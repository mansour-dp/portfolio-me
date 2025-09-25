// Fonction pour le menu mobile moderne
function toggleMenu() {
  const mobileMenu = document.getElementById("mobileMenu");
  mobileMenu.classList.toggle("open");
}

// Initialisation des animations au défilement (AOS) - Optimisé
document.addEventListener("DOMContentLoaded", function () {
  // Détection des capacités de l'appareil
  const isLowEndDevice = navigator.hardwareConcurrency <= 2 || navigator.deviceMemory <= 2;
  const isMobile = window.innerWidth < 768;
  
  AOS.init({
    duration: isMobile ? 600 : 1000, // Durée réduite sur mobile
    once: true, // Les animations ne se jouent qu'une fois
    mirror: false, // Ne pas rejouer les animations en remontant
    offset: isMobile ? 50 : 120, // Déclencher plus tôt sur mobile
    disable: function () {
      // Désactiver sur les appareils peu performants ou très petits écrans
      return isLowEndDevice || window.innerWidth < 480;
    },
  });

  // Ajout d'un gestionnaire pour l'orientation
  window.addEventListener("orientationchange", function () {
    // Forcer le rafraîchissement de la mise en page après changement d'orientation
    setTimeout(function () {
      AOS.refresh();
      window.scrollBy(0, 1);
      window.scrollBy(0, -1);
    }, 300);
  });

  // Gestion du redimensionnement de fenêtre
  window.addEventListener("resize", handleResize);

  // Vérification initiale de la taille d'écran
  handleResize();
});

// Gestion de la taille d'écran - Optimisée
function handleResize() {
  // Ajuster la hauteur pour les appareils mobiles (éviter les problèmes avec la barre d'adresse)
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
  
  // Réajuster AOS si nécessaire
  if (typeof AOS !== 'undefined') {
    AOS.refresh();
  }
  
  // Optimisation pour les changements d'orientation
  const isMobile = window.innerWidth < 768;
  const isLandscape = window.innerWidth > window.innerHeight;
  
  if (isMobile && isLandscape) {
    document.body.classList.add('mobile-landscape');
  } else {
    document.body.classList.remove('mobile-landscape');
  }
  
  // Ajustement dynamique de la grille des projets
  const projectsContainer = document.querySelector('.projects-container');
  if (projectsContainer) {
    if (window.innerWidth < 480) {
      projectsContainer.style.gridTemplateColumns = '1fr';
    } else if (window.innerWidth < 768) {
      projectsContainer.style.gridTemplateColumns = '1fr';
    } else if (window.innerWidth < 1024) {
      projectsContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
    } else {
      projectsContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(320px, 1fr))';
    }
  }
}

// Navigation moderne - gestion des clics et scroll
document.addEventListener("DOMContentLoaded", function () {
  const navButtons = document.querySelectorAll(".nav-button");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
  const sections = document.querySelectorAll("section");

  // Gestion des clics sur les boutons de navigation
  navButtons.forEach(button => {
    button.addEventListener("click", function () {
      const target = this.getAttribute("data-target");
      const targetSection = document.querySelector(target);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Navigation active lors du défilement
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute("id");
      }
    });

    // Mise à jour des boutons desktop
    navButtons.forEach((button) => {
      button.classList.remove("active");
      const target = button.getAttribute("data-target");
      if (target === `#${current}`) {
        button.classList.add("active");
      }
    });
  });
});

// Animation de texte dynamique (effet machine à écrire)
class TypeWriter {
  constructor(txtElement, words, wait = 3000) {
    this.txtElement = txtElement;
    this.words = words;
    this.txt = "";
    this.wordIndex = 0;
    this.wait = parseInt(wait, 10);
    this.type();
    this.isDeleting = false;
  }

