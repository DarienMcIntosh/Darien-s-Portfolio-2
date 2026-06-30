/* ============================================================
   DARIEN McINTOSH — PORTFOLIO  |  main.js
   All images are served as plain files from assets/
   No base64 injection needed.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* ─── Custom cursor ──────────────────────────────────── */
  const cursor = document.getElementById("cursor");
  const cursorRing = document.getElementById("cursorRing");
  let mx = 0,
    my = 0,
    rx = 0,
    ry = 0;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + "px";
    cursor.style.top = my + "px";
  });

  (function animRing() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    cursorRing.style.left = rx + "px";
    cursorRing.style.top = ry + "px";
    requestAnimationFrame(animRing);
  })();

  const hoverTargets =
    "a, button, .design-item, .uiux-card, .web-card, .broadcast-card, .brand-card";
  document.querySelectorAll(hoverTargets).forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("big");
      cursorRing.classList.add("big");
    });
    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("big");
      cursorRing.classList.remove("big");
    });
  });

  /* ─── Sticky nav ─────────────────────────────────────── */
  const nav = document.getElementById("nav");
  window.addEventListener(
    "scroll",
    () => {
      nav.classList.toggle("scrolled", window.scrollY > 60);
    },
    { passive: true },
  );

  /* ─── Mobile nav dropdown ────────────────────────────── */
  const navToggle = document.getElementById("navToggle");
  const navMobileMenu = document.getElementById("navMobileMenu");

  function closeMobileMenu() {
    navMobileMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }

  function openMobileMenu() {
    navMobileMenu.classList.add("open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
  }

  if (navToggle && navMobileMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMobileMenu.classList.contains("open");
      if (isOpen) closeMobileMenu();
      else openMobileMenu();
    });

    navMobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("click", (e) => {
      const isOpen = navMobileMenu.classList.contains("open");
      if (
        isOpen &&
        !navMobileMenu.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        closeMobileMenu();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navMobileMenu.classList.contains("open")) {
        closeMobileMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 960) closeMobileMenu();
    });
  }

  /* ─── Scroll reveal ──────────────────────────────────── */
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          revealObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
  );

  document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));

  /* ─── Active nav highlight ───────────────────────────── */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(
    ".nav-links a, .nav-mobile-menu a",
  );

  const sectionObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          navLinks.forEach((a) => {
            const isActive = a.getAttribute("href") === `#${e.target.id}`;
            a.classList.toggle("active", isActive);
          });
        }
      });
    },
    { threshold: 0.4 },
  );

  sections.forEach((s) => sectionObs.observe(s));

  /* ─── Hover tilt on design grid items ────────────────── */
  document.querySelectorAll(".design-item").forEach((item) => {
    item.addEventListener("mousemove", (e) => {
      const rect = item.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
      item.style.transform = `perspective(600px) rotateX(${-y}deg) rotateY(${x}deg)`;
    });
    item.addEventListener("mouseleave", () => {
      item.style.transform = "";
    });
  });

  /* ─── Hide scroll hint after scrolling ───────────────── */
  const scrollHint = document.querySelector(".hero-scroll");
  window.addEventListener(
    "scroll",
    () => {
      if (scrollHint)
        scrollHint.style.opacity = window.scrollY > 80 ? "0" : "1";
    },
    { passive: true },
  );

  const overlays = document.querySelectorAll(".case-overlay");
  const closeBtn = document.getElementById("caseCloseBtn");
  let activeCase = null;

  function openCase(id) {
    if (activeCase) activeCase.classList.remove("open");
    activeCase = document.getElementById("case-" + id);
    if (!activeCase) return;
    activeCase.classList.add("open");
    activeCase.scrollTop = 0;
    closeBtn.classList.add("visible");
    document.body.style.overflow = "hidden";
  }

  function closeCase() {
    if (activeCase) activeCase.classList.remove("open");
    activeCase = null;
    closeBtn.classList.remove("visible");
    document.body.style.overflow = "";
  }

  // Open on card click
  document.querySelectorAll(".proj-card").forEach((card) => {
    card.addEventListener("click", () => openCase(card.dataset.project));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") openCase(card.dataset.project);
    });
  });

  // Close button
  closeBtn.addEventListener("click", closeCase);

  // Next project
  document.querySelectorAll(".case-next-proj").forEach((btn) => {
    btn.addEventListener("click", () => openCase(btn.dataset.next));
  });

  // Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && activeCase) closeCase();
  });
});
