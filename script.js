// Utility Functions
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification show ${type}`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

function switchForm(formType) {
    const loginForm = document.getElementById('login');
    const signupForm = document.getElementById('signup');
    
    if (formType === 'login') {
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
    } else {
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
    }
}

function scrollToAuth(formType) {
    const authSection = document.getElementById('auth');
    authSection.scrollIntoView({ behavior: 'smooth' });
    
    setTimeout(() => {
        switchForm(formType);
    }, 300);
}

// Form Validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 8;
}

function validateUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    return usernameRegex.test(username);
}

// Password Strength Indicator
document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('signup-password');
    const strengthBar = document.getElementById('strength-bar');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', (e) => {
            const password = e.target.value;
            let strength = 0;
            const bar = document.getElementById('strength-bar');
            
            if (password.length >= 8) strength += 25;
            if (password.length >= 12) strength += 25;
            if (/[A-Z]/.test(password)) strength += 25;
            if (/[0-9]/.test(password)) strength += 12;
            if (/[^a-zA-Z0-9]/.test(password)) strength += 13;
            
            bar.style.width = strength + '%';
            
            if (strength <= 25) {
                bar.style.background = '#ef4444';
            } else if (strength <= 50) {
                bar.style.background = '#f59e0b';
            } else if (strength <= 75) {
                bar.style.background = '#3b82f6';
            } else {
                bar.style.background = '#10b981';
            }
        });
    }
});

// Sample Games Data
const GAMES_DATA = [
    {
        id: 1,
        name: 'Projeto - Guilherme',
        description: 'Um jogo Parkour',
        icon: '🎮',
        plays: 1,
        likes: 38,
        author: 'Guilherme',
        url: 'https://merry-treacle-727dc3.netlify.app/'
    },
    {
        id: 2,
        name: 'Projeto - Diego',
        description: 'Um jogo de Cartas',
        icon: '🍪',
        plays: 0,
        likes: 18,
        author: 'Diego',
        url: 'https://chimerical-shortbread-6ee684.netlify.app/'
    },
    {
        id: 3,
        name: 'Projeto - Eduardo',
        description: 'Um jogo de Parkour',
        icon: '🚀',
        plays: 1,
        likes: 1,
        author: 'Eduardo',
        url: 'https://rococo-frangollo-06f594.netlify.app/'
    },
    {
        id: 4,
        name: 'Projeto - Giovanna',
        description: 'Um jogo de ação',
        icon: '🎯',
        plays: 0,
        likes: 38,
        author: 'Desenvolvedor',
        url: 'https://stalwart-begonia-cb3516.netlify.app/'
    },
    {
        id: 5,
        name: 'Projeto - Yohan',
        description: 'Um jogo puzzle',
        icon: '👾',
        plays: 0,
        likes: 38,
        author: 'Criador',
        url: 'https://coruscating-biscuit-1ff3af.netlify.app/'
    },
    {
        id: 6,
        name: 'Projeto - Luiz',
        description: 'Um jogo de estratégia',
        icon: '🏆',
        plays: 1,
        likes: 44,
        author: 'Master',
        url: null
    }
];

// Show Dashboard
function showDashboard(user) {
    // Hide hero and auth sections
    document.getElementById('home').classList.add('hidden');
    document.getElementById('auth').classList.add('hidden');
    document.getElementById('features').classList.add('hidden');
    document.getElementById('footer').classList.add('hidden');
    
    // Show dashboard
    document.getElementById('dashboard').classList.remove('hidden');
    
    // Update user info
    const firstName = user.firstName || user.email.split('@')[0];
    document.getElementById('user-name').textContent = `Bem-vindo, ${firstName}!`;
    document.getElementById('user-email').textContent = user.email;
    
    // Load games
    loadGames();
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Load and render games
function loadGames() {
    const gamesGrid = document.getElementById('games-grid');
    gamesGrid.innerHTML = '';
    
    GAMES_DATA.forEach(game => {
        const gameCard = createGameCard(game);
        gamesGrid.appendChild(gameCard);
    });
}

// Create game card element
function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const isFavorited = favorites.includes(game.id);
    
    card.innerHTML = `
        <div class="game-icon">${game.icon}</div>
        <div class="game-name">${game.name}</div>
        <div class="game-description">${game.description}</div>
        <div class="game-stats">
            <div class="stat">
                <span class="stat-icon">🎮</span>
                <span>${game.plays} acessos</span>
            </div>
            <div class="stat">
                <span class="stat-icon">❤️</span>
                <span>${game.likes} likes</span>
            </div>
        </div>
        <div class="game-actions">
            <button class="btn-play" onclick="playGame(${game.id})">JOGAR AGORA</button>
            <button class="btn-favorite ${isFavorited ? 'favorited' : ''}" onclick="toggleFavorite(this, ${game.id})">❤️</button>
        </div>
    `;
    
    return card;
}

// Play game
function playGame(gameId) {
    const game = GAMES_DATA.find(g => g.id === gameId);
    
    // If game has a URL, redirect to it
    if (game.url) {
        showNotification(`Abrindo ${game.name}...`, 'success');
        setTimeout(() => {
            window.open(game.url, '_blank');
        }, 300);
    } else {
        // Otherwise show modal
        showNotification(`Iniciando ${game.name}...`, 'success');
        setTimeout(() => {
            showGameModal(game);
        }, 500);
    }
}

// Show game modal with details
function showGameModal(game) {
    const modal = document.getElementById('game-modal');
    const modalContent = document.getElementById('game-modal-content');
    
    modalContent.innerHTML = `
        <div style="text-align: center;">
            <div class="game-icon" style="font-size: 6rem; margin-bottom: 1rem;">${game.icon}</div>
            <div class="game-modal-title">${game.name}</div>
            <div class="game-modal-description">
                <p><strong>Descrição:</strong> ${game.description}</p>
                <p style="margin-top: 1rem;"><strong>Autor:</strong> ${game.author}</p>
                <p><strong>Plays:</strong> ${game.plays}</p>
                <p><strong>Likes:</strong> ${game.likes}</p>
            </div>
            <button class="btn btn-primary btn-block" onclick="closeGameModal(); showNotification('Jogo iniciado! (simulado)', 'success')">
                INICIAR JOGO
            </button>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

