// IIITB COMET Foundation Website - JavaScript

// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Sticky Header on Scroll
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Animated Counter for Stats
const animateCounter = (element) => {

    const rawTarget = element.getAttribute('data-target');
    const target = parseInt(rawTarget); // extract number
    const suffix = rawTarget.replace(/[0-9]/g, ''); // extract + or %

    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += increment;

        if (current < target) {
            element.textContent = Math.floor(current) + suffix;
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + suffix;
        }
    };

    updateCounter();
};

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animate counters
            if (entry.target.classList.contains('stat-number')) {
                animateCounter(entry.target);
            }
            
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all counter elements
document.querySelectorAll('.stat-number').forEach(counter => {
    observer.observe(counter);
});

// Observe cards for stagger animation
document.querySelectorAll('.focus-card, .module-card, .step-card, .testimonial-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    cardObserver.observe(card);
});

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scrollTop');

if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        hero.style.opacity = 1 - scrolled / 800;
    }
});

// Highlight active section in navigation
const sections = document.querySelectorAll('section[id]');

const highlightNavigation = () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 200;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.add('active');
        } else {
            document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.remove('active');
        }
    });
};

window.addEventListener('scroll', highlightNavigation);

// Details/Summary Toggle Icons
document.querySelectorAll('details').forEach(details => {
    details.addEventListener('toggle', () => {
        const icon = details.querySelector('.toggle-icon');
        if (icon) {
            if (details.open) {
                icon.style.transform = 'rotate(180deg)';
            } else {
                icon.style.transform = 'rotate(0deg)';
            }
        }
    });
});

// Console welcome message
console.log('%c Welcome to IIITB COMET Foundation ', 'background: #2E60A9; color: white; font-size: 20px; padding: 10px;');
console.log('%c Future Wireless Communications Program ', 'background: #FFCC00; color: #1A202C; font-size: 14px; padding: 5px;');

// Initialize everything on DOM load
document.addEventListener('DOMContentLoaded', () => {
    console.log('IIITB COMET Website initialized successfully!');
    
    // Add fade-in animation to page
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Performance optimization: Debounce scroll events
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Apply debounce to scroll handlers
window.addEventListener('scroll', debounce(() => {
    // Scroll-dependent code
}, 10));

// ===== Batch Testimonial Slider (3 after 3) =====
document.addEventListener("DOMContentLoaded", function () {

    const track = document.querySelector(".testimonial-track");
    const slides = document.querySelectorAll(".testimonial-card");

    if (!track || slides.length === 0) return;

    let index = 0;

    function getSlidesPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    function moveSlides() {
        const slidesPerView = getSlidesPerView();
        const totalSlides = slides.length;

        index += slidesPerView;

        if (index >= totalSlides) {
            index = 0;
        }

        const slideWidth = slides[0].offsetWidth + 32; // card width + margin
        track.style.transform = `translateX(-${index * slideWidth}px)`;
    }

    setInterval(moveSlides, 3000);

});

// PHOTO GALLERY (About Page)
document.addEventListener('DOMContentLoaded', function() {
    
    // Check if gallery exists on page
    const gallerySlides = document.querySelectorAll('.gallery-slide');
    if (gallerySlides.length === 0) return; // Exit if no gallery

    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const currentSlideSpan = document.querySelector('.current-slide');
    const totalSlidesSpan = document.querySelector('.total-slides');

    let currentIndex = 0;
    const totalSlides = gallerySlides.length;
    let autoplayInterval;

    // Update total slides display
    if (totalSlidesSpan) {
        totalSlidesSpan.textContent = totalSlides;
    }

    // Show specific slide
    function showSlide(index) {
        // Wrap around
        if (index >= totalSlides) index = 0;
        if (index < 0) index = totalSlides - 1;
        
        currentIndex = index;

        // Update slides
        gallerySlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentIndex);
        });

        // Update thumbnails
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === currentIndex);
        });

        // Update progress
        if (currentSlideSpan) {
            currentSlideSpan.textContent = currentIndex + 1;
        }

        // Reset autoplay
        resetAutoplay();
    }

    // Next slide
    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    // Previous slide
    function prevSlide() {
        showSlide(currentIndex - 1);
    }

    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }

    // Thumbnail clicks
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            showSlide(index);
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

    // Autoplay functionality
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    // Pause on hover
    const galleryMain = document.querySelector('.gallery-main');
    if (galleryMain) {
        galleryMain.addEventListener('mouseenter', stopAutoplay);
        galleryMain.addEventListener('mouseleave', startAutoplay);
    }

    // Start autoplay on page load
    startAutoplay();

    // Touch/Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    if (galleryMain) {
        galleryMain.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        galleryMain.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            nextSlide(); // Swipe left
        }
        if (touchEndX > touchStartX + swipeThreshold) {
            prevSlide(); // Swipe right
        }
    }

});

