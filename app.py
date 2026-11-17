import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)

# Security: Limit maximum request size to 100KB to prevent DoS
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024

# Security: Configure CORS
CORS(app, resources={r"/api/*": {"origins": "*"}}, methods=["POST", "OPTIONS"])

KNOWLEDGE_BASE = {
    'greetings': ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'],
    'company': [
        'atom next', 'atom next solutions', 'atomnext', 'about atom', 'who are you',
        'company', 'about company', 'about us', 'msme', 'registered', 'udyam'
    ],
    'services': {
        'automation': ['automation', 'excel', 'repetitive', 'n8n', 'workflow', 'manual work', 'spreadsheet'],
        'ai_agents': ['ai', 'agent', 'chatbot', 'whatsapp', 'customer service', 'support', 'autonomous'],
        'erp_pos': ['erp', 'erpnext', 'pos', 'billing', 'invoice', 'gst', 'inventory'],
        'web_mobile': ['web development', 'mobile app', 'ios', 'android', 'react', 'flutter', 'saas'],
        'data_systems': ['data', 'pipeline', 'api', 'integration', 'cloud', 'database']
    },
    'pricing': ['price', 'cost', 'pricing', 'how much', 'budget', 'quote', 'estimate'],
    'contact': ['contact', 'reach', 'get in touch', 'email', 'phone', 'address', 'book', 'call'],
    'process': ['process', 'how it works', 'workflow', 'timeline', 'duration', 'steps']
}

RESPONSES = {
    'greeting': [
        "Hello! 👋 Welcome to AtomNext. We build autonomous business systems, AI agents, and enterprise software that eliminate manual work. How can I help you?",
        "Hi there! Welcome to AtomNext. How can we help automate your business operations today?"
    ],
    'company': [
        """AtomNext Solutions is an officially registered MSME (Govt. of India) specializing in replacing manual, repetitive work with intelligent business systems.

Our Core Offerings:
• Repetitive Workflow & Task Automation (n8n, webhooks, data pipelines)
• 24/7 Custom AI Agents & WhatsApp Multi-Channel Bots
• Enterprise ERP, POS & Smart Billing Solutions
• High-Performance Web & Mobile Applications
• Cloud Systems & API Integrations

"Think Better. Build Better." We build systems your business can depend on."""
    ],
    'automation': [
        "We help businesses replace manual Excel data entry, copy-pasting, and repetitive tasks with reliable automated pipelines and n8n workflows that save 400+ hours every month."
    ],
    'ai_agents': [
        "We build custom AI agents that handle customer conversations 24/7 across WhatsApp and web portals, qualify leads, and connect directly to your databases."
    ],
    'erp_pos': [
        "We provide custom ERP systems, ERPNext implementations, multi-branch POS, and automated GST billing to unify your entire inventory and accounting."
    ],
    'web_mobile': [
        "We build scalable web platforms and native/cross-platform mobile apps using React, Next.js, Flutter, and Node.js."
    ],
    'pricing': [
        "Pricing is milestone-based and tailored to your project requirements. You can submit a project scope on our Request Service page or schedule a consultation call to get a proposal within 24 hours."
    ],
    'contact': [
        "You can schedule a consultation call on our Book a Call page (/book-call.html) or email us directly at atomnextai@gmail.com."
    ],
    'process': [
        "Our process includes: 1) System Audit & Discovery, 2) Architecture Blueprint, 3) Agile Development, 4) Rigorous QA & Security Testing, and 5) Deployment & 24/7 SLA Support."
    ]
}

def get_response(msg):
    msg = (msg or '').lower()[:500]
    for cat, keywords in KNOWLEDGE_BASE['services'].items():
        if any(k in msg for k in keywords):
            return random.choice(RESPONSES.get(cat, RESPONSES['automation']))
    if any(k in msg for k in KNOWLEDGE_BASE['greetings']):
        return random.choice(RESPONSES['greeting'])
    if any(k in msg for k in KNOWLEDGE_BASE['company']):
        return random.choice(RESPONSES['company'])
    if any(k in msg for k in KNOWLEDGE_BASE['pricing']):
        return random.choice(RESPONSES['pricing'])
    if any(k in msg for k in KNOWLEDGE_BASE['contact']):
        return random.choice(RESPONSES['contact'])
    if any(k in msg for k in KNOWLEDGE_BASE['process']):
        return random.choice(RESPONSES['process'])
    
    return "At AtomNext, we help businesses run smarter by replacing manual work with complete automated business systems (AI agents, n8n workflows, ERP/POS, and web/mobile apps). How can we assist you?"

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json(silent=True) or {}
    message = str(data.get('message', ''))[:500]
    return jsonify({'success': True, 'response': get_response(message)})

# Security: Add security headers to Flask responses
@app.after_request
def set_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    return response

if __name__ == '__main__':
    # Security: Default to debug=False to avoid exposing Werkzeug debugger in production
    is_debug = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    app.run(port=5000, debug=is_debug)