// Close game modal
function closeGameModal() {
    const modal = document.getElementById('game-modal');
    modal.classList.add('hidden');
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('game-modal');
    if (modal && e.target === modal) {
        closeGameModal();
    }
});

// Toggle favorite
function toggleFavorite(button, gameId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    if (favorites.includes(gameId)) {
        favorites = favorites.filter(id => id !== gameId);
        button.classList.remove('favorited');
        showNotification('Removido dos favoritos', 'success');
    } else {
        favorites.push(gameId);
        button.classList.add('favorited');
        showNotification('Adicionado aos favoritos', 'success');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Logout
function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('favorites');
    
    // Hide dashboard
    document.getElementById('dashboard').classList.add('hidden');
    
    // Show home sections
    document.getElementById('home').classList.remove('hidden');
    document.getElementById('auth').classList.remove('hidden');
    document.getElementById('features').classList.remove('hidden');
    document.getElementById('footer').classList.remove('hidden');
    
    // Reset auth forms
    switchForm('login');
    
    // Clear forms
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('signup-firstname').value = '';
    document.getElementById('signup-lastname').value = '';
    document.getElementById('signup-email').value = '';
    document.getElementById('signup-username').value = '';
    document.getElementById('signup-password').value = '';
    document.getElementById('signup-confirm').value = '';
    
    showNotification('Você foi desconectado com sucesso', 'success');
    window.scrollTo(0, 0);
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    // Validation
    if (!email || !password) {
        showNotification('Por favor, preencha todos os campos', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showNotification('Email inválido', 'error');
        return;
    }
    
    if (!validatePassword(password)) {
        showNotification('Senha deve ter pelo menos 8 caracteres', 'error');
        return;
    }
    
    // Check if user exists
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email);
    
    if (!user) {
        showNotification('Email ou senha incorretos', 'error');
        return;
    }
    
    // Simulate password check (in real app, would check hashed password)
    const userData = {
        email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        loginTime: new Date().toLocaleString('pt-BR'),
        remember: document.getElementById('remember').checked
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    showNotification(`Bem-vindo de volta, ${user.firstName}!`, 'success');
    
    // Reset form
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('remember').checked = false;
    
    // Redirect to dashboard
    setTimeout(() => {
        showDashboard(userData);
    }, 500);
}

// Handle Signup
function handleSignup(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('signup-firstname').value.trim();
    const lastName = document.getElementById('signup-lastname').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const username = document.getElementById('signup-username').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    const termsAccepted = document.getElementById('terms').checked;
    
    // Validation
    if (!firstName || !lastName || !email || !username || !password || !confirm) {
        showNotification('Por favor, preencha todos os campos', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showNotification('Email inválido', 'error');
        return;
    }
    
    if (!validateUsername(username)) {
        showNotification('Nome de usuário deve ter 3-20 caracteres (letras, números, - e _)', 'error');
        return;
    }
    
    if (!validatePassword(password)) {
        showNotification('Senha deve ter pelo menos 8 caracteres', 'error');
        return;
    }
    
    if (password !== confirm) {
        showNotification('As senhas não correspondem', 'error');
        return;
    }
    
    if (!termsAccepted) {
        showNotification('Você deve concordar com os Termos de Serviço', 'error');
        return;
    }
    
    // Simulate signup (in a real app, this would call an API)
    const newUser = {
        firstName,
        lastName,
        email,
        username,
        createdAt: new Date().toLocaleString('pt-BR'),
        verified: false
    };
    
    // Store user data (in a real app, this would be on a server)
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if email already exists
    if (users.some(user => user.email === email)) {
        showNotification('Este email já está cadastrado', 'error');
        return;
    }
    
    // Check if username already exists
    if (users.some(user => user.username === username)) {
        showNotification('Este nome de usuário já está em uso', 'error');
        return;
    }
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('user', JSON.stringify(newUser));
    
    showNotification(`Conta criada com sucesso, ${firstName}!`, 'success');
    
    // Reset form
    document.getElementById('signup-firstname').value = '';
    document.getElementById('signup-lastname').value = '';
    document.getElementById('signup-email').value = '';
    document.getElementById('signup-username').value = '';
    document.getElementById('signup-password').value = '';
    document.getElementById('signup-confirm').value = '';
    document.getElementById('terms').checked = false;
    document.getElementById('strength-bar').style.width = '0';
    
    // Redirect to dashboard after signup
    setTimeout(() => {
        showDashboard(newUser);
    }, 500);
}

// Handle Social Login
function loginWithProvider(provider) {
    showNotification(`Login com ${provider.toUpperCase()} em desenvolvimento...`, 'success');
    console.log(`Attempting login with ${provider}`);
    
    // In a real app, this would implement OAuth flow
    setTimeout(() => {
        alert(`Redirecionando para ${provider.toUpperCase()} OAuth...`);
    }, 1000);
}

// Handle Social Signup
function signupWithProvider(provider) {
    showNotification(`Cadastro com ${provider.toUpperCase()} em desenvolvimento...`, 'success');
    console.log(`Attempting signup with ${provider}`);
    
    // In a real app, this would implement OAuth flow
    setTimeout(() => {
        alert(`Redirecionando para ${provider.toUpperCase()} OAuth...`);
    }, 1000);
}

// Check if user is already logged in
window.addEventListener('load', () => {
    const user = localStorage.getItem('user');
    if (user) {
        const userData = JSON.parse(user);
        console.log('User already logged in:', userData);
        
        // Automatically redirect to dashboard
        setTimeout(() => {
            showDashboard(userData);
        }, 100);
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const element = document.querySelector(href);
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press 'L' to switch to login
    if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault();
        scrollToAuth('login');
    }
    
    // Press 'S' to switch to signup
    if (e.key === 's' && e.ctrlKey) {
        e.preventDefault();
        scrollToAuth('signup');
    }
});

// Prevent form submission on Enter for better UX in signup password field
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.querySelector('.signup-form .form');
    if (signupForm) {
        signupForm.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
                // Allow natural form submission, but prevent if not on last field
                if (e.target.id !== 'signup-confirm') {
                    e.preventDefault();
                    const nextInput = e.target.nextElementSibling?.querySelector('input') || 
                                    e.target.parentElement.nextElementSibling?.querySelector('input');
                    if (nextInput) {
                        nextInput.focus();
                    }
                }
            }
        });
    }
});

