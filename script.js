document.addEventListener("DOMContentLoaded", () => {
    
    /* ==========================================================================
       CINEMATIC PRELOADER
       ========================================================================== */
    const preloader = document.getElementById("preloader");
    const loadingBar = document.querySelector(".loading-bar");
    const percentText = document.querySelector(".loading-percentage");
    let progress = 0;

    const loaderInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loaderInterval);
            
            // GSAP slide out preloader gracefully
            gsap.to(preloader, {
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
                onComplete: () => {
                    preloader.classList.add("hidden");
                    // Trigger hero animations after loading
                    animateHero();
                }
            });
        }
        loadingBar.style.width = `${progress}%`;
        percentText.innerText = `${progress}%`;
    }, 80);

    /* ==========================================================================
       SMOOTH SCROLLING (Lenis) & GSAP INTEGRATION
       ========================================================================== */
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Synchronize ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    /* ==========================================================================
       CUSTOM ANIMATED CURSOR
       ========================================================================== */
    const cursor = document.querySelector(".custom-cursor");
    const cursorDot = document.querySelector(".custom-cursor-dot");
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Immediate position for the tiny dot
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    // Lagged frame movement for premium outer circle
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.15;
        cursorY += dy * 0.15;
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Resize outer cursor circle on interactive links
    const links = document.querySelectorAll("a, button, input, textarea, .select-plan");
    links.forEach(link => {
        link.addEventListener("mouseenter", () => cursor.classList.add("active"));
        link.addEventListener("mouseleave", () => cursor.classList.remove("active"));
    });

    /* ==========================================================================
       SCROLL PROGRESS BAR
       ========================================================================== */
    window.addEventListener("scroll", () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById("scroll-progress").style.width = scrolled + "%";
    });

    /* ==========================================================================
       DYNAMIC NAVBAR SCROLLED STATE
       ========================================================================== */
    const header = document.querySelector(".main-header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    /* ==========================================================================
       RESPONSIVE MOBILE MENU
       ========================================================================== */
    const mobileToggle = document.querySelector(".mobile-toggle");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    mobileToggle.addEventListener("click", () => {
        navMenu.classList.toggle("open");
        mobileToggle.classList.toggle("active");
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("open");
            mobileToggle.classList.remove("active");
        });
    });

    /* ==========================================================================
       GSAP SCROLL TRIGGER ANIMATIONS & COUNTERS
       ========================================================================== */
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance animations
    function animateHero() {
        gsap.from(".hero-tagline", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" });
        gsap.from(".hero-title", { y: 40, opacity: 0, duration: 1, delay: 0.2, ease: "power3.out" });
        gsap.from(".hero-subtitle", { y: 30, opacity: 0, duration: 0.8, delay: 0.4, ease: "power3.out" });
        gsap.from(".hero-buttons", { y: 30, opacity: 0, duration: 0.8, delay: 0.6, ease: "power3.out" });
    }

    // Scroll trigger reveals for section headers
    gsap.utils.toArray(".section-header").forEach(header => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    });

    // Scroll Trigger statistics counter
    const statCards = document.querySelector(".about-stats-grid");
    if(statCards) {
        gsap.from(statCards.querySelectorAll(".stat-card"), {
            scrollTrigger: {
                trigger: statCards,
                start: "top 85%"
            },
            y: 50,
            opacity: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: "power2.out",
            onComplete: () => {
                const statNumbers = document.querySelectorAll(".stat-number");
                statNumbers.forEach(num => {
                    const target = parseInt(num.getAttribute("data-target"));
                    let count = 0;
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16);
                    
                    const counter = setInterval(() => {
                        count += increment;
                        if (count >= target) {
                            num.innerText = target + (target === 15 ? "" : "+");
                            clearInterval(counter);
                        } else {
                            num.innerText = Math.floor(count);
                        }
                    }, 16);
                });
            }
        });
    }

    // Services card grid stagger entry
    const servicesGrid = document.querySelector(".services-grid");
    if (servicesGrid) {
        gsap.from(servicesGrid.children, {
            scrollTrigger: {
                trigger: servicesGrid,
                start: "top 85%"
            },
            y: 50,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: "power2.out"
        });
    }

    /* ==========================================================================
       VANILLA TILT.JS INITIALIZATION (GLASS CARDS)
       ========================================================================== */
    const tiltElements = document.querySelectorAll("[data-tilt]");
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(Array.from(tiltElements), {
            max: 12,
            speed: 400,
            glare: true,
            "max-glare": 0.15,
            perspective: 800
        });
    }

    /* ==========================================================================
       SWIPER SLIDER INITIALIZATIONS
       ========================================================================== */
    // Transformation Gallery Slider
    new Swiper('.transformation-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
            },
            1100: {
                slidesPerView: 3,
            }
        }
    });

    // Testimonials Slider
    new Swiper('.testimonial-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            900: {
                slidesPerView: 2,
            }
        }
    });

    /* ==========================================================================
       BMI CALCULATOR LOGIC ENGINE
       ========================================================================== */
    const calculateBtn = document.getElementById("calculate-bmi-btn");
    const heightInput = document.getElementById("bmi-height");
    const weightInput = document.getElementById("bmi-weight");
    const resultBox = document.getElementById("bmi-results-display");
    const resultValue = document.getElementById("bmi-value");
    const resultCategory = document.getElementById("bmi-category");

    calculateBtn.addEventListener("click", () => {
        const height = parseFloat(heightInput.value);
        const weight = parseFloat(weightInput.value);

        if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
            alert("SYSTEM WARNING: Please enter valid metric heights and weights.");
            return;
        }

        // Formula: weight (kg) / [height (m)]^2
        const bmiValue = (weight / Math.pow((height / 100), 2)).toFixed(1);
        resultValue.innerText = bmiValue;

        let category = "";
        let color = "";

        if (bmiValue < 18.5) {
            category = "UNDERWEIGHT";
            color = "#00F5FF"; // Electric blue
        } else if (bmiValue >= 18.5 && bmiValue <= 24.9) {
            category = "HEALTHY SYSTEM";
            color = "#2ECC71"; // Safe Green
        } else if (bmiValue >= 25 && bmiValue <= 29.9) {
            category = "OVERWEIGHT";
            color = "#F39C12"; // Orange
        } else {
            category = "OBESE CATEGORY";
            color = "#FF2E63"; // Neon Red
        }

        resultCategory.innerText = category;
        resultCategory.style.color = color;
        resultValue.style.color = color;

        // Display results
        resultBox.classList.remove("hidden");
    });

    /* ==========================================================================
       CONTACT FORM TRANSMISSION (FAKE ENDPOINT)
       ========================================================================== */
    const contactForm = document.getElementById("iron-pulse-contact-form");
    const successModal = document.getElementById("success-modal");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const modalResponseText = document.getElementById("modal-response-text");

    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Grab inputs
        const name = document.getElementById("contact-name").value;
        const email = document.getElementById("contact-email").value;

        // Trigger loading text on button
        const submitBtn = contactForm.querySelector("button[type='submit']");
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `CONNECTING... <i class="fa-solid fa-sync fa-spin"></i>`;
        submitBtn.disabled = true;

        setTimeout(() => {
            // Revert button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Show custom glass modal
            modalResponseText.innerHTML = `Welcome to the grid, <strong>${name.toUpperCase()}</strong>. Your digital request profile has been synchronized. A physical training advisor will contact you at <strong>${email.toLowerCase()}</strong>.`;
            successModal.classList.remove("hidden");
            
            // Reset form
            contactForm.reset();
        }, 1500);
    });

    // Close modal handle
    closeModalBtn.addEventListener("click", () => {
        successModal.classList.add("hidden");
    });

    // Select Access Plan Quick Sync
    const planButtons = document.querySelectorAll(".select-plan");
    planButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const plan = btn.getAttribute("data-plan");
            modalResponseText.innerHTML = `ACCESS AUTHORIZED: Initializing <strong>${plan.toUpperCase()}</strong> setup program. Your membership configuration file has been written to system caches. Access code active.`;
            successModal.classList.remove("hidden");
        });
    });

    // Close Modal on overlay click
    successModal.addEventListener("click", (e) => {
        if(e.target === successModal) {
            successModal.classList.add("hidden");
        }
    });
});