/**
 * AtomNext! Web App Controller
 * Powers interactive widgets:
 * - Mobile navigation drawer
 * - Service category tabs
 * - Automation ROI Calculator
 * - System Architecture & Research Lab tabs
 * - FAQ Accordion
 * - Interactive AI Assistant (AtomNext Copilot)
 * - Scroll reveal animations (IntersectionObserver)
 * - Animated counters
 * - Smooth scroll
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initServiceTabs();
  initRoiCalculator();
  initArchTabs();
  initFaqAccordion();
  initAiChatbot();
  initScrollReveal();
  initCounterAnimation();
  initSmoothScroll();
  initNavbarScroll();
});

/* ==========================================================================
   1. Mobile Navigation
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const closeBtn = document.querySelector('.mobile-nav-close');
  const links = document.querySelectorAll('.mobile-nav-links a');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  const closeDrawer = () => {
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  links.forEach(l => l.addEventListener('click', closeDrawer));

  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   2. Service Category Filter / Tabs
   ========================================================================== */
function initServiceTabs() {
  const tabBtns = document.querySelectorAll('.services-tabs-nav .tab-btn');
  const cards = document.querySelectorAll('.service-card');

  if (!tabBtns.length || !cards.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   3. Interactive ROI & Automation Savings Calculator
   ========================================================================== */
function initRoiCalculator() {
  const teamSlider = document.getElementById('calc-team-size');
  const hoursSlider = document.getElementById('calc-hours-per-day');
  const wageSlider = document.getElementById('calc-hourly-wage');

  const teamVal = document.getElementById('calc-val-team');
  const hoursVal = document.getElementById('calc-val-hours');
  const wageVal = document.getElementById('calc-val-wage');

  const hoursSavedResult = document.getElementById('calc-result-hours');
  const annualSavingsResult = document.getElementById('calc-result-annual');
  const productivityResult = document.getElementById('calc-result-productivity');
  const recommendedArch = document.getElementById('calc-recommended-arch');

  const chips = document.querySelectorAll('.bottleneck-chip');

  if (!teamSlider || !hoursSlider || !wageSlider) return;

  function calculate() {
    const team = parseInt(teamSlider.value, 10);
    const hours = parseFloat(hoursSlider.value);
    const wage = parseInt(wageSlider.value, 10);

    // Update labels
    if (teamVal) teamVal.textContent = `${team} ${team === 1 ? 'person' : 'people'}`;
    if (hoursVal) hoursVal.textContent = `${hours} hrs / day`;
    if (wageVal) wageVal.textContent = `₹${wage.toLocaleString('en-IN')}`;

    // Selected bottlenecks multiplier
    const selectedCount = document.querySelectorAll('.bottleneck-chip.selected').length || 1;
    const efficiencyFactor = Math.min(0.88, 0.70 + (selectedCount * 0.04)); // 74% - 88% automation capture

    // Monthly working days = 22
    const totalManualHoursPerMonth = team * hours * 22;
    const savedHoursPerMonth = Math.round(totalManualHoursPerMonth * efficiencyFactor);

    // Annual cost saved = monthly saved hours * hourly wage * 12 months
    const annualSavings = Math.round(savedHoursPerMonth * wage * 12);

    // Productivity multiplier
    const multiplier = (1 / (1 - (efficiencyFactor * (hours / 8)))).toFixed(1);

    if (hoursSavedResult) hoursSavedResult.textContent = savedHoursPerMonth.toLocaleString('en-IN');
    if (annualSavingsResult) annualSavingsResult.textContent = `₹${(annualSavings / 100000).toFixed(1)} Lakhs`;
    if (productivityResult) productivityResult.textContent = `${multiplier}x`;

    // Dynamic architecture recommendation
    if (recommendedArch) {
      if (selectedCount >= 3) {
        recommendedArch.textContent = 'Custom Enterprise ERP & Autonomous n8n Workflow Suite';
      } else {
        recommendedArch.textContent = 'AtomNext AI Multi-Channel WhatsApp & Data Pipeline';
      }
    }
  }

  teamSlider.addEventListener('input', calculate);
  hoursSlider.addEventListener('input', calculate);
  wageSlider.addEventListener('input', calculate);

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
      calculate();
    });
  });

  calculate();
}

/* ==========================================================================
   4. Research & System Architecture Tabs
   ========================================================================== */
function initArchTabs() {
  const tabs = document.querySelectorAll('.arch-tab-btn');
  const panels = document.querySelectorAll('.arch-panel');

  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-target');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });
}

/* ==========================================================================
   5. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (question && answer) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close other items
        items.forEach(other => {
          other.classList.remove('open');
          const otherAns = other.querySelector('.faq-answer');
          if (otherAns) otherAns.style.maxHeight = null;
        });

        if (!isOpen) {
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });
}

/* ==========================================================================
   6. AtomNext Copilot AI Assistant Chatbot
   ========================================================================== */