  type() {
    const current = this.wordIndex % this.words.length;
    const fullTxt = this.words[current];

    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

    let typeSpeed = 100;

    if (this.isDeleting) {
      typeSpeed /= 2;
    }

    if (!this.isDeleting && this.txt === fullTxt) {
      typeSpeed = this.wait;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === "") {
      this.isDeleting = false;
      this.wordIndex++;
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// Initialisation de l'animation d'écriture
document.addEventListener("DOMContentLoaded", function () {
  const txtElement = document.querySelector(".dynamic-text");
  if (txtElement) {
    const words = JSON.parse(txtElement.getAttribute("data-type"));
    const wait = txtElement.getAttribute("data-period");
    new TypeWriter(txtElement, words, wait);
  }
});

// Variables globales pour le thème
let themeIcons = [];

// Fonction pour mettre à jour le bouton mobile
function updateMobileThemeButton(theme) {
  const mobileThemeText = document.querySelector('.mobile-theme-text');
  if (mobileThemeText) {
    if (theme === "dark") {
      mobileThemeText.textContent = "Mode clair";
    } else {
      mobileThemeText.textContent = "Mode sombre";
    }
  }
}

// Fonction pour activer le mode sombre
function setDarkMode() {
  document.body.setAttribute("theme", "dark");
  localStorage.setItem("theme", "dark");

  themeIcons.forEach((icon) => {
    if (icon.hasAttribute("src-dark")) {
      icon.src = icon.getAttribute("src-dark");
    }
  });

  // Mettre à jour le texte du bouton mobile
  updateMobileThemeButton("dark");
}

// Fonction pour activer le mode clair
function setLightMode() {
  document.body.removeAttribute("theme");
  localStorage.setItem("theme", "light");

  themeIcons.forEach((icon) => {
    if (icon.hasAttribute("src-light")) {
      icon.src = icon.getAttribute("src-light");
    }
  });

  // Mettre à jour le texte du bouton mobile
  updateMobileThemeButton("light");
}

// Fonction pour basculer entre les thèmes (GLOBALE)
function setTheme() {
  let currentTheme = document.body.getAttribute("theme");
  if (currentTheme === "dark") {
    setLightMode();
  } else {
    setDarkMode();
  }
}

// Fonction pour initialiser le thème
function initializeTheme() {
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme === "dark") {
    setDarkMode();
  } else {
    setLightMode(); // Mode par défaut est clair
  }
}

// Gestion du mode sombre/clair
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("modeToggle");
  themeIcons = document.querySelectorAll(".icon");

  // Initialiser le thème au chargement
  initializeTheme();

  // Gérer le clic sur le bouton de thème desktop
  if (btn) {
    btn.addEventListener("click", function () {
      setTheme();
    });
  }
});

// Défilement fluide pour les ancres
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetElement = document.querySelector(this.getAttribute("href"));
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
      });
    }

    // Fermer le menu hamburger si ouvert lors d'un clic sur un lien
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    if (menu && menu.classList.contains("open")) {
      menu.classList.remove("open");
      icon.classList.remove("open");
    }
  });
});

// Animation des cartes de projet
document.addEventListener("DOMContentLoaded", function () {
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      // N'appliquer l'effet que sur desktop (pas sur tactile)
      if (window.innerWidth > 1024) {
        // Effet d'inclinaison subtil
        this.style.transform = `translateY(-10px)`;
      }
    });

    card.addEventListener("mouseleave", function () {
      // Réinitialiser la transformation
      this.style.transform = "";
    });

    // Animation des tags techniques au survol
    const techTags = card.querySelectorAll(".tech-tag");
    techTags.forEach((tag, index) => {
      tag.style.transitionDelay = `${index * 50}ms`;
    });
  });
});

// Modern contact form validation and feedback - SUPPRIMÉ (remplacé par la validation EmailJS)

// Gestion automatique des messages de statut de contact via EmailJS

// Amélioration pour dispositifs mobiles - gestion de la taille réelle de l'écran
function revealOnScroll() {
  const elements = document.querySelectorAll(
    ".project-card, .contact-card, .timeline-item"
  );
  const windowHeight = window.innerHeight;

  elements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      if (!element.classList.contains("active")) {
        element.classList.add("active");
      }
    }
  });
}

// Exécuter lors du défilement pour dispositifs où AOS est désactivé
let scrollTimeout;
window.addEventListener("scroll", function () {
  if (window.innerWidth < 768) {
    // Throttle scroll events pour les performances
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(revealOnScroll, 16); // ~60fps
  }
});

// Initialisation pour les appareils mobiles
document.addEventListener("DOMContentLoaded", function () {
  if (window.innerWidth < 768) {
    revealOnScroll();
  }

  // Fixer les problèmes d'images brisées
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", function () {
      // Remplacer par une image par défaut ou cacher
      this.style.display = "none";
    });
  });
  
  // Gestion des gestes tactiles pour la navigation
  let startX, startY;
  
  document.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  });
  
  document.addEventListener('touchmove', function(e) {
    if (!startX || !startY) return;
    
    let diffX = startX - e.touches[0].clientX;
    let diffY = startY - e.touches[0].clientY;
    
    // Swipe horizontal pour ouvrir/fermer le menu sur mobile
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      const menu = document.querySelector(".menu-links");
      const icon = document.querySelector(".hamburger-icon");
      
      if (diffX > 0 && menu && menu.classList.contains("open")) {
        // Swipe left - fermer le menu
        menu.classList.remove("open");
        icon.classList.remove("open");
      }
    }
    
    startX = null;
    startY = null;
  });
  
  // Optimisation des performances sur mobile
  if ('serviceWorker' in navigator && window.innerWidth < 768) {
    // Préchargement intelligent des images
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
});

// ============================
// CONFIGURATION ET GESTION EMAILJS
// ============================

// Configuration EmailJS
(function() {
  // Initialiser EmailJS avec votre Public Key
  emailjs.init("XAcFRq3UXaXAWAIa3"); // Remplacez par votre clé publique EmailJS
})();

