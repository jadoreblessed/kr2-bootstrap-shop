const plants = {
  monstera: {
    name: "Монстера",
    badge: "Популярное",
    price: "2 490 ₽",
    description: "Монстера — крупное растение с выразительными резными листьями. Подойдёт для светлой комнаты, где есть место для роста.",
    light: "Яркий рассеянный свет",
    water: "После подсыхания верхнего слоя грунта",
    height: "До 80 см",
    pot: "Ø 17 см",
    care: "Умеренная",
    image: "images/photos/monstera.jpg",
    detailImage: "images/photos/leaves.jpg"
  },
  zamioculcas: {
    name: "Замиокулькас",
    badge: "Простой уход",
    price: "1 890 ₽",
    description: "Замиокулькас хорошо подходит тем, кто ищет неприхотливое растение с плотной зелёной листвой.",
    light: "Полутень или умеренный свет",
    water: "После заметного просыхания грунта",
    height: "До 70 см",
    pot: "Ø 14 см",
    care: "Простая",
    image: "images/photos/zamioculcas.jpg",
    detailImage: "images/photos/zamioculcas-detail.jpg"
  },
  ficus: {
    name: "Фикус",
    badge: "Для гостиной",
    price: "3 290 ₽",
    description: "Фикус станет заметным зелёным акцентом в комнате. Ему подойдёт постоянное светлое место.",
    light: "Яркий рассеянный свет",
    water: "Когда подсохнет верхний слой грунта",
    height: "До 100 см",
    pot: "Ø 21 см",
    care: "Умеренная",
    image: "images/photos/ficus.jpg",
    detailImage: "images/photos/ficus-detail.jpg"
  },
  pilea: {
    name: "Пилея",
    badge: "Компактное",
    price: "1 290 ₽",
    description: "Пилея занимает немного места и подходит для полки или рабочего стола.",
    light: "Умеренный рассеянный свет",
    water: "После лёгкого подсыхания грунта",
    height: "До 30 см",
    pot: "Ø 12 см",
    care: "Простая",
    image: "images/photos/pilea.jpg",
    detailImage: "images/photos/pilea-detail.jpg"
  },
  sansevieria: {
    name: "Сансевиерия",
    badge: "Для начинающих",
    price: "1 590 ₽",
    description: "Сансевиерия переносит разные условия и не требует частого полива.",
    light: "Умеренный свет или полутень",
    water: "После полного просыхания грунта",
    height: "До 60 см",
    pot: "Ø 14 см",
    care: "Простая",
    image: "images/photos/sansevieria.jpg",
    detailImage: "images/photos/sansevieria-detail.jpg"
  },
  spathiphyllum: {
    name: "Спатифиллум",
    badge: "Для спальни",
    price: "1 790 ₽",
    description: "Спатифиллум сочетает тёмно-зелёные листья и светлые цветы. Предпочитает место без прямого солнца.",
    light: "Умеренный рассеянный свет",
    water: "Поддерживать грунт слегка влажным",
    height: "До 50 см",
    pot: "Ø 14 см",
    care: "Умеренная",
    image: "images/photos/spathiphyllum.jpg",
    detailImage: "images/photos/spathiphyllum-detail.jpg"
  },
  calathea: {
    name: "Калатея",
    badge: "Узорная листва",
    price: "2 190 ₽",
    description: "Калатею выбирают за необычный рисунок листьев. Ей нравится рассеянный свет.",
    light: "Умеренный рассеянный свет",
    water: "Не допускать полного пересыхания грунта",
    height: "До 50 см",
    pot: "Ø 14 см",
    care: "Умеренная",
    image: "images/photos/calathea.jpg",
    detailImage: "images/photos/calathea-detail.jpg"
  },
  aloe: {
    name: "Алоэ",
    badge: "Солнечное место",
    price: "990 ₽",
    description: "Алоэ — компактное растение для светлого подоконника. Избыток полива ему не нужен.",
    light: "Яркий свет",
    water: "После полного просыхания грунта",
    height: "До 35 см",
    pot: "Ø 12 см",
    care: "Простая",
    image: "images/photos/aloe.jpg",
    detailImage: "images/photos/aloe-detail.jpg"
  },
  philodendron: {
    name: "Филодендрон",
    badge: "Зелёный акцент",
    price: "2 090 ₽",
    description: "Филодендрон добавит комнате пышной зелени и подойдёт для места с рассеянным светом.",
    light: "Умеренный рассеянный свет",
    water: "После подсыхания верхнего слоя грунта",
    height: "До 70 см",
    pot: "Ø 17 см",
    care: "Простая",
    image: "images/photos/philodendron.jpg",
    detailImage: "images/photos/philodendron-detail.jpg"
  }
};

const fallbackImage = "images/plant.svg";

document.querySelectorAll("img[data-fallback]").forEach((image) => {
  image.addEventListener("error", () => {
    if (!image.src.endsWith("/images/plant.svg")) {
      image.src = fallbackImage;
    }
  });
});

// Каталог: поиск и фильтры.
const filters = document.querySelector("#catalogFilters");

