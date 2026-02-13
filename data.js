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

  const BRAND_IMAGES = {
    Chausson: "https://images.unsplash.com/photo-1501706362039-c6e80948f5d6?auto=format&fit=crop&w=1600&q=80",
    Challenger: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1600&q=80",
    Caravelair: "https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1600&q=80",
    Sterckeman: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=1600&q=80",
    Rubis: "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1600&q=80",
    "Mini Freestyle": "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1600&q=80",
  };

  const CATEGORY_IMAGES = {
    "photos-hd": "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1400&q=80",
    "dossiers-presse": "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=80",
    logo: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1400&q=80",
    implantations: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=80",
    "catalogues-brochures": "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=80",
    "supports-video": "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1400&q=80",
  };

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
        thumbUrl: CATEGORY_IMAGES[category.slug],
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
        acc[year] = category.yearly
          ? makeResources(brand, category, year)
          : makeResources(brand, category, "2026");
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
    brandImages: BRAND_IMAGES,
    categoriesByBrand: CATEGORIES_BY_BRAND,
    mediaData: MEDIA_DATA,
  };
})();

// Notes architecture: données mock enrichies avec visuels premium (marques + catégories),
// tout en gardant une structure brand -> category -> year prête pour un futur backend API.
