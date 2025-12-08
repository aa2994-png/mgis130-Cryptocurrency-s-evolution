// CryptoShifts - Enhanced with API Ninjas Bitcoin API
// Created by: Mili, Haleigh, Boris, and Amina - RIT 2025

// ========================================
// API CONFIGURATION
// ========================================
const API_NINJAS_KEY = '3bfVQ5lCQSwpSW8uQ1WYgQ==tSIcWPx3Qatwfht1';

// ========================================
// THEME TOGGLE FUNCTIONALITY
// ========================================
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

// ========================================
// MOBILE MENU TOGGLE
// ========================================
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

// ========================================
// LIVE CRYPTO PRICE TICKER - UPDATED FOR NEW API
// ========================================
let cryptoPrices = {};

async function fetchCryptoPrices() {
    try {
        // Fetch Bitcoin data
        const btcResponse = await fetch('https://api.api-ninjas.com/v1/cryptoprice?symbol=BTCUSDT', {
            headers: {
                'X-Api-Key': API_NINJAS_KEY
            }
        });
        
        // Fetch Ethereum data
        const ethResponse = await fetch('https://api.api-ninjas.com/v1/cryptoprice?symbol=ETHUSDT', {
            headers: {
                'X-Api-Key': API_NINJAS_KEY
            }
        });

        if (!btcResponse.ok || !ethResponse.ok) {
            throw new Error('API request failed');
        }

        const btcData = await btcResponse.json();
        const ethData = await ethResponse.json();
        
        // Store prices using the new API format
        cryptoPrices = {
            bitcoin: { 
                usd: parseFloat(btcData.price),
                usd_24h_change: parseFloat(btcData['24h_price_change_percent'])
            },
            ethereum: { 
                usd: parseFloat(ethData.price),
                usd_24h_change: parseFloat(ethData['24h_price_change_percent'])
            }
        };
        
        updatePriceTicker();
    } catch (error) {
        console.error('Error fetching crypto prices:', error);
        // Fallback to demo data if API fails
        cryptoPrices = {
            bitcoin: { usd: 91000, usd_24h_change: 1.85 },
            ethereum: { usd: 3200, usd_24h_change: -1.2 }
        };
        updatePriceTicker();
    }
}

function updatePriceTicker() {
    // Update Bitcoin price
    const btcPriceEl = document.getElementById('btcPrice');
    const btcChangeEl = document.getElementById('btcChange');
    
    if (btcPriceEl && cryptoPrices.bitcoin) {
        btcPriceEl.textContent = '$' + cryptoPrices.bitcoin.usd.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        
        if (btcChangeEl) {
            const change = cryptoPrices.bitcoin.usd_24h_change || 0;
            const changeClass = change >= 0 ? 'positive' : 'negative';
            const changeIcon = change >= 0 ? '▲' : '▼';
            btcChangeEl.className = 'ticker-change ' + changeClass;
            btcChangeEl.textContent = changeIcon + ' ' + Math.abs(change).toFixed(2) + '%';
        }
    }
    
    // Update Ethereum price
    const ethPriceEl = document.getElementById('ethPrice');
    const ethChangeEl = document.getElementById('ethChange');
    
    if (ethPriceEl && cryptoPrices.ethereum) {
        ethPriceEl.textContent = '$' + cryptoPrices.ethereum.usd.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        
        if (ethChangeEl) {
            const change = cryptoPrices.ethereum.usd_24h_change || 0;
            const changeClass = change >= 0 ? 'positive' : 'negative';
            const changeIcon = change >= 0 ? '▲' : '▼';
            ethChangeEl.className = 'ticker-change ' + changeClass;
            ethChangeEl.textContent = changeIcon + ' ' + Math.abs(change).toFixed(2) + '%';
        }
    }
    
    // Update Market Cap (calculated estimate)
    const marketCapEl = document.getElementById('marketCap');
    if (marketCapEl && cryptoPrices.bitcoin && cryptoPrices.ethereum) {
        // Rough estimate: BTC circulating supply ~19.5M, ETH ~120M
        const estimatedMarketCap = (cryptoPrices.bitcoin.usd * 19500000 + cryptoPrices.ethereum.usd * 120000000) / 1000000000000;
        marketCapEl.textContent = '$' + estimatedMarketCap.toFixed(2) + 'T';
    }
    
    // Update last update time
    const lastUpdateEl = document.getElementById('lastUpdate');
    if (lastUpdateEl) {
        const now = new Date();
        lastUpdateEl.textContent = 'Updated: ' + now.toLocaleTimeString();
    }
}

