// Main JavaScript File for DevCraft Website
document.addEventListener('DOMContentLoaded', function() {
    console.log('DevCraft Website Loaded Successfully 🚀');
    
    // Improve Accessibility
    function improveAccessibility() {
        console.log('Improving accessibility...');
        
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
    
    // Mobile Menu Toggle
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
    
    // Smooth scrolling for anchor links
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
    
    // Animate skill bars when in viewport
    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-level');
        
        skillBars.forEach(bar => {
            const level = bar.getAttribute('data-level');
            bar.style.width = level + '%';
        });
    }
    
    // Intersection Observer for animations
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
    
    // Animate numbers function
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
    
    // Portfolio Slider
    const portfolioSlider = document.querySelector('.portfolio-slider-track');
    const slides = document.querySelectorAll('.portfolio-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.slider-dots');
    const currentSlideElement = document.querySelector('.current-slide');
    const totalSlidesElement = document.querySelector('.total-slides');
    
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
        
        // Update slide counter
        function updateSlideCounter() {
            if (currentSlideElement) {
                currentSlideElement.textContent = currentSlide + 1;
            }
            if (totalSlidesElement) {
                totalSlidesElement.textContent = totalSlides;
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
                dot.setAttribute('aria-current', index === currentSlide ? 'true' : 'false');
            });
            
            updateSlideCounter();
            
            // Update URL hash
            history.replaceState(null, null, `#slide-${currentSlide + 1}`);
            
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
        
        // Project navigation
        const prevProjectBtn = document.querySelector('.prev-project');
        const nextProjectBtn = document.querySelector('.next-project');
        
        if (prevProjectBtn) {
            prevProjectBtn.addEventListener('click', () => {
                goToSlide(currentSlide - 1);
                resetAutoSlide();
            });
        }
        
        if (nextProjectBtn) {
            nextProjectBtn.addEventListener('click', () => {
                goToSlide(currentSlide + 1);
                resetAutoSlide();
            });
        }
        
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
        updateSlideCounter();
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
                // Swipe left - next slide
                goToSlide(currentSlide + 1);
                resetAutoSlide();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe right - previous slide
                goToSlide(currentSlide - 1);
                resetAutoSlide();
            }
        }
    }
    
    // Portfolio Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioSlides = document.querySelectorAll('.portfolio-slide');
    
    if (filterButtons.length > 0 && portfolioSlides.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                });
                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');
                
                const filter = button.getAttribute('data-filter');
                
                // Filter slides
                portfolioSlides.forEach(slide => {
                    if (filter === 'all' || slide.getAttribute('data-category') === filter) {
                        slide.style.display = 'block';
                        slide.setAttribute('aria-hidden', 'false');
                    } else {
                        slide.style.display = 'none';
                        slide.setAttribute('aria-hidden', 'true');
                    }
                });
                
                // Go to first visible slide
                const visibleSlides = Array.from(portfolioSlides).filter(slide => 
                    slide.style.display !== 'none'
                );
                
                if (visibleSlides.length > 0 && portfolioSlider) {
                    const firstVisibleIndex = Array.from(portfolioSlides).indexOf(visibleSlides[0]);
                    goToSlide(firstVisibleIndex);
                }
            });
        });
    }
    
    // Project Form
    const projectForm = document.getElementById('projectRequestForm');
    const charCount = document.getElementById('charCount');
    const descriptionTextarea = document.getElementById('description');
    
    // Character counter for description
    if (descriptionTextarea && charCount) {
        descriptionTextarea.addEventListener('input', function() {
            const length = this.value.length;
            charCount.textContent = length;
            
            if (length > 1000) {
                this.value = this.value.substring(0, 1000);
                charCount.textContent = 1000;
            }
            
            // Change color based on length
            if (length > 900) {
                charCount.style.color = '#f72585';
            } else if (length > 700) {
                charCount.style.color = '#ff9500';
            } else {
                charCount.style.color = '#34c759';
            }
        });
    }
    
    // Form validation
    function validateForm() {
        const fullName = document.getElementById('fullName')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const phone = document.getElementById('phone')?.value.trim();
        const projectType = document.getElementById('projectType')?.value;
        const description = document.getElementById('description')?.value.trim();
        const agreeTerms = document.getElementById('agreeTerms')?.checked;
        
        // Clear previous errors
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
        });
        
        let isValid = true;
        
        // Basic validation
        if (!fullName || fullName.length < 3) {
            showError('fullName', 'لطفاً نام کامل خود را وارد کنید (حداقل ۳ حرف)');
            isValid = false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            showError('email', 'لطفاً یک ایمیل معتبر وارد کنید');
            isValid = false;
        }
        
        const phoneRegex = /^09[0-9]{9}$/;
        const phoneDigits = phone?.replace(/[^0-9]/g, '');
        if (!phoneDigits || !phoneRegex.test(phoneDigits)) {
            showError('phone', 'لطفاً شماره موبایل معتبر وارد کنید (۰۹۱۲۱۲۳۴۵۶۷)');
            isValid = false;
        }
        
        if (!projectType) {
            showError('projectType', 'لطفاً نوع پروژه را انتخاب کنید');
            isValid = false;
        }
        
        if (!description || description.length < 20) {
            showError('description', 'لطفاً توضیحات پروژه را به طور کامل وارد کنید (حداقل ۲۰ حرف)');
            isValid = false;
        }
        
        if (!agreeTerms) {
            showError('agreeTerms', 'لطفاً با قوانین و مقررات موافقت کنید');
            isValid = false;
        }
        
        return isValid;
    }
    
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (!field) return;
        
        let formGroup = field.closest('.form-group');
        if (!formGroup) {
            formGroup = field.parentElement.closest('.form-group');
        }
        
        if (formGroup) {
            formGroup.classList.add('error');
            
            // Remove existing error message
            const existingError = formGroup.querySelector('.error-message');
            if (existingError) existingError.remove();
            
            // Add error message
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = message;
            errorMsg.style.color = '#f72585';
            errorMsg.style.fontSize = '12px';
            errorMsg.style.marginTop = '5px';
            
            formGroup.appendChild(errorMsg);
            
            // Scroll to error
            field.focus();
        }
        
        showToast(message, 'error');
    }
    
    // Form submission
    if (projectForm) {
        projectForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validateForm()) {
                return;
            }
            
            const submitBtn = this.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            const originalWidth = submitBtn.offsetWidth;
            
            // Set fixed width to prevent button resizing
            submitBtn.style.width = originalWidth + 'px';
            
            // Show loading state
            submitBtn.classList.add('btn-loading');
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Show success message
                showToast('درخواست شما با موفقیت ثبت شد! به زودی با شما تماس می‌گیریم.', 'success');
                
                // Reset form
                this.reset();
                if (charCount) {
                    charCount.textContent = '0';
                    charCount.style.color = '#34c759';
                }
                
                // Clear errors
                document.querySelectorAll('.error-message').forEach(msg => msg.remove());
                document.querySelectorAll('.form-group').forEach(group => group.classList.remove('error'));
                
                // Reset button
                setTimeout(() => {
                    submitBtn.classList.remove('btn-loading');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.width = '';
                }, 1500);
                
            }, 2000);
        });
        
        // Real-time validation
        const formInputs = projectForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.value.trim()) {
                    this.closest('.form-group')?.classList.remove('error');
                    const errorMsg = this.closest('.form-group')?.querySelector('.error-message');
                    if (errorMsg) errorMsg.remove();
                }
            });
        });
    }
    
    // Toast notification
    function showToast(message, type = 'info') {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => {
            toast.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        });
        
        // Create toast element
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
        
        // Close button functionality
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        });
        
        // Auto-remove after 5 seconds
        const autoRemove = setTimeout(() => {
            if (document.body.contains(toast)) {
                toast.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
        
        // Stop auto-remove on hover
        toast.addEventListener('mouseenter', () => {
            clearTimeout(autoRemove);
        });
        
        toast.addEventListener('mouseleave', () => {
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    toast.style.animation = 'fadeOut 0.3s ease';
                    setTimeout(() => toast.remove(), 300);
                }
            }, 5000);
        });
        
        // Keyboard support
        toast.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                toast.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }
        });
        
        toast.focus();
    }
    
    // Newsletter form
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
                }, 2000);
            }, 1500);
        });
    });
    
    // Back to Top Button
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        let lastScrollTop = 0;
        let ticking = false;
        
        // Function to show/hide button
        function updateBackToTop() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 300) {
                backToTop.classList.add('show');
                
                // Add pulse animation when scrolling up
                if (scrollTop < lastScrollTop) {
                    backToTop.classList.add('pulse');
                    setTimeout(() => {
                        backToTop.classList.remove('pulse');
                    }, 2000);
                }
            } else {
                backToTop.classList.remove('show');
                backToTop.classList.remove('pulse');
            }
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }
        
        // Throttle scroll event
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateBackToTop();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Ripple effect
        function createRipple(event) {
            const button = event.currentTarget;
            const circle = document.createElement("span");
            const diameter = Math.max(button.clientWidth, button.clientHeight);
            const radius = diameter / 2;
            
            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
            circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
            circle.classList.add("ripple");
            
            const ripple = button.getElementsByClassName("ripple")[0];
            
            if (ripple) {
                ripple.remove();
            }
            
            button.appendChild(circle);
        }
        
        // Smooth scroll to top
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Add ripple effect
            createRipple(e);
            
            // Add click animation
            backToTop.classList.add('clicked');
            setTimeout(() => {
                backToTop.classList.remove('clicked');
            }, 300);
            
            // Smooth scroll with easing
            const scrollToTop = () => {
                const currentPosition = window.pageYOffset;
                
                if (currentPosition > 0) {
                    // Use cubic-bezier for smooth easing
                    const newPosition = currentPosition - currentPosition / 8;
                    window.scrollTo(0, newPosition);
                    requestAnimationFrame(scrollToTop);
                }
            };
            
            scrollToTop();
        });
        
        // Add keydown support for accessibility
        backToTop.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                backToTop.click();
            }
        });
        
        // Initialize on page load
        updateBackToTop();
    }
    
    // Update active nav link on scroll
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
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Initialize animations on load
    setTimeout(() => {
        updateActiveNavLink();
        
        // Check if we're at a specific slide from URL
        const hash = window.location.hash;
        if (hash && hash.startsWith('#slide-')) {
            const slideNum = parseInt(hash.replace('#slide-', ''));
            if (!isNaN(slideNum) && portfolioSlider) {
                goToSlide(slideNum - 1);
            }
        }
    }, 100);
    
    // Add performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const timing = performance.timing;
                const loadTime = timing.loadEventEnd - timing.navigationStart;
                console.log(`Page loaded in ${loadTime}ms 🚀`);
            }, 0);
        });
    }
    
    // Add service worker support check
    if ('serviceWorker' in navigator) {
        console.log('Service Worker API is supported 👍');
    }
    
    // Add offline detection
    window.addEventListener('online', () => {
        showToast('اتصال اینترنت برقرار شد', 'success');
    });
    
    window.addEventListener('offline', () => {
        showToast('اتصال اینترنت قطع شده است', 'error');
    });
    
    // Helper function for portfolio slider (global access)
    window.goToSlide = function(slideIndex) {
        const slides = document.querySelectorAll('.portfolio-slide');
        const track = document.querySelector('.portfolio-slider-track');
        
        if (!slides.length || !track) return;
        
        const totalSlides = slides.length;
        
        if (slideIndex < 0) slideIndex = totalSlides - 1;
        if (slideIndex >= totalSlides) slideIndex = 0;
        
        track.style.transform = `translateX(-${slideIndex * 100}%)`;
        
        // Update dots
        document.querySelectorAll('.slider-dots .dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === slideIndex);
        });
        
        // Update counter
        const currentSlideElement = document.querySelector('.current-slide');
        if (currentSlideElement) {
            currentSlideElement.textContent = slideIndex + 1;
        }
    };

    // Tech Expertise Section Enhancements
