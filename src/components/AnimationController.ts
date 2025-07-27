export class AnimationController {
  constructor() {
    this.init();
  }

  private init(): void {
    this.setupIntersectionObserver();
    this.setupStatsAnimation();
  }

  private setupIntersectionObserver(): void {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          target.style.opacity = '1';
          target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Observe elements when DOM is ready
    setTimeout(() => {
      document.querySelectorAll('.activity-card, .culture-card').forEach(card => {
        const element = card as HTMLElement;
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease';
        observer.observe(element);
      });
    }, 100);
  }

  private setupStatsAnimation(): void {
    const animateStats = () => {
      const stats = document.querySelectorAll('.stat-number');
      stats.forEach(stat => {
        const target = stat.textContent || '0';
        const isNumber = target.match(/\d+/);
        if (isNumber) {
          const num = parseInt(isNumber[0]);
          const suffix = target.replace(isNumber[0], '');
          let current = 0;
          const increment = num / 30;
          
          const updateCounter = () => {
            if (current < num) {
              current += increment;
              stat.textContent = Math.floor(current) + suffix;
              requestAnimationFrame(updateCounter);
            } else {
              stat.textContent = target;
            }
          };
          
          updateCounter();
        }
      });
    };

    // Trigger stats animation when about section is visible
    const aboutSection = document.querySelector('.about');
    if (aboutSection) {
      const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      statsObserver.observe(aboutSection);
    }
  }
}