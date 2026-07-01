/* ==========================================================================
   KL STUDIOS - DYNAMIC CLIENT SIDE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    /* --------------------------------------------------------------------------
       1. Neon Interactive Canvas Particles
       -------------------------------------------------------------------------- */
    const canvas = document.getElementById('hero-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 100 };

        const resizeCanvas = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
            initParticles();
        };

        window.addEventListener('resize', resizeCanvas);
        
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        canvas.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 2 + 1;
                this.baseX = x;
                this.baseY = y;
                // Soft gold / silver colors
                this.color = Math.random() > 0.5 ? 'rgba(210, 210, 210, 0.45)' : 'rgba(235, 185, 75, 0.45)';
                this.density = (Math.random() * 30) + 15;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }

            update() {
                // Free floating movement
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off boundaries gently
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

                // Mouse interaction (repulsion)
                if (mouse.x !== null && mouse.y !== null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < mouse.radius) {
                        let force = (mouse.radius - distance) / mouse.radius;
                        let directionX = dx / distance;
                        let directionY = dy / distance;
                        
                        this.x -= directionX * force * 5;
                        this.y -= directionY * force * 5;
                    }
                }
            }
        }

        const initParticles = () => {
            particles = [];
            // Calibrate quantity to width
            const count = Math.floor((canvas.width * canvas.height) / 14000);
            for (let i = 0; i < Math.min(count, 120); i++) {
                particles.push(new Particle(
                    Math.random() * canvas.width,
                    Math.random() * canvas.height
                ));
            }
        };

        const drawLines = () => {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let dx = particles[a].x - particles[b].x;
                    let dy = particles[a].y - particles[b].y;
                    let dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 100) {
                        let alpha = (100 - dist) / 100 * 0.08;
                        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            drawLines();
            requestAnimationFrame(animate);
        };

        resizeCanvas();
        animate();
    }

    /* --------------------------------------------------------------------------
       2. Scroll Spy & Header Shrink
       -------------------------------------------------------------------------- */
    const header = document.getElementById('main-header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const isPhotographyPage = document.body.classList.contains('page-photography');

    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            if (!isPhotographyPage) return;

            let currentSectionId = 'home';
            sections.forEach(sec => {
                const secTop = sec.offsetTop - 120;
                const secHeight = sec.clientHeight;
                if (window.scrollY >= secTop && window.scrollY < secTop + secHeight) {
                    currentSectionId = sec.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (!href || !href.startsWith('#')) return;
                link.classList.remove('active');
                if (href === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    /* --------------------------------------------------------------------------
       3. Mobile Drawer Navigation
       -------------------------------------------------------------------------- */
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle && navMenu) {
        const toggleMenu = () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        };

        mobileToggle.addEventListener('click', toggleMenu);

        // Close drawer when clicking any link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close drawer clicking outside nav container
        document.addEventListener('click', (e) => {
            if (header && !header.contains(e.target) && navMenu.classList.contains('active')) {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    /* --------------------------------------------------------------------------
       4. Portfolio Gallery Filter System
       -------------------------------------------------------------------------- */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterButtons.length && portfolioItems.length) filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                // Apply animate transitions
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    /* --------------------------------------------------------------------------
       5. Lightbox Modal & Carousel
       -------------------------------------------------------------------------- */
    const lightbox = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCat = document.getElementById('lightbox-cap-cat');
    const lightboxTitle = document.getElementById('lightbox-cap-title');
    const lightboxDesc = document.getElementById('lightbox-cap-desc');
    const closeLightboxBtn = document.getElementById('btn-close-lightbox');
    const prevLightboxBtn = document.getElementById('btn-lightbox-prev');
    const nextLightboxBtn = document.getElementById('btn-lightbox-next');
    
    let currentLightboxIndex = 0;
    let activeLightboxItems = []; // Contains DOM elements in current filter view

    const getActiveGalleryItems = () => {
        const activeFilterBtn = document.querySelector('.filter-btn.active');
        const activeFilter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
        return Array.from(portfolioItems).filter(item => {
            return activeFilter === 'all' || item.classList.contains(activeFilter);
        });
    };

    const updateLightboxData = (index) => {
        const item = activeLightboxItems[index];
        const img = item.querySelector('img');
        const overlay = item.querySelector('.portfolio-overlay');
        const cat = overlay.querySelector('.port-category').innerText;
        const title = overlay.querySelector('h4').innerText;
        const desc = overlay.querySelector('p').innerText;

        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCat.innerText = cat;
        lightboxTitle.innerText = title;
        lightboxDesc.innerText = desc;
        currentLightboxIndex = index;
    };

    const openLightbox = (itemElement) => {
        activeLightboxItems = getActiveGalleryItems();
        const itemIndex = activeLightboxItems.indexOf(itemElement);
        
        updateLightboxData(itemIndex);
        
        lightbox.style.display = 'flex';
        lightbox.setAttribute('aria-hidden', 'false');
        setTimeout(() => lightbox.classList.add('active'), 10);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        setTimeout(() => lightbox.style.display = 'none', 300);
        document.body.style.overflow = '';
    };

    const nextLightbox = () => {
        let index = currentLightboxIndex + 1;
        if (index >= activeLightboxItems.length) index = 0;
        updateLightboxData(index);
    };

    const prevLightbox = () => {
        let index = currentLightboxIndex - 1;
        if (index < 0) index = activeLightboxItems.length - 1;
        updateLightboxData(index);
    };

    if (portfolioItems.length && lightbox) {
        portfolioItems.forEach(item => {
            const zoomBtn = item.querySelector('.btn-lightbox');
            if (zoomBtn) {
                zoomBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openLightbox(item);
                });
            }
        });
    }

    if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeLightbox);
    if (nextLightboxBtn) nextLightboxBtn.addEventListener('click', nextLightbox);
    if (prevLightboxBtn) prevLightboxBtn.addEventListener('click', prevLightbox);

    // Close lightbox on click outside the image wrapper
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    // Keyboard bindings for Modal Navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextLightbox();
        if (e.key === 'ArrowLeft') prevLightbox();
    });

    /* --------------------------------------------------------------------------
       6. High-End Custom Quote & Timeline Estimator
       -------------------------------------------------------------------------- */
    const serviceBtns = document.querySelectorAll('.service-select-btn');
    const qtySlider = document.getElementById('qty-slider');
    const qtyValue = document.getElementById('qty-val');
    const speedSlider = document.getElementById('speed-slider');
    const speedValue = document.getElementById('speed-val');
    const costText = document.getElementById('cost-estimate');
    const timelineText = document.getElementById('timeline-estimate');
    const selectedList = document.getElementById('selected-services-list');
    const applyEstimateBtn = document.getElementById('btn-apply-estimate');

    // Estimator Variables
    let selectedServices = {};

    const serviceDetails = {
        graphic: { name: 'Graphic Design', basePrice: 1500, baseTimeline: 3, unit: 'Asset(s)' },
        photo: { name: 'Photo Editing', basePrice: 1200, baseTimeline: 2, unit: 'Photo(s)' },
        video: { name: 'Video Editing', basePrice: 2500, baseTimeline: 4, unit: 'Minute(s)' },
        branding: { name: 'Branding Kit', basePrice: 3500, baseTimeline: 6, unit: 'Asset(s)' },
        web: { name: 'Web Development', basePrice: 6000, baseTimeline: 10, unit: 'Page(s)' },
        portrait: { name: 'Portrait Session', basePrice: 0, baseTimeline: 0, unit: 'Session(s)' },
        event: { name: 'Event / Wedding', basePrice: 0, baseTimeline: 0, unit: 'Session(s)' },
        commercial: { name: 'Commercial / Product', basePrice: 0, baseTimeline: 0, unit: 'Session(s)' },
        editing: { name: 'Photo Editing Only', basePrice: 0, baseTimeline: 0, unit: 'Photo(s)' },
        other: { name: 'Photography Inquiry', basePrice: 0, baseTimeline: 0, unit: 'Session(s)' },
        multiple: { name: 'Multiple Services', basePrice: 0, baseTimeline: 0, unit: 'Item(s)' }
    };

    const formatCurrency = (amount) => {
        return '฿' + amount.toLocaleString('en-US');
    };

    const updateSliderLabels = () => {
        if (!qtySlider || !qtyValue || !speedSlider || !speedValue) return;

        const firstKey = Object.keys(selectedServices)[0];
        const unit = firstKey ? serviceDetails[firstKey].unit : 'Item(s)';
        
        qtyValue.innerText = `${qtySlider.value}x ${unit}`;

        const speeds = [
            { text: 'Standard Delivery', multiplier: 1.0 },
            { text: 'Express Delivery (+35%)', multiplier: 1.35 },
            { text: 'Super Express (+75%)', multiplier: 1.75 }
        ];
        
        const speedIndex = parseInt(speedSlider.value) - 1;
        speedValue.innerText = speeds[speedIndex].text;
    };

    const calculateEstimate = () => {
        if (!costText || !timelineText || !selectedList || !applyEstimateBtn) return;

        const keys = Object.keys(selectedServices);
        
        if (keys.length === 0) {
            costText.innerText = '฿0';
            timelineText.innerText = '-- Days';
            selectedList.innerHTML = '<p class="empty-list-msg">No services selected yet. Click on services to calculate cost!</p>';
            applyEstimateBtn.disabled = true;
            return;
        }

        applyEstimateBtn.disabled = false;
        let baseCostSum = 0;
        let maxTimeline = 0;
        let listHTML = '';

        keys.forEach(key => {
            const detail = serviceDetails[key];
            baseCostSum += detail.basePrice;
            if (detail.baseTimeline > maxTimeline) {
                maxTimeline = detail.baseTimeline;
            }
            
            listHTML += `
                <div class="summary-item">
                    <span class="summary-item-name"><i class="fa-solid fa-circle-notch text-gradient" style="font-size:0.7rem; margin-right: 8px;"></i>${detail.name}</span>
                    <span class="summary-item-price">${formatCurrency(detail.basePrice)}</span>
                </div>
            `;
        });

        selectedList.innerHTML = listHTML;

        // Sliders parameters
        const qty = parseInt(qtySlider.value);
        const speedVal = parseInt(speedSlider.value);
        
        // Quantity multiplier (Bulk Discount: 25% off additional items)
        const qtyFactor = 1 + (qty - 1) * 0.75;
        
        // Speed parameters
        let speedCostFactor = 1.0;
        let speedTimeFactor = 1.0;
        if (speedVal === 2) {
            speedCostFactor = 1.35;
            speedTimeFactor = 1.5; // Divide timeline by 1.5
        } else if (speedVal === 3) {
            speedCostFactor = 1.75;
            speedTimeFactor = 2.5; // Divide timeline by 2.5
        }

        // Final Calculations
        const finalCost = Math.round(baseCostSum * qtyFactor * speedCostFactor);
        
        // Timeline math
        const finalBaseTime = maxTimeline + (qty - 1) * 0.5;
        const finalTimeline = Math.max(1, Math.ceil(finalBaseTime / speedTimeFactor));

        costText.innerText = formatCurrency(finalCost);
        timelineText.innerText = `${finalTimeline} ${finalTimeline === 1 ? 'Day' : 'Days'}`;
    };

    if (serviceBtns.length) serviceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const serviceKey = btn.getAttribute('data-service');
            btn.classList.toggle('selected');

            if (selectedServices[serviceKey]) {
                delete selectedServices[serviceKey];
            } else {
                selectedServices[serviceKey] = true;
            }

            updateSliderLabels();
            calculateEstimate();
        });
    });

    if (qtySlider) {
        qtySlider.addEventListener('input', () => {
            updateSliderLabels();
            calculateEstimate();
        });
    }

    if (speedSlider) {
        speedSlider.addEventListener('input', () => {
            updateSliderLabels();
            calculateEstimate();
        });
    }

    /* --------------------------------------------------------------------------
       7. Estimate pre-fill mapping to Contact Form
       -------------------------------------------------------------------------- */
    const contactForm = document.getElementById('brand-contact-form');
    const calcAlertBox = document.getElementById('calc-alert-box');
    const clearCalcBtn = document.getElementById('btn-clear-calc');
    const formServiceSelect = document.getElementById('form-service-interest');
    const formMessage = document.getElementById('form-message');
    
    const hiddenPrice = document.getElementById('hidden-est-price');
    const hiddenTime = document.getElementById('hidden-est-time');
    const hiddenServices = document.getElementById('hidden-est-services');

    const clearCalculatorAlert = () => {
        if (calcAlertBox) calcAlertBox.style.display = 'none';
        if (hiddenPrice) hiddenPrice.value = '';
        if (hiddenTime) hiddenTime.value = '';
        if (hiddenServices) hiddenServices.value = '';
        if (formServiceSelect) formServiceSelect.value = '';
        if (formMessage) formMessage.value = '';
    };

    const applyEstimateToForm = (keys) => {
        if (!formServiceSelect || !formMessage) return;

        const serviceNames = keys.map(k => serviceDetails[k].name).join(', ');
        const finalCost = costText.innerText;
        const finalTime = timelineText.innerText;
        const qty = qtySlider.value;
        const unit = serviceDetails[keys[0]].unit;
        const speeds = ['Standard Delivery', 'Express Delivery (+35%)', 'Super Express (+75%)'];
        const currentSpeedText = speeds[parseInt(speedSlider.value, 10) - 1];

        if (keys.length === 1) {
            formServiceSelect.value = keys[0];
        } else {
            formServiceSelect.value = 'multiple';
        }

        if (hiddenPrice) hiddenPrice.value = finalCost;
        if (hiddenTime) hiddenTime.value = finalTime;
        if (hiddenServices) hiddenServices.value = serviceNames;

        formMessage.value = `Hello KL Studios team!\n\nI have calculated a project estimate using your interactive calculator. Here are the details of my request:\n- Selected Services: ${serviceNames}\n- Required Quantity: ${qty}x ${unit}\n- Preferred Speed: ${currentSpeedText}\n\nInteractive Ballpark Calculation: ${finalCost} within ${finalTime}.\n\nLooking forward to discussing and finalized the proposal. Let's make it awesome!`;

        if (calcAlertBox) calcAlertBox.style.display = 'flex';
    };

    const restoreEstimateFromStorage = () => {
        if (!contactForm || !formMessage) return;
        const raw = sessionStorage.getItem('kl_estimate');
        if (!raw) return;

        try {
            const data = JSON.parse(raw);
            const keys = data.keys || [];
            if (keys.length === 1) {
                formServiceSelect.value = keys[0];
            } else if (keys.length > 1) {
                formServiceSelect.value = 'multiple';
            }
            if (hiddenPrice) hiddenPrice.value = data.finalCost || '';
            if (hiddenTime) hiddenTime.value = data.finalTime || '';
            if (hiddenServices) hiddenServices.value = data.serviceNames || '';
            formMessage.value = data.message || '';
            if (calcAlertBox) calcAlertBox.style.display = 'flex';
            sessionStorage.removeItem('kl_estimate');
            setTimeout(() => {
                const nameField = document.getElementById('form-name');
                if (nameField) nameField.focus();
            }, 400);
        } catch (err) {
            sessionStorage.removeItem('kl_estimate');
        }
    };

    restoreEstimateFromStorage();

    if (applyEstimateBtn) {
        applyEstimateBtn.addEventListener('click', () => {
            const keys = Object.keys(selectedServices);
            if (keys.length === 0) return;

            if (contactForm && formMessage) {
                applyEstimateToForm(keys);
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => {
                        const nameField = document.getElementById('form-name');
                        if (nameField) nameField.focus();
                    }, 800);
                }
                return;
            }

            const serviceNames = keys.map(k => serviceDetails[k].name).join(', ');
            const finalCost = costText.innerText;
            const finalTime = timelineText.innerText;
            const qty = qtySlider.value;
            const unit = serviceDetails[keys[0]].unit;
            const speeds = ['Standard Delivery', 'Express Delivery (+35%)', 'Super Express (+75%)'];
            const currentSpeedText = speeds[parseInt(speedSlider.value, 10) - 1];
            const message = `Hello KL Studios team!\n\nI have calculated a project estimate using your interactive calculator. Here are the details of my request:\n- Selected Services: ${serviceNames}\n- Required Quantity: ${qty}x ${unit}\n- Preferred Speed: ${currentSpeedText}\n\nInteractive Ballpark Calculation: ${finalCost} within ${finalTime}.\n\nLooking forward to discussing and finalized the proposal. Let's make it awesome!`;

            sessionStorage.setItem('kl_estimate', JSON.stringify({
                keys,
                serviceNames,
                finalCost,
                finalTime,
                message
            }));
            window.location.href = 'contact.html';
        });
    }

    if (clearCalcBtn) {
        clearCalcBtn.addEventListener('click', clearCalculatorAlert);
    }

    /* --------------------------------------------------------------------------
       8. Secure Contact Form Submission (Simulated API Handler)
       -------------------------------------------------------------------------- */
    const formAlert = document.getElementById('form-alert');
    const submitBtn = document.getElementById('form-submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect Form Values
            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const service = formServiceSelect.value;
            const message = formMessage.value.trim();

            if (!name || !email || !service || !message) {
                formAlert.innerText = 'Please complete all required fields correctly before sending.';
                formAlert.className = 'form-alert error';
                return;
            }

            // Spinner animation state
            submitBtn.disabled = true;
            submitBtn.innerHTML = `Sending Proposal <i class="fa-solid fa-spinner fa-spin" style="margin-left: 8px;"></i>`;
            
            // Clear prior status message
            formAlert.style.display = 'none';

            // Simulate high-end backend network lag
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `Send Secure Message <i class="fa-solid fa-paper-plane"></i>`;
                
                // Set success state
                formAlert.innerHTML = `<i class="fa-solid fa-circle-check" style="margin-right: 8px;"></i> Thank you <strong>${name}</strong>! Your inquiry regarding <strong>${serviceDetails[service] ? serviceDetails[service].name : 'your project'}</strong> has been sent securely. We will review details and reply on WhatsApp/Email within <strong>2 hours</strong>.`;
                formAlert.className = 'form-alert success';
                
                // Reset form inputs & estimator triggers
                contactForm.reset();
                clearCalculatorAlert();
                
                if (serviceBtns.length) {
                    serviceBtns.forEach(btn => btn.classList.remove('selected'));
                    selectedServices = {};
                }
                if (qtySlider) qtySlider.value = 1;
                if (speedSlider) speedSlider.value = 1;
                updateSliderLabels();
                calculateEstimate();
                
                // Auto scroll message into center view
                formAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Hide alert after 8 seconds
                setTimeout(() => {
                    formAlert.style.display = 'none';
                }, 8000);

            }, 2000);
        });
    }
});
