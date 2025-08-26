/**
 * Main Application Script
 * Handles general website functionality and interactions
 * 
 * @author Fellowship of Sub-Saharan Culture
 * @version 1.0.0
 */

class Application {
    constructor() {
        this.isInitialized = false;
        this.scrollY = 0;
        
        // Bind methods
        this.handleScroll = this.handleScroll.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.handleNavigation = this.handleNavigation.bind(this);
    }

    /**
     * Initialize the application
     */
    init() {
        console.log('Initializing application...');
        
        this.setupScrollEffects();
        this.setupSmoothScrolling();
        this.setupNavigationEffects();
        this.setupAccessibility();
        this.setupPerformanceOptimizations();
        
        this.isInitialized = true;
        console.log('Application initialized successfully');
    }

    /**
     * Setup scroll-based effects
     */
    setupScrollEffects() {
        // Throttled scroll handler for performance
        let ticking = false;
        
        const scrollHandler = () => {
            this.scrollY = window.scrollY;
            this.updateNavigationStyle();
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(scrollHandler);
                ticking = true;
            }
        }, { passive: true });
    }

    /**
     * Update navigation style based on scroll position
     */
    updateNavigationStyle() {
        const nav = document.querySelector('.nav');
        if (!nav) return;
        
        if (this.scrollY > 50) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
    }

    /**
     * Setup smooth scrolling for anchor links
     */
    setupSmoothScrolling() {
        document.addEventListener('click', (event) => {
            const target = event.target.closest('a[href^="#"]');
            if (!target) return;
            
            event.preventDefault();
            
            const targetId = target.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }

    /**
     * Setup navigation effects and mobile menu
     */
    setupNavigationEffects() {
        // Add mobile menu functionality (if needed in future)
        this.setupMobileNavigation();
        
        // Update active navigation item based on scroll position
        this.setupActiveNavigation();
    }

    /**
     * Setup mobile navigation (expandable for future use)
     */
    setupMobileNavigation() {
        // Mobile menu toggle functionality can be added here
        // Currently the design uses language selector only on mobile
        
        const languageSelector = document.querySelector('.language-selector');
        if (languageSelector && window.innerWidth <= 768) {
            // Add any mobile-specific language selector behavior
        }
    }

    /**
     * Setup active navigation highlighting
     */
    setupActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        
        if (sections.length === 0 || navLinks.length === 0) return;
        
        const updateActiveNav = () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                
                if (this.scrollY >= sectionTop && this.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        };
        
        // Update on scroll
        window.addEventListener('scroll', updateActiveNav, { passive: true });
        
        // Initial update
        updateActiveNav();
    }

    /**
     * Setup accessibility improvements
     */
    setupAccessibility() {
        // Keyboard navigation for language buttons
        document.querySelectorAll('.lang-btn').forEach(button => {
            button.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    button.click();
                }
            });
        });
        
        // Focus management for modals and interactive elements
        this.setupFocusManagement();
        
        // Skip to content link (can be added)
        this.setupSkipToContent();
    }

    /**
     * Setup focus management
     */
    setupFocusManagement() {
        // Add focus indicators for keyboard navigation
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    /**
     * Setup skip to content functionality
     */
    setupSkipToContent() {
        // This can be expanded to add a skip-to-content link
        // for better accessibility
    }

    /**
     * Setup performance optimizations
     */
    setupPerformanceOptimizations() {
        // Lazy loading for images
        this.setupLazyLoading();
        
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Setup resize handler with debouncing
        this.setupResizeHandler();
    }

    /**
     * Setup lazy loading for images
     */
    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    /**
     * Preload critical resources
     */
    preloadCriticalResources() {
        // Preload translation files for faster language switching
        const preloadTranslations = () => {
            const supportedLangs = ['en', 'fr'];
            supportedLangs.forEach(lang => {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = `./locales/${lang}.json`;
                document.head.appendChild(link);
            });
        };
        
        // Preload after page load to not block initial render
        window.addEventListener('load', preloadTranslations);
    }

    /**
     * Setup debounced resize handler
     */
    setupResizeHandler() {
        let resizeTimeout;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }

    /**
     * Handle window resize events
     */
    handleResize() {
        // Update any size-dependent calculations
        this.updateActiveNavigation();
        
        // Update mobile navigation if needed
        this.setupMobileNavigation();
    }

    /**
     * Handle scroll events
     */
    handleScroll() {
        this.updateNavigationStyle();
    }

    /**
     * Handle navigation events
     */
    handleNavigation(event) {
        // Custom navigation handling if needed
    }

    /**
     * Utility method to animate elements on scroll
     */
    animateOnScroll() {
        const elements = document.querySelectorAll('[data-animate]');
        
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const animation = element.dataset.animate;
                        element.classList.add(animation, 'animated');
                        animationObserver.unobserve(element);
                    }
                });
            }, {
                threshold: 0.1
            });
            
            elements.forEach(element => {
                animationObserver.observe(element);
            });
        }
    }

    /**
     * Get application status
     */
    isReady() {
        return this.isInitialized;
    }
}

// Initialize application
const app = new Application();

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app.init();
    });
} else {
    app.init();
}

// Export for use in other scripts
window.app = app;

// Additional CSS for enhanced navigation behavior
const additionalStyles = `
    .nav-scrolled {
        background: rgba(255,255,255,0.98);
        backdrop-filter: blur(15px);
        box-shadow: 0 2px 20px rgba(0,0,0,0.1);
    }
    
    .keyboard-navigation *:focus {
        outline: 2px solid var(--primary-orange);
        outline-offset: 2px;
    }
    
    .nav-links a.active {
        color: var(--primary-orange);
        background: rgba(212, 116, 26, 0.1);
    }
    
    img.loaded {
        opacity: 1;
        transition: opacity 0.3s ease;
    }
    
    img[data-src] {
        opacity: 0;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);