/**
 * UK Hair Cut - Premium Men's Hair Salon & Barber Shop
 * Script File (Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all functions
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initServiceTabs();
  initReviewsSlider();
  initBookingForm();
  updateLiveBusinessStatus();
});

/* ==========================================================================
   1. NAVIGATION BAR EFFECTS
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  
  // Smooth Sticky Navbar on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Highlight Active Link on Scroll
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120; // Offset for header
    
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
  
  // Smooth Scroll for Navigation Links
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        // Close mobile menu if open
        const navList = document.querySelector('.nav-links');
        const menuToggle = document.querySelector('.menu-toggle');
        navList.classList.remove('active');
        menuToggle.classList.remove('active');
        
        const headerOffset = 80;
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================================================
   2. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }
}

/* ==========================================================================
   3. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          // Once animated, no need to track it further
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport completely
    });
    
    reveals.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    reveals.forEach(el => el.classList.add('reveal-active'));
  }
}

/* ==========================================================================
   4. TABBED GROOMING MENU
   ========================================================================== */
function initServiceTabs() {
  const tabButtons = document.querySelectorAll('.services-tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');
  
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all tabs
      tabButtons.forEach(b => b.classList.remove('active'));
      // Add active to current
      btn.classList.add('active');
      
      const category = btn.getAttribute('data-tab');
      const servicesContainer = document.querySelector('.services-grid');
      
      // Fade transition effect
      servicesContainer.style.opacity = '0';
      
      setTimeout(() => {
        serviceCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          if (category === 'all' || cardCategory === category) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
        
        servicesContainer.style.opacity = '1';
      }, 200);
    });
  });
}

/* ==========================================================================
   5. CUSTOMER TESTIMONIALS SLIDER
   ========================================================================== */
function initReviewsSlider() {
  const track = document.querySelector('.review-track');
  const slides = document.querySelectorAll('.review-slide');
  const nextBtn = document.querySelector('.review-ctrl-btn.next');
  const prevBtn = document.querySelector('.review-ctrl-btn.prev');
  const dotsContainer = document.querySelector('.review-dots');
  
  if (!track || slides.length === 0) return;
  
  let currentIndex = 0;
  
  // Create indicators
  slides.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.classList.add('review-dot');
    if (idx === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(idx));
    dotsContainer.appendChild(dot);
  });
  
  const dots = document.querySelectorAll('.review-dot');
  
  function updateSlider() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Update active dot
    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
  
  function goToSlide(index) {
    currentIndex = index;
    updateSlider();
  }
  
  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
  }
  
  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlider();
  }
  
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);
  
  // Autoplay
  let autoplay = setInterval(nextSlide, 7000);
  
  // Pause autoplay on interaction
  const sliderContainer = document.querySelector('.reviews-container');
  sliderContainer.addEventListener('mouseenter', () => clearInterval(autoplay));
  sliderContainer.addEventListener('mouseleave', () => {
    clearInterval(autoplay);
    autoplay = setInterval(nextSlide, 7000);
  });
}

/* ==========================================================================
   6. PREMIUM APPOINTMENT BOOKING SYSTEM
   ========================================================================== */
