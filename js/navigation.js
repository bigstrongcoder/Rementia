// Navigation functionality
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');
  const mobileMenuBtn = document.querySelector('.mobile-menu-button');
  const navLinksContainer = document.querySelector('.nav-links');
  const header = document.getElementById('header');
  let lastScrollPosition = 0;

  // Handle navigation link clicks
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Prevent default anchor behavior
      e.preventDefault();

      // Remove active class from all links
      navLinks.forEach(link => link.classList.remove('active'));
      
      // Add active class to clicked link
      link.classList.add('active');
      
      // Get the target section id from href attribute
      const targetId = link.getAttribute('href').substring(1);
      
      // Hide all sections and show the target section
      sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === targetId) {
          section.classList.add('active');
          
          // Update URL without page reload
          history.pushState(null, null, `#${targetId}`);
        }
      });
      
      // Close mobile menu if open
      if (window.innerWidth <= 768) {
        navLinksContainer.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
      }
      
      // Scroll to top of section with offset for header
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });

  // Mobile menu toggle
  mobileMenuBtn.addEventListener('click', () => {
    navLinksContainer.classList.toggle('active');
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
      navLinksContainer.classList.remove('active');
      mobileMenuBtn.classList.remove('active');
    }
  });
  
  // Handle resize events
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navLinksContainer.classList.contains('active')) {
      navLinksContainer.classList.remove('active');
      mobileMenuBtn.classList.remove('active');
    }
  });
  
  // Check URL hash on page load and activate corresponding section
  const checkHash = () => {
    const hash = window.location.hash;
    if (hash) {
      const targetLink = document.querySelector(`.nav-link[href="${hash}"]`);
      if (targetLink) {
        // Trigger click event on the link
        targetLink.click();
      }
    } else {
      // Default to first tab if no hash
      navLinks[0].click();
    }
  };
  
  // Header scroll behavior
  window.addEventListener('scroll', () => {
    const currentScrollPosition = window.scrollY;
    
    if (currentScrollPosition > 50) {
      header.style.boxShadow = 'var(--shadow-md)';
    } else {
      header.style.boxShadow = 'var(--shadow-sm)';
    }
    
    lastScrollPosition = currentScrollPosition;
  });
  
  // Run hash check after DOM is fully loaded
  setTimeout(checkHash, 100);
  
  // Listen for hash changes
  window.addEventListener('hashchange', checkHash);
});