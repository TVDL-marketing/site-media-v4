(function () {
  const { brands, years, brandImages, categoriesByBrand, mediaData } = window.MediaCenterData;

  const state = {
    brand: null,
    cat: null,
    year: "2026",
  };

  const brandNav = document.getElementById("brand-nav");
  const brandCards = document.getElementById("brand-cards");
  const contentTitle = document.getElementById("content-title");
  const contentSubtitle = document.getElementById("content-subtitle");
  const resourceGrid = document.getElementById("resource-grid");
  const yearFilter = document.getElementById("year-filter");
  const backToTopBtn = document.getElementById("back-to-top");
  const fadeRoot = document.querySelector(".fade-in-root");

  function slugLabel(brand, catSlug) {
    return categoriesByBrand[brand]?.find((cat) => cat.slug === catSlug)?.label ?? catSlug;
  }

  function parseQuery() {
    const params = new URLSearchParams(window.location.search);
    const brand = params.get("brand");
    const cat = params.get("cat");
    const year = params.get("year") || "2026";

    if (brand && brands.includes(brand)) state.brand = brand;
    if (year && years.includes(year)) state.year = year;
    if (state.brand && cat && mediaData[state.brand]?.[cat]) state.cat = cat;
  }

  function pushUrl() {
    const params = new URLSearchParams();
    if (state.brand) params.set("brand", state.brand);
    if (state.cat) params.set("cat", state.cat);
    params.set("year", state.year);
    history.pushState({ ...state }, "", `?${params.toString()}`);
  }

  function renderYearOptions() {
    yearFilter.innerHTML = years
      .map((year) => `<option value="${year}" ${year === state.year ? "selected" : ""}>${year}</option>`)
      .join("");
  }

  function renderBrandCards() {
    brandCards.innerHTML = brands
      .map((brand) => {
        const monogram = brand
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2);
        const isActive = state.brand === brand;
        return `
          <button class="brand-card ${isActive ? "active" : ""}" role="listitem" data-brand="${brand}" aria-label="Ouvrir ${brand} dans le menu latéral">
            <div class="brand-card-media" style="background-image:url('${brandImages[brand]}')"></div>
            <div class="brand-card-content">
              <div class="brand-logo" aria-hidden="true">${monogram}</div>
              <p class="brand-name">${brand}</p>
            </div>
          </button>
        `;
      })
      .join("");

    brandCards.querySelectorAll(".brand-card").forEach((card) => {
      card.addEventListener("click", () => {
        state.brand = card.dataset.brand;
        state.cat = null;
        renderBrandCards();
        renderSidebar();
        renderContent();
        pushUrl();
        guideToSidebar(state.brand);
        document.querySelector(`[data-brand-trigger="${state.brand}"]`)?.focus();
      });
    });
  }


  function guideToSidebar(brand) {
    const trigger = document.querySelector(`[data-brand-trigger="${brand}"]`);
    if (!trigger) return;

    brandNav.classList.remove("guide-focus");
    trigger.classList.remove("guide-pulse");

    void brandNav.offsetWidth;
    brandNav.classList.add("guide-focus");
    trigger.classList.add("guide-pulse");

    trigger.scrollIntoView({ behavior: "smooth", block: "center" });

    window.setTimeout(() => {
      brandNav.classList.remove("guide-focus");
      trigger.classList.remove("guide-pulse");
    }, 1400);
  }

  function renderSidebar() {
    brandNav.innerHTML = brands
      .map((brand) => {
        const isActive = state.brand === brand;
        const categoriesMarkup = categoriesByBrand[brand]
          .map((cat) => {
            const isCatActive = isActive && state.cat === cat.slug;
            return `
              <li>
                <button
                  class="cat-btn ${isCatActive ? "active" : ""}"
                  data-brand="${brand}"
                  data-cat="${cat.slug}"
                  aria-label="Afficher ${cat.label} pour ${brand}"
                >
                  ${cat.label}
                </button>
              </li>
            `;
          })
          .join("");

        return `
          <section class="brand-item ${isActive ? "active" : ""}" aria-label="${brand}">
            <button
              class="brand-btn"
              data-brand-trigger="${brand}"
              data-brand="${brand}"
              aria-expanded="${isActive}"
              aria-controls="cats-${brand.replace(/\s+/g, "-").toLowerCase()}"
            >
              <span>${brand}</span>
              <span aria-hidden="true">${isActive ? "−" : "+"}</span>
            </button>
            <ul id="cats-${brand.replace(/\s+/g, "-").toLowerCase()}" class="brand-categories" role="list">
              ${categoriesMarkup}
            </ul>
          </section>
        `;
      })
      .join("");

    brandNav.querySelectorAll("[data-brand-trigger]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.brand = btn.dataset.brand;
        state.cat = null;
        renderBrandCards();
        renderSidebar();
        renderContent();
        pushUrl();
      });
    });

    brandNav.querySelectorAll(".cat-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.brand = btn.dataset.brand;
        state.cat = btn.dataset.cat;
        renderBrandCards();
        renderSidebar();
        renderContent();
        pushUrl();
      });
    });
  }

  function renderResources(resources) {
    resourceGrid.innerHTML = resources
      .map(
        (r) => `
      <article class="resource-card">
        <div class="thumb" role="img" aria-label="Miniature ${r.title}" style="background-image:url('${r.thumbUrl}')"></div>
        <div class="resource-body">
          <h3 class="resource-title">${r.title}</h3>
          <p class="meta">${r.type} · ${r.size}</p>
          <p class="meta">Mise à jour : ${r.date}</p>
          <button class="download-btn" data-id="${r.id}">Télécharger</button>
        </div>
      </article>
    `
      )
      .join("");

    resourceGrid.querySelectorAll(".download-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        console.log(`[Téléchargement simulé] ${btn.dataset.id}`);
      });
    });
  }

  function renderGeneratorPlaceholder(catData) {
    resourceGrid.innerHTML = `
      <article class="placeholder-card">
        <h3>Générateur de fiches produit/prix</h3>
        <p>${catData.description}</p>
        <button class="primary-btn" id="generate-sheet-btn">Générer une fiche</button>
      </article>
    `;

    document.getElementById("generate-sheet-btn")?.addEventListener("click", () => {
      alert("Génération simulée — la fiche serait créée et téléchargée automatiquement.");
      console.log("[Génération simulée] fiche produit/prix");
    });
  }

  function renderContent() {
    if (!state.brand || !state.cat) {
      contentTitle.textContent = "Aucune catégorie sélectionnée";
      contentSubtitle.textContent =
        "Sélectionnez une marque puis une catégorie pour afficher les ressources.";
      resourceGrid.innerHTML = "";
      return;
    }

    const catData = mediaData[state.brand][state.cat];
    const catLabel = slugLabel(state.brand, state.cat);

    contentTitle.textContent = `${state.brand} — ${catLabel}`;
    contentSubtitle.textContent = `Ressources disponibles pour le millésime ${state.year}.`;

    if (catData.generator) {
      renderGeneratorPlaceholder(catData);
      return;
    }

    renderResources(catData.years[state.year] ?? []);
  }

  function bindEvents() {
    yearFilter.addEventListener("change", (event) => {
      state.year = event.target.value;
      renderContent();
      pushUrl();
    });

    window.addEventListener("scroll", () => {
      backToTopBtn.classList.toggle("visible", window.scrollY > 380);
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("popstate", (event) => {
      if (event.state) {
        Object.assign(state, event.state);
      } else {
        parseQuery();
      }
      renderYearOptions();
      renderBrandCards();
      renderSidebar();
      renderContent();
    });
  }

  function init() {
    parseQuery();
    renderYearOptions();
    renderBrandCards();
    renderSidebar();
    renderContent();
    bindEvents();
    if (!window.location.search) pushUrl();

    requestAnimationFrame(() => {
      fadeRoot?.classList.add("ready");
    });
  }

  init();
})();

// Notes architecture: rendu piloté par un state unique (brand/cat/year), URL synchronisée,
// enrichi avec assets visuels premium, transitions douces et UX utilitaires (fade-in + retour haut).
