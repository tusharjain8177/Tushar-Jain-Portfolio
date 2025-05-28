document.addEventListener('DOMContentLoaded', function () {
    initializeAnimations();
    initializeThemeToggle();
    initializePrintButton();
    initializeSmoothScroll();
    initializeScrollSpy();
    handleProfileImageLoading();
    initializeAnimeJS();
});

function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function initializeAnimations() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    sections.forEach(section => sectionObserver.observe(section));
}

function initializeThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

function initializePrintButton() {
    const printButton = document.querySelector('.print-button');
    printButton.addEventListener('click', async () => {
        // Show loading state
        printButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        printButton.disabled = true;

        try {
            // Get the container element
            const element = document.querySelector('.container');
            
            // Create a clone of the element to modify for PDF
            const clone = element.cloneNode(true);
            clone.style.width = '210mm'; // A4 width
            clone.style.padding = '20mm';
            clone.style.margin = '0';
            clone.style.backgroundColor = 'white';
            clone.style.boxShadow = 'none';
            
            // Temporarily append clone to body
            document.body.appendChild(clone);
            clone.style.position = 'absolute';
            clone.style.left = '-9999px';
            
            // Use html2canvas to capture the element
            const canvas = await html2canvas(clone, {
                scale: 2, // Higher scale for better quality
                useCORS: true, // Enable CORS for images
                logging: false,
                backgroundColor: '#ffffff'
            });
            
            // Remove the clone
            document.body.removeChild(clone);
            
            // Create PDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            // Calculate dimensions to fit the page
            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            // Add the image to the PDF
            pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, imgWidth, imgHeight);
            
            // If content is longer than one page, add new pages
            let heightLeft = imgHeight;
            let position = 0;
            const pageHeight = 297; // A4 height in mm
            
            while (heightLeft > 0) {
                position = heightLeft - pageHeight;
                if (position > 0) {
                    pdf.addPage();
                    pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, -position, imgWidth, imgHeight);
                }
                heightLeft -= pageHeight;
            }
            
            // Save the PDF
            pdf.save('Tushar_Jain_Resume.pdf');
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        } finally {
            // Reset button state
            printButton.innerHTML = '<i class="fas fa-print"></i>';
            printButton.disabled = false;
        }
    });
}

function initializeScrollSpy() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('a[href^="#"]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.5, rootMargin: '-20% 0px -80% 0px' });
    sections.forEach(section => observer.observe(section));
}

function handleProfileImageLoading() {
    const profileImage = document.querySelector('.profile-image');
    const profileInitial = document.querySelector('.profile-initial');
    if (profileImage) {
        if (profileImage.complete) {
            profileImage.classList.add('loaded');
            if (profileInitial) profileInitial.style.display = 'none';
        }
        profileImage.onload = function () {
            this.classList.add('loaded');
            if (profileInitial) profileInitial.style.display = 'none';
        };
        profileImage.onerror = function () {
            this.style.display = 'none';
            if (profileInitial) profileInitial.style.display = 'flex';
        };
    }
}

function initializeAnimeJS() {
    animateOnScroll('.contact-info a', {
        translateX: [-50, 0],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutExpo',
        delay: anime.stagger(100)
    });

    anime({
        targets: '.contact-info i',
        translateY: [-2, 2],
        direction: 'alternate',
        easing: 'easeInOutSine',
        duration: 2000,
        loop: true
    });

    document.querySelectorAll('.skill-tag').forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            anime({
                targets: tag,
                scale: [1, 1.1],
                duration: 300,
                direction: 'alternate',
                easing: 'easeInOutQuad'
            });
        });
    });

    animateOnScroll('h2', {
        translateX: [-5, 5, -3, 3, 0],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeInOutQuad',
        delay: anime.stagger(100)
    });

    animateOnScroll('.experience-item', {
        translateX: [-50, 0],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutExpo',
        delay: anime.stagger(200)
    });

    animateOnScroll('.project-item', {
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutExpo',
        delay: anime.stagger(150)
    });

    animateOnScroll('.skill-tag', {
        scale: [0, 1],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutElastic(1, .5)',
        delay: anime.stagger(50)
    });

    animateOnScroll('.timeline-dot', {
        scale: [0, 1],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutElastic(1, .5)',
        delay: anime.stagger(200)
    });

    animateOnScroll('.certifications li', {
        translateX: [-30, 0],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutExpo',
        delay: anime.stagger(100)
    });

    animateOnScroll('#summary-text span', {
        opacity: [0, 1],
        translateX: [-20, 0],
        delay: anime.stagger(200),
        duration: 800,
        easing: 'easeOutQuad'
    });

    anime({
        targets: '.profile-header',
        translateY: [-50, 0],
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeOutExpo'
    });

    anime({
        targets: 'h1',
        translateY: [-30, 0],
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 1500,
        easing: 'easeOutElastic(1, .6)'
    });

    anime({
        targets: '.print-button',
        scale: [1, 1.05],
        direction: 'alternate',
        easing: 'easeInOutQuad',
        duration: 1500,
        loop: true
    });

    const languageSection = document.querySelector('.languages');
    if (languageSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateLanguageSection();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });
        observer.observe(languageSection);
    }
}

function animateOnScroll(selector, animationOptions) {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                anime(Object.assign({ targets: entry.target }, animationOptions));
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });

    elements.forEach(el => observer.observe(el));
}

function animateLanguageSection() {
    const languageItems = document.querySelectorAll('.language-item');
    languageItems.forEach(item => {
        const dots = item.querySelectorAll('.level-dot');
        const filledDots = item.querySelectorAll('.level-dot.filled');
        const levelText = item.querySelector('.level-text');

        anime({
            targets: dots,
            scale: [0, 1],
            opacity: [0, 1],
            delay: anime.stagger(100),
            duration: 600,
            easing: 'easeOutElastic(1, .5)'
        });

        anime({
            targets: filledDots,
            scale: [0, 1],
            opacity: [0, 1],
            backgroundColor: ['#e0e0e0', '#3498db'],
            delay: anime.stagger(200),
            duration: 800,
            easing: 'easeOutElastic(1, .5)',
            begin: () => {
                if (levelText) levelText.style.opacity = '0';
            },
            complete: () => {
                if (levelText) {
                    anime({
                        targets: levelText,
                        opacity: [0, 1],
                        duration: 500,
                        easing: 'easeOutExpo'
                    });
                }
            }
        });
    });
}
