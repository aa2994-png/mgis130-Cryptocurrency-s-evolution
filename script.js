// CryptoShifts - Enhanced with Gamification, Quizzes, Charts & API
// Created by: Mili, Haleigh, Boris, and Amina - RIT 2025

// ========================================
// API CONFIGURATION
// ========================================
const API_NINJAS_KEY = '3bfVQ5lCQSwpSW8uQ1WYgQ==tSIcWPx3Qatwfht1';

// ========================================
// GAMIFICATION SYSTEM - XP & LEVELS
// ========================================
const LEVELS = [
    { level: 1, xpRequired: 0, title: "Crypto Newbie" },
    { level: 2, xpRequired: 100, title: "Beginner Trader" },
    { level: 3, xpRequired: 250, title: "Learning Investor" },
    { level: 4, xpRequired: 450, title: "Crypto Enthusiast" },
    { level: 5, xpRequired: 700, title: "Crypto Master" }
];

const BADGES = [
    { id: 'first_visit', name: 'First Steps', icon: '🚀', description: 'Visit CryptoShifts for the first time', xp: 10 },
    { id: 'page_explorer', name: 'Page Explorer', icon: '🗺️', description: 'Visit all pages', xp: 50 },
    { id: 'quiz_starter', name: 'Quiz Starter', icon: '📝', description: 'Complete your first quiz', xp: 50 },
    { id: 'quiz_master', name: 'Quiz Master', icon: '🎓', description: 'Complete all 4 quizzes', xp: 100 },
    { id: 'perfect_score', name: 'Perfect Score', icon: '💯', description: 'Get 100% on any quiz', xp: 75 },
    { id: 'calculator_pro', name: 'Calculator Pro', icon: '🧮', description: 'Use the ROI calculator', xp: 20 },
    { id: 'market_analyst', name: 'Market Analyst', icon: '📊', description: 'View interactive price charts', xp: 20 },
    { id: 'tooltip_hunter', name: 'Tooltip Hunter', icon: '🔍', description: 'Discover 5 tooltips', xp: 15 },
    { id: 'level_5', name: 'Crypto Master', icon: '👑', description: 'Reach Level 5 - Maximum Level!', xp: 0 },
    { id: 'dedicated_learner', name: 'Dedicated Learner', icon: '📚', description: 'Spend 30 minutes on the site', xp: 50 }
];

let gameState = {
    xp: 0,
    level: 1,
    badges: [],
    pagesVisited: [],
    quizzesCompleted: [],
    tooltipsDiscovered: 0,
    calculatorUsed: false,
    chartViewed: false,
    sessionStartTime: Date.now()
};

// ========================================
// STORAGE FUNCTIONS
// ========================================
function saveGameState() {
    localStorage.setItem('cryptoShiftsGame', JSON.stringify(gameState));
}

function loadGameState() {
    const saved = localStorage.getItem('cryptoShiftsGame');
    if (saved) {
        gameState = JSON.parse(saved);
        gameState.sessionStartTime = Date.now(); // Reset session timer
        
        // Auto-migration: Remove invalid badges if they exist
        const validBadgeIds = BADGES.map(b => b.id);
        const invalidBadges = ['level_7', 'elite_trader', 'level_10'];
        
        // Filter out any invalid badges
        gameState.badges = gameState.badges.filter(badgeId => {
            return validBadgeIds.includes(badgeId) && !invalidBadges.includes(badgeId);
        });
        
        // Save the cleaned state
        saveGameState();
    }
    updateXPDisplay();
    updateBadgeCount();
}

// ========================================
// XP SYSTEM FUNCTIONS
// ========================================
function addXP(amount, reason) {
    gameState.xp += amount;
    
    // Check for level up
    const newLevel = calculateLevel(gameState.xp);
    const leveledUp = newLevel > gameState.level;
    gameState.level = newLevel;
    
    // Show notification
    showXPNotification(amount, reason, leveledUp);
    
    // Update display
    updateXPDisplay();
    saveGameState();
    
    // Check for level badges
    if (leveledUp) {
        checkLevelBadges();
    }
}

function calculateLevel(xp) {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (xp >= LEVELS[i].xpRequired) {
            return LEVELS[i].level;
        }
    }
    return 1;
}

