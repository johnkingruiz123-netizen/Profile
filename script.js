/* HYUK portfolio interactions and editable personal details. */

// Replace these placeholder values with your real details when you're ready.
const PORTFOLIO_CONFIG = {
  email: "johnkingruiz12345@gmail.com",
  githubUsername: "johnkingruiz12345-glitch",
  facebookUsername: "johndsruizjr",
  // Add real links only when they exist. Leave empty to keep actions unavailable.
  projects: {
    faculty: { githubUrl: "", liveDemoUrl: "" },
    portfolio: { githubUrl: "", liveDemoUrl: "" },
    attendance: { githubUrl: "", liveDemoUrl: "" }
  }
};

const navLinks = [...document.querySelectorAll(".nav-link")];
const sections = [...document.querySelectorAll("main section[id]")];
const mainNav = document.getElementById("mainNav");
const menuToggle = document.getElementById("menuToggle");

// Update the active navigation item while the visitor moves between sections.
function setActiveLink(sectionId) {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${sectionId}`;
    link.classList.toggle("active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

// Use Intersection Observer for section tracking and gentle reveal animations.
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActiveLink(entry.target.id);
    });
  }, { rootMargin: "-30% 0px -55% 0px", threshold: 0 });
  sections.forEach((section) => sectionObserver.observe(section));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -25px 0px" });
  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}

// Smoothly navigate and close the mobile menu after a selection.
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const targetId = link.getAttribute("href").slice(1);
    setActiveLink(targetId);
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  });
});

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  mainNav.classList.toggle("open", !isOpen);
});

// Close the mobile menu with Escape and when returning to a wide layout.
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }
});
window.addEventListener("resize", () => {
  if (window.innerWidth > 680) {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }
});

// Apply contact placeholders from the single configuration object above.
const emailLink = document.getElementById("emailLink");
const emailText = document.getElementById("emailText");
emailLink.href = `mailto:${PORTFOLIO_CONFIG.email}`;
emailText.textContent = PORTFOLIO_CONFIG.email;

const githubLink = document.getElementById("githubLink");
const githubText = document.getElementById("githubText");
githubLink.href = `https://github.com/${PORTFOLIO_CONFIG.githubUsername}`;
githubText.textContent = `github.com/${PORTFOLIO_CONFIG.githubUsername}`;

const facebookLink = document.getElementById("facebookLink");
const facebookText = document.getElementById("facebookText");
facebookLink.href = `https://facebook.com/${PORTFOLIO_CONFIG.facebookUsername}`;
facebookText.textContent = `facebook.com/${PORTFOLIO_CONFIG.facebookUsername}`;

// Project data powers the category filters and the View Details modal.
const PROJECTS = {
  faculty: {
    title: "Faculty Deliverables Monitoring System",
    description: "Academic monitoring system concept for organizing faculty deliverables, requirements, deadlines, and submission status.",
    categories: ["Web", "Database", "Academic"],
    technologies: ["HTML", "CSS", "JavaScript", "SQL"]
  },
  portfolio: {
    title: "Personal Portfolio Website",
    description: "Responsive portfolio website concept designed to showcase programming skills, projects, education, and contact information.",
    categories: ["Web", "Academic"],
    technologies: ["HTML5", "CSS3", "JavaScript"]
  },
  attendance: {
    title: "Student Attendance System",
    description: "Academic system concept for recording attendance and organizing student attendance information.",
    categories: ["Web", "Database", "Academic"],
    technologies: ["HTML", "CSS", "JavaScript", "SQL"]
  }
};

// Filter cards by their categories and update the active filter button.
const filterButtons = [...document.querySelectorAll(".filter-button")];
const projectCards = [...document.querySelectorAll(".project-card")];
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    projectCards.forEach((card) => {
      const categories = card.dataset.categories.split(" ");
      const shouldShow = filter === "all" || categories.includes(filter);
      card.classList.toggle("is-filtered-out", !shouldShow);
      if (shouldShow) card.classList.add("is-visible");
    });
  });
});

// Populate and open the project details modal.
const projectModal = document.getElementById("projectModal");
const modalTitle = document.getElementById("projectModalTitle");
const modalDescription = document.getElementById("projectModalDescription");
const modalCategories = document.getElementById("projectModalCategories");
const modalTechnologies = document.getElementById("projectModalTechnologies");
let lastModalTrigger = null;

function closeProjectModal() {
  projectModal.classList.remove("is-open");
  projectModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (lastModalTrigger) lastModalTrigger.focus();
}

document.querySelectorAll("[data-project-details]").forEach((button) => {
  button.addEventListener("click", () => {
    const project = PROJECTS[button.dataset.projectDetails];
    if (!project) return;
    lastModalTrigger = button;
    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;
    modalCategories.textContent = project.categories.join(" · ");
    modalTechnologies.textContent = project.technologies.join(" · ");
    projectModal.classList.add("is-open");
    projectModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    projectModal.querySelector(".modal-close").focus();
  });
});

projectModal.querySelectorAll("[data-close-modal]").forEach((element) => {
  element.addEventListener("click", closeProjectModal);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && projectModal.classList.contains("is-open")) closeProjectModal();
});

// Optional repository/demo URLs: buttons stay disabled unless a real URL is configured.
Object.entries(PORTFOLIO_CONFIG.projects).forEach(([projectId, links]) => {
  const card = document.querySelector(`[data-project-id="${projectId}"]`);
  if (!card) return;
  const githubButton = card.querySelector(".mini-action:nth-last-child(2)");
  const demoButton = card.querySelector(".mini-action:last-child");
  [[githubButton, links.githubUrl, "GitHub"], [demoButton, links.liveDemoUrl, "Live Demo"]].forEach(([button, url, label]) => {
    if (url && url.trim()) {
      button.disabled = false;
      button.classList.remove("unavailable");
      button.title = `Open ${label}`;
      button.addEventListener("click", () => window.open(url, "_blank", "noopener,noreferrer"));
    }
  });
});

document.getElementById("currentYear").textContent = new Date().getFullYear();
