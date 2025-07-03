
function startCountdown(display) {
    const targetDate = new Date(2025, 6, 25, 17, 40, 30); // Month is 0-indexed (July is 6)

    const interval = setInterval(function () {
        const now = new Date();
        const remaining = (targetDate.getTime() - now.getTime()) / 1000;

        if (remaining <= 0) {
            clearInterval(interval);
            display.days.textContent = "00";
            display.hours.textContent = "00";
            display.minutes.textContent = "00";
            display.seconds.textContent = "00";
            console.log("Countdown finished!");
            return;
        }

        const days = Math.floor(remaining / (60 * 60 * 24));
        const hours = Math.floor((remaining % (60 * 60 * 24)) / (60 * 60));
        const minutes = Math.floor((remaining % (60 * 60)) / 60);
        const seconds = Math.floor(remaining % 60);

        display.days.textContent = days < 10 ? "0" + days : days;
        display.hours.textContent = hours < 10 ? "0" + hours : hours;
        display.minutes.textContent = minutes < 10 ? "0" + minutes : minutes;
        display.seconds.textContent = seconds < 10 ? "0" + seconds : seconds;
    }, 1000);
}


// --- Main DOMContentLoaded Listener for all page-specific logic ---
// All JavaScript code that interacts with the DOM should be inside this single listener
document.addEventListener('DOMContentLoaded', () => {

    // --- JAVASCRIPT FOR HERO SLIDER DOTS ---
    const heroDots = document.querySelectorAll('.slider-dots .dot');
    if (heroDots) {
        heroDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                heroDots.forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                console.log(`Hero Slider Dot ${index + 1} clicked`);
            });
        });
    }

    // --- JAVASCRIPT FOR MAIN NAV ACTIVE STATE ---
    const mainNavLinks = document.querySelectorAll('.main-nav a, .offcanvas-nav-list a');
    if (mainNavLinks) {
        mainNavLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // e.preventDefault();
                document.querySelectorAll('.main-nav a').forEach(l => l.classList.remove('active'));
                document.querySelectorAll('.offcanvas-nav-list a').forEach(l => l.classList.remove('active'));
                
                this.classList.add('active');

                if (this.closest('.offcanvas-menu')) {
                    document.getElementById('offcanvas-menu').classList.remove('open');
                    document.getElementById('offcanvas-overlay').classList.remove('open');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    // --- JAVASCRIPT FOR CATEGORY ITEMS ACTIVE STATE ---
    const categoryItems = document.querySelectorAll('.category-list-horizontal .category-item, .category-list-offcanvas .category-item');
    if (categoryItems) {
        categoryItems.forEach(item => {
            item.addEventListener('click', function() {
                this.classList.toggle('active');
            });
        });
    }

    // --- JAVASCRIPT FOR MOBILE HAMBURGER MENU ---
    const hamburgerToggle = document.getElementById('hamburger-menu-toggle');
    const offcanvasMenu = document.getElementById('offcanvas-menu');
    const offcanvasCloseBtn = document.getElementById('offcanvas-close-btn');
    const offcanvasOverlay = document.getElementById('offcanvas-overlay');

    if (hamburgerToggle && offcanvasMenu && offcanvasCloseBtn && offcanvasOverlay) {
        hamburgerToggle.addEventListener('click', () => {
            offcanvasMenu.classList.add('open');
            offcanvasOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        });

        offcanvasCloseBtn.addEventListener('click', () => {
            offcanvasMenu.classList.remove('open');
            offcanvasOverlay.classList.remove('open');
            document.body.style.overflow = '';
        });

        offcanvasOverlay.addEventListener('click', () => {
            offcanvasMenu.classList.remove('open');
            offcanvasOverlay.classList.remove('open');
            document.body.style.overflow = '';
        });
    }


    // --- User Account & Dropdown Logic (for index.html) ---
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        const desktopHeaderAccount = document.getElementById('desktop-header-account');
        const mobileHeaderAccount = document.getElementById('mobile-header-account');

        const loggedInUser = sessionStorage.getItem('loggedInUser');
        const isAdmin = sessionStorage.getItem('isAdmin') === 'true';

        // Function to process a single header account div (desktop or mobile)
        const processAccountDiv = (accountDivId) => {
            const accountDiv = document.getElementById(accountDivId);
            if (!accountDiv) return;

            const userDisplayNameSpan = accountDiv.querySelector('.user-display-name');
            const userIcon = accountDiv.querySelector('.user-icon');
            const userDropdownMenu = accountDiv.querySelector('.user-dropdown-menu');
            const loginRedirectLink = accountDiv.querySelector('[id$="-login-redirect-link"]');

            // --- IMPORTANT: Cleanly remove all existing listeners from the current element first ---
            // This is safer than cloning if the element is already in the DOM.
            // Remove previous redirect listener if it was set
            const oldClickListener = accountDiv._headerAccountClickListener;
            if (oldClickListener) {
                accountDiv.removeEventListener('click', oldClickListener);
                accountDiv._headerAccountClickListener = null; // Clear reference
            }

            if (loggedInUser) {
                // User is logged in: display username, enable dropdown toggle
                userDisplayNameSpan.textContent = loggedInUser;
                userDisplayNameSpan.style.display = 'inline-block';
                userDisplayNameSpan.style.cursor = 'pointer'; 
                userIcon.style.cursor = 'pointer';

                // Hide the direct login link if user is logged in
                if (loginRedirectLink) {
                    loginRedirectLink.style.display = 'none';
                }
                
                // Attach the dropdown toggle listener
                accountDiv._headerAccountClickListener = (e) => {
                    // Only toggle dropdown if clicking the icon, span, or parent div itself, but NOT inside the dropdown menu items
                    if (userDropdownMenu && !userDropdownMenu.contains(e.target) && (e.target === userIcon || e.target === userDisplayNameSpan || e.target === accountDiv)) {
                        e.preventDefault(); // Prevent default link behavior if it was on a link
                        accountDiv.classList.toggle('open');
                    }
                };
                accountDiv.addEventListener('click', accountDiv._headerAccountClickListener);

                // Update settings and logout links within the dropdown
                const settingsLink = userDropdownMenu ? userDropdownMenu.querySelector('[id$="-settings-link"]') : null;
                const logoutLink = userDropdownMenu ? userDropdownMenu.querySelector('[id$="-logout-link"]') : null;
                const shoppingCartLink = userDropdownMenu ? userDropdownMenu.querySelector('[id$="-shopping-cart-link"]') : null;


                if (settingsLink) {
                    settingsLink.style.display = 'flex'; // Show setting link
                    if (settingsLink.querySelector('span')) settingsLink.querySelector('span').textContent = 'تنظیمات'; // Ensure span text is set
                    if (settingsLink.querySelector('i')) settingsLink.querySelector('i').style.display = 'inline-block'; // Ensure icon shows
                    if (isAdmin) {
                        settingsLink.href = 'admin_settings.html';
                    } else {
                        settingsLink.href = '#user-settings-page'; // Placeholder for user settings
                    }
                }
                if (logoutLink) {
                    logoutLink.style.display = 'flex'; // Show logout link
                    if (logoutLink.querySelector('i')) logoutLink.querySelector('i').style.display = 'inline-block'; // Ensure icon shows
                    logoutLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        sessionStorage.removeItem('loggedInUser');
                        sessionStorage.removeItem('isAdmin');
                        window.location.href = 'index.html'; // Go back home
                    });
                }
                if (shoppingCartLink) {
                    shoppingCartLink.style.display = 'flex'; // Show cart link
                    if (shoppingCartLink.querySelector('i')) shoppingCartLink.querySelector('i').style.display = 'inline-block'; // Ensure icon shows
                    shoppingCartLink.href = '#shopping-cart-page'; // Placeholder
                }

                if (userDropdownMenu) userDropdownMenu.style.display = 'block';

            } else {
                // User is NOT logged in: Show "ثبت نام" link, and clicking icon/text redirects to login.html
                userDisplayNameSpan.textContent = 'ثبت نام'; // Set text to "ثبت نام"
                userDisplayNameSpan.style.display = 'inline-block'; // Show the span
                userDisplayNameSpan.style.cursor = 'pointer'; 
                userIcon.style.cursor = 'pointer'; 

                if (loginRedirectLink) {
                    loginRedirectLink.textContent = 'ثبت نام';
                    loginRedirectLink.style.display = 'inline-block'; // Show the "ثبت نام" link
                    loginRedirectLink.href = 'login.html'; // Ensure correct href
                }
                
                // Add click listener to the icon and the text span to redirect to login
                accountDiv._headerAccountClickListener = (e) => {
                    // Redirect only if clicking the user icon, the display name span, or the login redirect link itself
                    if (e.target === userIcon || e.target === userDisplayNameSpan || e.target === loginRedirectLink) {
                        window.location.href = 'login.html';
                    }
                };
                accountDiv.addEventListener('click', accountDiv._headerAccountClickListener);

                // Hide dropdown menu and its items
                accountDiv.classList.remove('open');
                if (userDropdownMenu) userDropdownMenu.style.display = 'none';
                if (userDropdownMenu) userDropdownMenu.querySelectorAll('li a').forEach(link => {
                    link.style.display = 'none';
                    if (link.querySelector('i')) link.querySelector('i').style.display = 'none';
                });
            }
        };

        // Call processAccountDiv for both desktop and mobile account divs
        processAccountDiv('desktop-header-account');
        processAccountDiv('mobile-header-account');


        // Close user dropdowns when clicking anywhere outside (global listener)
        document.addEventListener('click', (e) => {
            // Get current references to the account divs from the DOM, as they might have been re-processed
            const currentDesktopHeaderAccount = document.getElementById('desktop-header-account');
            const currentMobileHeaderAccount = document.getElementById('mobile-header-account');

            if (currentDesktopHeaderAccount && !currentDesktopHeaderAccount.contains(e.target)) {
                currentDesktopHeaderAccount.classList.remove('open');
            }
            if (currentMobileHeaderAccount && !currentMobileHeaderAccount.contains(e.target)) {
                currentMobileHeaderAccount.classList.remove('open');
            }
        });
    }

    // Login.html specific script logic
    if (window.location.pathname.endsWith('login.html')) {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const toggleToRegisterLink = document.getElementById('toggle-to-register');
        const authTitle = document.getElementById('auth-title');
        const toggleText = document.getElementById('toggle-text');
        const messageArea = document.getElementById('message-area');

        // Function to show messages
        function showMessage(message, type) {
            if (messageArea) {
                messageArea.textContent = message;
                messageArea.className = `message ${type}`;
                messageArea.style.display = 'block';
                setTimeout(() => {
                    messageArea.style.display = 'none';
                }, 3000);
            }
        }

        // Handlers for toggling forms (defined outside to avoid re-creation issues)
        const handleToggleRegister = (e) => {
            e.preventDefault();
            if (loginForm) {
                loginForm.classList.remove('visible');
                loginForm.classList.add('hidden');
            }
            if (registerForm) {
                registerForm.classList.remove('hidden');
                registerForm.classList.add('visible');
            }
            if (authTitle) authTitle.textContent = 'ثبت نام';
            if (toggleText) toggleText.innerHTML = 'حساب کاربری دارید؟ <a href="#" id="toggle-to-login">ورود کنید</a>';
            if (messageArea) messageArea.style.display = 'none';
            setupAuthToggleListeners(); // Re-attach listeners after content change
        };

        const handleToggleLogin = (e) => {
            e.preventDefault();
            if (registerForm) {
                registerForm.classList.remove('visible');
                registerForm.classList.add('hidden');
            }
            if (loginForm) {
                loginForm.classList.remove('hidden');
                loginForm.classList.add('visible');
            }
            if (authTitle) authTitle.textContent = 'ورود به حساب کاربری';
            if (toggleText) toggleText.innerHTML = 'حساب کاربری ندارید؟ <a href="#" id="toggle-to-register">ثبت نام کنید</a>';
            if (messageArea) messageArea.style.display = 'none';
            setupAuthToggleListeners(); // Re-attach listeners after content change
        };

        // Setup toggle listeners (called once on DOMContentLoaded)
        const setupAuthToggleListeners = () => {
            const currentToggleToRegister = document.getElementById('toggle-to-register');
            const currentToggleToLogin = document.getElementById('toggle-to-login');

            // Ensure listeners are added only once by removing before adding, or checking if already attached
            if (currentToggleToRegister) {
                currentToggleToRegister.removeEventListener('click', handleToggleRegister); // Defensive removal
                currentToggleToRegister.addEventListener('click', handleToggleRegister);
            }
            if (currentToggleToLogin) {
                currentToggleToLogin.removeEventListener('click', handleToggleLogin); // Defensive removal
                currentToggleToLogin.addEventListener('click', handleToggleLogin);
            }
        };

        // Initial form setup (moved to a function)
        const initializeAuthForms = () => {
            if (loginForm) loginForm.classList.add('visible');
            if (registerForm) registerForm.classList.add('hidden');
            if (authTitle) authTitle.textContent = 'ورود به حساب کاربری';
            if (toggleText) toggleText.innerHTML = 'حساب کاربری ندارید؟ <a href="#" id="toggle-to-register">ثبت نام کنید</a>';
            setupAuthToggleListeners(); // Call setup after setting initial HTML to attach listeners
        };
        initializeAuthForms(); // Initial call


        // Handle Login Form Submission
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = loginForm.elements['login-username'].value;
                const password = loginForm.elements['login-password'].value;

                if (username === 'admin1' && password === '123456') {
                    showMessage('ورود مدیر موفقیت‌آمیز بود. در حال انتقال به پنل مدیریت...', 'success');
                    sessionStorage.setItem('loggedInUser', username);
                    sessionStorage.setItem('isAdmin', 'true');
                    setTimeout(() => {
                        window.location.href = 'admin_settings.html';
                    }, 1500);
                } else {
                    showMessage('ورود موفقیت‌آمیز بود! (این یک دمو است و اطلاعات ذخیره نمی‌شود)', 'success');
                    sessionStorage.setItem('loggedInUser', username);
                    sessionStorage.setItem('isAdmin', 'false');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                }
            });
        }

        // Handle Register Form Submission
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = registerForm.elements['register-username'].value;
                const email = registerForm.elements['register-email'].value;
                const password = registerForm.elements['register-password'].value;
                const confirmPassword = registerForm.elements['register-confirm-password'].value;

                if (password !== confirmPassword) {
                    showMessage('رمز عبور و تکرار آن مطابقت ندارند!', 'error');
                    return;
                }

                showMessage(`ثبت نام با نام کاربری ${username} موفقیت‌آمیز بود! (این یک دمو است و اطلاعات ذخیره نمی‌شود)`, 'success');
                setTimeout(() => {
                    if (loginForm) {
                        loginForm.classList.remove('hidden');
                        loginForm.classList.add('visible');
                    }
                    if (registerForm) {
                        registerForm.classList.remove('visible');
                        registerForm.classList.add('hidden');
                    }
                    if (authTitle) authTitle.textContent = 'ورود به حساب کاربری';
                    if (toggleText) toggleText.innerHTML = 'حساب کاربری ندارید؟ <a href="#" id="toggle-to-register">ثبت نام کنید</a>';
                    setupAuthToggleListeners(); // Re-attach listeners after UI change
                }, 2000);
            });
        }
    }
});


