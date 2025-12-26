document.addEventListener("DOMContentLoaded", function () {
    console.log("Atom Next AI website loaded!");
    // Initialize hero section animations
    const heroSection = document.querySelector('.hero');
    const sphere = document.querySelector('.sphere-3d');
    const techCards = document.querySelectorAll('.tech-card');
    const heroContent = document.querySelector('.hero-content');

    // Animate hero content on load
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(20px)';

        setTimeout(() => {
            heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }

    // Animate tech cards
    techCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 500 + (index * 200));
    });

    // Sphere rotation animation
    if (sphere) {
        let rotation = 0;
        function animateSphere() {
            rotation += 0.5;
            sphere.style.transform = `rotateY(${rotation}deg)`;
            requestAnimationFrame(animateSphere);
        }
        animateSphere();
    }

    // Parallax effect for tech cards
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        techCards.forEach((card) => {
            const speed = card.getAttribute('data-speed') || 0.1;
            const x = (mouseX - 0.5) * speed * 100;
            const y = (mouseY - 0.5) * speed * 100;

            card.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections for scroll animations
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Particle effect
    const particleContainer = document.querySelector('.particle-network');
    if (particleContainer) {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDuration = `${Math.random() * 3 + 2}s`;
            particle.style.animationDelay = `${Math.random() * 2}s`;
            particleContainer.appendChild(particle);
        }
    }
});

// Navigation scroll effect
window.addEventListener("scroll", function () {
    const nav = document.querySelector("nav");
    if (nav) {
        nav.classList.toggle("scrolled", window.scrollY > 50);
    }
});

const text = "We Build AI Automations for Businesses";
let index = 0;
function typeEffect() {
    if (index < text.length) {
        document.getElementById("hero-title").textContent += text.charAt(index);
        index++;
        setTimeout(typeEffect, 100);
    }
}
document.addEventListener("DOMContentLoaded", typeEffect);

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const navItems = document.querySelector('.nav-items');
    const navLinks = document.querySelectorAll('.nav-items a');
    const body = document.body;

    // Toggle menu
    if (hamburger && navItems) {
        hamburger.addEventListener('click', function (e) {
            e.stopPropagation();
            this.classList.toggle('active');
            navItems.classList.toggle('active');
            body.classList.toggle('no-scroll');
        });
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            if (navItems.classList.contains('active')) {
                navItems.classList.remove('active');
                hamburger.classList.remove('active');
                body.classList.remove('no-scroll');
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
        if (navItems.classList.contains('active') &&
            !e.target.closest('.nav-items') &&
            !e.target.closest('.hamburger')) {
            navItems.classList.remove('active');
            hamburger.classList.remove('active');
            body.classList.remove('no-scroll');
        }
    });

    // Prevent clicks inside nav from closing it
    navItems.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#" or if target doesn't exist
            if (href === '#' || href.length === 1) {
                e.preventDefault();
                return;
            }

            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Close mobile menu if open
                if (navItems.classList.contains('active')) {
                    navItems.classList.remove('active');
                    hamburger.classList.remove('active');
                    body.classList.remove('no-scroll');
                }
            }
        });
    });
});



// Chatbot functionality
document.addEventListener('DOMContentLoaded', function () {
    const chatbotContainer = document.querySelector('.chatbot-container');
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotClose = document.querySelector('.chatbot-close');
    const chatbotInput = document.querySelector('.chatbot-text-input');
    const chatbotSend = document.querySelector('.chatbot-send');
    const chatbotMessages = document.querySelector('.chatbot-messages');
    const chatbotWelcome = document.querySelector('.chatbot-welcome');
    const chatbotWelcomeClose = document.querySelector('.chatbot-welcome-close');

    // Generate a unique session ID
    const sessionId = 'session_' + Math.random().toString(36).substr(2, 9);

    // Show welcome popup after a short delay
    setTimeout(() => {
        chatbotWelcome.classList.add('active');
    }, 2000);

    // Close welcome popup
    chatbotWelcomeClose.addEventListener('click', () => {
        chatbotWelcome.classList.remove('active');
    });

    // Toggle chatbot
    chatbotToggle.addEventListener('click', () => {
        chatbotContainer.classList.add('active');
        chatbotWelcome.classList.remove('active');
    });

    // Close chatbot
    chatbotClose.addEventListener('click', () => {
        chatbotContainer.classList.remove('active');
    });

    // Add typing indicator
    function addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing';
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        chatbotMessages.appendChild(typingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        return typingDiv;
    }

    // Remove typing indicator
    function removeTypingIndicator(typingDiv) {
        if (typingDiv && typingDiv.parentNode) {
            typingDiv.parentNode.removeChild(typingDiv);
        }
    }

    // Send message function
    async function sendMessage() {
        const message = chatbotInput.value.trim();
        if (message) {
            // Add user message
            addMessage(message, 'user');
            chatbotInput.value = '';

            // Show typing indicator
            const typingIndicator = addTypingIndicator();

            try {
                // Send message to backend
                const response = await fetch('http://localhost:5000/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: message,
                        session_id: sessionId
                    })
                });

                const data = await response.json();

                // Remove typing indicator
                removeTypingIndicator(typingIndicator);

                if (data.status === 'success') {
                    // Add bot response
                    addMessage(data.response, 'bot');
                } else {
                    // Handle error
                    addMessage('I apologize, but I encountered an error. Please try again later.', 'bot');
                }
            } catch (error) {
                // Remove typing indicator
                removeTypingIndicator(typingIndicator);

                // Handle network error
                addMessage('I apologize, but I\'m having trouble connecting to the server. Please try again later.', 'bot');
                console.error('Error:', error);
            }
        }
    }

    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.innerHTML = `<div class="message-content">${text}</div>`;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Send message on button click
    chatbotSend.addEventListener('click', sendMessage);

    // Send message on Enter key
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
