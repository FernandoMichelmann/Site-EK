(() => {
  "use strict";

  /* CONFIGURAÇÕES */
  const isTouch = window.matchMedia("(hover: none)").matches;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ANO DO FOOTER */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* CURSOR PERSONALIZADO */
  const cursorRing = document.querySelector("[data-cursor-ring]");

  if (!isTouch && cursorRing) {
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

      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursor);
    };

    animateCursor();

    // Eventos corrigidos com e.target / e.relatedTarget para evitar falsos "mouseout"
    document.addEventListener("pointerover", (event) => {
      const targetHover = event.target.closest("[data-hover]");
      const targetProject = event.target.closest("[data-hover-project]");

      if (targetHover) cursorRing.classList.add("is-active");
      if (targetProject) cursorRing.classList.add("is-project");
    });

    document.addEventListener("pointerout", (event) => {
      const targetHover = event.target.closest("[data-hover]");
      const targetProject = event.target.closest("[data-hover-project]");

      // Garante que o cursor só perde a classe se sair do elemento completamente
      if (targetHover && !targetHover.contains(event.relatedTarget)) {
        cursorRing.classList.remove("is-active");
      }
      if (targetProject && !targetProject.contains(event.relatedTarget)) {
        cursorRing.classList.remove("is-project");
      }
    });
  }

  /* HUD */
  const hudTime = document.querySelector("[data-hud-time]");
  const hudPos = document.querySelector("[data-hud-pos]");
  const hudScroll = document.querySelector("[data-hud-scroll]");
  const hudSection = document.querySelector("[data-hud-section]");

  const pad = (number) => String(number).padStart(2, "0");

  if (hudTime) {
    const tickClock = () => {
      const now = new Date();
      hudTime.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    };

    tickClock();
    setInterval(tickClock, 1000);
  }

  if (hudPos) {
    window.addEventListener("mousemove", (event) => {
      hudPos.textContent = `X${String(Math.round(event.clientX)).padStart(4, "0")} Y${String(Math.round(event.clientY)).padStart(4, "0")}`;
    });
  }

  /* HUD — SCROLL / SECTION */
  const sections = Array.from(document.querySelectorAll("[data-section-name]"));
  let isTickingScroll = false;

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

    isTickingScroll = false;
  };

  const onScrollThrottled = () => {
    if (!isTickingScroll) {
      requestAnimationFrame(updateScrollHud);
      isTickingScroll = true;
    }
  };

  updateScrollHud();
  window.addEventListener("scroll", onScrollThrottled, { passive: true });
  window.addEventListener("resize", onScrollThrottled);

  /* MENU MOBILE */
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");

  if (menuToggle && mobileNav) {
    const closeMenu = () => {
      mobileNav.classList.remove("is-open");
      mobileNav.setAttribute("aria-hidden", "true");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menu");
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = mobileNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      mobileNav.setAttribute("aria-hidden", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
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

  /* CATÁLOGO DE CAMISETAS */
  const productStage = document.querySelector("[data-product-stage]");

  if (productStage) {
    const products = [
      {
        tag: "T-SHIRT",
        titleTop: "NOSSAS CAMISETAS",
        titleBottom: " ",
        lines: [
          'PORQUE ELE É DIGNO, É UMA MÚSICA DA EKBALLO DO EP "A ELE"',
          "PRODUÇÃO LIMITADA E NUMERADA",
          "ALGODÃO PREMIUM, CAIMENTO OVERSIZED",
          "FEITA PARA QUEM VIVE A MENSAGEM"
        ],
        image: "imagem/2CAMISAS.png",
        alt: "Camiseta Porque Ele É Digno"
      },
      {
        tag: "T-SHIRT",
        titleTop: "PORQUE ELE É DIGNO",
        titleBottom: "",
        lines: [
          "PEÇA EXCLUSIVA DA COLEÇÃO OFICIAL EKBALLO SOUNDS",
          "PRODUÇÃO LIMITADA E NUMERADA",
          "ALGODÃO PREMIUM, CAIMENTO OVERSIZED",
          "FEITA PARA QUEM VIVE A MENSAGEM"
        ],
        image: "imagem/camisaPQ.png",
        alt: "Camiseta Porque Ele É Digno"
      },
      {
        tag: "T-SHIRT",
        titleTop: "EKBALLO",
        titleBottom: "",
        lines: [
          "PEÇA EXCLUSIVA DA COLEÇÃO OFICIAL EKBALLO SOUNDS",
          "PRODUÇÃO LIMITADA E NUMERADA",
          "ALGODÃO PREMIUM, CAIMENTO OVERSIZED",
          "FEITA PARA QUEM VIVE A MENSAGEM"
        ],
        image: "imagem/camisaEK.png",
        alt: "Camiseta Ekballo"
      }
    ];

    let currentIndex = 0;
    let isAnimating = false;
    let transitionTimer = null;

    const stageImage = productStage.querySelector("[data-product-image]");
    const stageTag = productStage.querySelector("[data-product-tag]");
    const stageTitleTop = productStage.querySelector("[data-product-title-top]");
    const stageTitleBottom = productStage.querySelector("[data-product-title-bottom]");
    const stageLines = productStage.querySelector("[data-product-lines]");
    const controls = document.querySelector("[data-product-controls]");
    const bgVideos = Array.from(document.querySelectorAll("[data-bg-video]"));

    const setActiveBgVideo = (index) => {
      bgVideos.forEach((video) => {
        const isActive = Number(video.dataset.bgVideo) === index;
        video.classList.toggle("is-active", isActive);

        if (isActive) {
          video.muted = true;
          video.play()?.catch(() => { });
        } else {
          video.pause();
        }
      });
    };

    const renderContent = (index) => {
      const product = products[index];
      if (stageImage) {
        stageImage.src = product.image;
        stageImage.alt = product.alt;
      }
      if (stageTag) stageTag.textContent = product.tag;
      if (stageTitleTop) stageTitleTop.textContent = product.titleTop;
      if (stageTitleBottom) stageTitleBottom.textContent = product.titleBottom;
      if (stageLines) {
        stageLines.innerHTML = product.lines.map((line) => `<p>${line}</p>`).join("");
      }
    };

    const renderButtons = (index) => {
      if (!controls) return;
      controls.replaceChildren(); // Forma otimizada de limpar elementos filhos

      const fragment = document.createDocumentFragment();
      const buttonNames = ["NOSSAS CAMISAS", "PORQUE ELE É DIGNO", "EKBALLO"];

      products.forEach((product, i) => {
        if (i === index) return;

        const button = document.createElement("button");
        button.type = "button";
        button.className = "product-btn";
        button.setAttribute("data-hover", "");
        button.dataset.index = String(i);
        button.dataset.color = String(i + 1);
        button.textContent = buttonNames[i];

        button.addEventListener("click", () => switchProduct(i));
        fragment.appendChild(button);
      });

      controls.appendChild(fragment);
    };

    const switchProduct = (index) => {
      if (isAnimating || index === currentIndex) return;

      isAnimating = true;
      if (transitionTimer) clearTimeout(transitionTimer);

      productStage.classList.remove("is-entering");
      productStage.classList.add("is-leaving");

      const delay = prefersReducedMotion ? 0 : 420;

      transitionTimer = window.setTimeout(() => {
        currentIndex = index;

        renderContent(currentIndex);
        renderButtons(currentIndex);
        setActiveBgVideo(currentIndex);

        productStage.classList.remove("is-leaving");
        productStage.classList.add("is-entering");

        requestAnimationFrame(() => {
          productStage.classList.remove("is-entering");
          isAnimating = false;
        });
      }, delay);
    };

    renderContent(currentIndex);
    renderButtons(currentIndex);
    setActiveBgVideo(currentIndex);
  }

  /* GSAP */
  const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

  if (hasGsap && !prefersReducedMotion) {
    gsap.registerPlugin(ScrollTrigger);

    /* HERO */
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .to(".hero-title .reveal", { y: "0%", duration: 1, stagger: 0.12, delay: 0.2 })
      .from(".hero-scatter .scatter-item", { opacity: 0, y: 10, duration: 0.6, stagger: 0.08 }, "-=0.5")
      .from(".hero-sub", { opacity: 0, y: 16, duration: 0.7 }, "-=0.4")
      .from(".hero-index", { opacity: 0, duration: 0.6 }, "-=0.6");

    /* SEÇÕES */
    gsap.utils.toArray(".section-eyebrow, .section-title, .about-title, .contact-title").forEach((element) => {
      gsap.from(element, {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: element, start: "top 85%", once: true }
      });
    });

    /* PROJETOS */
    gsap.utils.toArray(".project").forEach((project) => {
      gsap.from(project, {
        opacity: 0,
        y: 50,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: project, start: "top 88%", once: true }
      });
    });

    /* LOJA */
    gsap.from(".store-video-wrap", {
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: ".store-grid", start: "top 85%", once: true }
    });

    gsap.from(".store-info > *", {
      opacity: 0,
      y: 24,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: { trigger: ".store-grid", start: "top 85%", once: true }
    });

    /* PRODUTOS */
    gsap.from(".product-stage", {
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: ".products", start: "top 85%", once: true }
    });

    gsap.from(".product-controls .product-btn", {
      opacity: 0,
      y: 20,
      duration: 0.7,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: { trigger: ".products", start: "top 80%", once: true }
    });

    /* SOBRE */
    gsap.from(".about-lead, .about-text, .about-coords", {
      opacity: 0,
      y: 24,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: { trigger: ".about-body", start: "top 85%", once: true }
    });

    /* ESTATÍSTICAS */
    gsap.from(".stat", {
      opacity: 0,
      y: 30,
      duration: 0.7,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: { trigger: ".stats-grid", start: "top 85%", once: true }
    });

    /* CONTATO */
    gsap.from(".contact-link", {
      opacity: 0,
      y: 20,
      duration: 0.7,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: { trigger: ".contact-links", start: "top 88%", once: true }
    });

    /* PARALLAX DE IMAGENS */
    gsap.utils.toArray("[data-parallax-img]").forEach((image) => {
      const strength = parseFloat(image.dataset.parallaxImg) || 0.1;

      gsap.to(image, {
        yPercent: strength * 40,
        ease: "none",
        scrollTrigger: {
          trigger: image,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6
        }
      });
    });
  } else {
    /* FALLBACK SEM GSAP */
    document.querySelectorAll(".hero-title .reveal").forEach((element) => {
      element.style.transform = "translateY(0)";
    });

    const revealTargets = document.querySelectorAll(
      [
        ".section-eyebrow",
        ".section-title",
        ".about-title",
        ".contact-title",
        ".project",
        ".about-lead",
        ".about-text",
        ".about-coords",
        ".stat",
        ".contact-link",
        ".store-grid",
        ".product-stage",
        ".product-controls"
      ].join(",")
    );

    revealTargets.forEach((element) => {
      element.setAttribute("data-reveal", "");
    });

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

      revealTargets.forEach((element) => {
        observer.observe(element);
      });
    }
  }

  /* MARQUEE */
  const marqueeTrack = document.querySelector(".marquee-track");

  if (marqueeTrack) {
    const buildMarquee = () => {
      const original = marqueeTrack.querySelector(".marquee-content");
      if (!original) return;

      const baseHTML = original.innerHTML;
      const singleWidth = original.offsetWidth || window.innerWidth * 0.5;
      const targetWidth = window.innerWidth * 2;
      const copiesNeeded = Math.max(4, Math.ceil(targetWidth / singleWidth));

      const fragment = document.createDocumentFragment();

      for (let i = 0; i < copiesNeeded; i++) {
        const block = document.createElement("div");
        block.className = "marquee-content";
        block.innerHTML = baseHTML;
        fragment.appendChild(block);
      }

      marqueeTrack.replaceChildren(fragment);
    };

    buildMarquee();

    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(buildMarquee, 200);
    });
  }

  /* FORMULÁRIO DE CONTATO */
  const form = document.querySelector("#formulario-convite");

  if (form) {
    form.addEventListener("submit", (event) => {
      const nome = document.querySelector("#nome");
      const email = document.querySelector("#email");
      const mensagem = document.querySelector("#mensagem");

      if (!nome || !email || !mensagem) return;

      const nomeVal = nome.value.trim();
      const emailVal = email.value.trim();
      const mensagemVal = mensagem.value.trim();

      if (!nomeVal || !emailVal || !mensagemVal) {
        event.preventDefault();
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
      }

      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailValido.test(emailVal)) {
        event.preventDefault();
        alert("Por favor, digite um endereço de e-mail válido.");
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