function updateXPDisplay() {
    const currentLevel = LEVELS.find(l => l.level === gameState.level);
    const nextLevel = LEVELS.find(l => l.level === gameState.level + 1);
    
    document.getElementById('levelBadge').textContent = `Level ${gameState.level}`;
    document.getElementById('currentXP').textContent = gameState.xp;
    
    if (nextLevel) {
        document.getElementById('nextLevelXP').textContent = nextLevel.xpRequired;
        const progress = ((gameState.xp - currentLevel.xpRequired) / (nextLevel.xpRequired - currentLevel.xpRequired)) * 100;
        document.getElementById('xpProgressFill').style.width = Math.min(progress, 100) + '%';
    } else {
        document.getElementById('nextLevelXP').textContent = 'MAX';
        document.getElementById('xpProgressFill').style.width = '100%';
    }
}

function showXPNotification(xp, reason, levelUp = false) {
    const notification = document.getElementById('xpNotification');
    
    if (levelUp) {
        notification.innerHTML = `
            <div class="level-up">
                🎉 LEVEL UP! 🎉<br>
                Level ${gameState.level}<br>
                <small>${LEVELS.find(l => l.level === gameState.level).title}</small>
            </div>
        `;
        notification.className = 'xp-notification level-up-notification show';
    } else {
        notification.innerHTML = `+${xp} XP<br><small>${reason}</small>`;
        notification.className = 'xp-notification show';
    }
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// ========================================
// BADGE SYSTEM FUNCTIONS
// ========================================
function unlockBadge(badgeId) {
    if (gameState.badges.includes(badgeId)) return;
    
    const badge = BADGES.find(b => b.id === badgeId);
    if (!badge) return;
    
    gameState.badges.push(badgeId);
    
    if (badge.xp > 0) {
        addXP(badge.xp, badge.name + ' Unlocked!');
    }
    
    showBadgeUnlockNotification(badge);
    updateBadgeCount();
    saveGameState();
}

function showBadgeUnlockNotification(badge) {
    const notification = document.getElementById('xpNotification');
    notification.innerHTML = `
        <div class="badge-unlock">
            <div class="badge-icon">${badge.icon}</div>
            <div><strong>Badge Unlocked!</strong><br>${badge.name}</div>
        </div>
    `;
    notification.className = 'xp-notification badge-notification show';
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

function updateBadgeCount() {
    const totalBadges = BADGES.length; // This will be 10
    document.getElementById('badgeCount').textContent = `${gameState.badges.length}/${totalBadges}`;
}

function openBadgeModal() {
    const modal = document.getElementById('badgeModal');
    const grid = document.getElementById('badgesGrid');
    
    grid.innerHTML = '';
    
    BADGES.forEach(badge => {
        const unlocked = gameState.badges.includes(badge.id);
        const badgeCard = document.createElement('div');
        badgeCard.className = 'badge-card' + (unlocked ? ' unlocked' : ' locked');
        badgeCard.innerHTML = `
            <div class="badge-icon-large">${unlocked ? badge.icon : '🔒'}</div>
            <h4>${badge.name}</h4>
            <p>${badge.description}</p>
            ${badge.xp > 0 ? `<span class="badge-xp">+${badge.xp} XP</span>` : ''}
        `;
        grid.appendChild(badgeCard);
    });
    
    modal.style.display = 'block';
}

function closeBadgeModal() {
    document.getElementById('badgeModal').style.display = 'none';
}

function checkLevelBadges() {
    if (gameState.level >= 5) unlockBadge('level_5');
}

// ========================================
// PAGE TRACKING
// ========================================
function trackPageVisit(pageName) {
    if (!gameState.pagesVisited.includes(pageName)) {
        gameState.pagesVisited.push(pageName);
        addXP(10, 'Visited ' + pageName.charAt(0).toUpperCase() + pageName.slice(1));
        saveGameState();
        
        // Check for badges
        if (gameState.pagesVisited.length === 1) {
            unlockBadge('first_visit');
        }
        if (gameState.pagesVisited.length >= 8) {
            unlockBadge('page_explorer');
        }
    }
}

// ========================================
// QUIZ DATA
// ========================================
const QUIZZES = {
    basics: {
        title: 'Cryptocurrency Basics',
        questions: [
            {
                question: 'What is blockchain technology?',
                options: [
                    'A type of cryptocurrency',
                    'A distributed ledger technology',
                    'A central bank system',
                    'A payment processor'
                ],
                correct: 1,
                explanation: 'Blockchain is a distributed ledger technology that records transactions across multiple computers securely.'
            },
            {
                question: 'What does CBDC stand for?',
                options: [
                    'Crypto Based Digital Currency',
                    'Central Bank Digital Currency',
                    'Cybersecurity Bitcoin Data',
                    'Centralized Blockchain Development'
                ],
                correct: 1,
                explanation: 'CBDC stands for Central Bank Digital Currency - digital versions of fiat currency issued by central banks.'
            },
            {
                question: 'What is a stablecoin?',
                options: [
                    'A cryptocurrency with no volatility',
                    'A coin pegged to stable assets like USD',
                    'Government-issued digital currency',
                    'The original Bitcoin'
                ],
                correct: 1,
                explanation: 'Stablecoins are cryptocurrencies pegged to stable assets, offering reduced volatility.'
            },
            {
                question: 'What is fiat currency?',
                options: [
                    'Digital cryptocurrency',
                    'Government-issued traditional money',
                    'Gold-backed currency',
                    'Private company money'
                ],
                correct: 1,
                explanation: 'Fiat currency is government-issued money not backed by physical commodities, but by government authority.'
            },
            {
                question: 'What makes cryptocurrency decentralized?',
                options: [
                    'Owned by one company',
                    'Controlled by governments',
                    'No single controlling authority',
                    'Requires bank approval'
                ],
                correct: 2,
                explanation: 'Cryptocurrency is decentralized because it operates without a single controlling authority.'
            }
        ]
    },
    'pros-cons': {
        title: 'Crypto Advantages & Challenges',
        questions: [
            {
                question: 'Which is an advantage of cryptocurrency?',
                options: [
                    'Price stability',
                    'Slow transactions',
                    'Fast borderless transactions',
                    'Government control'
                ],
                correct: 2,
                explanation: 'Fast, borderless transactions are a key advantage of cryptocurrency.'
            },
            {
                question: 'What is a major challenge for cryptocurrency?',
                options: [
                    'Too much transparency',
                    'Price volatility',
                    'Instant settlement',
                    'Low transaction fees'
                ],
                correct: 1,
                explanation: 'Price volatility is a major challenge, with significant price fluctuations.'
            },
            {
                question: 'What is a strength of fiat currency?',
                options: [
                    'Anonymous transactions',
                    'Stability and government backing',
                    'No inflation',
                    'Free international transfers'
                ],
                correct: 1,
                explanation: 'Fiat currency benefits from stability and government backing.'
            },
            {
                question: 'Which is a limitation of fiat currency?',
                options: [
                    'Universal acceptance',
                    'Consumer protection',
                    'Slow international transfers',
                    'Government guarantee'
                ],
                correct: 2,
                explanation: 'International fiat transfers can take days, unlike crypto transactions.'
            },
            {
                question: 'What does cryptocurrency offer for the unbanked?',
                options: [
                    'Nothing useful',
                    'Financial inclusion',
                    'Government loans',
                    'Physical bank branches'
                ],
                correct: 1,
                explanation: 'Cryptocurrency provides financial inclusion for those without access to traditional banking.'
            }
        ]
    },
    global: {
        title: 'Global Crypto Impact',
        questions: [
            {
                question: 'When was Bitcoin introduced?',
                options: ['2005', '2007', '2009', '2011'],
                correct: 2,
                explanation: 'Bitcoin was introduced in 2009, launching blockchain technology to the world.'
            },
            {
                question: 'Which country adopted Bitcoin as legal tender?',
                options: ['United States', 'China', 'El Salvador', 'Japan'],
                correct: 2,
                explanation: 'El Salvador became the first country to adopt Bitcoin as legal tender in 2021.'
            },
            {
                question: 'When did Ethereum launch smart contracts?',
                options: ['2009', '2013', '2015', '2017'],
                correct: 2,
                explanation: 'Ethereum launched in 2015, enabling smart contracts and DeFi applications.'
            },
            {
                question: 'Which region leads CBDC development?',
                options: [
                    'Americas',
                    'Europe with digital euro',
                    'Asia with digital yuan',
                    'Africa'
                ],
                correct: 2,
                explanation: 'China leads CBDC development with the digital yuan pilot program.'
            },
            {
                question: 'What is the EU\'s crypto regulation called?',
                options: ['CryptoLaw', 'MiCA', 'EuroBlock', 'DigitalAct'],
                correct: 1,
                explanation: 'MiCA (Markets in Crypto-Assets) is the EU\'s comprehensive crypto regulation framework.'
            }
        ]
    },
    market: {
        title: 'Market & Adoption',
        questions: [
            {
                question: 'Approximately how many crypto users are worldwide?',
                options: ['50 million', '150 million', '420 million', '1 billion'],
                correct: 2,
                explanation: 'There are approximately 420 million cryptocurrency users worldwide.'
            },
            {
                question: 'What is the global crypto market cap?',
                options: [
                    'Over $500 billion',
                    'Over $1 trillion',
                    'Over $2 trillion',
                    'Over $5 trillion'
                ],
                correct: 2,
                explanation: 'The global cryptocurrency market capitalization exceeds $2 trillion.'
            },
            {
                question: 'What is the primary use of crypto currently?',
                options: [
                    'Daily purchases',
                    'Investment and speculation',
                    'Paying bills',
                    'Employee salaries'
                ],
                correct: 1,
                explanation: 'Despite growing adoption, crypto remains primarily focused on investment and speculation.'
            },
            {
                question: 'Which companies accept cryptocurrency?',
                options: [
                    'None',
                    'Only small startups',
                    'Microsoft, PayPal, retailers',
                    'Only in Asia'
                ],
                correct: 2,
                explanation: 'Major companies like Microsoft, PayPal, and various retailers now accept cryptocurrency.'
            },
            {
                question: 'What is the predicted future monetary system?',
                options: [
                    'Only cryptocurrency',
                    'Only fiat currency',
                    'Hybrid coexistence of both',
                    'Return to gold standard'
                ],
                correct: 2,
                explanation: 'Experts predict a hybrid system with coexistence of fiat, CBDCs, and cryptocurrencies.'
            }
        ]
    }
};

let currentQuiz = null;
let currentQuestionIndex = 0;
let quizAnswers = [];

// ========================================
// QUIZ FUNCTIONS
// ========================================
function initializeQuiz(quizId) {
    const quiz = QUIZZES[quizId];
    const container = document.getElementById('quiz-' + quizId);
    
    if (!quiz || !container) return;
    
    // Check if already completed
    if (gameState.quizzesCompleted.includes(quizId)) {
        container.innerHTML = `
            <div class="quiz-completed">
                <div class="completion-badge">✅</div>
                <h3>Quiz Completed!</h3>
                <p>You've already completed this quiz.</p>
                <button class="quiz-btn" onclick="retakeQuiz('${quizId}')">Retake Quiz</button>
            </div>
        `;
        return;
    }
    
    // Show start screen
    container.innerHTML = `
        <div class="quiz-start">
            <h3>${quiz.title}</h3>
            <p>${quiz.questions.length} questions • Earn +50 XP</p>
            <button class="quiz-btn" onclick="startQuiz('${quizId}')">Start Quiz</button>
        </div>
    `;
}

function startQuiz(quizId) {
    currentQuiz = quizId;
    currentQuestionIndex = 0;
    quizAnswers = [];
    loadQuizQuestion();
}

function retakeQuiz(quizId) {
    currentQuiz = quizId;
    currentQuestionIndex = 0;
    quizAnswers = [];
    loadQuizQuestion();
}

function loadQuizQuestion() {
    const quiz = QUIZZES[currentQuiz];
    const container = document.getElementById('quiz-' + currentQuiz);
    const question = quiz.questions[currentQuestionIndex];
    
    container.innerHTML = `
        <div class="quiz-progress">
            <span>Question ${currentQuestionIndex + 1} of ${quiz.questions.length}</span>
        </div>
        <div class="quiz-question">
            <h3>${question.question}</h3>
            <div class="quiz-options">
                ${question.options.map((option, index) => `
                    <button class="quiz-option" onclick="selectQuizAnswer(${index})" data-index="${index}">
                        ${option}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

function selectQuizAnswer(answerIndex) {
    const quiz = QUIZZES[currentQuiz];
    const question = quiz.questions[currentQuestionIndex];
    const container = document.getElementById('quiz-' + currentQuiz);
    const options = container.querySelectorAll('.quiz-option');
    
    // Disable all options
    options.forEach(opt => opt.disabled = true);
    
    const isCorrect = answerIndex === question.correct;
    quizAnswers.push(isCorrect);
    
    // Visual feedback
    options[answerIndex].classList.add(isCorrect ? 'correct' : 'incorrect');
    if (!isCorrect) {
        options[question.correct].classList.add('correct');
    }
    
    // Show explanation and next button
    setTimeout(() => {
        const feedback = document.createElement('div');
        feedback.className = 'quiz-feedback ' + (isCorrect ? 'correct' : 'incorrect');
        feedback.innerHTML = `
            <p><strong>${isCorrect ? '✅ Correct!' : '❌ Incorrect'}</strong></p>
            <p>${question.explanation}</p>
            <button class="quiz-btn" onclick="nextQuizQuestion()">
                ${currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
        `;
        container.appendChild(feedback);
    }, 500);
}

function nextQuizQuestion() {
    const quiz = QUIZZES[currentQuiz];
    currentQuestionIndex++;
    
    if (currentQuestionIndex < quiz.questions.length) {
        loadQuizQuestion();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    const quiz = QUIZZES[currentQuiz];
    const container = document.getElementById('quiz-' + currentQuiz);
    const score = quizAnswers.filter(a => a).length;
    const percentage = (score / quiz.questions.length) * 100;
    
    let grade = 'Good Job!';
    let message = 'Keep learning!';
    
    if (percentage === 100) {
        grade = '🏆 Perfect!';
        message = 'Outstanding performance!';
        unlockBadge('perfect_score');
    } else if (percentage >= 80) {
        grade = '⭐ Great!';
        message = 'Excellent understanding!';
    } else if (percentage >= 60) {
        grade = '👍 Good!';
        message = 'Nice work!';
    }
    
    container.innerHTML = `
        <div class="quiz-results">
            <div class="score-circle">
                <div class="score-number">${score}</div>
                <div class="score-total">/ ${quiz.questions.length}</div>
            </div>
            <h3>${grade}</h3>
            <p>${message}</p>
            <p class="score-percent">${percentage}% Correct</p>
            <button class="quiz-btn" onclick="retakeQuiz('${currentQuiz}')">Retake Quiz</button>
        </div>
    `;
    
    // Award XP and update progress (only first time)
    if (!gameState.quizzesCompleted.includes(currentQuiz)) {
        gameState.quizzesCompleted.push(currentQuiz);
        addXP(50, 'Completed ' + quiz.title);
        
        // Check badges
        if (gameState.quizzesCompleted.length === 1) {
            unlockBadge('quiz_starter');
        }
        if (gameState.quizzesCompleted.length >= 4) {
            unlockBadge('quiz_master');
        }
        
        saveGameState();
    }
}

// ========================================
// INTERACTIVE PRICE CHART
// ========================================
let priceChart = null;
let currentCrypto = 'bitcoin';
let currentTimeframe = '24H';

function initializePriceChart() {
    const ctx = document.getElementById('priceChart');
    if (!ctx) return;
    
    // Award XP for viewing chart
    if (!gameState.chartViewed) {
        gameState.chartViewed = true;
        addXP(20, 'Viewed Price Charts');
        unlockBadge('market_analyst');
        saveGameState();
    }
    
    // Get theme for colors
    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#e2e8f0' : '#001F3F';
    const gridColor = isDarkMode ? 'rgba(148, 163, 184, 0.15)' : 'rgba(0, 31, 63, 0.1)';
    
    // Create chart
    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Price (USD)',
                data: [],
                borderColor: '#1E488F',
                backgroundColor: 'rgba(30, 72, 143, 0.1)',
                tension: 0.4,
                fill: true,
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    titleColor: textColor,
                    bodyColor: textColor,
                    borderColor: '#1E488F',
                    borderWidth: 2
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColor,
                        font: {
                            size: 13,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: gridColor
                    }
                },
                y: {
                    ticks: {
                        color: textColor,
                        font: {
                            size: 13,
                            weight: 'bold'
                        },
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    },
                    grid: {
                        color: gridColor
                    }
                }
            }
        }
    });
    
    loadChartData();
}