function initTechExpertise() {
    console.log('Initializing Tech Expertise Section...');
    
    // Tab Functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                // Update active tab button
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Update active tab pane
                tabPanes.forEach(pane => pane.classList.remove('active'));
                document.getElementById(tabId).classList.add('active');
                
                // Animate skill meters in active tab
                setTimeout(() => {
                    animateSkillMetersInTab(tabId);
                }, 300);
            });
        });
        
        // Animate initial tab
        animateSkillMetersInTab('frontend');
    }
    
    // Animate skill meters in specific tab
    function animateSkillMetersInTab(tabId) {
        const activeTab = document.getElementById(tabId);
        if (!activeTab) return;
        
        const skillMeters = activeTab.querySelectorAll('.skill-fill');
        
        skillMeters.forEach(meter => {
            const techCard = meter.closest('.tech-card');
            const skillValue = techCard.getAttribute('data-skill');
            
            // Reset animation
            meter.style.width = '0';
            
            // Animate after a small delay
            setTimeout(() => {
                meter.style.width = `${skillValue}%`;
                techCard.classList.add('active');
            }, 100);
        });
    }
    
    // Skill hover effects
    const techCards = document.querySelectorAll('.tech-card');
    
    techCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const skillValue = card.getAttribute('data-skill');
            card.style.setProperty('--skill-width', `${skillValue}%`);
        });
        
        // Add click to show details
        card.addEventListener('click', function() {
            const techName = this.querySelector('h4').textContent;
            const skillPercent = this.querySelector('.skill-percent').textContent;
            
            showTechDetails(this);
        });
    });
    
    // Tech details modal
    function showTechDetails(card) {
        const techIcon = card.querySelector('.tech-icon').innerHTML;
        const techName = card.querySelector('h4').textContent;
        const techDescription = card.querySelector('p').textContent;
        const skillPercent = card.querySelector('.skill-percent').textContent;
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'tech-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" aria-label="بستن">
                    <i class="fas fa-times"></i>
                </button>
                <div class="modal-header">
                    <div class="modal-icon">${techIcon}</div>
                    <h3>${techName}</h3>
                    <div class="modal-skill">${skillPercent} تسلط</div>
                </div>
                <div class="modal-body">
                    <p>${techDescription}</p>
                    
                    <div class="tech-projects">
                        <h4><i class="fas fa-briefcase"></i> پروژه‌های انجام شده</h4>
                        <div class="projects-count">۱۵+ پروژه موفق</div>
                    </div>
                    
                    <div class="tech-experience">
                        <h4><i class="fas fa-calendar-alt"></i> سابقه کار</h4>
                        <div class="experience-time">۳+ سال تجربه</div>
                    </div>
                    
                    <div class="tech-features">
                        <h4><i class="fas fa-star"></i> قابلیت‌ها</h4>
                        <ul>
                            <li><i class="fas fa-check"></i> توسعه بهینه و استاندارد</li>
                            <li><i class="fas fa-check"></i> پشتیبانی طولانی‌مدت</li>
                            <li><i class="fas fa-check"></i> مستندسازی کامل</li>
                            <li><i class="fas fa-check"></i> تست و تضمین کیفیت</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary">
                        <i class="fas fa-code"></i> مشاهده نمونه کد
                    </button>
                    <button class="btn btn-outline">
                        <i class="fas fa-project-diagram"></i> پروژه‌های مرتبط
                    </button>
                </div>
            </div>
        `;
        
        // Add styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease;
        `;
        
        // Add modal styles to head if not exists
        if (!document.querySelector('#modal-styles')) {
            const style = document.createElement('style');
            style.id = 'modal-styles';
            style.textContent = `
                .modal-content {
                    background: white;
                    border-radius: 20px;
                    width: 90%;
                    max-width: 500px;
                    max-height: 90vh;
                    overflow-y: auto;
                    animation: slideUp 0.3s ease;
                }
                
                @keyframes slideUp {
                    from { transform: translateY(50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                .modal-header {
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    color: white;
                    padding: 30px;
                    border-radius: 20px 20px 0 0;
                    text-align: center;
                }
                
                .modal-icon {
                    font-size: 48px;
                    margin-bottom: 15px;
                }
                
                .modal-skill {
                    background: rgba(255, 255, 255, 0.2);
                    display: inline-block;
                    padding: 8px 20px;
                    border-radius: 20px;
                    font-weight: 600;
                    margin-top: 10px;
                }
                
                .modal-body {
                    padding: 30px;
                }
                
                .tech-projects, .tech-experience, .tech-features {
                    margin: 25px 0;
                }
                
                .projects-count, .experience-time {
                    background: var(--light-gray);
                    padding: 10px 20px;
                    border-radius: 10px;
                    display: inline-block;
                    margin-top: 10px;
                    font-weight: 600;
                    color: var(--dark);
                }
                
                .tech-features ul {
                    list-style: none;
                    padding: 0;
                }
                
                .tech-features li {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin: 10px 0;
                    color: var(--dark);
                }
                
                .tech-features i {
                    color: var(--success);
                }
                
                .modal-footer {
                    padding: 20px 30px;
                    border-top: 1px solid var(--light-gray);
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                }
                
                .modal-close {
                    position: absolute;
                    top: 15px;
                    left: 15px;
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    font-size: 18px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .modal-close:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: rotate(90deg);
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => modal.remove(), 300);
        });
        
        // Close on escape key
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modal.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => modal.remove(), 300);
            }
        });
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => modal.remove(), 300);
            }
        });
        
        // Focus on modal
        modal.querySelector('.modal-content').focus();
    }
    
    // Animate timeline items on scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });
    
    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
    
    // Certificate hover effects
    const certCards = document.querySelectorAll('.cert-card');
    
    certCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Certificate click to show details
        card.addEventListener('click', function() {
            const certName = this.querySelector('h4').textContent;
            const certDesc = this.querySelector('p').textContent;
            const certDate = this.querySelector('.cert-date').textContent;
            
            showToast(`گواهینامه ${certName} - ${certDate}`, 'info');
        });
    });
    
    // Auto-rotate tabs for demo
    let currentTab = 0;
    const autoRotateTabs = () => {
        if (tabButtons.length > 0) {
            currentTab = (currentTab + 1) % tabButtons.length;
            tabButtons[currentTab].click();
            
            setTimeout(autoRotateTabs, 5000);
        }
    };
    
    // Start auto rotation after 10 seconds
    setTimeout(autoRotateTabs, 10000);
}

// Initialize tech expertise section
document.addEventListener('DOMContentLoaded', function() {
    initTechExpertise();
});

// Add to your existing DOMContentLoaded event
// Call initTechExpertise() in your main DOMContentLoaded function
});

// Modern Services JavaScript
function initModernServices() {
    console.log('🚀 Initializing Modern Services...');
    
    // Filter services by category
    const categoryFilters = document.querySelectorAll('.category-filter');
    const serviceCards = document.querySelectorAll('.service-card-modern');
    
    if (categoryFilters.length > 0) {
        categoryFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                // Update active filter
                categoryFilters.forEach(f => f.classList.remove('active'));
                this.classList.add('active');
                
                const category = this.getAttribute('data-category');
                
                // Filter service cards
                serviceCards.forEach(card => {
                    if (category === 'all' || card.getAttribute('data-service') === category) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeIn 0.5s ease';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Service card hover effects
    serviceCards.forEach(card => {
        // Color coding based on service type
        const serviceType = card.getAttribute('data-service');
        const colorMap = {
            'web': '#3b82f6',
            'mobile': '#10b981',
            'ecommerce': '#8b5cf6',
            'seo': '#f59e0b',
            'wordpress': '#ef4444',
            'consultation': '#ec4899'
        };
        
        const serviceColor = colorMap[serviceType] || '#3b82f6';
        
        // Add hover gradient effect
        card.addEventListener('mouseenter', function() {
            this.style.setProperty('--hover-color', serviceColor);
            
            // Animate tech tags
            const techTags = this.querySelectorAll('.tech-tag');
            techTags.forEach((tag, index) => {
                tag.style.transitionDelay = `${index * 0.1}s`;
                tag.style.transform = 'translateY(-5px)';
                tag.style.boxShadow = `0 5px 15px ${serviceColor}33`;
            });
        });
        
        card.addEventListener('mouseleave', function() {
            const techTags = this.querySelectorAll('.tech-tag');
            techTags.forEach((tag, index) => {
                tag.style.transitionDelay = `${index * 0.05}s`;
                tag.style.transform = 'translateY(0)';
                tag.style.boxShadow = 'none';
            });
        });
        
        // Click to expand service details
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.service-cta')) {
                toggleServiceDetails(this);
            }
        });
    });
    
    // Animate stats
    const statNumbers = document.querySelectorAll('.stat-number-service');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numberElement = entry.target;
                const target = parseInt(numberElement.getAttribute('data-count'));
                animateServiceStat(numberElement, target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(number => observer.observe(number));
}

// Animate service stat numbers
function animateServiceStat(element, target) {
    if (element.classList.contains('animated')) return;
    
    element.classList.add('animated');
    let start = null;
    const duration = 2000;
    
    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const percentage = Math.min(progress / duration, 1);
        
        // Easing function
        const easeOutBack = 1 - Math.pow(1 - percentage, 4);
        const current = Math.floor(easeOutBack * target);
        
        element.textContent = current.toLocaleString('fa-IR');
        
        if (progress < duration) {
            requestAnimationFrame(step);
        } else {
            element.textContent = target.toLocaleString('fa-IR');
            
            // Add celebration effect for milestones
            if (target >= 100) {
                createConfetti(element);
            }
        }
    }
    
    requestAnimationFrame(step);
}

// Toggle service details
function toggleServiceDetails(card) {
    const details = card.querySelector('.service-details-expanded');
    
    if (details) {
        // Collapse details
        details.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => details.remove(), 300);
        return;
    }
    
    // Create expanded details
    const serviceType = card.getAttribute('data-service');
    const serviceTitle = card.querySelector('.service-title').textContent;
    const serviceDescription = card.querySelector('.service-description').textContent;
    const servicePrice = card.querySelector('.price-value').textContent;
    
    const detailsElement = document.createElement('div');
    detailsElement.className = 'service-details-expanded';
    detailsElement.innerHTML = `
        <div class="details-header">
            <h4>جزئیات کامل ${serviceTitle}</h4>
            <button class="btn-close-details">
                <i class="fas fa-times"></i>
            </button>
        </div>
        
        <div class="details-content">
            <div class="details-section">
                <h5><i class="fas fa-list-check"></i> مراحل کار</h5>
                <ol class="work-steps">
                    <li>مشاوره و تحلیل پروژه</li>
                    <li>طراحی اولیه و برنامه‌ریزی</li>
                    <li>توسعه و پیاده‌سازی</li>
                    <li>تست و کنترل کیفیت</li>
                    <li>تحویل و پشتیبانی</li>
                </ol>
            </div>
            
            <div class="details-section">
                <h5><i class="fas fa-clock"></i> زمان تحویل</h5>
                <div class="delivery-time">
                    <i class="fas fa-calendar-alt"></i>
                    <span>${getDeliveryTime(serviceType)}</span>
                </div>
            </div>
            
            <div class="details-section">
                <h5><i class="fas fa-shield-alt"></i> گارانتی</h5>
                <div class="warranty">
                    <i class="fas fa-award"></i>
                    <span>${getWarrantyPeriod(serviceType)} ماه گارانتی</span>
                </div>
            </div>
            
            <div class="details-section">
                <h5><i class="fas fa-handshake"></i> تعهدات ما</h5>
                <ul class="commitments">
                    <li><i class="fas fa-check"></i> کدنویسی تمیز و استاندارد</li>
                    <li><i class="fas fa-check"></i> تست کامل در مراحل مختلف</li>
                    <li><i class="fas fa-check"></i> مستندسازی کامل پروژه</li>
                    <li><i class="fas fa-check"></i> پشتیبانی ۶ ماهه رایگان</li>
                </ul>
            </div>
        </div>
        
        <div class="details-footer">
            <div class="price-summary">
                <span class="price-label">هزینه پروژه:</span>
                <span class="price-value">${servicePrice}</span>
            </div>
            <button class="btn-order-now">
                <i class="fas fa-shopping-cart"></i>
                سفارش آنلاین
            </button>
        </div>
    `;
    
    card.appendChild(detailsElement);
    
    // Close button
    const closeBtn = detailsElement.querySelector('.btn-close-details');
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        detailsElement.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => detailsElement.remove(), 300);
    });
    
    // Order button
    const orderBtn = detailsElement.querySelector('.btn-order-now');
    orderBtn.addEventListener('click', () => {
        window.location.href = '#start-project';
    });
    
    // Add styles for expanded details
    addExpandedDetailsStyles();
}

// Helper functions
function getDeliveryTime(serviceType) {
    const times = {
        'web': '۲-۴ هفته',
        'mobile': '۴-۸ هفته',
        'ecommerce': '۳-۶ هفته',
        'seo': 'ماهانه',
        'wordpress': '۲-۳ هفته',
        'consultation': '۱-۲ روز کاری'
    };
    return times[serviceType] || 'مشخص نشده';
}

function getWarrantyPeriod(serviceType) {
    const periods = {
        'web': '۶',
        'mobile': '۱۲',
        'ecommerce': '۶',
        'seo': '۳',
        'wordpress': '۶',
        'consultation': '۱'
    };
    return periods[serviceType] || '۳';
}

// Confetti effect for milestones
function createConfetti(element) {
    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 10 + 5;
        const posX = Math.random() * 100;
        const duration = Math.random() * 1 + 0.5;
        
        confetti.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: ${size < 8 ? '50%' : '3px'};
            left: ${posX}%;
            top: 50%;
            z-index: 1000;
            pointer-events: none;
            animation: confettiFall ${duration}s ease-out forwards;
        `;
        
        element.parentElement.appendChild(confetti);
        
        // Remove after animation
        setTimeout(() => confetti.remove(), duration * 1000);
    }
}

