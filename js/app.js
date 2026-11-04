const plants = {
  monstera: {
    name: "Монстера",
    badge: "Популярное",
    price: "2 490 ₽",
    description: "Монстера — крупное растение с выразительными резными листьями. Подойдёт для светлой комнаты, где есть место для роста.",
    light: "Яркий рассеянный свет",
    water: "После подсыхания верхнего слоя грунта",
    height: "До 80 см",
    care: "Умеренная",
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1000&q=85"
  },
  zamioculcas: {
    name: "Замиокулькас",
    badge: "Простой уход",
    price: "1 890 ₽",
    description: "Замиокулькас хорошо подходит тем, кто ищет неприхотливое растение с плотной зелёной листвой.",
    light: "Полутень или умеренный свет",
    water: "После заметного просыхания грунта",
    height: "До 70 см",
    care: "Простая",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1000&q=85"
  },
  ficus: {
    name: "Фикус",
    badge: "Для гостиной",
    price: "3 290 ₽",
    description: "Фикус станет заметным зелёным акцентом в комнате. Ему подойдёт постоянное светлое место.",
    light: "Яркий рассеянный свет",
    water: "Когда подсохнет верхний слой грунта",
    height: "До 100 см",
    care: "Умеренная",
    image: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?w=1000&q=85"
  },
  pilea: {
    name: "Пилея",
    badge: "Компактное",
    price: "1 290 ₽",
    description: "Пилея занимает немного места и подходит для полки или рабочего стола.",
    light: "Умеренный рассеянный свет",
    water: "После лёгкого подсыхания грунта",
    height: "До 30 см",
    care: "Простая",
    image: "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=1000&q=85"
  },
  sansevieria: {
    name: "Сансевиерия",
    badge: "Для начинающих",
    price: "1 590 ₽",
    description: "Сансевиерия переносит разные условия и не требует частого полива.",
    light: "Умеренный свет или полутень",
    water: "После полного просыхания грунта",
    height: "До 60 см",
    care: "Простая",
    image: "https://images.unsplash.com/photo-1463320726281-696a485928c7?w=1000&q=85"
  },
  spathiphyllum: {
    name: "Спатифиллум",
    badge: "Для спальни",
    price: "1 790 ₽",
    description: "Спатифиллум сочетает тёмно-зелёные листья и светлые цветы. Предпочитает место без прямого солнца.",
    light: "Умеренный рассеянный свет",
    water: "Поддерживать грунт слегка влажным",
    height: "До 50 см",
    care: "Умеренная",
    image: "https://images.unsplash.com/photo-1525498128493-380d1990a112?w=1000&q=85"
  },
  calathea: {
    name: "Калатея",
    badge: "Узорная листва",
    price: "2 190 ₽",
    description: "Калатею выбирают за необычный рисунок листьев. Ей нравится рассеянный свет.",
    light: "Умеренный рассеянный свет",
    water: "Не допускать полного пересыхания грунта",
    height: "До 50 см",
    care: "Умеренная",
    image: "https://images.unsplash.com/photo-1545241047-6083a3684587?w=1000&q=85"
  },
  aloe: {
    name: "Алоэ",
    badge: "Солнечное место",
    price: "990 ₽",
    description: "Алоэ — компактное растение для светлого подоконника. Избыток полива ему не нужен.",
    light: "Яркий свет",
    water: "После полного просыхания грунта",
    height: "До 35 см",
    care: "Простая",
    image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=1000&q=85"
  },
  philodendron: {
    name: "Филодендрон",
    badge: "Зелёный акцент",
    price: "2 090 ₽",
    description: "Филодендрон добавит комнате пышной зелени и подойдёт для места с рассеянным светом.",
    light: "Умеренный рассеянный свет",
    water: "После подсыхания верхнего слоя грунта",
    height: "До 70 см",
    care: "Простая",
    image: "https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=1000&q=85"
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
  const cards = [...document.querySelectorAll(".plant-item")];
  const count = document.querySelector("#catalogCount");
  const emptyState = document.querySelector("#emptyState");

  function applyFilters() {
    const query = search.value.trim().toLocaleLowerCase("ru");
    let visible = 0;

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
      `Освещение: ${plant.light}. Уход: ${plant.care.toLowerCase()}.`;
    document.querySelector("#quickPrice").textContent = plant.price;

    const image = document.querySelector("#quickImage");
    image.src = plant.image;
    image.alt = `Иллюстрация растения: ${plant.name}`;

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
  document.querySelector("#productCare").textContent = plant.care;
  document.querySelector("#productOrder").href = `order.html?plant=${selectedSlug}`;

  const image = document.querySelector("#productImage");
  image.src = plant.image;
  image.alt = `Иллюстрация растения: ${plant.name}`;
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
      "Это демонстрационный проект: данные не отправлены.";
    result.classList.remove("d-none");
    result.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  orderForm.addEventListener("reset", () => {
    result.classList.add("d-none");
    result.textContent = "";
  });
}