const { Resend } = require('resend');

const OWNER_EMAIL = process.env.OWNER_EMAIL || 'atomnextai@gmail.com';
const RESEND_API_KEY = process.env.RESEND_API_KEY;

// Security: HTML entity escaper to prevent HTML injection / XSS in emails
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Security: Strip newline characters to prevent Email Header Injection
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
    const requiredFields = ['name', 'email', 'phone', 'service', 'description', 'timeline'];
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

    // Enforce safe string length limits & sanitize
    const name = escapeHtml(data.name.trim().slice(0, 100));
    const phone = escapeHtml(data.phone.trim().slice(0, 30));
    const company = data.company ? escapeHtml(data.company.trim().slice(0, 100)) : '';
    const service = escapeHtml(data.service.trim().slice(0, 150));
    const timeline = escapeHtml(data.timeline.trim().slice(0, 100));
    const budget = data.budget ? escapeHtml(data.budget.trim().slice(0, 100)) : '';
    const description = escapeHtml(data.description.trim().slice(0, 4000));

    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

    // EMAIL 1: To Owner (Sanitized HTML)
    const ownerEmailHTML = `
      <h2>New Service Request from AtomNext Website</h2>
      <p><strong>Submitted:</strong> ${escapeHtml(timestamp)}</p>
      <hr/>
      <h3>Contact Information</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${escapeHtml(cleanEmail)}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
      <hr/>
      <h3>Service Details</h3>
      <p><strong>Service Type:</strong> ${service}</p>
      <p><strong>Timeline:</strong> ${timeline}</p>
      ${budget ? `<p><strong>Budget:</strong> ${budget}</p>` : ''}
      <hr/>
      <h3>Project Description</h3>
      <p>${description}</p>
    `;

    // If Resend API Key is configured, dispatch emails
    if (RESEND_API_KEY && RESEND_API_KEY !== 'your_resend_api_key_here') {
      const resend = new Resend(RESEND_API_KEY);

      await resend.emails.send({
        from: 'AtomNext Website <onboarding@resend.dev>',
        to: sanitizeHeader(OWNER_EMAIL),
        subject: `New Service Request - ${sanitizeHeader(service)}`,
        html: ownerEmailHTML
      });

      // Confirmation to user
      const userEmailHTML = `
        <h2>Thank You for Your Service Request!</h2>
        <p>Hi ${name},</p>
        <p>We've received your request for <strong>${service}</strong> and will prepare a custom proposal and quote within 24 hours.</p>
        <hr/>
        <h3>Your Request Summary</h3>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Timeline:</strong> ${timeline}</p>
        <hr/>
        <p>Our engineering team will review your requirements and contact you at <strong>${phone}</strong> or ${escapeHtml(cleanEmail)}.</p>
        <p>Best regards,<br/>
        <strong>AtomNext! Solutions Team</strong><br>
        <em>Govt. Recognized MSME Enterprise</em></p>
      `;

      await resend.emails.send({
        from: 'AtomNext <onboarding@resend.dev>',
        to: sanitizeHeader(cleanEmail),
        subject: 'Service Request Received - AtomNext!',
        html: userEmailHTML
      });
    }

    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'Service request recorded successfully'
      })
    };
  } catch (error) {
    // Avoid leaking internal stack trace
    return {
      statusCode: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'An internal error occurred while processing your request'
      })
    };
  }
};