// Real-time email validation feedback
document.addEventListener('DOMContentLoaded', () => {
    const emailInputs = document.querySelectorAll('input[type="email"]');
    
    emailInputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value && !validateEmail(input.value)) {
                input.style.borderColor = '#ef4444';
            } else {
                input.style.borderColor = '';
            }
        });
        
        input.addEventListener('input', () => {
            if (input.value && validateEmail(input.value)) {
                input.style.borderColor = '#10b981';
            } else if (input.value) {
                input.style.borderColor = '#ef4444';
            } else {
                input.style.borderColor = '';
            }
        });
    });
});

// Password confirmation validation
document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('signup-password');
    const confirmInput = document.getElementById('signup-confirm');
    
    if (confirmInput && passwordInput) {
        confirmInput.addEventListener('input', () => {
            if (confirmInput.value) {
                if (passwordInput.value === confirmInput.value) {
                    confirmInput.style.borderColor = '#10b981';
                } else {
                    confirmInput.style.borderColor = '#ef4444';
                }
            } else {
                confirmInput.style.borderColor = '';
            }
        });
    }
});

// Prevent multiple form submissions
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('.form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitButton = this.querySelector('button[type="submit"]');
            if (submitButton.disabled) {
                e.preventDefault();
                return;
            }
            
            submitButton.disabled = true;
            submitButton.textContent = 'Processando...';
            
            // Re-enable button after 2 seconds
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.textContent = submitButton.getAttribute('data-original-text') || 'Entrar';
            }, 2000);
        });
    });
});

// Update button text storage
document.addEventListener('DOMContentLoaded', () => {
    const submitButtons = document.querySelectorAll('button[type="submit"]');
    submitButtons.forEach(button => {
        button.setAttribute('data-original-text', button.textContent);
    });
});

console.log('ClipHub - Sistema de Login e Cadastro Carregado com Sucesso!');