// Gestion du formulaire de contact
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitText');
  const loadingSpinner = document.getElementById('loadingSpinner');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Désactiver le bouton et afficher le loader
      submitBtn.disabled = true;
      submitText.textContent = 'Envoi en cours...';
      loadingSpinner.classList.remove('hidden');
      formStatus.classList.add('hidden');

      // Collecter les données du formulaire
      const formData = new FormData(contactForm);
      const templateParams = {
        from_name: formData.get('from_name'),
        from_email: formData.get('from_email'),
        phone: formData.get('phone') || 'Non renseigné',
        message: formData.get('message'),
        to_name: 'Mansour Diop', // Votre nom
      };

      // Envoyer l'email via EmailJS
      emailjs.send(
        'service_euamka5',    // Remplacez par votre Service ID
        'template_zjmhmx1',   // Remplacez par votre Template ID
        templateParams
      )
      .then(function(response) {
        // Email envoyé avec succès
        showFormStatus('success', 'Message envoyé avec succès ! Je vous répondrai bientôt.');
        contactForm.reset();
      })
      .catch(function(error) {
        // Erreur lors de l'envoi
        showFormStatus('error', 'Erreur lors de l\'envoi. Veuillez réessayer ou me contacter directement.');
      })
      .finally(function() {
        // Réactiver le bouton
        submitBtn.disabled = false;
        submitText.textContent = 'Envoyer le message';
        loadingSpinner.classList.add('hidden');
      });
    });
  }

  // Fonction pour afficher le statut du formulaire
  function showFormStatus(type, message) {
    formStatus.textContent = message;
    formStatus.className = `form-status-message ${type}`;
    
    // Masquer le message après 5 secondes
    setTimeout(function() {
      formStatus.style.display = 'none';
    }, 5000);
  }
});

// ============================
// BOUTON SCROLL TO TOP MODERNE AVEC PROGRESSION
// ============================

class ModernScrollToTop {
  constructor() {
    this.btn = document.getElementById('scrollToTopBtn');
    this.progressCircle = document.querySelector('.progress-ring-circle');
    this.isVisible = false;
    this.circumference = 2 * Math.PI * 26; // rayon desktop = 26
    this.isMobile = window.innerWidth <= 768;
    
    if (!this.btn || !this.progressCircle) return;
    
    this.init();
  }
  
  init() {
    // Adapter la circonférence selon l'écran
    this.updateCircumference();
    
    // Configurer le cercle de progression
    this.progressCircle.style.strokeDasharray = this.circumference;
    this.progressCircle.style.strokeDashoffset = this.circumference;
    
    // Throttle pour optimiser les performances du scroll
    this.throttledScroll = this.throttle(this.handleScroll.bind(this), 16); // 60fps
    
    // Event listeners optimisés
    this.btn.addEventListener('click', this.scrollToTop.bind(this));
    window.addEventListener('scroll', this.throttledScroll, { passive: true });
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Initialiser immédiatement
    this.handleScroll();
  }
  
  // Fonction throttle pour optimiser les performances
  throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }
  
  updateCircumference() {
    const isMobileNow = window.innerWidth <= 768;
    if (isMobileNow !== this.isMobile) {
      this.isMobile = isMobileNow;
      this.circumference = 2 * Math.PI * (this.isMobile ? 22 : 26);
      if (this.progressCircle) {
        this.progressCircle.style.strokeDasharray = this.circumference;
      }
    }
  }
  
  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.min(scrollTop / docHeight, 1);
    
    // Mettre à jour la progression du cercle
    const offset = this.circumference - (scrollPercent * this.circumference);
    this.progressCircle.style.strokeDashoffset = offset;
    
    // Afficher/masquer le bouton avec un seuil plus réactif
    const threshold = this.isMobile ? 150 : 200;
    
    if (scrollTop > threshold && !this.isVisible) {
      this.showButton();
    } else if (scrollTop <= threshold && this.isVisible) {
      this.hideButton();
    }
  }
  
  handleResize() {
    this.updateCircumference();
    this.handleScroll(); // Recalculer la progression
  }
  
  showButton() {
    this.btn.classList.add('show');
    this.isVisible = true;
  }
  
  hideButton() {
    this.btn.classList.remove('show');
    this.isVisible = false;
  }
  
  scrollToTop() {
    // Animation de scroll fluide et rapide
    const startPosition = window.pageYOffset;
    const duration = 600; // Durée réduite pour plus de réactivité
    const startTime = performance.now();
    
    const easeOutQuart = (t) => {
      return 1 - Math.pow(1 - t, 4); // Animation plus rapide
    };
    
    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      
      window.scrollTo(0, startPosition * (1 - easedProgress));
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };
    
    requestAnimationFrame(animateScroll);
    
    // Feedback visuel
    this.btn.style.transform = 'translateY(-1px) scale(0.95)';
    setTimeout(() => {
      if (this.btn.style.transform) {
        this.btn.style.transform = '';
      }
    }, 150);
  }
}

// Initialiser le bouton scroll to top
document.addEventListener('DOMContentLoaded', function() {
  new ModernScrollToTop();
});
