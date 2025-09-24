// Interactive behaviour for the Complexo Maker presentation site

// Smooth scroll helper exposed to global scope so inline handlers can access it
function scrollToSection(id) {
  const target = document.getElementById(id);
  const nav = document.querySelector('.navbar');
  const navHeight = nav ? nav.offsetHeight : 0;
  if (target) {
    const top = target.offsetTop - navHeight - 20;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Mobile navigation toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinksContainer = document.querySelector('.nav-links');
  menuToggle.addEventListener('click', () => {
    navLinksContainer.classList.toggle('open');
  });

  // Smooth scrolling for nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      scrollToSection(targetId);
      // Close mobile nav when a link is clicked
      navLinksContainer.classList.remove('open');
    });
  });

  // Highlight active nav link based on scroll position
  function activateNav() {
    const scrollPos = window.scrollY + 90; // offset accounts for navbar height
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.querySelectorAll('section').forEach(section => {
      if (section.offsetTop <= scrollPos && section.offsetTop + section.offsetHeight > scrollPos) {
        const id = section.getAttribute('id');
        const activeLink = document.querySelector('.nav-link[href="#' + id + '"]');
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', activateNav);
  activateNav();

  // Scroll reveal using IntersectionObserver
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.scroll-reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // Expand/collapse for dimension and phase cards
  document.querySelectorAll('.dimension-card, .phase-card').forEach(card => {
    card.addEventListener('click', () => {
      const container = card.parentElement;
      // Collapse other cards in the same container
      container.querySelectorAll('.card').forEach(other => {
        if (other !== card) other.classList.remove('expanded');
      });
      card.classList.toggle('expanded');
    });
  });

  // Timeline items expand/collapse
  document.querySelectorAll('.timeline-item').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('active');
    });
  });

  // Animate timeline progress on scroll. This function calculates
  // how much of the timeline element is visible and updates the
  // CSS variable `--timeline-progress` accordingly. When the top of
  // the timeline enters the viewport, the progress increases until
  // the entire element has passed. If the timeline is not in view,
  // progress resets to 0%.
  function updateTimelineProgress() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;
    const rect = timeline.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    // When timeline is entirely below the viewport
    if (rect.top > windowHeight) {
      timeline.style.setProperty('--timeline-progress', '0%');
      return;
    }
    // When timeline is entirely above the viewport
    if (rect.bottom < 0) {
      timeline.style.setProperty('--timeline-progress', '100%');
      return;
    }
    const visibleStart = Math.max(rect.top, 0);
    const visibleEnd = Math.min(rect.bottom, windowHeight);
    const visibleHeight = visibleEnd - visibleStart;
    const totalHeight = rect.height;
    // The amount scrolled past the top relative to total height
    const scrolled = Math.max(windowHeight - rect.top, 0);
    const progress = Math.min((scrolled / (totalHeight + windowHeight)) * 100, 100);
    timeline.style.setProperty('--timeline-progress', progress + '%');
  }
  // Update timeline progress when scrolling and on load
  window.addEventListener('scroll', updateTimelineProgress);
  updateTimelineProgress();
});