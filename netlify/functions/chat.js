const OWNER_EMAIL = process.env.OWNER_EMAIL || 'atomnextai@gmail.com';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'X-Content-Type-Options': 'nosniff'
};

// Modern Knowledge Base for AtomNext AI Assistant (Apple Minimal / MSME Enterprise)
const KNOWLEDGE_BASE = {
  greetings: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'],
  company: [
    'atom next', 'atom next solutions', 'atomnext', 'about atom', 'who are you',
    'company', 'about company', 'about us', 'tell me about atom', 'msme', 'registered', 'udyam'
  ],
  services: {
    automation: [
      'automation', 'manual work', 'excel', 'repetitive', 'n8n', 'workflow',
      'tasks', 'process automation', 'spreadsheet'
    ],
    ai_agents: [
      'ai', 'agent', 'ai agents', 'chatbot', 'whatsapp', 'customer service',
      'llm', 'support bot', 'autonomous'
    ],
    erp_pos: [
      'erp', 'erpnext', 'pos', 'billing', 'invoice', 'gst', 'inventory',
      'accounting', 'retail system'
    ],
    web_mobile: [
      'web development', 'mobile app', 'ios', 'android', 'react', 'next.js',
      'flutter', 'saas', 'application'
    ],
    data_systems: [
      'data', 'pipeline', 'api', 'integration', 'cloud', 'database', 'backend'
    ]
  },
  pricing: ['price', 'cost', 'pricing', 'how much', 'budget', 'quote', 'estimate', 'rate'],
  contact: ['contact', 'reach', 'get in touch', 'email', 'phone', 'address', 'book', 'call', 'consultation'],
  process: ['process', 'how it works', 'workflow', 'timeline', 'duration', 'steps', 'methodology', 'architecture']
};

const RESPONSES = {
  greeting: [
    "Hello! Welcome to AtomNext. We build autonomous business systems, AI agents, and custom software that replace manual work. How can I help you today?",
    "Hi there! Welcome to AtomNext. Looking to automate business workflows, build custom AI agents, or scale with enterprise ERP/web apps? Ask me anything!"
  ],
  company: [
    `AtomNext Solutions is an officially registered MSME (Micro, Small & Medium Enterprise) recognized by the Government of India. 

We help modern businesses run smarter by replacing manual work and disconnected spreadsheets with complete, autonomous systems:
• Repetitive Workflow & Task Automation (n8n, webhook pipelines)
• 24/7 Custom AI Agents & WhatsApp Assistants
• Enterprise ERP, POS & Smart Billing Solutions
• High-Performance Web & Mobile Applications
• Robust Data Infrastructure & API Orchestration

Our motto: "Think Better. Build Better."`,

    `At AtomNext, we don't just write code — we build dependable, enterprise-grade business systems. Registered under MSME (Govt. of India), we partner with companies to eliminate manual bottlenecks, integrate operations, and automate communication across platforms like WhatsApp and custom portals.`
  ],
  automation: [
    "Many businesses lose 20-40 hours a week on repetitive tasks — updating Excel sheets, copy-pasting data, and manual operations. AtomNext builds event-driven pipelines (using n8n, webhooks, and secure APIs) that execute these tasks automatically and reliably.",
    "Our automation systems replace manual human data entry with instant sync across your databases, CRM, billing, and inventory. Would you like to estimate your team's monthly hours saved?"
  ],
  ai_agents: [
    "We engineer custom AI agents that perform real business actions: qualifying inbound leads, answering customer questions 24/7 on WhatsApp, booking appointments, and triggering backend actions without human lag.",
    "Unlike generic chatbots, AtomNext AI agents connect directly to your product catalog, internal database, or ERP to deliver instant, accurate responses with verified context."
  ],
  erp_pos: [
    "We design and deploy modern ERP and ERPNext solutions, point-of-sale (POS) systems, and automated billing software. Features include multi-branch inventory sync, GST e-invoicing, and unified financial reporting.",
    "Stop juggling disconnected spreadsheets. Our ERP and POS platforms unify purchasing, inventory, sales, and accounts into a single, scalable dashboard."
  ],
  web_mobile: [
    "We engineer production-grade web and mobile applications using modern technologies (React, Next.js, Flutter, Node.js, Python). Our software is fast, responsive, and architected for long-term scalability.",
    "From high-conversion SaaS portals to iOS and Android applications, we build intuitive digital products that deliver high business ROI."
  ],
  data_systems: [
    "We design real-time data pipelines, API middleware, and secure cloud databases that connect your disparate software tools into one synchronized ecosystem."
  ],
  pricing: [
    "Our solutions are customized to your specific workflow complexity and scale. To get an exact estimate and project timeline within 24 hours, you can fill out our Service Request Wizard or schedule a consultation call.",
    "We provide transparent, milestone-based pricing with enterprise SLAs and ongoing warranty. Let's schedule a brief 15-minute discovery call to map out your requirements."
  ],
  contact: [
    "You can schedule a consultation call directly with our engineering team at /book-call.html or submit a service inquiry at /order.html. You can also reach us at atomnextai@gmail.com.",
    "We'd love to connect! You can book a free 20-minute strategy call through our Book a Call page, or tell me your email and requirements right here."
  ],
  process: [
    "Our 5-step engineering process: 1) System Audit & Discovery, 2) Architecture Blueprint, 3) Agile Development, 4) Rigorous QA & Security Testing, 5) Deployment & 24/7 SLA Support.",
    "We work in rapid, transparent sprints. From initial architecture to production rollout, you have full visibility into every milestone and pipeline test."
  ]
};