// 3. LAZY LOADING IMAGE FADE-IN
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
                if (img.complete) {
                    img.classList.add('loaded');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    lazyImages.forEach(img => imageObserver.observe(img));
});

// 6. FORM FOCUS ENHANCEMENTS
document.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('focus', function() {
        this.parentElement?.classList.add('field-focused');
    });
    
    field.addEventListener('blur', function() {
        this.parentElement?.classList.remove('field-focused');
    });
});

// 7. SMOOTH SCROLL ENHANCEMENTS
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const headerHeight = document.getElementById('header')?.offsetHeight || 0;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// 4x4 GRID GALLERY WITH LIGHTBOX
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Check if gallery exists
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length === 0) return;
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxCurrent = document.getElementById('lightboxCurrent');
    const lightboxTotal = document.getElementById('lightboxTotal');
    
    let currentIndex = 0;
    const totalImages = galleryItems.length;
    
    // Set total count
    if (lightboxTotal) {
        lightboxTotal.textContent = totalImages;
    }
    
    // Create array of image data
    const images = Array.from(galleryItems).map(item => {
        const img = item.querySelector('img');
        return {
            src: img.src,
            alt: img.alt
        };
    });
    
    // Open lightbox
    function openLightbox(index) {
        currentIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Update lightbox image
    function updateLightboxImage() {
        if (!images[currentIndex]) return;
        
        lightboxImg.src = images[currentIndex].src;
        lightboxImg.alt = images[currentIndex].alt;
        lightboxCaption.textContent = images[currentIndex].alt;
        lightboxCurrent.textContent = currentIndex + 1;
        
        // Add fade animation
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.style.opacity = '1';
        }, 50);
    }
    
    // Navigate to next image
    function nextImage() {
        currentIndex = (currentIndex + 1) % totalImages;
        updateLightboxImage();
    }
    
    // Navigate to previous image
    function prevImage() {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        updateLightboxImage();
    }
    
    // Event Listeners
    
    // Click on gallery items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            openLightbox(index);
        });
        
        // Keyboard accessibility
        item.setAttribute('tabindex', '0');
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
            }
        });
    });
    
    // Close button
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    // Navigation buttons
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', prevImage);
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', nextImage);
    }
    
    // Click outside image to close
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowRight':
                nextImage();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
        }
    });
    
    // Touch/Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchEndX < touchStartX - swipeThreshold) {
            nextImage(); // Swipe left
        }
        
        if (touchEndX > touchStartX + swipeThreshold) {
            prevImage(); // Swipe right
        }
    }
    
    // Preload adjacent images for smooth navigation
    function preloadImages() {
        const nextIndex = (currentIndex + 1) % totalImages;
        const prevIndex = (currentIndex - 1 + totalImages) % totalImages;
        
        [nextIndex, prevIndex].forEach(index => {
            const img = new Image();
            img.src = images[index].src;
        });
    }
    
    // Call preload when lightbox opens or image changes
    lightbox.addEventListener('transitionend', () => {
        if (lightbox.classList.contains('active')) {
            preloadImages();
        }
    });
    
    // Smooth image transition
    lightboxImg.style.transition = 'opacity 0.3s ease';
    
    console.log('Gallery lightbox initialized with', totalImages, 'images');
});