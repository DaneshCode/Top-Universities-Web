const THEME_KEY = 'site-theme-preference';

class ThemeManager {
  constructor() {
    this.themeSwitch = document.querySelector('.theme-switch__checkbox');
    this.init();
  }

  init() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const isDark = savedTheme === 'dark';

    this.themeSwitch.checked = isDark;
    this.applyTheme(isDark);

    this.themeSwitch.addEventListener(
      'change',
      this.debounce((e) => {
        const newTheme = e.target.checked;
        this.applyTheme(newTheme);
        localStorage.setItem(THEME_KEY, newTheme ? 'dark' : 'light');
      }, 300)
    );
  }

  applyTheme(isDark) {
    const root = document.documentElement;
    const bgColor = isDark ? '#353535' : '#e8e8e8';
    const textColor = isDark ? '#ffffff' : '#000000';
    const elements = [
      document.getElementById('result'),
      ...document.querySelectorAll('.pBox'),
      document.querySelector('footer')
    ];

    root.style.setProperty('--color-bg', bgColor);
    root.style.setProperty('--color-text', textColor);
    document.body.style.backgroundColor = bgColor;
    document.body.style.color = textColor;

    requestAnimationFrame(() => {
      elements.forEach(element => {
        if (element) {
          element.style.color = textColor;
          element.style.backgroundColor = isDark ? '#353535' : '#f1f1f1';
        }
      });
    });
  }

  debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
}

const loadImage = (img) => {
  img.src = img.dataset.src;
  img.onload = () => {
    img.classList.add('loaded');
  };
};

const lazyLoadImages = () => {
  const images = document.querySelectorAll('img[loading="lazy"]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadImage(entry.target);
          obs.unobserve(entry.target);
        }
      });
    });
    images.forEach(img => observer.observe(img));
  } else {
    // Fallback for browsers without IntersectionObserver
    images.forEach(img => loadImage(img));
  }
};

// Smooth scroll polyfill
const smoothScrollPolyfill = () => {
  if ('scrollBehavior' in document.documentElement.style) return;
  const originalScrollTo = window.scrollTo;
  window.scrollTo = (x, y) => {
    if (typeof x === 'object') {
      y = x.top;
      x = x.left;
    }
    originalScrollTo({ top: y, left: x, behavior: 'smooth' });
  };
};

document.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();
  lazyLoadImages();
  smoothScrollPolyfill();
  // Attach a click handler for the print button
  const printButton = document.getElementById('printButton');
  if (printButton) {
    printButton.addEventListener('click', () => window.print());
  }
});