function switchCrypto(crypto) {
    currentCrypto = crypto;
    
    // Update button states
    document.querySelectorAll('.crypto-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    loadChartData();
}

function changeTimeframe(timeframe) {
    currentTimeframe = timeframe;
    
    // Update button states
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    loadChartData();
}

async function loadChartData() {
    if (!priceChart) return;
    
    // Generate simulated historical data based on current price
    const currentPrice = currentCrypto === 'bitcoin' ? 
        (cryptoPrices.bitcoin?.usd || 96500) : 
        (cryptoPrices.ethereum?.usd || 3450);
    
    let dataPoints = 24;
    let labels = [];
    let data = [];
    
    // Adjust based on timeframe
    switch(currentTimeframe) {
        case '1H':
            dataPoints = 12;
            for (let i = dataPoints; i >= 0; i--) {
                labels.push((i * 5) + 'm ago');
                data.push(currentPrice * (1 + (Math.random() - 0.5) * 0.01));
            }
            break;
        case '24H':
            dataPoints = 24;
            for (let i = dataPoints; i >= 0; i--) {
                labels.push(i + 'h ago');
                data.push(currentPrice * (1 + (Math.random() - 0.5) * 0.02));
            }
            break;
        case '7D':
            dataPoints = 7;
            for (let i = dataPoints; i >= 0; i--) {
                labels.push(i + 'd ago');
                data.push(currentPrice * (1 + (Math.random() - 0.5) * 0.05));
            }
            break;
        case '30D':
            dataPoints = 30;
            for (let i = dataPoints; i >= 0; i--) {
                labels.push(i + 'd ago');
                data.push(currentPrice * (1 + (Math.random() - 0.5) * 0.1));
            }
            break;
    }
    
    // Update chart
    priceChart.data.labels = labels.reverse();
    priceChart.data.datasets[0].data = data.reverse();
    
    // Update chart colors based on theme
    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#e2e8f0' : '#001F3F';
    const gridColor = isDarkMode ? 'rgba(148, 163, 184, 0.15)' : 'rgba(0, 31, 63, 0.1)';
    
    priceChart.options.scales.x.ticks.color = textColor;
    priceChart.options.scales.y.ticks.color = textColor;
    priceChart.options.scales.x.grid.color = gridColor;
    priceChart.options.scales.y.grid.color = gridColor;
    priceChart.options.plugins.tooltip.backgroundColor = isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)';
    priceChart.options.plugins.tooltip.titleColor = textColor;
    priceChart.options.plugins.tooltip.bodyColor = textColor;
    
    priceChart.update();
    
    // Update stats
    const high = Math.max(...data);
    const low = Math.min(...data);
    const change = ((data[data.length - 1] - data[0]) / data[0]) * 100;
    
    document.getElementById('chartPrice').textContent = '$' + currentPrice.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    const changeEl = document.getElementById('chartChange');
    changeEl.textContent = (change >= 0 ? '+' : '') + change.toFixed(2) + '%';
    changeEl.className = 'stat-value ' + (change >= 0 ? 'positive' : 'negative');
    
    document.getElementById('chartHigh').textContent = '$' + high.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    document.getElementById('chartLow').textContent = '$' + low.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// ========================================
// PAGE NAVIGATION SYSTEM
// ========================================
function showPage(pageName) {
    // Hide all pages
    const allPages = document.querySelectorAll('.page-content');
    allPages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const selectedPage = document.getElementById('page-' + pageName);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }
    
    // Update active nav link
    const allNavLinks = document.querySelectorAll('.nav-link');
    allNavLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`.nav-link[data-page="${pageName}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Track page visit for XP
    trackPageVisit(pageName);
    
    // Initialize page-specific content
    if (pageName === 'basics') {
        initializeQuiz('basics');
    } else if (pageName === 'pros-cons') {
        initializeQuiz('pros-cons');
    } else if (pageName === 'global') {
        initializeQuiz('global');
    } else if (pageName === 'market') {
        initializeQuiz('market');
        if (!priceChart) {
            setTimeout(() => initializePriceChart(), 100);
        }
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Close mobile menu if open
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
        navLinks.classList.remove('active');
    }
}

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
    
    // Update chart if it exists
    if (priceChart) {
        const isDarkMode = body.classList.contains('dark-mode');
        const textColor = isDarkMode ? '#e2e8f0' : '#001F3F';
        const gridColor = isDarkMode ? 'rgba(148, 163, 184, 0.15)' : 'rgba(0, 31, 63, 0.1)';
        
        priceChart.options.scales.x.ticks.color = textColor;
        priceChart.options.scales.y.ticks.color = textColor;
        priceChart.options.scales.x.grid.color = gridColor;
        priceChart.options.scales.y.grid.color = gridColor;
        priceChart.options.plugins.tooltip.backgroundColor = isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)';
        priceChart.options.plugins.tooltip.titleColor = textColor;
        priceChart.options.plugins.tooltip.bodyColor = textColor;
        
        priceChart.update();
    }
}

// ========================================
// MOBILE MENU TOGGLE
// ========================================
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

// ========================================
// LIVE CRYPTO PRICE TICKER WITH COUNTDOWN
// ========================================
let cryptoPrices = {};
let lastFetchTime = null;
let nextUpdateTime = null;
const UPDATE_INTERVAL = 60000; // 60 seconds
let updateIntervalId = null;

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
        
        // Store prices
        cryptoPrices = {
            bitcoin: { 
                usd: parseFloat(btcData.price)
            },
            ethereum: { 
                usd: parseFloat(ethData.price)
            }
        };
        
        // Set the fetch time AFTER we get the data (now)
        lastFetchTime = new Date();
        nextUpdateTime = new Date(lastFetchTime.getTime() + UPDATE_INTERVAL);
        
        updatePriceTicker();
        
        // Update chart if visible
        if (priceChart && document.getElementById('page-market').classList.contains('active')) {
            loadChartData();
        }
        
        console.log('Crypto Prices Updated:', {
            bitcoin: cryptoPrices.bitcoin,
            ethereum: cryptoPrices.ethereum,
            timestamp: lastFetchTime.toLocaleTimeString(),
            nextUpdate: nextUpdateTime.toLocaleTimeString()
        });
        
    } catch (error) {
        console.error('Error fetching crypto prices:', error);
        // Fallback to demo data if API fails
        cryptoPrices = {
            bitcoin: { usd: 96500 },
            ethereum: { usd: 3450 }
        };
        lastFetchTime = new Date();
        nextUpdateTime = new Date(lastFetchTime.getTime() + UPDATE_INTERVAL);
        updatePriceTicker();
    }
}

function updatePriceTicker() {
    // Update Bitcoin price
    const btcPriceEl = document.getElementById('btcPrice');
    
    if (btcPriceEl && cryptoPrices.bitcoin) {
        btcPriceEl.textContent = '$' + cryptoPrices.bitcoin.usd.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
    
    // Update Ethereum price
    const ethPriceEl = document.getElementById('ethPrice');
    
    if (ethPriceEl && cryptoPrices.ethereum) {
        ethPriceEl.textContent = '$' + cryptoPrices.ethereum.usd.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
    
    // Update Market Cap (calculated estimate)
    const marketCapEl = document.getElementById('marketCap');
    if (marketCapEl && cryptoPrices.bitcoin && cryptoPrices.ethereum) {
        // Rough estimate: BTC circulating supply ~19.5M, ETH ~120M
        const estimatedMarketCap = (cryptoPrices.bitcoin.usd * 19500000 + cryptoPrices.ethereum.usd * 120000000) / 1000000000000;
        marketCapEl.textContent = '$' + estimatedMarketCap.toFixed(2) + 'T';
    }
}

// Countdown timer with price update time
function updateCountdown() {
    const lastUpdateEl = document.getElementById('lastUpdate');
    
    if (!lastUpdateEl || !lastFetchTime || !nextUpdateTime) {
        if (lastUpdateEl) {
            lastUpdateEl.textContent = 'Loading prices...';
        }
        return;
    }
    
    const now = new Date();
    const secondsUntilUpdate = Math.max(0, Math.floor((nextUpdateTime - now) / 1000));
    
    // Format the last update time
    const timeString = lastFetchTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        second: '2-digit',
        hour12: true 
    });
    
    // Display with countdown
    if (secondsUntilUpdate > 0) {
        lastUpdateEl.textContent = `Prices from ${timeString} • Next update: ${secondsUntilUpdate}s`;
    } else {
        lastUpdateEl.textContent = `Prices from ${timeString} • Updating...`;
    }
}

// Initialize the price fetching system
function initializePriceFetching() {
    // Clear any existing interval
    if (updateIntervalId) {
        clearInterval(updateIntervalId);
    }
    
    // Fetch prices immediately
    fetchCryptoPrices();
    
    // Set up interval to fetch prices every 60 seconds
    updateIntervalId = setInterval(fetchCryptoPrices, UPDATE_INTERVAL);
}

// Update the countdown every second
setInterval(updateCountdown, 1000);

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
    
    // Award XP for using calculator
    if (!gameState.calculatorUsed) {
        gameState.calculatorUsed = true;
        addXP(20, 'Used ROI Calculator');
        unlockBadge('calculator_pro');
        saveGameState();
    }
}

// ========================================
// TOOLTIP TRACKING
// ========================================
function trackTooltipHover() {
    gameState.tooltipsDiscovered++;
    saveGameState();
    
    if (gameState.tooltipsDiscovered >= 5) {
        unlockBadge('tooltip_hunter');
    }
}

// ========================================
// SESSION TIME TRACKING
// ========================================
function checkSessionTime() {
    const sessionDuration = Date.now() - gameState.sessionStartTime;
    const minutes = sessionDuration / 1000 / 60;
    
    if (minutes >= 30 && !gameState.badges.includes('dedicated_learner')) {
        unlockBadge('dedicated_learner');
    }
}

// Check session time every minute
setInterval(checkSessionTime, 60000);

// ========================================
// ANIMATE ELEMENTS ON SCROLL
// ========================================
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.card, .timeline-item, .content-paragraph');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

document.querySelectorAll('.card, .timeline-item, .content-paragraph').forEach(element => {
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
        closeBadgeModal();
    }
    
    if (e.key === 'Enter' && (
        document.activeElement.id === 'investment' ||
        document.activeElement.id === 'years' ||
        document.activeElement.id === 'investmentType'
    )) {
        calculateROI();
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
// TOOLTIP ACCESSIBILITY & TRACKING
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.tooltip').forEach(tooltip => {
        tooltip.setAttribute('tabindex', '0');
        
        const handleTooltipInteraction = () => {
            trackTooltipHover();
        };
        
        tooltip.addEventListener('mouseenter', handleTooltipInteraction);
        tooltip.addEventListener('focus', function() {
            const tooltipText = this.querySelector('.tooltiptext');
            if (tooltipText) {
                tooltipText.style.visibility = 'visible';
                tooltipText.style.opacity = '1';
            }
            handleTooltipInteraction();
        });
        tooltip.addEventListener('blur', function() {
            const tooltipText = this.querySelector('.tooltiptext');
            if (tooltipText) {
                tooltipText.style.visibility = 'hidden';
                tooltipText.style.opacity = '0';
            }
        });
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
// CLOSE MODAL ON OUTSIDE CLICK
// ========================================
window.onclick = function(event) {
    const modal = document.getElementById('badgeModal');
    if (event.target == modal) {
        closeBadgeModal();
    }
}

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
    
    // Load theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.className = savedTheme + '-mode';
    
    // Load game state
    loadGameState();
    
    // Initialize price fetching system
    initializePriceFetching();
    
    // Start the countdown timer
    updateCountdown();
    
    // Show home page by default
    showPage('home');
    
    console.log('🚀 CryptoShifts - Loaded Successfully with Gamification!');
    console.log('%c🔗 CryptoShifts', 'font-size: 24px; font-weight: bold; color: #6366f1;');
    console.log('%cUnderstanding the Future of Money', 'font-size: 14px; color: #8b5cf6;');
    console.log('%cCreated by: Mili, Haleigh, Boris, and Amina', 'font-size: 12px; color: #64748b;');
    console.log('%cRochester Institute of Technology - 2025', 'font-size: 12px; color: #64748b;');
    console.log('%c🎮 Gamification Active: Earn XP and unlock badges!', 'font-size: 14px; color: #10b981; font-weight: bold;');
});

// ========================================
// PERFORMANCE MONITORING
// ========================================
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`Page loaded in ${(loadTime / 1000).toFixed(2)} seconds`);
});