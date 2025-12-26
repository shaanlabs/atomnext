// ========================================
// GET STARTED ONBOARDING - FIXED LOGIC
// Same UI, smart adaptive behavior
// ========================================

class GetStartedOnboarding {
    constructor() {
        this.modal = null;
        this.overlay = null;
        this.currentStep = 1;
        this.userIntent = null;
        this.userType = null;
        this.userDescription = '';
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.createModal();
        this.attachTriggers();
        this.loadSavedData();
    }

    loadSavedData() {
        try {
            const saved = localStorage.getItem('atomnext_user_context');
            if (saved) {
                const data = JSON.parse(saved);
                this.userIntent = data.intent || null;
                this.userType = data.type || null;
                this.userDescription = data.description || '';
            }
        } catch (e) {
            console.log('No saved context');
        }
    }

    saveData() {
        try {
            localStorage.setItem('atomnext_user_context', JSON.stringify({
                intent: this.userIntent,
                type: this.userType,
                description: this.userDescription,
                timestamp: new Date().toISOString()
            }));
        } catch (e) {
            console.log('Could not save context');
        }
    }

    createModal() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'onboarding-overlay';
        this.overlay.setAttribute('aria-hidden', 'true');

        this.modal = document.createElement('div');
        this.modal.className = 'onboarding-modal';
        this.modal.setAttribute('role', 'dialog');
        this.modal.setAttribute('aria-label', 'Get started with AtomNext');
        this.modal.setAttribute('aria-hidden', 'true');

        this.modal.innerHTML = `
            <button class="onboarding-close" aria-label="Close dialog">
                <i class="fas fa-times"></i>
            </button>
            <div class="onboarding-content">
                <!-- Steps will be injected here -->
            </div>
            <div class="onboarding-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 33.33%"></div>
                </div>
                <p class="progress-text">Step <span class="current-step">1</span> of 3</p>
            </div>
        `;

        document.body.appendChild(this.overlay);
        document.body.appendChild(this.modal);

