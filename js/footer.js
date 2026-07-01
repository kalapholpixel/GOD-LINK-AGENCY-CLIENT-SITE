(function () {
    const footerEl = document.getElementById('site-footer');
    if (!footerEl) return;

    const ctaBand = document.createElement('section');
    ctaBand.className = 'cta-band reveal';
    ctaBand.innerHTML = `
        <div class="cta-band-inner section-container">
            <div class="cta-band-text">
                <h2>Ready to elevate your brand?</h2>
                <p>Get a ballpark quote in minutes or send us your brief — we respond within 2 hours.</p>
            </div>
            <div class="cta-band-actions">
                <a href="estimator.html" class="btn btn-primary">Get a Quote</a>
                <a href="contact.html" class="btn btn-outline">Contact Us</a>
            </div>
        </div>
    `;
    footerEl.before(ctaBand);

    footerEl.className = 'footer-area';
    footerEl.innerHTML = `
        <div class="footer-container">
            <div class="footer-row">
                <div class="footer-col-brand">
                    <a href="index.html" class="logo-area footer-logo-link" aria-label="KL Studios — Home">
                        <img src="assets/logo.png" alt="KL Studios — Kalaphol and Legacy Studios" class="footer-logo" width="200" height="80">
                    </a>
                    <p class="footer-brand-desc">Premium creative designs, digital assets, and interactive websites built for elite modern brands.</p>
                    <a href="mailto:klstudios.agency@gmail.com" class="footer-email"><i class="fa-solid fa-envelope"></i> klstudios.agency@gmail.com</a>
                </div>
                <div class="footer-col-links">
                    <h4>Navigation</h4>
                    <ul>
                        <li><a href="index.html">Home</a></li>
                        <li><a href="about.html">Why Us</a></li>
                        <li><a href="services.html">Services</a></li>
                        <li><a href="portfolio.html">Our Work</a></li>
                        <li><a href="photography.html">Photography</a></li>
                        <li><a href="estimator.html">Quote Calculator</a></li>
                        <li><a href="contact.html">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-col-services">
                    <h4>Core Services</h4>
                    <ul>
                        <li><a href="services.html">Graphic Design</a></li>
                        <li><a href="photography.html">Legacy Studios Photography</a></li>
                        <li><a href="services.html">Photo &amp; Video Editing</a></li>
                        <li><a href="services.html">Brand Identity</a></li>
                        <li><a href="services.html">Web Development</a></li>
                    </ul>
                </div>
            </div>
            <hr class="footer-divider">
            <div class="footer-bottom">
                <p class="copyright-text">&copy; ${new Date().getFullYear()} KL STUDIOS. All Rights Reserved.</p>
                <div class="footer-socials">
                    <a href="https://instagram.com/KLSTUDIOS.AGENCY" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                    <a href="https://facebook.com/KLSTUDIOS.AGENCY" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i class="fa-brands fa-facebook"></i></a>
                    <a href="https://youtube.com/KLSTUDIOS.AGENCY" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
                </div>
            </div>
        </div>
    `;
})();
