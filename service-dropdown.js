// Google-style searchable service dropdown
class ServiceDropdown {
    constructor(containerId, inputId, hiddenInputId) {
        this.container = document.getElementById(containerId);
        this.input = document.getElementById(inputId);
        this.hiddenInput = document.getElementById(hiddenInputId);
        this.dropdown = null;
        this.selectedValue = '';

        this.services = [
            { group: 'Development', icon: 'fa-code', label: 'Web Development', value: 'web-development' },
            { group: 'Development', icon: 'fa-mobile-alt', label: 'Mobile App Development', value: 'mobile-app-development' },

            { group: 'AI & Automation', icon: 'fa-robot', label: 'AI Solutions & Chatbots', value: 'ai-solutions' },
            { group: 'AI & Automation', icon: 'fa-fire', label: 'n8n Workflow Automation', value: 'n8n-workflows' },
            { group: 'AI & Automation', icon: 'fa-cogs', label: 'Business Process Automation', value: 'business-automation' },
            { group: 'AI & Automation', icon: 'fa-magic', label: 'No-code/Low-code Automation', value: 'no-code-automation' },

            { group: 'ERP & Business Systems', icon: 'fa-building', label: 'ERPNext Implementation', value: 'erpnext' },
            { group: 'ERP & Business Systems', icon: 'fa-briefcase', label: 'Custom ERP Development', value: 'custom-erp' },
            { group: 'ERP & Business Systems', icon: 'fa-users', label: 'HRMS Solution', value: 'hrms' },
            { group: 'ERP & Business Systems', icon: 'fa-handshake', label: 'CRM Solution', value: 'crm' },
            { group: 'ERP & Business Systems', icon: 'fa-chart-line', label: 'Business Management Software', value: 'business-mgmt' },

            { group: 'SaaS', icon: 'fa-cloud', label: 'SaaS Product Development', value: 'saas-development' },
            { group: 'SaaS', icon: 'fa-server', label: 'Custom SaaS Platform', value: 'custom-saas' },
            { group: 'SaaS', icon: 'fa-network-wired', label: 'Cloud Infrastructure & DevOps', value: 'cloud-devops' },
            { group: 'SaaS', icon: 'fa-project-diagram', label: 'SaaS Architecture Consulting', value: 'saas-consulting' },

            { group: 'Integration', icon: 'fa-plug', label: 'API Integrations & Middleware', value: 'api-integration' },
            { group: 'Integration', icon: 'fa-exchange-alt', label: 'System Integrations (ERP ↔ CRM)', value: 'system-integration' }
        ];

        this.init();
    }

    init() {
        this.createDropdown();
        this.attachEvents();
    }

    createDropdown() {
        this.dropdown = document.createElement('div');
        this.dropdown.className = 'service-dropdown';
        this.container.appendChild(this.dropdown);
        this.renderOptions(this.services);
    }

    renderOptions(services) {
        if (services.length === 0) {
            this.dropdown.innerHTML = '<div class="no-results">No services found</div>';
            return;
        }

        let html = '';
        let currentGroup = '';

        services.forEach(service => {
            if (service.group !== currentGroup) {
                html += `<div class="service-group-label">${service.group}</div>`;
                currentGroup = service.group;
            }
            html += `
                <div class="service-option" data-value="${service.value}">
                    <i class="fas ${service.icon} icon"></i>
                    <span>${service.label}</span>
                </div>
            `;
        });

        this.dropdown.innerHTML = html;
    }

    attachEvents() {
        // Show dropdown on focus
        this.input.addEventListener('focus', () => {
            this.dropdown.classList.add('show');
            if (!this.input.value) {
                this.renderOptions(this.services);
            }
        });

        // Filter on input
        this.input.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = this.services.filter(service =>
                service.label.toLowerCase().includes(query)
            );
            this.renderOptions(filtered);
            this.dropdown.classList.add('show');
        });

        // Handle selection
        this.dropdown.addEventListener('click', (e) => {
            const option = e.target.closest('.service-option');
            if (option) {
                const value = option.dataset.value;
                const service = this.services.find(s => s.value === value);
                if (service) {
                    this.selectService(service);
                }
            }
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target)) {
                this.dropdown.classList.remove('show');
            }
        });
    }

    selectService(service) {
        this.input.value = service.label;
        this.hiddenInput.value = service.value;
        this.selectedValue = service.value;
        this.dropdown.classList.remove('show');

        // Trigger change event for validation
        this.hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
}

// Initialize after DOM loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('service-search-container')) {
        new ServiceDropdown('service-search-container', 'service-search-input', 'service-type');
    }
});
