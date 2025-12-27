const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'atomnextai@gmail.com';

// Knowledge base for the chatbot (ported from Flask app.py)
const KNOWLEDGE_BASE = {
    greetings: [
        'hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'
    ],
    company: [
        'atom next', 'atom next solutions', 'atom next ai', 'about atom', 'who are you',
        'company', 'about company', 'about us', 'tell me about atom'
    ],
    services: {
        web_development: [
            'web development', 'website', 'web app', 'web application', 'website development',
            'frontend', 'backend', 'full stack', 'responsive design'
        ],
        mobile_apps: [
            'mobile app', 'mobile application', 'ios', 'android', 'app development',
            'cross platform', 'react native', 'flutter'
        ],
        ai_solutions: [
            'ai', 'artificial intelligence', 'machine learning', 'ml', 'chatbot',
            'automation', 'data analytics', 'predictive analytics'
        ],
        custom_software: [
            'custom software', 'software development', 'enterprise software',
            'business software', 'custom solution'
        ]
    },
    pricing: [
        'price', 'cost', 'pricing', 'how much', 'budget', 'quote', 'estimate'
    ],
    contact: [
        'contact', 'reach', 'get in touch', 'email', 'phone', 'address',
        'location', 'office', 'meet'
    ],
    process: [
        'process', 'how it works', 'workflow', 'timeline', 'duration',
        'steps', 'methodology', 'approach'
    ]
};

const RESPONSES = {
    greeting: [
        "Hello! 👋 I'm Atom Next AI's assistant. How can I help you today?",
        "Hi there! 👋 Welcome to Atom Next AI. What can I do for you?",
        "Hey! 👋 I'm here to help you with any questions about our services."
    ],
    company: [
        `Atom Next Solutions is a cutting-edge technology company founded by Nasheel Damudi, Shaanif Ahmed, and Azhar Ali. We specialize in transforming businesses through innovative technology solutions.

Our expertise includes:
• Web Development
• Mobile App Development
• AI Solutions
• Custom Software Development

We're passionate about helping businesses grow through technology and innovation. Our team combines technical expertise with creative problem-solving to deliver exceptional results.`,

        `Welcome to Atom Next Solutions! We're a dynamic team of technology experts dedicated to helping businesses succeed in the digital age.

Founded by industry professionals, we offer:
• Modern Web Solutions
• Mobile Applications
• AI Integration
• Custom Software

Our mission is to empower businesses with technology that drives growth and innovation.`
    ],
    web_development: [
        "We offer comprehensive web development services including responsive websites, web applications, and e-commerce solutions. Our team uses modern technologies like React, Angular, and Node.js to create robust and scalable web solutions.",
        "Our web development services cover everything from simple websites to complex web applications. We focus on creating user-friendly, responsive, and high-performance solutions tailored to your needs."
    ],
    mobile_apps: [
        "We develop both native and cross-platform mobile applications for iOS and Android. Our mobile solutions are designed to provide excellent user experience and performance across all devices.",
        "Our mobile app development services include iOS, Android, and cross-platform development using technologies like React Native and Flutter. We ensure your app is fast, secure, and user-friendly."
    ],
    ai_solutions: [
        "We provide cutting-edge AI solutions including chatbots, process automation, and data analytics. Our AI services help businesses streamline operations and make data-driven decisions.",
        "Our AI solutions range from intelligent chatbots to complex machine learning systems. We help businesses leverage artificial intelligence to improve efficiency and gain competitive advantages."
    ],
    custom_software: [
        "We develop custom software solutions tailored to your specific business needs. Our team creates scalable and maintainable software that helps streamline your operations.",
        "Our custom software development services focus on creating solutions that perfectly match your business requirements. We ensure high quality, security, and scalability in every project."
    ],
    pricing: [
        "Our pricing varies based on project requirements and scope. Would you like to schedule a consultation to discuss your specific needs and get a detailed quote?",
        "We provide customized quotes based on your project requirements. Let's schedule a call to understand your needs better and provide an accurate estimate."
    ],
    contact: [
        "You can reach us through our contact form on the website or schedule a consultation call. Would you like me to help you with that?",
        "We're available through multiple channels. You can contact us via the website, email, or schedule a call. I can help you with any of these options."
    ],
    process: [
        "Our development process includes: 1) Discovery and consultation, 2) Planning and design, 3) Development, 4) Testing, 5) Deployment, and 6) Ongoing support. Would you like to know more about any specific phase?",
        "We follow a systematic approach: starting with understanding your requirements, creating a detailed plan, developing the solution, thorough testing, and providing ongoing support. Each phase is designed to ensure the best results."
    ],
    fallback: [
        "I'm not sure I understand. Could you please rephrase your question? I can help you with information about our services, pricing, or process.",
        "I'm still learning! Could you try asking that in a different way? I can tell you about our web development, mobile apps, AI solutions, or custom software services."
    ]
};

function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

function getChatResponse(message) {
    const lowerMessage = message.toLowerCase();

    // Check for greetings
    if (KNOWLEDGE_BASE.greetings.some(greeting => lowerMessage.includes(greeting))) {
        return { response: getRandomResponse(RESPONSES.greeting), status: 'success' };
    }

    // Check for company information
    if (KNOWLEDGE_BASE.company.some(term => lowerMessage.includes(term))) {
        return { response: getRandomResponse(RESPONSES.company), status: 'success' };
    }

    // Check for services
    for (const [service, keywords] of Object.entries(KNOWLEDGE_BASE.services)) {
        if (keywords.some(keyword => lowerMessage.includes(keyword))) {
            return { response: getRandomResponse(RESPONSES[service]), status: 'success' };
        }
    }

    // Check for pricing
    if (KNOWLEDGE_BASE.pricing.some(term => lowerMessage.includes(term))) {
        return { response: getRandomResponse(RESPONSES.pricing), status: 'success' };
    }

    // Check for contact
    if (KNOWLEDGE_BASE.contact.some(term => lowerMessage.includes(term))) {
        return { response: getRandomResponse(RESPONSES.contact), status: 'success' };
    }

    // Check for process
    if (KNOWLEDGE_BASE.process.some(term => lowerMessage.includes(term))) {
        return { response: getRandomResponse(RESPONSES.process), status: 'success' };
    }

    // Fallback response
    return { response: getRandomResponse(RESPONSES.fallback), status: 'success' };
}

exports.handler = async (event) => {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                response: 'Method not allowed',
                status: 'error'
            })
        };
    }

    try {
        const data = JSON.parse(event.body);
        const userMessage = data.message || '';

        if (!userMessage) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    response: 'Please provide a message.',
                    status: 'error'
                })
            };
        }

        const response = getChatResponse(userMessage);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(response)
        };

    } catch (error) {
        console.error('Chat error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                response: 'I apologize, but I encountered an error. Please try again.',
                status: 'error',
                error: error.message
            })
        };
    }
};
