(function () {
    const NAV_ITEMS = [
        { key: 'home', label: 'Home', href: 'index.html' },
        { key: 'about', label: 'Why Us', href: 'about.html' },
        { key: 'services', label: 'Services', href: 'services.html' },
        { key: 'portfolio', label: 'Our Work', href: 'portfolio.html' },
        { key: 'photography', label: 'Photography', href: 'photography.html' },
        { key: 'estimator', label: 'Cost Calculator', href: 'estimator.html' },
        { key: 'contact', label: 'Get In Touch', href: 'contact.html', cta: true }
    ];

    const activePage = document.body.dataset.page || 'home';
    const headerEl = document.getElementById('site-header');
    if (!headerEl) return;

    const navItemsHtml = NAV_ITEMS.map(item => {
        const isActive = item.key === activePage;
        const classes = ['nav-link', isActive ? 'active' : '', item.cta ? 'btn-nav' : ''].filter(Boolean).join(' ');
        return `<li><a href="${item.href}" class="${classes}">${item.label}</a></li>`;
    }).join('');

    headerEl.className = 'main-header';
    headerEl.id = 'main-header';
    headerEl.innerHTML = `
        <a href="#main-content" class="skip-link">Skip to main content</a>
        <div class="nav-container">
            <a href="index.html" class="logo-area" id="nav-logo-link" aria-label="KL Studios — Home">
                <img src="assets/logo.png" alt="KL Studios — Kalaphol and Legacy Studios" class="header-logo" id="header-logo" width="180" height="72">
            </a>
            <nav class="nav-menu" id="nav-menu">
                <ul>${navItemsHtml}</ul>
            </nav>
            <button class="mobile-menu-toggle" id="mobile-menu-toggle" aria-label="Toggle Navigation Menu">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </button>
        </div>
    `;
})();
