document.addEventListener('DOMContentLoaded', function () {

    /* ================== LOADER ================== */
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.innerHTML = '<div class="loader-circle"></div>';
    document.body.appendChild(loader);

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => loader.remove(), 500);
        }, 1000);
    });

    /* ================== SCROLL UI ================== */
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    const backToTop = document.createElement('div');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        progressBar.style.width = (winScroll / height) * 100 + '%';

        backToTop.classList.toggle('visible', winScroll > 500);
        animateOnScroll();
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ================== MENU ================== */
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle) {
        menuToggle.addEventListener('click', e => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            menuToggle.innerHTML = navMenu.classList.contains('active')
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        });
    }

    /* ================== CONTACT FORM (EMAILJS) ================== */
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        const inputs = contactForm.querySelectorAll('input, textarea');

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            // ===== RESTORE CONTACT FORM UI (IMPORTANT) =====
const inputs = contactForm.querySelectorAll('input, textarea');

inputs.forEach(input => {
    const labelText = input.getAttribute('placeholder');
    if (!labelText) return;

    const label = document.createElement('label');
    label.textContent = labelText;
    input.insertAdjacentElement('afterend', label);
    input.placeholder = '';

    // Auto-fix label position on load
    if (input.value.trim()) {
        label.style.top = '-10px';
        label.style.fontSize = '0.8rem';
    }

    input.addEventListener('focus', () => {
        label.style.top = '-10px';
        label.style.fontSize = '0.8rem';
        label.style.color = 'var(--primary)';
    });

    input.addEventListener('blur', () => {
        if (!input.value.trim()) {
            label.style.top = '18px';
            label.style.fontSize = '1rem';
            label.style.color = 'var(--text-light)';
        }
    });
});


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

            const submitBtn = contactForm.querySelector('button');
            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            emailjs.send(
                "service_3cvbezk",
                "template_fs0arj5",
                {
                    name: contactForm.querySelector('input[name="name"]').value,
                    email: contactForm.querySelector('input[name="email"]').value,
                    subject: contactForm.querySelector('input[name="subject"]').value,
                    message: contactForm.querySelector('textarea[name="message"]').value
                }
            ).then(() => {
                showMessage('🎉 Message sent successfully!', 'success');
                contactForm.reset();
            }).catch(err => {
                console.error(err);
                showMessage('❌ Failed to send message', 'error');
            }).finally(() => {
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
            });
        });
    }

    function showMessage(text, type) {
        if (!formMessage) return;
        formMessage.textContent = text;
        formMessage.className = `form-message ${type}`;
        setTimeout(() => formMessage.textContent = '', 5000);
    }

    /* ================== SCROLL ANIMATION ================== */
    function animateOnScroll() { }

});

