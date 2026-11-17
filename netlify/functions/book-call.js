const { Resend } = require('resend');

const OWNER_EMAIL = process.env.OWNER_EMAIL || 'atomnextai@gmail.com';
const RESEND_API_KEY = process.env.RESEND_API_KEY;

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function sanitizeHeader(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[\r\n\x00-\x1F]/g, ' ').trim().slice(0, 150);
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'X-Content-Type-Options': 'nosniff'
};

exports.handler = async (event) => {
  // Handle CORS Preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: CORS_HEADERS,
      body: ''
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Method not allowed' })
    };
  }

  // Check request body size (limit to 50KB to prevent DoS)
  if (!event.body || event.body.length > 50 * 1024) {
    return {
      statusCode: 413,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Payload too large' })
    };
  }

  try {
    let data;
    try {
      data = JSON.parse(event.body);
    } catch {
      return {
        statusCode: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Invalid JSON payload' })
      };
    }

    // MANDATORY VALIDATION
    const requiredFields = ['name', 'email', 'phone', 'date', 'time'];
    const missingFields = requiredFields.filter(field => !data[field] || typeof data[field] !== 'string' || !data[field].trim());

    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Missing required fields',
          fields: missingFields
        })
      };
    }

    // Strict email format validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    const cleanEmail = data.email.trim().slice(0, 120);
    if (!emailRegex.test(cleanEmail)) {
      return {
        statusCode: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Invalid email address' })
      };
    }

    // Sanitize and bound all inputs
    const name = escapeHtml(data.name.trim().slice(0, 100));
    const phone = escapeHtml(data.phone.trim().slice(0, 30));
    const company = data.company ? escapeHtml(data.company.trim().slice(0, 100)) : '';
    const date = escapeHtml(data.date.trim().slice(0, 50));
    const time = escapeHtml(data.time.trim().slice(0, 50));
    const description = data.description ? escapeHtml(data.description.trim().slice(0, 2000)) : '';

    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

    // EMAIL 1: To Owner
    const ownerEmailHTML = `
      <h2>New Consultation Call Request</h2>
      <p><strong>Submitted:</strong> ${escapeHtml(timestamp)}</p>
      <hr/>
      <h3>Client Details</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${escapeHtml(cleanEmail)}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
      <hr/>
      <h3>Scheduled Slot</h3>
      <p><strong>Preferred Date:</strong> ${date}</p>
      <p><strong>Preferred Time:</strong> ${time}</p>
      ${description ? `
      <hr/>
      <h3>Project Agenda / Notes</h3>
      <p>${description}</p>
      ` : ''}
    `;

    if (RESEND_API_KEY && RESEND_API_KEY !== 'your_resend_api_key_here') {
      const resend = new Resend(RESEND_API_KEY);

      await resend.emails.send({
        from: 'AtomNext Website <onboarding@resend.dev>',
        to: sanitizeHeader(OWNER_EMAIL),
        subject: `New Call Request - ${sanitizeHeader(name)}`,
        html: ownerEmailHTML
      });

      // EMAIL 2: Confirmation to User
      const userEmailHTML = `
        <h2>Consultation Call Confirmed!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for scheduling a strategy call with AtomNext!.</p>
        <hr/>
        <h3>Your Booking Details</h3>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <hr/>
        <p>Our engineering team will review your agenda and send a calendar invitation to <strong>${escapeHtml(cleanEmail)}</strong> or connect via WhatsApp at <strong>${phone}</strong>.</p>
        <p>Best regards,<br/>
        <strong>AtomNext! Engineering Team</strong><br>
        <em>Govt. Recognized MSME Enterprise</em></p>
      `;

      await resend.emails.send({
        from: 'AtomNext <onboarding@resend.dev>',
        to: sanitizeHeader(cleanEmail),
        subject: 'Consultation Call Request Received - AtomNext!',
        html: userEmailHTML
      });
    }

    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'Call booked successfully'
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'An internal error occurred while processing your call request'
      })
    };
  }
};