function initAiChatbot() {
  const toggleBtn = document.querySelector('.chat-widget-btn');
  const modal = document.querySelector('.chat-modal-window');
  const closeBtn = document.querySelector('.chat-close-btn');
  const sendBtn = document.querySelector('.chat-send-btn');
  const input = document.querySelector('.chat-input-field');
  const messagesArea = document.querySelector('.chat-messages-area');
  const quickBtns = document.querySelectorAll('.chat-quick-btn');

  if (!toggleBtn || !modal) return;

  toggleBtn.addEventListener('click', () => {
    modal.classList.toggle('open');
    if (modal.classList.contains('open') && input) {
      input.focus();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
    });
  }

  function appendMessage(text, sender = 'bot') {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;
    bubble.innerHTML = text;
    messagesArea.appendChild(bubble);
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }

  function handleSend(userText) {
    const text = userText || (input ? input.value.trim() : '');
    if (!text) return;

    appendMessage(escapeHtml(text), 'user');
    if (input) input.value = '';

    // Show typing state
    const typingBubble = document.createElement('div');
    typingBubble.className = 'chat-bubble bot';
    typingBubble.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Thinking...';
    messagesArea.appendChild(typingBubble);
    messagesArea.scrollTop = messagesArea.scrollHeight;

    // Call serverless netlify function or local knowledge engine
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    })
      .then(res => res.json())
      .then(data => {
        typingBubble.remove();
        if (data && data.response) {
          appendMessage(formatBotResponse(data.response), 'bot');
        } else {
          respondLocally(text);
        }
      })
      .catch(() => {
        typingBubble.remove();
        respondLocally(text);
      });
  }

  function respondLocally(query) {
    const q = query.toLowerCase();
    let reply = '';

    if (q.includes('msme') || q.includes('register') || q.includes('gov') || q.includes('udyam')) {
      reply = `<strong>AtomNext Solutions</strong> is an officially registered Micro, Small & Medium Enterprise (MSME) under the Ministry of MSME, Government of India. We adhere to high-standard enterprise engineering, strict NDA protocols, and secure data isolation practices.`;
    } else if (q.includes('excel') || q.includes('automation') || q.includes('n8n') || q.includes('manual')) {
      reply = `We specialize in replacing manual Excel operations, copy-pasting, and repetitive tasks with automated n8n workflows and custom cloud pipelines. Our clients typically save 400+ hours every month. <br><br><a href="order.html" class="btn btn-sm btn-primary" style="margin-top:8px;">Request Automation Audit</a>`;
    } else if (q.includes('agent') || q.includes('whatsapp') || q.includes('ai') || q.includes('bot')) {
      reply = `Our custom AI agents operate 24/7 across WhatsApp, web, and internal channels to qualify leads, handle support, and execute operations automatically without human delay. <br><br><a href="book-call.html" class="btn btn-sm btn-primary" style="margin-top:8px;">Discuss Your AI Agent</a>`;
    } else if (q.includes('erp') || q.includes('pos') || q.includes('billing') || q.includes('invoice')) {
      reply = `We provide custom ERP and ERPNext implementations, unified multi-branch POS, inventory tracking, and automated GST/e-invoicing to replace scattered spreadsheets with one reliable system.`;
    } else if (q.includes('price') || q.includes('cost') || q.includes('quote') || q.includes('budget')) {
      reply = `Projects are customized to your exact operational requirements. You can use our <a href="order.html" style="font-weight:600; text-decoration:underline;">Service Request Wizard</a> for an instant project scope and quote within 24 hours.`;
    } else if (q.includes('call') || q.includes('meet') || q.includes('schedule') || q.includes('consult')) {
      reply = `You can easily book a 1-on-1 strategy call with our engineering team on our <a href="book-call.html" style="font-weight:600; text-decoration:underline;">Consultation Scheduler</a>!`;
    } else {
      reply = `Thank you for reaching out! At AtomNext, we help businesses run smarter by replacing manual work with complete automated business systems (AI agents, n8n workflows, ERP/POS, and web/mobile apps). Would you like to schedule a call or request a custom proposal?`;
    }

    appendMessage(reply, 'bot');
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', () => handleSend());
  }

  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }

  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const prompt = btn.getAttribute('data-prompt');
      handleSend(prompt);
    });
  });
}

function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
}

function formatBotResponse(text) {
  if (typeof text !== 'string') return '';
  // Sanitize first to prevent XSS, then format linebreaks
  return escapeHtml(text).replace(/\n/g, '<br>');
}

/* ==========================================================================
   7. Scroll Reveal Animation (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
  const revealEls = document.querySelectorAll(
    '.service-card, .principle-box, .faq-item, .trust-item, ' +
    '.arch-step, .process-step, .pricing-card, .testimonial-card, ' +
    '.values-card, .timeline-step'
  );

  if (!revealEls.length) return;

  // Add base hidden state
  revealEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ease ${(i % 4) * 0.1}s, transform 0.5s ease ${(i % 4) * 0.1}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

/* ==========================================================================
   8. Animated Trust Counters
   ========================================================================== */
function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-count-to]');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseFloat(el.getAttribute('data-count-to'));
    const suffix = el.getAttribute('data-count-suffix') || '';
    const prefix = el.getAttribute('data-count-prefix') || '';
    const duration = 1800;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      const display = Number.isInteger(target) ? Math.round(current) : current.toFixed(1);
      el.textContent = prefix + display + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ==========================================================================
   9. Smooth Scroll for Anchor Links
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navbar = document.querySelector('.navbar');
        const offset = navbar ? navbar.offsetHeight + 12 : 70;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ==========================================================================
   10. Navbar scroll state (compact + shadow on scroll)
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handler = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handler, { passive: true });
  handler();
}
