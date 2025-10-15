// CryptoShifts - Main JavaScript File

// Theme Toggle Functionality
function toggleTheme() {
    const body = document.body;
    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
    }
}

// Load saved theme preference on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.className = savedTheme + '-mode';
});

// Mobile Menu Toggle
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

// Breadcrumb Update Based on Scroll Position
const sections = document.querySelectorAll('section');
const breadcrumb = document.getElementById('currentSection');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            const sectionNames = {
                'home': 'Welcome',
                'basics': 'Understanding the Basics',
                'pros-cons': 'Pros and Cons',
                'global': 'Global Impact',
                'features': 'Key Features',
                'market': 'Market and Adoption',
                'resources': 'Resources',
                'contact': 'Contact Us'
            };
            breadcrumb.textContent = sectionNames[sectionId] || 'Welcome';
        }
    });
}, { threshold: 0.5 });

// Observe all sections for breadcrumb updates
sections.forEach(section => sectionObserver.observe(section));

// ROI Calculator Function
function calculateROI() {
    const investment = parseFloat(document.getElementById('investment').value);
    const type = document.getElementById('investmentType').value;
    const years = parseFloat(document.getElementById('years').value);
    
    // Validation
    if (!investment || !years || investment <= 0 || years <= 0) {
        alert('Please enter valid positive numbers for investment and years');
        return;
    }

    // Interest rates for different investment types
    const rates = {
        'savings': 0.005,      // 0.5% APY
        'stocks': 0.07,        // 7% average annual
        'crypto': 0.15,        // 15% average annual (high risk)
        'stablecoin': 0.05     // 5% APY
    };

    const rate = rates[type];
    
    // Calculate future value using compound interest formula: FV = PV * (1 + r)^t
    const futureValue = investment * Math.pow(1 + rate, years);
    const profit = futureValue - investment;
    const percentGain = ((profit / investment) * 100).toFixed(2);

    // Display results
    const resultDiv = document.getElementById('roiResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h4>Investment Results</h4>
        <p><strong>Initial Investment:</strong> $${investment.toLocaleString()}</p>
        <p><strong>Future Value:</strong> $${futureValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
        <p><strong>Total Profit:</strong> $${profit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
        <p><strong>Percentage Gain:</strong> ${percentGain}%</p>
        ${type === 'crypto' ? '<p style="color: #f59e0b; margin-top: 10px;"><small>⚠️ Cryptocurrency is highly volatile. Past performance doesn\'t guarantee future results.</small></p>' : ''}
    `;

    // Smooth scroll to results
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Contact Form Submission Function
function submitContact() {
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    // Validation - check if all fields are filled
    if (!name || !email || !subject || !message) {
        alert('Please fill in all fields');
        return;
    }

    // Email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }

    // Display success message
    const resultDiv = document.getElementById('contactResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <p><strong>Thank you, ${name}!</strong></p>
        <p>Your message has been received. We'll respond to ${email} shortly.</p>
    `;

    // Clear form fields
    document.getElementById('contactName').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactSubject').value = '';
    document.getElementById('contactMessage').value = '';

    // Hide success message after 5 seconds
    setTimeout(() => {
        resultDiv.style.display = 'none';
    }, 5000);

    // Scroll to success message
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            document.getElementById('navLinks').classList.remove('active');
        }
    });
});

// Animate Elements on Scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.card, .timeline-item');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        // Check if element is in viewport
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Initialize card and timeline animations
document.querySelectorAll('.card, .timeline-item').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

// Run animation check on scroll and initial load
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('DOMContentLoaded', animateOnScroll);

// Performance Monitoring
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`Page loaded in ${(loadTime / 1000).toFixed(2)} seconds`);
    
    // Log performance metrics if PerformanceObserver is available
    if ('PerformanceObserver' in window) {
        try {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    console.log('Performance:', entry.name, entry.duration + 'ms');
                }
            });
            observer.observe({ entryTypes: ['measure', 'navigation'] });
        } catch (e) {
            console.log('Performance monitoring not available');
        }
    }
});

// Keyboard Navigation Support
document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape key
    if (e.key === 'Escape') {
        document.getElementById('navLinks').classList.remove('active');
    }
    
    // Enter key on calculator inputs triggers calculation
    if (e.key === 'Enter' && (
        document.activeElement.id === 'investment' ||
        document.activeElement.id === 'years' ||
        document.activeElement.id === 'investmentType'
    )) {
        calculateROI();
    }
});

// Add Enter key support for contact form
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        const activeElement = document.activeElement;
        if (activeElement.id === 'contactMessage') {
            submitContact();
        }
    }
});

// Track scroll progress (optional enhancement)
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add shadow to nav on scroll
    const nav = document.querySelector('nav');
    if (scrollTop > 50) {
        nav.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}, false);

// Handle window resize for responsive adjustments
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768) {
            document.getElementById('navLinks').classList.remove('active');
        }
    }, 250);
});

// Tooltip accessibility - keyboard support
document.querySelectorAll('.tooltip').forEach(tooltip => {
    tooltip.setAttribute('tabindex', '0');
    
    tooltip.addEventListener('focus', function() {
        const tooltipText = this.querySelector('.tooltiptext');
        if (tooltipText) {
            tooltipText.style.visibility = 'visible';
            tooltipText.style.opacity = '1';
        }
    });
    
    tooltip.addEventListener('blur', function() {
        const tooltipText = this.querySelector('.tooltiptext');
        if (tooltipText) {
            tooltipText.style.visibility = 'hidden';
            tooltipText.style.opacity = '0';
        }
    });
});

// Add loading state indicator
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
    console.log('CryptoShifts website loaded successfully!');
});

// Analytics tracking (placeholder - replace with actual analytics if needed)
function trackEvent(category, action, label) {
    console.log('Event tracked:', { category, action, label });
    // Example: Google Analytics tracking
    // gtag('event', action, { 'event_category': category, 'event_label': label });
}

// Track button clicks
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function() {
        trackEvent('Button', 'Click', this.textContent);
    });
});

// Track external link clicks
document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.addEventListener('click', function() {
        trackEvent('External Link', 'Click', this.href);
    });
});

// Form validation helpers
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateNumber(value) {
    return !isNaN(value) && parseFloat(value) > 0;
}

// Add real-time validation feedback (optional enhancement)
const investmentInput = document.getElementById('investment');
const yearsInput = document.getElementById('years');

if (investmentInput) {
    investmentInput.addEventListener('input', function() {
        if (this.value && !validateNumber(this.value)) {
            this.style.borderColor = '#ef4444';
        } else {
            this.style.borderColor = '';
        }
    });
}

if (yearsInput) {
    yearsInput.addEventListener('input', function() {
        if (this.value && !validateNumber(this.value)) {
            this.style.borderColor = '#ef4444';
        } else {
            this.style.borderColor = '';
        }
    });
}

// Console welcome message
console.log('%c🔗 CryptoShifts', 'font-size: 24px; font-weight: bold; color: #6366f1;');
console.log('%cUnderstanding the Future of Money', 'font-size: 14px; color: #8b5cf6;');
console.log('%cCreated by: Mili, Haleigh, Boris, and Amina', 'font-size: 12px; color: #64748b;');
console.log('%cRochester Institute of Technology - 2025', 'font-size: 12px; color: #64748b;');