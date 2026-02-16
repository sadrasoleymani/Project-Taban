// Main JavaScript File for DevCraft Website
document.addEventListener('DOMContentLoaded', function() {
    console.log('DevCraft Website Loaded Successfully 🚀');
    
    // ==================== ACCESSIBILITY ====================
    function improveAccessibility() {
        // Add focus styles for all interactive elements
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
        
        interactiveElements.forEach(el => {
            if (!el.hasAttribute('tabindex')) {
                el.setAttribute('tabindex', '0');
            }
            
            // Add keyboard navigation support
            el.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
        
        // Add aria-labels for icon buttons
        document.querySelectorAll('button:not([aria-label])').forEach(btn => {
            if (btn.querySelector('i')) {
                btn.setAttribute('aria-label', btn.textContent.trim() || 'button');
            }
        });
    }
    
    improveAccessibility();
    
    // ==================== MOBILE MENU ====================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            const isExpanded = navMenu.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
            mobileMenuBtn.innerHTML = isExpanded 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // ==================== SMOOTH SCROLLING ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                // Smooth scroll with easing
                const targetPosition = targetElement.offsetTop - 80;
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 1000;
                let start = null;
                
                function animation(currentTime) {
                    if (start === null) start = currentTime;
                    const timeElapsed = currentTime - start;
                    const run = ease(timeElapsed, startPosition, distance, duration);
                    window.scrollTo(0, run);
                    if (timeElapsed < duration) requestAnimationFrame(animation);
                }
                
                // Easing function
                function ease(t, b, c, d) {
                    t /= d / 2;
                    if (t < 1) return c / 2 * t * t + b;
                    t--;
                    return -c / 2 * (t * (t - 2) - 1) + b;
                }
                
                requestAnimationFrame(animation);
                
                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
                
                // Update URL without page reload
                history.pushState(null, null, href);
            }
        });
    });
    
    // ==================== INTERSECTION OBSERVER ====================
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate skill bars
                if (entry.target.classList.contains('expertise')) {
                    animateSkillBars();
                }
                
                // Animate numbers in hero
                if (entry.target.classList.contains('hero')) {
                    animateNumbers('.hero-stats .stat-number');
                }
                
                // Animate numbers in quick stats
                if (entry.target.classList.contains('portfolio-slider')) {
                    animateNumbers('.quick-stats .stat-number');
                }
            }
        });
    }, observerOptions);
    
    // Observe sections
    document.querySelectorAll('.expertise, .hero, .portfolio-slider').forEach(el => {
        if (el) observer.observe(el);
    });
    
    // ==================== ANIMATE SKILL BARS ====================
    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-level');
        
        skillBars.forEach(bar => {
            const level = bar.getAttribute('data-level');
            bar.style.width = level + '%';
        });
    }
    
    // ==================== ANIMATE NUMBERS ====================
    function animateNumbers(selector) {
        const numbers = document.querySelectorAll(selector);
        
        numbers.forEach(number => {
            // Don't re-animate
            if (number.classList.contains('animated')) return;
            
            const target = parseInt(number.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                    number.classList.add('animated');
                }
                number.textContent = Math.floor(current);
            }, 16);
        });
    }
    
    // ==================== PORTFOLIO SLIDER ====================
    const portfolioSlider = document.querySelector('.portfolio-slider-track');
    const slides = document.querySelectorAll('.portfolio-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.slider-dots');
    
    if (portfolioSlider && slides.length > 0) {
        let currentSlide = 0;
        const totalSlides = slides.length;
        let autoSlideInterval;
        let isAnimating = false;
        
        // Initialize dots
        function initDots() {
            if (dotsContainer) {
                dotsContainer.innerHTML = '';
                slides.forEach((_, index) => {
                    const dot = document.createElement('span');
                    dot.className = 'dot';
                    if (index === 0) dot.classList.add('active');
                    dot.setAttribute('data-slide', index);
                    dot.setAttribute('role', 'button');
                    dot.setAttribute('aria-label', `اسلاید ${index + 1}`);
                    dotsContainer.appendChild(dot);
                });
            }
        }
        
        // Go to slide
        function goToSlide(slideIndex) {
            if (isAnimating) return;
            
            isAnimating = true;
            
            if (slideIndex < 0) slideIndex = totalSlides - 1;
            if (slideIndex >= totalSlides) slideIndex = 0;
            
            currentSlide = slideIndex;
            portfolioSlider.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            // Update dots
            document.querySelectorAll('.slider-dots .dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
            
            // Reset animation flag
            setTimeout(() => {
                isAnimating = false;
            }, 800);
        }
        
        // Next slide
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                goToSlide(currentSlide + 1);
                resetAutoSlide();
            });
        }
        
        // Previous slide
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goToSlide(currentSlide - 1);
                resetAutoSlide();
            });
        }
        
        // Dot click
        if (dotsContainer) {
            dotsContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('dot')) {
                    const slideIndex = parseInt(e.target.getAttribute('data-slide'));
                    goToSlide(slideIndex);
                    resetAutoSlide();
                }
            });
        }
        
        // Keyboard navigation for slider
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                goToSlide(currentSlide + 1);
                resetAutoSlide();
            } else if (e.key === 'ArrowLeft') {
                goToSlide(currentSlide - 1);
                resetAutoSlide();
            }
        });
        
        // Auto slide function
        function startAutoSlide() {
            autoSlideInterval = setInterval(() => {
                goToSlide(currentSlide + 1);
            }, 5000);
        }
        
        // Reset auto slide timer
        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }
        
        // Initialize
        initDots();
        startAutoSlide();
        
        // Pause auto slide on hover
        portfolioSlider.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        
        portfolioSlider.addEventListener('mouseleave', () => {
            startAutoSlide();
        });
        
        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        portfolioSlider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        portfolioSlider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            
            if (touchEndX < touchStartX - swipeThreshold) {
                goToSlide(currentSlide + 1);
                resetAutoSlide();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                goToSlide(currentSlide - 1);
                resetAutoSlide();
            }
        }
    }
    
    // ==================== PORTFOLIO FILTER ====================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioSlides = document.querySelectorAll('.portfolio-slide');
    
    if (filterButtons.length > 0 && portfolioSlides.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filter = button.getAttribute('data-filter');
                
                portfolioSlides.forEach(slide => {
                    if (filter === 'all' || slide.getAttribute('data-category') === filter) {
                        slide.style.display = 'block';
                    } else {
                        slide.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // ==================== PROJECT FORM ====================
    const projectForm = document.getElementById('projectRequestForm');
    
    if (projectForm) {
        projectForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.classList.add('btn-loading');
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                showToast('درخواست شما با موفقیت ثبت شد!', 'success');
                this.reset();
                
                submitBtn.classList.remove('btn-loading');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }, 2000);
        });
    }
    
    // ==================== TOAST NOTIFICATION ====================
    function showToast(message, type = 'info') {
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => toast.remove());
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 
                    type === 'error' ? 'exclamation-circle' : 'info-circle';
        
        toast.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
            <button class="toast-close" aria-label="بستن پیام">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(toast);
        
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => toast.remove());
        
        setTimeout(() => {
            if (document.body.contains(toast)) {
                toast.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    }
    
    // ==================== NEWSLETTER FORM ====================
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!email) {
                showToast('لطفاً ایمیل خود را وارد کنید', 'error');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showToast('لطفاً یک ایمیل معتبر وارد کنید', 'error');
                return;
            }
            
            const submitBtn = this.querySelector('button');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showToast('ایمیل شما با موفقیت ثبت شد!', 'success');
                emailInput.value = '';
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 500);
            }, 1500);
        });
    });
    
    // ==================== BACK TO TOP BUTTON ====================
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        let lastScrollTop = 0;
        let ticking = false;
        
        function updateBackToTop() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateBackToTop();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        updateBackToTop();
    }
    
    // ==================== UPDATE ACTIVE NAV LINK ====================
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavLink);
    
    // ==================== NAVBAR SCROLL EFFECT ====================
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // ==================== ABOUT SECTION INIT ====================
    function initAboutSection() {
        console.log('🚀 Initializing About Section...');
        
        // Animate stats on scroll
        const aboutStats = document.querySelectorAll('.about-stat-item .stat-number');
        
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = parseInt(target.getAttribute('data-count'));
                    animateStatNumber(target, finalValue);
                }
            });
        }, { threshold: 0.3 });
        
        aboutStats.forEach(stat => {
            statObserver.observe(stat);
        });
        
        // Team card interactions
        const teamCards = document.querySelectorAll('.team-card');
        teamCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
            
            card.addEventListener('click', function() {
                const memberName = this.querySelector('h4').textContent;
                const memberRole = this.querySelector('.member-role').textContent;
                showToast(`👤 ${memberName} - ${memberRole}`, 'info');
            });
        });
        
        // Client slider pause on hover
        const clientSlider = document.querySelector('.clients-slider');
        if (clientSlider) {
            clientSlider.addEventListener('mouseenter', () => {
                clientSlider.style.animationPlayState = 'paused';
            });
            
            clientSlider.addEventListener('mouseleave', () => {
                clientSlider.style.animationPlayState = 'running';
            });
        }
    }
    
    // Helper function to animate numbers
    function animateStatNumber(element, target) {
        if (element.classList.contains('animated')) return;
        
        element.classList.add('animated');
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
                element.classList.add('done');
            }
            element.textContent = Math.floor(current);
        }, 20);
    }
    
    // Call about section init
    if (document.querySelector('.about-section')) {
        initAboutSection();
    }
    
    // ==================== TECH EXPERTISE INIT ====================
    function initTechExpertise() {
        console.log('Initializing Tech Expertise Section...');
        
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');
        
        if (tabButtons.length > 0) {
            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const tabId = button.getAttribute('data-tab');
                    
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    
                    tabPanes.forEach(pane => pane.classList.remove('active'));
                    document.getElementById(tabId).classList.add('active');
                    
                    setTimeout(() => {
                        animateSkillMetersInTab(tabId);
                    }, 300);
                });
            });
            
            animateSkillMetersInTab('frontend');
        }
        
        function animateSkillMetersInTab(tabId) {
            const activeTab = document.getElementById(tabId);
            if (!activeTab) return;
            
            const skillMeters = activeTab.querySelectorAll('.skill-fill');
            
            skillMeters.forEach(meter => {
                const techCard = meter.closest('.tech-card');
                const skillValue = techCard.getAttribute('data-skill');
                
                meter.style.width = '0';
                
                setTimeout(() => {
                    meter.style.width = `${skillValue}%`;
                    techCard.classList.add('active');
                }, 100);
            });
        }
        
        const techCards = document.querySelectorAll('.tech-card');
        techCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const skillValue = card.getAttribute('data-skill');
                card.style.setProperty('--skill-width', `${skillValue}%`);
            });
        });
        
        const timelineItems = document.querySelectorAll('.timeline-item');
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, { threshold: 0.2 });
        
        timelineItems.forEach(item => {
            timelineObserver.observe(item);
        });
        
        const certCards = document.querySelectorAll('.cert-card');
        certCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    // Call tech expertise init
    if (document.querySelector('.tech-tabs')) {
        initTechExpertise();
    }
    
    // ==================== MODERN SERVICES INIT ====================
    function initModernServices() {
        console.log('🚀 Initializing Modern Services...');
        
        const serviceCards = document.querySelectorAll('.service-card-modern');
        
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                const techTags = this.querySelectorAll('.tech-tag');
                techTags.forEach((tag, index) => {
                    tag.style.transitionDelay = `${index * 0.1}s`;
                    tag.style.transform = 'translateY(-5px)';
                });
            });
            
            card.addEventListener('mouseleave', function() {
                const techTags = this.querySelectorAll('.tech-tag');
                techTags.forEach((tag, index) => {
                    tag.style.transitionDelay = `${index * 0.05}s`;
                    tag.style.transform = 'translateY(0)';
                });
            });
        });
    }
    
    // Call modern services init
    if (document.querySelector('.services-modern')) {
        initModernServices();
    }
    
    // ==================== OFFLINE DETECTION ====================
    window.addEventListener('online', () => {
        showToast('اتصال اینترنت برقرار شد', 'success');
    });
    
    window.addEventListener('offline', () => {
        showToast('اتصال اینترنت قطع شده است', 'error');
    });
    
    // ==================== PERFORMANCE MONITORING ====================
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const timing = performance.timing;
                const loadTime = timing.loadEventEnd - timing.navigationStart;
                console.log(`Page loaded in ${loadTime}ms 🚀`);
            }, 0);
        });
    }
});

// Newsletter form - دقیقاً مثل قبلی
const newsletterForms = document.querySelectorAll('.newsletter-form');

newsletterForms.forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (!email) {
            showToast('لطفاً ایمیل خود را وارد کنید', 'error');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('لطفاً یک ایمیل معتبر وارد کنید', 'error');
            return;
        }
        
        const submitBtn = this.querySelector('button');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            showToast('ایمیل شما با موفقیت ثبت شد!', 'success');
            emailInput.value = '';
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 500);
        }, 1500);
    });
});