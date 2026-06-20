// ==========================================
// 1. ROUTE PROTECTION (Run immediately)
// ==========================================
const currentUser = JSON.parse(localStorage.getItem('daviesUser'));
const currentPath = window.location.pathname;

if (currentPath.includes('admin.html') || currentPath.includes('customer.html')) {
    if (!currentUser) {
        window.location.href = 'login.html';
    } else if (currentPath.includes('admin.html') && currentUser.role !== 'admin') {
        alert('Access Denied: Administrator privileges required.');
        window.location.href = 'customer.html';
    }
}

// ==========================================
// 2. VALIDATION HELPERS
// ==========================================
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showValidation(inputId, msgId, isValid, message) {
    const input = document.getElementById(inputId);
    const msg = document.getElementById(msgId);
    
    if (isValid) {
        input.classList.remove('error');
        input.classList.add('success');
        msg.className = 'validation-msg success';
        msg.textContent = message || 'Looks good!';
    } else {
        input.classList.remove('success');
        input.classList.add('error');
        msg.className = 'validation-msg error';
        msg.textContent = message;
    }
}

// ==========================================
// 3. SIGNUP LOGIC
// ==========================================
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    const nameInput = document.getElementById('signupName');
    const emailInput = document.getElementById('signupEmail');
    const passInput = document.getElementById('signupPassword');
    const formError = document.getElementById('formError');
    const submitBtn = document.getElementById('signupBtn');

    // Real-time validation
    nameInput.addEventListener('input', () => {
        const isValid = nameInput.value.trim().length >= 2;
        showValidation('signupName', 'nameMsg', isValid, isValid ? '' : 'Name must be at least 2 characters.');
    });

    emailInput.addEventListener('input', () => {
        const isValid = validateEmail(emailInput.value);
        showValidation('signupEmail', 'emailMsg', isValid, isValid ? '' : 'Please enter a valid email address.');
    });

    passInput.addEventListener('input', () => {
        const isValid = passInput.value.length >= 6;
        showValidation('signupPassword', 'passwordMsg', isValid, isValid ? '' : 'Password must be at least 6 characters.');
    });

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        formError.textContent = '';

        // Final validation check before sending
        if (nameInput.value.trim().length < 2 || !validateEmail(emailInput.value) || passInput.value.length < 6) {
            formError.textContent = 'Please fix the errors above before submitting.';
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating Account...';

        const payload = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passInput.value,
            role: document.getElementById('signupRole').value
        };

        try {
            const response = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                alert('Account created successfully! Please log in.');
                window.location.href = 'login.html';
            } else {
                formError.textContent = data.error || 'Signup failed. Please try again.';
            }
        } catch (error) {
            formError.textContent = 'Cannot connect to server. Ensure the backend is running.';
            console.error('Signup error:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Create Account';
        }
    });
}

// ==========================================
// 4. LOGIN LOGIC
// ==========================================
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    const loginEmail = document.getElementById('loginEmail');
    const loginPass = document.getElementById('loginPassword');
    const loginFormError = document.getElementById('loginFormError');
    const loginBtn = document.getElementById('loginBtn');

    loginEmail.addEventListener('input', () => {
        showValidation('loginEmail', 'loginEmailMsg', validateEmail(loginEmail.value), '');
    });

    loginPass.addEventListener('input', () => {
        showValidation('loginPassword', 'loginPasswordMsg', loginPass.value.length >= 6, '');
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loginFormError.textContent = '';

        if (!validateEmail(loginEmail.value) || loginPass.value.length < 6) {
            loginFormError.textContent = 'Please enter a valid email and password.';
            return;
        }

        loginBtn.disabled = true;
        loginBtn.textContent = 'Logging in...';

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginEmail.value.trim(), password: loginPass.value })
            });

            const data = await response.json();

            if (response.ok) {
                // Save session securely in localStorage
                localStorage.setItem('daviesUser', JSON.stringify(data.user));
                
                // Redirect based on role
                if (data.user.role === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'customer.html';
                }
            } else {
                loginFormError.textContent = data.error || 'Invalid credentials.';
            }
        } catch (error) {
            loginFormError.textContent = 'Cannot connect to server. Ensure the backend is running.';
            console.error('Login error:', error);
        } finally {
            loginBtn.disabled = false;
            loginBtn.textContent = 'Log In';
        }
    });
}

// ==========================================
// 5. LOGOUT LOGIC (Used in Dashboards)
// ==========================================
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('daviesUser');
        window.location.href = 'index.html';
    });
}