// Call updateHeaderAccountUI and countdown when the main page loads (for index.html)
document.addEventListener('DOMContentLoaded', () => {
    // This will run only on index.html
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        updateHeaderAccountUI();
        // Also ensure countdown starts after DOM is ready
        const daysDisplay = document.getElementById('days');
        const hoursDisplay = document.getElementById('hours');
        const minutesDisplay = document.getElementById('minutes');
        const secondsDisplay = document.getElementById('seconds');
        if (daysDisplay && hoursDisplay && minutesDisplay && secondsDisplay) {
            startCountdown({
                days: daysDisplay,
                hours: hoursDisplay,
                minutes: minutesDisplay,
                seconds: secondsDisplay
            });
        }
    }
});

// Sliders and FAQ Accordion (global listeners, should run on all pages if elements exist)
document.addEventListener('DOMContentLoaded', () => {
    // Simple slider for Amazing Offers (visual only for now)
    const amazingOffersGrid = document.getElementById('amazing-offers-grid');
    const amazingOfferArrowLeft = document.getElementById('amazing-offers-arrow-left');
    const amazingOfferArrowRight = document.getElementById('amazing-offers-arrow-right');

    if (amazingOfferArrowLeft && amazingOfferArrowRight && amazingOffersGrid) {
        amazingOfferArrowLeft.addEventListener('click', () => {
            console.log('Amazing Offers: Scroll Left');
            amazingOffersGrid.scrollBy({
                left: -280,
                behavior: 'smooth'
            });
        });

        amazingOfferArrowRight.addEventListener('click', () => {
            console.log('Amazing Offers: Scroll Right');
            amazingOffersGrid.scrollBy({
                left: 280,
                behavior: 'smooth'
            });
        });
    }

    // Simple slider for Popular Products (visual only for now)
    const popularProductsGrid = document.getElementById('popular-products-grid');
    const popularProductsArrowLeft = document.getElementById('popular-products-arrow-left');
    const popularProductsArrowRight = document.getElementById('popular-products-arrow-right');

    if (popularProductsArrowLeft && popularProductsArrowRight && popularProductsGrid) {
        popularProductsArrowLeft.addEventListener('click', () => {
            console.log('Popular Products: Scroll Left');
            popularProductsGrid.scrollBy({
                left: -280,
                behavior: 'smooth'
            });
        });

        popularProductsArrowRight.addEventListener('click', () => {
            console.log('Popular Products: Scroll Right');
            popularProductsGrid.scrollBy({
                left: 280,
                behavior: 'smooth'
            });
        });
    }

    // NEW: Simple slider for Newest Products (visual only for now)
    const newestProductsGrid = document.getElementById('newest-products-grid');
    const newestProductsArrowLeft = document.getElementById('newest-products-arrow-left');
    const newestProductsArrowRight = document.getElementById('newest-products-arrow-right');

    if (newestProductsArrowLeft && newestProductsArrowRight && newestProductsGrid) {
        newestProductsArrowLeft.addEventListener('click', () => {
            console.log('Newest Products: Scroll Left');
            newestProductsGrid.scrollBy({
                left: -280,
                behavior: 'smooth'
            });
        });

        newestProductsArrowRight.addEventListener('click', () => {
            console.log('Newest Products: Scroll Right');
            newestProductsGrid.scrollBy({
                left: 280,
                behavior: 'smooth'
            });
        });
    }

    // FAQ Accordion functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (faqQuestions) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.closest('.faq-item');
                const faqAnswer = faqItem.querySelector('.faq-answer');

                faqItem.classList.toggle('active');

                if (faqItem.classList.contains('active')) {
                    faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 20 + 'px';
                    faqAnswer.querySelector('p').style.paddingBottom = '20px';
                } else {
                    faqAnswer.style.maxHeight = '0';
                    faqAnswer.querySelector('p').style.paddingBottom = '0';
                }
            });
        });
    }
});