class NavigationManager {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navLinks = document.querySelector('.nav-links');
        this.scrollTopBtn = document.getElementById('scroll-top');

        this.init();
    }

    init() {
        this.bindEvents();
        this.handleScroll();
        this.setActiveNavLink();
    }

    bindEvents() {
        // Nav toggle for mobile
        if (this.navToggle && this.navLinks) {
            this.navToggle.addEventListener('click', () => {
                this.navLinks.classList.toggle('active');
            });
        }

        // Close mobile menu on link click
        if (this.navLinks) {
            this.navLinks.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    this.navLinks.classList.remove('active');
                }
            });
        }

        // Scroll to top
        if (this.scrollTopBtn) {
            this.scrollTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // Handle scroll
        window.addEventListener('scroll', () => this.handleScroll());

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;

                // Check if it's an internal page anchor
                if (href.includes('.html#')) {
                    // Let the browser handle navigation
                    return;
                }

                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    this.scrollToElement(targetElement);
                }
            });
        });
    }

    handleScroll() {
        // Add scrolled class to navbar
        if (this.navbar) {
            if (window.scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        }

        // Show/hide scroll to top button
        if (this.scrollTopBtn) {
            if (window.scrollY > 300) {
                this.scrollTopBtn.classList.add('visible');
            } else {
                this.scrollTopBtn.classList.remove('visible');
            }
        }
    }

    scrollToElement(element) {
        const navbarHeight = this.navbar ? this.navbar.offsetHeight : 0;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.nav-links a');

        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');

            // Remove active class from all links
            link.classList.remove('active');

            // Check if this link matches current page
            if (linkHref === currentPage ||
                (currentPage === '' && linkHref === 'index.html') ||
                (linkHref.includes('#') && window.location.hash === linkHref)) {
                link.classList.add('active');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    new NavigationManager();
});

window.NavigationManager = NavigationManager;
