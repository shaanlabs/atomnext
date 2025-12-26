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
        const requiredFields = ['name', 'email', 'phone', 'service', 'description', 'timeline'];
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
      <h2>New Service Request from AtomNext Website</h2>
      <p><strong>Submitted:</strong> ${timestamp}</p>
      <hr/>
      <h3>Contact Information</h3>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
      <hr/>
      <h3>Service Details</h3>
      <p><strong>Service Type:</strong> ${data.service}</p>
      <p><strong>Timeline:</strong> ${data.timeline}</p>
      ${data.budget ? `<p><strong>Budget:</strong> ${data.budget}</p>` : ''}
      <hr/>
      <h3>Project Description</h3>
      <p>${data.description}</p>
    `;

        await resend.emails.send({
            from: 'AtomNext Website <onboarding@resend.dev>',
            to: OWNER_EMAIL,
            subject: `New Service Request - ${data.service}`,
            html: ownerEmailHTML
        });

        // EMAIL 2: Confirmation to User
        const userEmailHTML = `
      <h2>Thank You for Your Service Request!</h2>
      <p>Hi ${data.name},</p>
      <p>We've received your request for <strong>${data.service}</strong> and will send you a custom quote within 24 hours.</p>
      <hr/>
      <h3>Your Request Summary</h3>
      <p><strong>Service:</strong> ${data.service}</p>
      <p><strong>Timeline:</strong> ${data.timeline}</p>
      <p><strong>Description:</strong> ${data.description}</p>
      <hr/>
      <p>Our team will review your requirements and contact you at <strong>${data.phone}</strong> or ${data.email} with next steps.</p>
      <p>Best regards,<br/>
      <strong>AtomNext Team</strong></p>
    `;

        await resend.emails.send({
            from: 'AtomNext <onboarding@resend.dev>',
            to: data.email,
            subject: 'Service Request Received - AtomNext',
            html: userEmailHTML
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: 'Thanks! We\'ve received your request and will get back to you shortly.'
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
