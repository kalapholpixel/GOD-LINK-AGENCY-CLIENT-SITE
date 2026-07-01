(function () {
    document.body.classList.add('is-loading');
    window.addEventListener('load', () => {
        document.body.classList.remove('is-loading');
        document.body.classList.add('is-loaded');
    });

    const injectPageHero = () => {
        const title = document.body.dataset.heroTitle;
        if (!title) return;
        const main = document.querySelector('.site-main');
        if (!main || main.querySelector('.page-hero')) return;

        const subtitle = document.body.dataset.heroSubtitle || '';
        const ctaLabel = document.body.dataset.heroCta || '';
        const ctaHref = document.body.dataset.heroHref || 'contact.html';
        const crumbLabel = document.body.dataset.heroBreadcrumb || '';
        let breadcrumbHtml = '';
        if (crumbLabel) {
            breadcrumbHtml = `<nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><span class="breadcrumb-sep" aria-hidden="true">/</span><span aria-current="page">${crumbLabel}</span></nav>`;
        }

        const hero = document.createElement('section');
        hero.className = 'page-hero reveal is-visible';
        hero.setAttribute('aria-label', 'Page introduction');
        hero.innerHTML = `
            <div class="page-hero-bg"></div>
            <div class="page-hero-inner section-container">
                ${breadcrumbHtml}
                <h1 class="page-hero-title">${title}</h1>
                ${subtitle ? `<p class="page-hero-subtitle">${subtitle}</p>` : ''}
                ${ctaLabel ? `<a href="${ctaHref}" class="btn btn-primary">${ctaLabel} <i class="fa-solid fa-arrow-right"></i></a>` : ''}
            </div>
        `;
        main.prepend(hero);
    };

    injectPageHero();

    document.addEventListener('DOMContentLoaded', () => {
        const backToTop = document.createElement('button');
        backToTop.type = 'button';
        backToTop.className = 'back-to-top';
        backToTop.setAttribute('aria-label', 'Back to top');
        backToTop.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
        document.body.appendChild(backToTop);

        const toggleBackToTop = () => {
            backToTop.classList.toggle('visible', window.scrollY > 500);
        };
        window.addEventListener('scroll', toggleBackToTop, { passive: true });
        toggleBackToTop();

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        const revealEls = document.querySelectorAll('.reveal, .reveal-stagger > *');
        if (revealEls.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

            revealEls.forEach(el => observer.observe(el));
        } else {
            revealEls.forEach(el => el.classList.add('is-visible'));
        }

        const navMenu = document.getElementById('nav-menu');
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        if (navMenu && mobileToggle) {
            const lockScroll = (lock) => {
                document.body.style.overflow = lock ? 'hidden' : '';
            };
            const origToggle = mobileToggle.onclick;
            mobileToggle.addEventListener('click', () => {
                setTimeout(() => lockScroll(navMenu.classList.contains('active')), 0);
            });
        }
    });
})();
