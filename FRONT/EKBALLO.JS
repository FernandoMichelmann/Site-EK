(() => {
  "use strict";

  const isTouch = window.matchMedia("(hover: none)").matches;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ANO DO FOOTER */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* CURSOR COM LOGO DA EKBALLO */
  if (!isTouch) {
    const ring = document.querySelector("[data-cursor-ring]");

    if (ring) {
      let mouseX = window.innerWidth / 2;
      let mouseY = window.innerHeight / 2;
      let ringX = mouseX;
      let ringY = mouseY;

      window.addEventListener("mousemove", (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
      });

      const animateCursor = () => {
        ringX += (mouseX - ringX) * 0.16;
        ringY += (mouseY - ringY) * 0.16;
        ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animateCursor);
      };
      animateCursor();

      document.querySelectorAll("[data-hover]").forEach((el) => {
        el.addEventListener("mouseenter", () => ring.classList.add("is-active"));
        el.addEventListener("mouseleave", () => ring.classList.remove("is-active"));
      });

      document.querySelectorAll("[data-hover-project]").forEach((el) => {
        el.addEventListener("mouseenter", () => ring.classList.add("is-project"));
        el.addEventListener("mouseleave", () => ring.classList.remove("is-project"));
      });
    }
  }

  /* HUD */
  const hudTime = document.querySelector("[data-hud-time]");
  const hudPos = document.querySelector("[data-hud-pos]");
  const hudScroll = document.querySelector("[data-hud-scroll]");
  const hudSection = document.querySelector("[data-hud-section]");

  const pad = (n) => String(n).padStart(2, "0");

  const tickClock = () => {
    if (!hudTime) return;
    const now = new Date();
    hudTime.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  };
  tickClock();
  setInterval(tickClock, 1000);

  window.addEventListener("mousemove", (event) => {
    if (!hudPos) return;
    hudPos.textContent =
      `X${String(Math.round(event.clientX)).padStart(4, "0")} ` +
      `Y${String(Math.round(event.clientY)).padStart(4, "0")}`;
  });

  const sections = Array.from(document.querySelectorAll("[data-section-name]"));

  const updateScrollHud = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;

    if (hudScroll) {
      hudScroll.textContent = `${String(Math.round(percentage)).padStart(3, "0")}%`;
    }

    if (hudSection && sections.length) {
      let current = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= window.innerHeight * 0.5) {
          current = section;
        }
      }
      const index = sections.indexOf(current) + 1;
      hudSection.textContent = `${pad(index)} / ${current.dataset.sectionName}`;
    }
  };
  updateScrollHud();
  window.addEventListener("scroll", updateScrollHud, { passive: true });
  window.addEventListener("resize", updateScrollHud);

  /* MENU MOBILE */
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");

  if (menuToggle && mobileNav) {
    const closeMenu = () => {
      mobileNav.classList.remove("is-open");
      mobileNav.setAttribute("aria-hidden", "true");
      menuToggle.setAttribute("aria-expanded", "false");
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = mobileNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      mobileNav.setAttribute("aria-hidden", String(!isOpen));
    });

    document.querySelectorAll("[data-mobile-link]").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  /* PARALLAX DO HERO */
  if (!isTouch && !prefersReducedMotion) {
    const elements = document.querySelectorAll("[data-parallax]");

    window.addEventListener("mousemove", (event) => {
      const relX = (event.clientX / window.innerWidth - 0.5) * 2;
      const relY = (event.clientY / window.innerHeight - 0.5) * 2;

      elements.forEach((el) => {
        const strength = parseFloat(el.dataset.parallax) || 0.2;
        const x = relX * strength * 14;
        const y = relY * strength * 10;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
    });
  }

  /* GSAP */
  const hasGsap = window.gsap && window.ScrollTrigger;

  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.timeline({ defaults: { ease: "power3.out" } })
      .to(".hero-title .reveal", { y: "0%", duration: 1, stagger: 0.12, delay: 0.2 })
      .from(".hero-scatter .scatter-item", { opacity: 0, y: 10, duration: 0.6, stagger: 0.08 }, "-=0.5")
      .from(".hero-sub", { opacity: 0, y: 16, duration: 0.7 }, "-=0.4")
      .from(".hero-index", { opacity: 0, duration: 0.6 }, "-=0.6");

    gsap.utils
      .toArray(".section-eyebrow, .section-title, .about-title, .contact-title")
      .forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 30,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" }
        });
      });

    gsap.utils.toArray(".project").forEach((project) => {
      gsap.from(project, {
        opacity: 0,
        y: 50,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: project, start: "top 88%" }
      });
    });

    gsap.from(".store-video-wrap", {
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: ".store-grid", start: "top 85%" }
    });

    gsap.from(".store-info > *", {
      opacity: 0,
      y: 24,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: { trigger: ".store-grid", start: "top 85%" }
    });

    gsap.from(".about-lead, .about-text, .about-coords", {
      opacity: 0,
      y: 24,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: { trigger: ".about-body", start: "top 85%" }
    });

    gsap.from(".stat", {
      opacity: 0,
      y: 30,
      duration: 0.7,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: { trigger: ".stats-grid", start: "top 85%" }
    });

    gsap.from(".contact-link", {
      opacity: 0,
      y: 20,
      duration: 0.7,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: { trigger: ".contact-links", start: "top 88%" }
    });

    gsap.utils.toArray("[data-parallax-img]").forEach((image) => {
      const strength = parseFloat(image.dataset.parallaxImg) || 0.1;
      gsap.to(image, {
        yPercent: strength * 40,
        ease: "none",
        scrollTrigger: { trigger: image, start: "top bottom", end: "bottom top", scrub: 0.6 }
      });
    });
  } else {
    /* FALLBACK SEM GSAP */
    document.querySelectorAll(".hero-title .reveal").forEach((el) => {
      el.style.transform = "translateY(0)";
    });

    const revealTargets = document.querySelectorAll(
      ".section-eyebrow, .section-title, .about-title, .contact-title, .project, .about-lead, .about-text, .about-coords, .stat, .contact-link, .store-grid"
    );

    revealTargets.forEach((el) => el.setAttribute("data-reveal", ""));

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      revealTargets.forEach((el) => observer.observe(el));
    }
  }

  /* MARQUEE — PREENCHER LARGURA DINAMICAMENTE */
  const marqueeTrack = document.querySelector(".marquee-track");

  if (marqueeTrack) {
    const buildMarquee = () => {
      const original = marqueeTrack.querySelector(".marquee-content");
      if (!original) return;

      const baseHTML = original.innerHTML;
      marqueeTrack.innerHTML = "";

      const viewportWidth = window.innerWidth;
      let totalWidth = 0;
      let copies = 0;

      // preenche até passar do dobro da tela, garantindo que o loop em -50% nunca deixe vazio
      while (totalWidth < viewportWidth * 2 || copies < 2) {
        const block = document.createElement("div");
        block.className = "marquee-content";
        block.innerHTML = baseHTML;
        marqueeTrack.appendChild(block);

        totalWidth += block.offsetWidth;
        copies++;

        if (copies > 20) break; // proteção contra loop infinito
      }
    };

    buildMarquee();

    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(buildMarquee, 200);
    });
  }

  /* FORMULÁRIO */
  const form = document.querySelector("#formulario-convite");

  if (form) {
    form.addEventListener("submit", (event) => {
      const nome = document.querySelector("#nome");
      const email = document.querySelector("#email");
      const mensagem = document.querySelector("#mensagem");

      if (!nome || !email || !mensagem) return;

      if (nome.value.trim() === "" || email.value.trim() === "" || mensagem.value.trim() === "") {
        event.preventDefault();
        alert("Preencha todos os campos antes de enviar.");
        return;
      }

      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailValido.test(email.value.trim())) {
        event.preventDefault();
        alert("Digite um endereço de email válido.");
        email.focus();
      }
    });
  }

  /* SCROLL SUAVE */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });
    });
  });
})();