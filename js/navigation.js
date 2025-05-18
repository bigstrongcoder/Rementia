// Navigation functionality with GSAP animations
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LocomotiveScroll from 'locomotive-scroll';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // Initialize smooth scroll
  const scroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    multiplier: 1,
    lerp: 0.1
  });

  // Update ScrollTrigger on scroll using the correct event listener method
  scroll.scroll.on('scroll', () => {
    ScrollTrigger.update();
  });

  // Navigation elements
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');
  const mobileMenuBtn = document.querySelector('.mobile-menu-button');
  const navLinksContainer = document.querySelector('.nav-links');
  const header = document.getElementById('header');

  // GSAP animations for section transitions
  const sectionAnimation = gsap.timeline({ paused: true });
  
  sections.forEach((section, index) => {
    sectionAnimation.fromTo(section,
      {
        opacity: 0,
        y: 50
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out'
      },
      index * 0.1
    );
  });

  // Handle navigation link clicks
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      navLinks.forEach(link => link.classList.remove('active'));
      link.classList.add('active');

      const targetId = link.getAttribute('href').substring(1);

      sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === targetId) {
          section.classList.add('active');
          history.pushState(null, null, `#${targetId}`);
          
          // Animate section transition
          gsap.fromTo(section,
            {
              opacity: 0,
              y: 20
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: 'power2.out'
            }
          );
        }
      });

      // Close mobile menu
      if (window.innerWidth <= 768) {
        gsap.to(navLinksContainer, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.inOut',
          onComplete: () => {
            navLinksContainer.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
          }
        });
      }

      // Smooth scroll to section using the correct scrollTo method
      scroll.scrollTo(document.querySelector(`#${targetId}`), {
        offset: -100,
        duration: 1000,
        easing: [0.25, 0.00, 0.35, 1.00]
      });
    });
  });

  // Mobile menu toggle with GSAP animation
  mobileMenuBtn.addEventListener('click', () => {
    const isActive = navLinksContainer.classList.contains('active');
    
    if (!isActive) {
      navLinksContainer.classList.add('active');
      gsap.fromTo(navLinksContainer,
        {
          height: 0,
          opacity: 0
        },
        {
          height: 'auto',
          opacity: 1,
          duration: 0.3,
          ease: 'power2.inOut'
        }
      );
    } else {
      gsap.to(navLinksContainer, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          navLinksContainer.classList.remove('active');
        }
      });
    }
    
    mobileMenuBtn.classList.toggle('active');
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (
      window.innerWidth <= 768 &&
      !e.target.closest('nav') &&
      !e.target.closest('.mobile-menu-button') &&
      navLinksContainer.classList.contains('active')
    ) {
      gsap.to(navLinksContainer, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          navLinksContainer.classList.remove('active');
          mobileMenuBtn.classList.remove('active');
        }
      });
    }
  });

  // Handle resize events
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (window.innerWidth > 768 && navLinksContainer.classList.contains('active')) {
        navLinksContainer.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        navLinksContainer.style.height = '';
        navLinksContainer.style.opacity = '';
      }
      scroll.update();
    }, 250);
  });

  // Header scroll behavior with GSAP
  ScrollTrigger.create({
    start: 'top -50',
    end: 99999,
    toggleClass: {
      className: 'header-scrolled',
      targets: header
    }
  });

  // Check URL hash on page load
  const checkHash = () => {
    const hash = window.location.hash;
    if (hash) {
      const targetLink = document.querySelector(`.nav-link[href="${hash}"]`);
      if (targetLink) {
        setTimeout(() => targetLink.click(), 100);
      }
    } else {
      navLinks[0].click();
    }
  };

  // Initialize page
  checkHash();
  window.addEventListener('hashchange', checkHash);
  
  // Trigger initial animations
  sectionAnimation.play();
});