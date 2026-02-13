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

  const BRAND_LOGOS = {
    "Mini Freestyle": "2._0000_logo-Mini-freestyle.png",
    Challenger: "2._0001_Logo-Challenger.png",
    Sterckeman: "2._0002_Logo-Sterckeman.png",
    Rubis: "2._0003_Logo-Rubis.png",
    Chausson: "2._0004_Logo-Chausson.png",
    Caravelair: "2._0005_Logo-Caravelair.png",
  };

  const BRAND_IMAGES = {
    Caravelair: "Caravelair.jpg",
    Challenger: "Challenger.jpg",
    Chausson: "Chausson.jpg",
    "Mini Freestyle": "Mini Freestyle.jpg",
    Rubis: "Rubis.jpg",
    Sterckeman: "Sterckeman.jpg",
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
    brandLogos: BRAND_LOGOS,
    categoriesByBrand: CATEGORIES_BY_BRAND,
    mediaData: MEDIA_DATA,
  };
})();

// Notes architecture: données mock priorisent les assets déposés localement (logos + visuels marque),
// sans fallback: les visuels proviennent exclusivement des fichiers PNG/JPG fournis pour les marques.