function initBookingForm() {
  const bookingForm = document.getElementById('appointmentForm');
  const toastOverlay = document.getElementById('toastOverlay');
  const closeToast = document.getElementById('closeToast');
  const serviceSelect = document.getElementById('bookingService');
  
  // Handlers to book from a specific card directly
  const bookButtons = document.querySelectorAll('.service-book-btn');
  bookButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const card = this.closest('.service-card');
      const title = card.querySelector('.service-title').textContent.trim();
      
      // Select appropriate service in select dropdown
      if (serviceSelect) {
        for (let option of serviceSelect.options) {
          if (option.text.toLowerCase().includes(title.toLowerCase())) {
            serviceSelect.value = option.value;
            break;
          }
        }
      }
      
      // Scroll smoothly to contact/booking form section
      const bookingSection = document.getElementById('contact');
      if (bookingSection) {
        const headerOffset = 80;
        const elementPosition = bookingSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Perform validation
      const name = document.getElementById('bookingName').value.trim();
      const phone = document.getElementById('bookingPhone').value.trim();
      const service = document.getElementById('bookingService').value;
      const date = document.getElementById('bookingDate').value;
      const time = document.getElementById('bookingTime').value;
      
      if (!name || !phone || !service || !date || !time) {
        alert('Please fill in all required fields to secure your appointment.');
        return;
      }
      
      // Perfect confirmation message
      const formattedDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      });
      
      const confirmationMsg = document.getElementById('confirmationDetails');
      if (confirmationMsg) {
        confirmationMsg.innerHTML = `
          Dear <strong>${name}</strong>, your premium styling experience for 
          <strong>${service.replace('-', ' ')}</strong> is provisionally held on 
          <strong>${formattedDate}</strong> at <strong>${time}</strong>. <br><br>
          We are sending a confirmation request to our barber lounge team now.
        `;
      }
      
      // Show success modal overlay
      toastOverlay.classList.add('active');
      
      // Prepare WhatsApp booking text
      const waText = `Hello UK Hair Cut, I would like to book an appointment.\n\n` +
                     `Name: ${name}\n` +
                     `Phone: ${phone}\n` +
                     `Service: ${service.replace('-', ' ')}\n` +
                     `Date: ${formattedDate}\n` +
                     `Time: ${time}`;
      
      // Setup redirection to WhatsApp on successful modal button click
      const sendWhatsAppBtn = document.getElementById('sendWhatsAppBtn');
      if (sendWhatsAppBtn) {
        sendWhatsAppBtn.onclick = function() {
          const waUrl = `https://wa.me/923123845594?text=${encodeURIComponent(waText)}`;
          window.open(waUrl, '_blank');
          toastOverlay.classList.remove('active');
          bookingForm.reset();
        };
      }
    });
  }
  
  if (closeToast && toastOverlay) {
    closeToast.addEventListener('click', () => {
      toastOverlay.classList.remove('active');
      if (bookingForm) bookingForm.reset();
    });
    
    // Close modal when clicking outside
    toastOverlay.addEventListener('click', (e) => {
      if (e.target === toastOverlay) {
        toastOverlay.classList.remove('active');
        if (bookingForm) bookingForm.reset();
      }
    });
  }
}

/* ==========================================================================
   7. LIVE STATUS INDICATOR (Current Time awareness)
   ========================================================================== */
function updateLiveBusinessStatus() {
  const statusBadge = document.getElementById('liveStatus');
  if (!statusBadge) return;
  
  // Salon Business hours: 11:00 AM to 10:00 PM (11:00 to 22:00) PKT
  // Pakistan is UTC+5. Let's find Pakistan's current hour.
  const nowUtc = new Date();
  
  // Calculate Pakistan Time (UTC + 5 hours)
  const pktTime = new Date(nowUtc.getTime() + (5 * 60 * 60 * 1000));
  const pktDay = pktTime.getUTCDay(); // 0 = Sunday, 1 = Monday, etc.
  const pktHour = pktTime.getUTCHours();
  const pktMinute = pktTime.getUTCMinutes();
  
  const currentMinutesInDay = (pktHour * 60) + pktMinute;
  const openMinutes = 11 * 60; // 11:00 AM
  const closeMinutes = 22 * 60; // 10:00 PM
  
  const isOpen = (currentMinutesInDay >= openMinutes && currentMinutesInDay < closeMinutes);
  
  if (isOpen) {
    statusBadge.textContent = 'Open Now';
    statusBadge.className = 'status-badge';
  } else {
    statusBadge.textContent = 'Closed Now';
    statusBadge.className = 'status-badge closed';
  }
}
