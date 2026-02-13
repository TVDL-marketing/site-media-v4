(function () {
  const YEARS = Array.from({ length: 14 }, (_, i) => String(2013 + i));

  const ALL_CATEGORIES = [
    { slug: "photos-hd", label: "Photos HD", yearly: true, ext: "JPG" },
    { slug: "dossiers-presse", label: "Dossiers de presse", yearly: true, ext: "PDF" },
    { slug: "logo", label: "Logo", yearly: false, ext: "PNG" },
    {
      slug: "generateur-fiches-produit-prix",
      label: "Générateur de fiches produit/prix",
      yearly: false,
      isGenerator: true,
    },
    { slug: "implantations", label: "Implantations", yearly: true, ext: "PDF" },
    { slug: "catalogues-brochures", label: "Catalogues et brochures", yearly: true, ext: "PDF" },
    { slug: "supports-video", label: "Supports vidéo", yearly: true, ext: "MP4" },
  ];

  const BRANDS = [
    "Chausson",
    "Challenger",
    "Caravelair",
    "Sterckeman",
    "Rubis",
    "Mini Freestyle",
  ];

  const CATEGORIES_BY_BRAND = BRANDS.reduce((acc, brand) => {
    const withoutGenerator = ["Rubis", "Mini Freestyle"].includes(brand);
    acc[brand] = withoutGenerator
      ? ALL_CATEGORIES.filter((cat) => cat.slug !== "generateur-fiches-produit-prix")
      : ALL_CATEGORIES;
    return acc;
  }, {});

  function makeResources(brand, category, year = "2026") {
    const seeds = ["Pack", "Master", "Pro", "Studio", "Essentiel", "Signature"];
    return seeds.map((seed, idx) => {
      const month = String((idx % 9) + 1).padStart(2, "0");
      const day = String((idx % 26) + 1).padStart(2, "0");
      return {
        id: `${brand}-${category.slug}-${year}-${idx}`,
        title: `${category.label} ${seed} ${year}`,
        type: category.ext,
        size: `${(2.2 + idx * 0.8).toFixed(1)} MB`,
        date: `${year}-${month}-${day}`,
        thumb: `Aperçu ${brand}`,
      };
    });
  }

  const MEDIA_DATA = BRANDS.reduce((brandsObj, brand) => {
    const categoryObj = {};

    CATEGORIES_BY_BRAND[brand].forEach((category) => {
      if (category.isGenerator) {
        categoryObj[category.slug] = {
          generator: true,
          description:
            "Module premium de génération de fiches produit/prix. Version prototype (simulation locale).",
          years: YEARS.reduce((acc, year) => {
            acc[year] = [];
            return acc;
          }, {}),
        };
        return;
      }

      const byYear = YEARS.reduce((acc, year) => {
        acc[year] = category.yearly ? makeResources(brand, category, year) : makeResources(brand, category, "2026");
        return acc;
      }, {});

      categoryObj[category.slug] = {
        generator: false,
        years: byYear,
      };
    });

    brandsObj[brand] = categoryObj;
    return brandsObj;
  }, {});

  window.MediaCenterData = {
    years: YEARS,
    brands: BRANDS,
    categoriesByBrand: CATEGORIES_BY_BRAND,
    mediaData: MEDIA_DATA,
  };
})();

// Notes architecture: dataset généré de façon déterministe pour limiter la duplication massive,
// tout en exposant un objet structuré brand -> category -> years compatible avec un vrai backend futur.