if (filters) {
  const search = document.querySelector("#searchPlant");
  const light = document.querySelector("#lightFilter");
  const care = document.querySelector("#careFilter");
  const sort = document.querySelector("#sortFilter");
  const grid = document.querySelector("#catalogGrid");
  const cards = [...document.querySelectorAll(".plant-item")];
  const count = document.querySelector("#catalogCount");
  const emptyState = document.querySelector("#emptyState");

  function applyFilters() {
    const query = search.value.trim().toLocaleLowerCase("ru");
    let visible = 0;

    const sorted = [...cards].sort((a, b) => {
      if (sort.value === "price-asc") return Number(a.dataset.price) - Number(b.dataset.price);
      if (sort.value === "price-desc") return Number(b.dataset.price) - Number(a.dataset.price);
      return cards.indexOf(a) - cards.indexOf(b);
    });
    grid.append(...sorted);

    cards.forEach((card) => {
      const matches =
        card.dataset.name.includes(query) &&
        (!light.value || card.dataset.light === light.value) &&
        (!care.value || card.dataset.care === care.value);

      card.classList.toggle("d-none", !matches);
      if (matches) visible += 1;
    });

    count.textContent = `Показано растений: ${visible}`;
    emptyState.classList.toggle("d-none", visible !== 0);
  }

  filters.addEventListener("input", applyFilters);
  filters.addEventListener("change", applyFilters);
  filters.addEventListener("reset", () => setTimeout(applyFilters, 0));
  filters.addEventListener("submit", (event) => event.preventDefault());
}

// Каталог: быстрый просмотр через Bootstrap modal.
const quickModal = document.querySelector("#quickModal");

if (quickModal) {
  quickModal.addEventListener("show.bs.modal", (event) => {
    const slug = event.relatedTarget?.dataset.quick;
    const plant = plants[slug];

    if (!plant) return;

    document.querySelector("#quickModalTitle").textContent = plant.name;
    document.querySelector("#quickDescription").textContent = plant.description;
    document.querySelector("#quickCare").textContent =
      `Освещение: ${plant.light}. Уход: ${plant.care.toLowerCase()}. Высота: ${plant.height.toLowerCase()}. Горшок: ${plant.pot}.`;
    document.querySelector("#quickPrice").textContent = plant.price;

    const image = document.querySelector("#quickImage");
    image.src = plant.image;
    image.alt = `Фото растения: ${plant.name}`;

    document.querySelector("#quickDetails").href = `product.html?plant=${slug}`;
    document.querySelector("#quickOrder").href = `order.html?plant=${slug}`;
  });
}

// Карточка товара: один шаблон показывает растение из адреса страницы.
const productName = document.querySelector("#productName");

if (productName) {
  const slug = new URLSearchParams(window.location.search).get("plant");
  const selectedSlug = plants[slug] ? slug : "monstera";
  const plant = plants[selectedSlug];

  document.title = `${plant.name} — ROOM`;
  productName.textContent = plant.name;
  document.querySelector("#productCrumb").textContent = plant.name;
  document.querySelector("#productBadge").textContent = plant.badge;
  document.querySelector("#productDescription").textContent = plant.description;
  document.querySelector("#productPrice").textContent = plant.price;
  document.querySelector("#productLight").textContent = plant.light;
  document.querySelector("#productWater").textContent = plant.water;
  document.querySelector("#productHeight").textContent = plant.height;
  document.querySelector("#productPot").textContent = plant.pot;
  document.querySelector("#productCare").textContent = plant.care;
  document.querySelector("#productOrder").href = `order.html?plant=${selectedSlug}`;

  const image = document.querySelector("#productImage");
  image.src = plant.image;
  image.alt = `Фото растения: ${plant.name}`;

  const thumbnails = document.querySelector("#productThumbnails");
  [plant.image, plant.detailImage].forEach((src, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `product-thumb${index === 0 ? " active" : ""}`;
    button.setAttribute("aria-label", `Показать фото ${index + 1}: ${plant.name}`);
    button.setAttribute("aria-pressed", String(index === 0));

    const thumbnail = document.createElement("img");
    thumbnail.src = src;
    thumbnail.alt = "";
    button.append(thumbnail);
    button.addEventListener("click", () => {
      image.src = src;
      image.alt = `${plant.name}: фото ${index + 1} из 2`;
      thumbnails.querySelectorAll("button").forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
    });
    thumbnails.append(button);
  });

  const related = Object.entries(plants)
    .filter(([key]) => key !== selectedSlug)
    .sort(([, a], [, b]) =>
      Number(b.light === plant.light) + Number(b.care === plant.care) -
      Number(a.light === plant.light) - Number(a.care === plant.care))
    .slice(0, 3);
  document.querySelector("#relatedGrid").innerHTML = related.map(([key, item]) => `
    <div class="col-12 col-md-6 col-lg-4">
      <article class="card plant-card h-100">
        <img class="card-img-top plant-photo" src="${item.image}" alt="${item.name}" loading="lazy">
        <div class="card-body d-flex flex-column p-4">
          <h3 class="h5 card-title">${item.name}</h3>
          <p class="text-secondary small">${item.light} · ${item.height.toLowerCase()}</p>
          <div class="d-flex justify-content-between align-items-center gap-2 mt-auto">
            <strong>${item.price}</strong>
            <a class="btn btn-outline-dark" href="product.html?plant=${key}">Подробнее</a>
          </div>
        </div>
      </article>
    </div>`).join("");
}

// Заявка: подставляем растение из ссылки и проверяем форму.
const orderForm = document.querySelector("#orderForm");

if (orderForm) {
  const slug = new URLSearchParams(window.location.search).get("plant");
  const plantSelect = document.querySelector("#orderPlant");
  const result = document.querySelector("#formResult");

  if (plants[slug]) {
    plantSelect.value = slug;
  }

  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!orderForm.checkValidity()) {
      orderForm.reportValidity();
      return;
    }

    const plant = plants[plantSelect.value];
    result.textContent =
      `Форма для растения «${plant.name}» заполнена корректно. ` +
      "Это предварительный просмотр: данные никуда не отправлены.";
    result.classList.remove("d-none");
    result.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  orderForm.addEventListener("reset", () => {
    result.classList.add("d-none");
    result.textContent = "";
  });
}