function getResponse(userMessage) {
  const msg = (userMessage || '').toLowerCase();

  if (KNOWLEDGE_BASE.greetings.some(k => msg.includes(k))) {
    return RESPONSES.greeting[Math.floor(Math.random() * RESPONSES.greeting.length)];
  }
  if (KNOWLEDGE_BASE.company.some(k => msg.includes(k))) {
    return RESPONSES.company[Math.floor(Math.random() * RESPONSES.company.length)];
  }
  if (KNOWLEDGE_BASE.services.automation.some(k => msg.includes(k))) {
    return RESPONSES.automation[Math.floor(Math.random() * RESPONSES.automation.length)];
  }
  if (KNOWLEDGE_BASE.services.ai_agents.some(k => msg.includes(k))) {
    return RESPONSES.ai_agents[Math.floor(Math.random() * RESPONSES.ai_agents.length)];
  }
  if (KNOWLEDGE_BASE.services.erp_pos.some(k => msg.includes(k))) {
    return RESPONSES.erp_pos[Math.floor(Math.random() * RESPONSES.erp_pos.length)];
  }
  if (KNOWLEDGE_BASE.services.web_mobile.some(k => msg.includes(k))) {
    return RESPONSES.web_mobile[Math.floor(Math.random() * RESPONSES.web_mobile.length)];
  }
  if (KNOWLEDGE_BASE.pricing.some(k => msg.includes(k))) {
    return RESPONSES.pricing[Math.floor(Math.random() * RESPONSES.pricing.length)];
  }
  if (KNOWLEDGE_BASE.contact.some(k => msg.includes(k))) {
    return RESPONSES.contact[Math.floor(Math.random() * RESPONSES.contact.length)];
  }
  if (KNOWLEDGE_BASE.process.some(k => msg.includes(k))) {
    return RESPONSES.process[Math.floor(Math.random() * RESPONSES.process.length)];
  }

  return "At AtomNext, we help businesses run smarter by replacing manual work with complete automated business systems (AI agents, n8n workflows, ERP/POS, and web/mobile apps). Would you like to schedule a call or request a custom proposal?";
}

exports.handler = async (event) => {
  // Handle CORS Preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: CORS_HEADERS,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Method not allowed' })
    };
  }

  // Security: Payload size validation
  if (!event.body || event.body.length > 10 * 1024) {
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

    // Security: Truncate input string to 500 characters
    const userMessage = (typeof data.message === 'string' ? data.message : '').slice(0, 500);
    const botResponse = getResponse(userMessage);

    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        response: botResponse
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'Failed to process message',
        response: "At AtomNext, we build powerful business automation systems, custom AI agents, and enterprise ERP solutions. How can we help you?"
      })
    };
  }
};
