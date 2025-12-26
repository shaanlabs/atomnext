const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'atomnextai@gmail.com';

exports.handler = async (event) => {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ success: false, error: 'Method not allowed' })
        };
    }

    try {
        const data = JSON.parse(event.body);

        // MANDATORY VALIDATION
        const requiredFields = ['name', 'email', 'phone', 'date', 'time'];
        const missingFields = requiredFields.filter(field => !data[field]);

        if (missingFields.length > 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    success: false,
                    error: 'Missing required fields',
                    fields: missingFields
                })
            };
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    success: false,
                    error: 'Invalid email address'
                })
            };
        }

        const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

        // EMAIL 1: To Owner (Full Details)
        const ownerEmailHTML = `
      <h2>New Call Request from AtomNext Website</h2>
      <p><strong>Submitted:</strong> ${timestamp}</p>
      <hr/>
      <h3>Contact Information</h3>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <hr/>
      <h3>Preferred Schedule</h3>
      <p><strong>Date:</strong> ${data.date}</p>
      <p><strong>Time:</strong> ${data.time}</p>
      ${data.description ? `
      <hr/>
      <h3>Project Description</h3>
      <p>${data.description}</p>
      ` : ''}
      ${data.message ? `
      <hr/>
      <h3>Additional Information</h3>
      <p>${data.message}</p>
      ` : ''}
    `;

        await resend.emails.send({
            from: 'AtomNext Website <onboarding@resend.dev>',
            to: OWNER_EMAIL,
            subject: `New Call Request - ${data.name}`,
            html: ownerEmailHTML
        });

        // EMAIL 2: Confirmation to User
        const userEmailHTML = `
      <h2>Thank You for Reaching Out to AtomNext!</h2>
      <p>Hi ${data.name},</p>
      <p>We've received your call request and will get back to you shortly.</p>
      <hr/>
      <h3>Your Booking Details</h3>
      <p><strong>Preferred Date:</strong> ${data.date}</p>
      <p><strong>Preferred Time:</strong> ${data.time}</p>
      <hr/>
      <p>Our team will review your request and contact you at <strong>${data.phone}</strong> or ${data.email} to confirm the schedule.</p>
      <p>Best regards,<br/>
      <strong>AtomNext Team</strong></p>
    `;

        await resend.emails.send({
            from: 'AtomNext <onboarding@resend.dev>',
            to: data.email,
            subject: 'Call Request Received - AtomNext',
            html: userEmailHTML
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: 'Your call request has been received. We\'ll contact you soon.'
            })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                error: 'Something went wrong. Please try again or contact us directly.'
            })
        };
    }
};