// Add expanded details styles
function addExpandedDetailsStyles() {
    if (!document.querySelector('#expanded-details-styles')) {
        const style = document.createElement('style');
        style.id = 'expanded-details-styles';
        style.textContent = `
            .service-details-expanded {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border-radius: 20px;
                padding: 25px;
                margin-top: 15px;
                z-index: 100;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
                animation: slideDown 0.3s ease;
                border: 1px solid #f1f5f9;
            }
            
            @keyframes slideDown {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes slideUp {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-20px); }
            }
            
            .details-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid #f1f5f9;
            }
            
            .details-header h4 {
                font-size: 1.2rem;
                color: #1e293b;
                margin: 0;
            }
            
            .btn-close-details {
                background: #f1f5f9;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                color: #64748b;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .btn-close-details:hover {
                background: #ef4444;
                color: white;
                transform: rotate(90deg);
            }
            
            .details-content {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-bottom: 25px;
            }
            
            .details-section h5 {
                font-size: 1rem;
                color: #475569;
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .details-section h5 i {
                color: #3b82f6;
            }
            
            .work-steps {
                padding-right: 20px;
                margin: 0;
                color: #64748b;
                line-height: 1.8;
            }
            
            .work-steps li {
                margin-bottom: 8px;
            }
            
            .delivery-time, .warranty {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px;
                background: #f8fafc;
                border-radius: 12px;
                color: #475569;
                font-weight: 500;
            }
            
            .delivery-time i, .warranty i {
                color: #10b981;
                font-size: 20px;
            }
            
            .commitments {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .commitments li {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 10px;
                color: #475569;
            }
            
            .commitments i {
                color: #10b981;
                font-size: 14px;
            }
            
            .details-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-top: 20px;
                border-top: 1px solid #f1f5f9;
            }
            
            .price-summary {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .price-summary .price-label {
                font-size: 14px;
                color: #94a3b8;
            }
            
            .price-summary .price-value {
                font-size: 1.5rem;
                font-weight: 800;
                color: #1e293b;
            }
            
            .btn-order-now {
                background: linear-gradient(90deg, #10b981, #059669);
                color: white;
                border: none;
                padding: 15px 30px;
                border-radius: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .btn-order-now:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
            }
            
            @keyframes confettiFall {
                0% {
                    transform: translateY(-100px) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100px) rotate(360deg);
                    opacity: 0;
                }
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    initModernServices();
});