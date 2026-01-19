document.addEventListener('DOMContentLoaded', function() {
    // Loading animation
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.innerHTML = '<div class="loader-circle"></div>';
    document.body.appendChild(loader);
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => loader.remove(), 500);
        }, 1000);
    });
    
    // Scroll progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    // Back to top button
    const backToTop = document.createElement('div');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(backToTop);
    
    // Scroll event for progress bar and back-to-top
    window.addEventListener('scroll', function() {
        // Progress bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
        
        // Back to top button
        if (winScroll > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        
        // Scroll animations for sections
        animateOnScroll();
    });
    
    // Back to top functionality
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Mobile menu toggle with animation
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            menuToggle.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!menuToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
    
    // Enhanced active nav link on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function highlightNavLink() {
        let scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Enhanced smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Close mobile menu
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                
                // Smooth scroll
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Add pulse animation to section
                targetSection.classList.add('pulse');
                setTimeout(() => targetSection.classList.remove('pulse'), 1000);
            }
        });
    });
    
    // Logo click scroll to top
    document.querySelector('.logo').addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Enhanced contact form handling with EmailJS
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    

    (function() {
        emailjs.init("e-SBr2SBWTWrV5VHM"); // Replace with your EmailJS Public Key
    })();
    
    if (contactForm) {
        // Add labels dynamically
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach((input, index) => {
            const labelText = input.getAttribute('placeholder');
            const label = document.createElement('label');
            label.textContent = labelText;
            input.insertAdjacentElement('afterend', label);
            input.placeholder = '';
        });
        
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                from_name: this.querySelector('input[name="name"]').value,
                reply_to: this.querySelector('input[name="_replyto"]').value,
                subject: this.querySelector('input[name="subject"]').value,
                message: this.querySelector('textarea[name="message"]').value
            };
            
            // Validate
            let hasError = false;
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = '#c0392b';
                    hasError = true;
                } else {
                    input.style.borderColor = '';
                }
            });
            
            if (hasError) {
                showMessage('Please fill all required fields', 'error');
                return;
            }
            
            // Show loading with animation
            const submitBtn = this.querySelector('button');
            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            try {

                const response = await emailjs.send(
                    "service_3cvbezk",    // Replace with your Service ID
                    "template_fs0arj5",   // Replace with your Template ID
                    formData
                );
                
                if (response.status === 200) {
                    // Add success animation
                    this.classList.add('success');
                    
                    // Show success message
                    showMessage('🎉 Message sent successfully! I will respond soon.', 'success');
                    
                    // Reset form with animation
                    setTimeout(() => {
                        contactForm.reset();
                        this.classList.remove('success');
                        inputs.forEach(input => {
                            input.style.borderColor = '';
                            input.nextElementSibling.style.top = '18px';
                            input.nextElementSibling.style.fontSize = '1rem';
                        });
                    }, 1000);
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                console.error('EmailJS Error:', error);
                
                // Fallback to mailto if EmailJS fails
                showMessage('📧 Using alternative method...', 'info');
                
                const name = this.querySelector('input[name="name"]').value;
                const email = this.querySelector('input[name="_replyto"]').value;
                const subject = this.querySelector('input[name="subject"]').value;
                const message = this.querySelector('textarea[name="message"]').value;
                
                // Create mailto link
                const mailtoLink = `mailto:nahidajannatmayouree@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
                
                // Open mail client
                window.location.href = mailtoLink;
                
                // Reset form
                setTimeout(() => {
                    contactForm.reset();
                    inputs.forEach(input => {
                        input.style.borderColor = '';
                        input.nextElementSibling.style.top = '18px';
                        input.nextElementSibling.style.fontSize = '1rem';
                    });
                }, 1000);
            } finally {
                // Reset button after delay
                setTimeout(() => {
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.disabled = false;
                }, 2000);
                
                // Clear message after 5 seconds
                setTimeout(() => {
                    if (formMessage) {
                        formMessage.textContent = '';
                        formMessage.className = 'form-message';
                    }
                }, 5000);
            }
        });
        
        // Input focus/blur effects
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.nextElementSibling.style.top = '-10px';
                this.nextElementSibling.style.fontSize = '0.8rem';
                this.nextElementSibling.style.color = 'var(--primary)';
            });
            
            input.addEventListener('blur', function() {
                if (!this.value.trim()) {
                    this.nextElementSibling.style.top = '18px';
                    this.nextElementSibling.style.fontSize = '1rem';
                    this.nextElementSibling.style.color = 'var(--text-light)';
                }
            });
            
            // Auto-adjust label on load if input has value
            if (input.value.trim()) {
                input.nextElementSibling.style.top = '-10px';
                input.nextElementSibling.style.fontSize = '0.8rem';
                input.nextElementSibling.style.color = 'var(--primary)';
            }
        });
    }
    
    function showMessage(text, type) {
        if (!formMessage) return;
        formMessage.textContent = text;
        formMessage.className = `form-message ${type}`;
        
        // Add emoji animation
        const emoji = text.match(/\p{Emoji}/gu);
        if (emoji) {
            formMessage.style.animation = 'none';
            setTimeout(() => {
                formMessage.style.animation = 'bounce 0.5s ease';
            }, 10);
        }
    }
    
    // Enhanced skill bars animation
    const skillBars = document.querySelectorAll('.skill-level');
    
    function animateSkills() {
        skillBars.forEach((bar, index) => {
            const rect = bar.parentElement.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                const width = bar.parentElement.getAttribute('data-width') || bar.style.width;
                bar.parentElement.style.setProperty('--skill-width', width);
                bar.parentElement.classList.add('visible');
                
                // Animate skill items sequentially
                const skillItem = bar.closest('.skill-item');
                setTimeout(() => {
                    skillItem.classList.add('visible');
                }, index * 100);
            }
        });
    }
    
    // Scroll animations for all elements
    function animateOnScroll() {
        // Animate sections
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                section.classList.add('visible');
            }
        });
        
        // Animate about wrapper
        const aboutWrapper = document.querySelector('.about-wrapper');
        if (aboutWrapper) {
            const rect = aboutWrapper.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                aboutWrapper.classList.add('visible');
            }
        }
        
        // Animate skills grid
        const skillsGrid = document.querySelector('.skills-grid');
        if (skillsGrid) {
            const rect = skillsGrid.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                skillsGrid.classList.add('visible');
            }
        }
        
        // Animate projects grid
        const projectsGrid = document.querySelector('.projects-grid');
        if (projectsGrid) {
            const rect = projectsGrid.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                projectsGrid.classList.add('visible');
                
                // Animate project cards sequentially
                const projectCards = document.querySelectorAll('.project-card');
                projectCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 200);
                });
            }
        }
        
        // Animate contact wrapper
        const contactWrapper = document.querySelector('.contact-wrapper');
        if (contactWrapper) {
            const rect = contactWrapper.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                contactWrapper.classList.add('visible');
            }
        }
        
        animateSkills();
        highlightNavLink();
    }
    
    // Initial animations
    setTimeout(() => {
        animateOnScroll();
    }, 1500);
    
    // Add hover effect to all interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .badge, .project-card, .skill-category, .contact-item, .social-icon');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
    
    // Add typing animation effect to hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        setTimeout(typeWriter, 1000);
    }
    
    // Add CSS for email links
    const style = document.createElement('style');
    style.textContent = `
        .email-link, .contact-text a {
            color: var(--text-light);
            text-decoration: none;
            transition: color 0.3s ease;
        }
        
        .email-link:hover, .contact-text a:hover {
            color: var(--primary);
            text-decoration: underline;
        }
        
        @keyframes floatParticle {
            0% {
                transform: translate(0, 0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: ${Math.random() * 0.3 + 0.1};
            }
            90% {
                opacity: ${Math.random() * 0.3 + 0.1};
            }
            100% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(360deg);
                opacity: 0;
            }
        }
        
        .pulse {
            animation: pulse 1s ease;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }
        
        @keyframes bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
    `;
    document.head.appendChild(style);
});