// Update prices every 60 seconds
setInterval(fetchCryptoPrices, 60000);

// ========================================
// BREADCRUMB UPDATE BASED ON SCROLL
// ========================================
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
            if (breadcrumb) {
                breadcrumb.textContent = sectionNames[sectionId] || 'Welcome';
            }
        }
    });
}, { threshold: 0.5 });

sections.forEach(section => sectionObserver.observe(section));

// ========================================
// ROI CALCULATOR
// ========================================
function calculateROI() {
    const investment = parseFloat(document.getElementById('investment').value);
    const type = document.getElementById('investmentType').value;
    const years = parseFloat(document.getElementById('years').value);
    
    if (!investment || !years || investment <= 0 || years <= 0) {
        alert('Please enter valid positive numbers for investment and years');
        return;
    }

    const rates = {
        'savings': 0.005,
        'stocks': 0.07,
        'crypto': 0.15,
        'stablecoin': 0.05
    };

    const rate = rates[type];
    const futureValue = investment * Math.pow(1 + rate, years);
    const profit = futureValue - investment;
    const percentGain = ((profit / investment) * 100).toFixed(2);

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

    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ========================================
// CONTACT FORM SUBMISSION
// ========================================
function submitContact() {
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !subject || !message) {
        alert('Please fill in all fields');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }

    const resultDiv = document.getElementById('contactResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <p><strong>Thank you, ${name}!</strong></p>
        <p>Your message has been received. We'll respond to ${email} shortly.</p>
    `;

    document.getElementById('contactName').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactSubject').value = '';
    document.getElementById('contactMessage').value = '';

    setTimeout(() => {
        resultDiv.style.display = 'none';
    }, 5000);

    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ========================================
// SMOOTH SCROLLING
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            const navLinks = document.getElementById('navLinks');
            if (navLinks) {
                navLinks.classList.remove('active');
            }
        }
    });
});

// ========================================
// ANIMATE ELEMENTS ON SCROLL
// ========================================
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.card, .timeline-item');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

document.querySelectorAll('.card, .timeline-item').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('DOMContentLoaded', animateOnScroll);

// ========================================
// KEYBOARD NAVIGATION
// ========================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const navLinks = document.getElementById('navLinks');
        if (navLinks) navLinks.classList.remove('active');
    }
    
    if (e.key === 'Enter' && (
        document.activeElement.id === 'investment' ||
        document.activeElement.id === 'years' ||
        document.activeElement.id === 'investmentType'
    )) {
        calculateROI();
    }
    
    if (e.key === 'Enter' && e.ctrlKey) {
        if (document.activeElement.id === 'contactMessage') {
            submitContact();
        }
    }
});

// ========================================
// NAVIGATION SHADOW ON SCROLL
// ========================================
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const nav = document.querySelector('nav');
    if (nav) {
        if (scrollTop > 50) {
            nav.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        } else {
            nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}, false);

// ========================================
// RESPONSIVE MENU HANDLING
// ========================================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768) {
            const navLinks = document.getElementById('navLinks');
            if (navLinks) navLinks.classList.remove('active');
        }
    }, 250);
});

// ========================================
// TOOLTIP ACCESSIBILITY
// ========================================
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

// ========================================
// INPUT VALIDATION
// ========================================
function validateNumber(value) {
    return !isNaN(value) && parseFloat(value) > 0;
}

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

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
    console.log('🚀 CryptoShifts - Loaded Successfully!');
    
    // Fetch initial crypto prices
    fetchCryptoPrices();
    
    console.log('%c🔗 CryptoShifts', 'font-size: 24px; font-weight: bold; color: #6366f1;');
    console.log('%cUnderstanding the Future of Money', 'font-size: 14px; color: #8b5cf6;');
    console.log('%cCreated by: Mili, Haleigh, Boris, and Amina', 'font-size: 12px; color: #64748b;');
    console.log('%cRochester Institute of Technology - 2025', 'font-size: 12px; color: #64748b;');
});

// ========================================
// PERFORMANCE MONITORING
// ========================================
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`Page loaded in ${(loadTime / 1000).toFixed(2)} seconds`);
});