        const closeBtn = this.modal.querySelector('.onboarding-close');
        closeBtn.addEventListener('click', () => this.close());
        this.overlay.addEventListener('click', () => this.close());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });

        this.modal.addEventListener('click', (e) => e.stopPropagation());
    }

    attachTriggers() {
        const triggers = document.querySelectorAll('a[href="book-call.html"].btn, .btn.primary-btn, .sidebar-cta');
        triggers.forEach(trigger => {
            const text = trigger.textContent.trim();
            if (text.includes('Get Started') || text.includes('Let\'s Build')) {
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.open();
                });
            }
        });
    }

    open() {
        this.currentStep = 1;

        this.modal.classList.add('active');
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        this.modal.setAttribute('aria-hidden', 'false');
        this.overlay.setAttribute('aria-hidden', 'false');

        this.renderStep(1);
    }

    close() {
        this.saveData();
        this.modal.classList.remove('active');
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';

        this.modal.setAttribute('aria-hidden', 'true');
        this.overlay.setAttribute('aria-hidden', 'true');
    }

    renderStep(step) {
        this.currentStep = step;
        const content = this.modal.querySelector('.onboarding-content');
        const progressFill = this.modal.querySelector('.progress-fill');
        const stepNumber = this.modal.querySelector('.current-step');

        progressFill.style.width = `${(step / 3) * 100}%`;
        stepNumber.textContent = step;

        switch (step) {
            case 1:
                content.innerHTML = this.getStep1HTML();
                this.attachStep1Handlers();
                break;
            case 2:
                content.innerHTML = this.getStep2HTML();
                this.attachStep2Handlers();
                break;
            case 3:
                content.innerHTML = this.getStep3HTML();
                this.attachStep3Handlers();
                break;
        }

        content.style.opacity = '0';
        content.style.transform = 'translateY(20px)';
        setTimeout(() => {
            content.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
        }, 50);
    }

    getStep1HTML() {
        return `
            <h2 class="onboarding-title">How would you like to get started with AtomNext?</h2>
            <p class="onboarding-subtitle">Choose the option that best describes your needs</p>
            <div class="onboarding-options">
                <button class="option-card" data-intent="discuss">
                    <div class="option-icon">
                        <i class="fas fa-comments"></i>
                    </div>
                    <h3>Discuss an Idea</h3>
                    <p>Talk to our team about your project vision</p>
                </button>
                <button class="option-card" data-intent="request">
                    <div class="option-icon">
                        <i class="fas fa-clipboard-list"></i>
                    </div>
                    <h3>Request a Service</h3>
                    <p>Get a quote for a specific service</p>
                </button>
                <button class="option-card" data-intent="automate">
                    <div class="option-icon">
                        <i class="fas fa-magic"></i>
                    </div>
                    <h3>Automate My Business</h3>
                    <p>Streamline operations with automation</p>
                </button>
            </div>
            <div class="text-input-section">
                <label for="user-description" class="text-input-label">
                    Briefly describe what you're looking to build or improve (optional)
                </label>
                <textarea 
                    id="user-description" 
                    class="text-input-field"
                    placeholder="E.g: We want to automate our operations to reduce manual work..."
                    rows="4"
                >${this.userDescription}</textarea>
            </div>
        `;
    }

    getStep2HTML() {
        return `
            <h2 class="onboarding-title">Tell us a bit about yourself</h2>
            <p class="onboarding-subtitle">This helps us tailor our recommendations</p>
            <div class="onboarding-options">
                <button class="option-card" data-type="startup">
                    <div class="option-icon">
                        <i class="fas fa-rocket"></i>
                    </div>
                    <h3>Startup</h3>
                    <p>Early-stage, building an MVP</p>
                </button>
                <button class="option-card" data-type="business">
                    <div class="option-icon">
                        <i class="fas fa-building"></i>
                    </div>
                    <h3>Business</h3>
                    <p>Established company, growing fast</p>
                </button>
                <button class="option-card" data-type="enterprise">
                    <div class="option-icon">
                        <i class="fas fa-city"></i>
                    </div>
                    <h3>Enterprise</h3>
                    <p>Large organization, complex needs</p>
                </button>
            </div>
        `;
    }

    getStep3HTML() {
        // ADAPTIVE LOGIC - Changes based on user type
        const intentLabels = {
            'discuss': 'Discuss an Idea',
            'request': 'Request a Service',
            'automate': 'Automate My Business'
        };

        const typeLabels = {
            'startup': 'Startup',
            'business': 'Business',
            'enterprise': 'Enterprise'
        };

        // Summary panel (same for all)
        const summaryHTML = `
            <div class="confirmation-summary">
                <h4>We understood:</h4>
                <div class="summary-items">
                    <div class="summary-item">
                        <i class="fas fa-check-circle"></i>
                        <span><strong>Intent:</strong> ${intentLabels[this.userIntent] || 'Not selected'}</span>
                    </div>
                    <div class="summary-item">
                        <i class="fas fa-check-circle"></i>
                        <span><strong>Company Type:</strong> ${typeLabels[this.userType] || 'Not selected'}</span>
                    </div>
                    ${this.userDescription ? `
                    <div class="summary-item description">
                        <i class="fas fa-check-circle"></i>
                        <span><strong>Your Description:</strong> "${this.userDescription}"</span>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;

        // ADAPTIVE CTAs based on user type
        let titleText = '';
        let primaryCTA = '';
        let secondaryCTA = '';

        if (this.userType === 'startup') {
            // Startups need guidance
            titleText = "How AtomNext Can Help You Build and Validate";
            primaryCTA = '<button class="value-cta primary" data-action="call">Book a Call - Get Guidance</button>';
            secondaryCTA = '<button class="value-cta secondary" data-action="request">Explore Services</button>';
        } else if (this.userType === 'business') {
            // Businesses need efficiency
            titleText = "How AtomNext Can Improve Your Operations";
            primaryCTA = '<button class="value-cta primary" data-action="request">Request Service - Start Improving</button>';
            secondaryCTA = '<button class="value-cta secondary" data-action="call">Talk to Us First</button>';
        } else if (this.userType === 'enterprise') {
            // Enterprise needs architecture & partnership
            titleText = "How AtomNext Can Scale Your Systems";
            primaryCTA = '<button class="value-cta primary" data-action="call">Book a Call - Discuss Architecture</button>';
            secondaryCTA = '<button class="value-cta secondary" data-action="request">Request Service</button>';
        }

        return `
            <h2 class="onboarding-title">${titleText}</h2>
            <p class="onboarding-subtitle">Based on what you told us</p>
            ${summaryHTML}
            <div class="value-cards-simple">
                <div class="value-card-single">
                    <div class="value-icon">
                        <i class="fas fa-handshake"></i>
                    </div>
                    <h3>Next Steps</h3>
                    <p>We'll help you move forward at the right pace for your needs</p>
                    <div class="value-ctas">
                        ${primaryCTA}
                        ${secondaryCTA}
                    </div>
                </div>
            </div>
        `;
    }

    attachStep1Handlers() {
        const options = this.modal.querySelectorAll('[data-intent]');
        const textarea = this.modal.querySelector('#user-description');

        // Save description on input
        if (textarea) {
            textarea.addEventListener('input', (e) => {
                this.userDescription = e.target.value.trim();
                this.saveData();
            });
        }

        // AUTO-ADVANCE on click (NO Continue button)
        options.forEach(option => {
            option.addEventListener('click', () => {
                options.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                this.userIntent = option.dataset.intent;
                this.saveData();

                // Auto-advance after brief delay for visual feedback
                setTimeout(() => {
                    this.renderStep(2);
                }, 250);
            });
        });
    }

    attachStep2Handlers() {
        const options = this.modal.querySelectorAll('[data-type]');

        // AUTO-ADVANCE on click (NO Continue button)
        options.forEach(option => {
            option.addEventListener('click', () => {
                this.userType = option.dataset.type;
                this.saveData();

                // Auto-advance after brief delay
                setTimeout(() => {
                    this.renderStep(3);
                }, 250);
            });
        });
    }

    attachStep3Handlers() {
        const ctas = this.modal.querySelectorAll('[data-action]');
        ctas.forEach(cta => {
            cta.addEventListener('click', () => {
                const action = cta.dataset.action;
                this.handleFinalAction(action);
            });
        });
    }

    handleFinalAction(action) {
        let url = '';

        if (action === 'call') {
            url = 'book-call.html';
        } else {
            url = 'order.html';
        }

        // Pass all context
        const params = new URLSearchParams();
        if (this.userIntent) params.append('intent', this.userIntent);
        if (this.userType) params.append('type', this.userType);
        if (this.userDescription) params.append('description', this.userDescription);

        // Internal mapping (user never sees this)
        if (this.userIntent === 'automate') {
            params.append('service', 'automation');
        }

        const finalURL = params.toString() ? `${url}?${params.toString()}` : url;

        this.close();
        setTimeout(() => {
            window.location.href = finalURL;
        }, 200);
    }
}

// Initialize
const onboarding = new GetStartedOnboarding();
window.getStartedOnboarding = onboarding;
