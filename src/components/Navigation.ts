export class Navigation {
  private nav: HTMLElement | null;
  private isScrolled: boolean = false;
  
  constructor() {
    this.nav = document.querySelector('.nav');
    if (this.nav) {
      this.init();
    }
  }

  private init(): void {
    this.setupScrollListener();
    this.setupSmoothScrolling();
  }

  private setupScrollListener(): void {
    let ticking = false;
    
    const updateNavbar = () => {
      const shouldBeScrolled = window.scrollY > 50;
      
      if (shouldBeScrolled !== this.isScrolled) {
        this.isScrolled = shouldBeScrolled;
        this.updateNavbarStyles();
      }
      
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    }, { passive: true });
  }

  private updateNavbarStyles(): void {
    if (!this.nav) return;
    
    const styles = this.isScrolled ? {
      background: 'rgba(255,255,255,0.98)',
      boxShadow: '0 2px 20px rgba(0,0,0,0.1)'
    } : {
      background: 'rgba(255,255,255,0.95)',
      boxShadow: 'none'
    };

    Object.assign(this.nav.style, styles);
  }

  private setupSmoothScrolling(): void {
    const links = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href')!);
        
        if (target) {
          const offsetTop = (target as HTMLElement).offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}