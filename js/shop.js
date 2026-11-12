// функции магазина работают в браузере и сохраняют данные на этом устройстве
const roomStore = {
  read(key, fallback) {
    try { return JSON.parse(localStorage.getItem(`room-${key}`)) ?? fallback; }
    catch { return fallback; }
  },
  write(key, value) {
    try { localStorage.setItem(`room-${key}`, JSON.stringify(value)); return true; }
    catch { return false; }
  }
};

const plantSlugs = Object.keys(plants);
const money = (value) => new Intl.NumberFormat("ru-RU").format(value) + " ₽";
const priceNumber = (slug) => Number(plants[slug].price.replace(/\D/g, ""));
const safeText = (value) => String(value).replace(/[&<>"']/g, (symbol) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[symbol]);
const validCart = () => {
  const cart = roomStore.read("cart", {});
  return Object.fromEntries(Object.entries(cart).filter(([slug, count]) =>
    plantSlugs.includes(slug) && Number.isInteger(count) && count > 0 && count <= 99));
};
const validFavorites = () => roomStore.read("favorites", []).filter((slug) => plantSlugs.includes(slug));

function updateCounts() {
  const cartCount = Object.values(validCart()).reduce((sum, count) => sum + count, 0);
  document.querySelectorAll("[data-cart-count]").forEach((node) => node.textContent = cartCount);
  document.querySelectorAll("[data-favorites-count]").forEach((node) => node.textContent = validFavorites().length);
}

const nav = document.querySelector(".navbar-nav");
if (nav) {
  const orderLink = nav.querySelector('a[href="order.html"]');
  const links = document.createElement("div");
  links.className = "room-nav-tools d-flex flex-wrap align-items-xl-center gap-2 ms-xl-2";
  links.innerHTML = '<a class="room-tool-link" href="favorites.html" aria-label="Избранное">♡ <span data-favorites-count>0</span></a>' +
    '<a class="room-tool-link" href="cart.html" aria-label="Корзина">Корзина <span data-cart-count>0</span></a>' +
    '<a class="room-tool-link" href="account.html">Кабинет</a>';
  if (orderLink) orderLink.before(links); else nav.append(links);
}
updateCounts();

function favoriteButton(slug) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "room-favorite-button";
  button.dataset.favorite = slug;
  button.setAttribute("aria-label", `Добавить ${plants[slug].name} в избранное`);
  button.textContent = "♡";
  return button;
}
function cartButton(slug) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn btn-room btn-sm";
  button.dataset.addCart = slug;
  button.textContent = "В корзину";
  return button;
}
function syncFavoriteButtons() {
  const favorites = validFavorites();
  document.querySelectorAll("[data-favorite]").forEach((button) => {
    const active = favorites.includes(button.dataset.favorite);
    button.classList.toggle("active", active);
    button.textContent = active ? "♥" : "♡";
    button.setAttribute("aria-pressed", String(active));
    button.setAttribute("aria-label", `${active ? "Убрать" : "Добавить"} ${plants[button.dataset.favorite].name} ${active ? "из" : "в"} избранного`);
  });
  updateCounts();
}

document.querySelectorAll(".plant-card").forEach((card) => {
  const link = card.querySelector('a[href*="product.html?plant="]');
  const slug = link && new URL(link.href).searchParams.get("plant");
  if (!plants[slug]) return;
  card.style.position = "relative";
  card.append(favoriteButton(slug));
  const body = card.querySelector(".card-body");
  if (body) {
    const row = document.createElement("div");
    row.className = "mt-3";
    row.append(cartButton(slug));
    body.append(row);
  }
});
if (document.querySelector("#productName")) {
  const slug = new URLSearchParams(location.search).get("plant");
  const current = plants[slug] ? slug : "monstera";
  const actions = document.querySelector("#productOrder")?.parentElement;
  if (actions) { actions.append(cartButton(current), favoriteButton(current)); }

  const reviews = document.createElement("section");
  reviews.className = "room-reviews pb-5";
  reviews.innerHTML = `<div class="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-4"><div><span class="eyebrow">МНЕНИЯ</span><h2 class="h3 mt-2 mb-0">Отзывы о растении</h2></div><span class="text-secondary small">Отзывы сохраняются только в вашем браузере</span></div><div id="reviewList" class="row g-3 mb-4"></div><form id="reviewForm" class="care-panel p-4"><h3 class="h5 mb-3">Оставить отзыв</h3><div class="row g-3"><div class="col-md-6"><label class="form-label" for="reviewName">Ваше имя</label><input class="form-control" id="reviewName" maxlength="40" required></div><div class="col-md-6"><label class="form-label" for="reviewRating">Оценка</label><select class="form-select" id="reviewRating" required><option value="5">5 — отлично</option><option value="4">4 — хорошо</option><option value="3">3 — нормально</option><option value="2">2 — не очень</option><option value="1">1 — плохо</option></select></div><div class="col-12"><label class="form-label" for="reviewText">Ваше мнение</label><textarea class="form-control" id="reviewText" rows="3" minlength="10" maxlength="500" required></textarea></div><div class="col-12"><button class="btn btn-room" type="submit">Опубликовать отзыв здесь</button></div></div></form>`;
  document.querySelector("#relatedGrid").closest("section").before(reviews);
  const list = reviews.querySelector("#reviewList");
  function renderReviews() {
    const items = roomStore.read(`reviews-${current}`, []).slice(-20).reverse();
    list.innerHTML = items.length ? items.map((item) => `<div class="col-md-6"><article class="room-review h-100"><div class="room-stars" aria-label="${item.rating} из 5">${"★".repeat(item.rating)}${"☆".repeat(5 - item.rating)}</div><strong>${safeText(item.name)}</strong><p class="mb-0 mt-2">${safeText(item.text)}</p></article></div>`).join("") : '<div class="col-12"><p class="text-secondary mb-0">Пока нет отзывов. Вы можете оставить первый.</p></div>';
  }
  reviews.querySelector("#reviewForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const item = { name: form.querySelector("#reviewName").value.trim(), rating: Number(form.querySelector("#reviewRating").value), text: form.querySelector("#reviewText").value.trim() };
    if (!item.name || item.text.length < 10) return;
    const items = roomStore.read(`reviews-${current}`, []);
    items.push(item);
    roomStore.write(`reviews-${current}`, items.slice(-20));
    form.reset();
    renderReviews();
  });
  renderReviews();
}
syncFavoriteButtons();

document.addEventListener("click", (event) => {
  const favorite = event.target.closest("[data-favorite]");
  if (favorite) {
    const slug = favorite.dataset.favorite;
    const favorites = validFavorites();
    const next = favorites.includes(slug) ? favorites.filter((item) => item !== slug) : [...favorites, slug];
    roomStore.write("favorites", next);
    syncFavoriteButtons();
    if (document.querySelector("#favoritesGrid")) renderFavorites();
  }
  const add = event.target.closest("[data-add-cart]");
  if (add) {
    const cart = validCart();
    cart[add.dataset.addCart] = Math.min(99, (cart[add.dataset.addCart] || 0) + 1);
    roomStore.write("cart", cart);
    updateCounts();
    const old = add.textContent;
    add.textContent = "Добавлено ✓";
    setTimeout(() => add.textContent = old, 1300);
  }
  const change = event.target.closest("[data-quantity]");
  if (change) {
    const cart = validCart();
    const slug = change.dataset.slug;
    cart[slug] = Math.max(0, Math.min(99, (cart[slug] || 0) + Number(change.dataset.quantity)));
    if (!cart[slug]) delete cart[slug];
    roomStore.write("cart", cart);
    renderCart();
  }
});

function plantRow(slug, count) {
  const plant = plants[slug];
  return `<div class="room-cart-row d-flex gap-3 align-items-center"><img src="${plant.image}" alt="${plant.name}"><div class="flex-grow-1"><a class="fw-semibold text-decoration-none" href="product.html?plant=${slug}">${plant.name}</a><div class="text-secondary small">${plant.price} за штуку</div></div><div class="room-stepper"><button type="button" data-quantity="-1" data-slug="${slug}" aria-label="Уменьшить количество ${plant.name}">−</button><span>${count}</span><button type="button" data-quantity="1" data-slug="${slug}" aria-label="Увеличить количество ${plant.name}">+</button></div><strong>${money(priceNumber(slug) * count)}</strong></div>`;
}
function renderCart() {
  const list = document.querySelector("#cartItems");
  if (!list) return;
  const cart = validCart();
  const entries = Object.entries(cart);
  list.innerHTML = entries.length ? entries.map(([slug, count]) => plantRow(slug, count)).join("") : '<div class="room-empty"><h2 class="h4">Корзина пока пуста</h2><p class="text-secondary">Найдите растение в каталоге и добавьте его сюда.</p><a class="btn btn-room" href="catalog.html">Открыть каталог</a></div>';
  document.querySelector("#cartTotal").textContent = money(entries.reduce((sum, [slug, count]) => sum + priceNumber(slug) * count, 0));
  document.querySelector("#checkoutForm").classList.toggle("d-none", !entries.length);
  updateCounts();
}
renderCart();

const checkout = document.querySelector("#checkoutForm");
if (checkout) checkout.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!checkout.reportValidity()) return;
  const cart = validCart();
  if (!Object.keys(cart).length) return;
  const order = { id: `ROOM-${Date.now().toString().slice(-6)}`, date: new Date().toLocaleDateString("ru-RU"), items: cart, total: Object.entries(cart).reduce((sum, [slug, count]) => sum + priceNumber(slug) * count, 0) };
  const history = roomStore.read("orders", []);
  roomStore.write("orders", [order, ...history].slice(0, 20));
  roomStore.write("cart", {});
  checkout.reset();
  renderCart();
  const result = document.querySelector("#checkoutResult");
  result.textContent = `Заявка ${order.id} сохранена в этом браузере. Магазину она не отправлена.`;
  result.classList.remove("d-none");
  result.scrollIntoView({ behavior: "smooth", block: "center" });
});

function renderFavorites() {
  const grid = document.querySelector("#favoritesGrid");
  if (!grid) return;
  const favorites = validFavorites();
  grid.innerHTML = favorites.length ? favorites.map((slug) => `<div class="col-md-6 col-lg-4"><article class="card plant-card h-100"><img class="card-img-top plant-photo" src="${plants[slug].image}" alt="${plants[slug].name}"><div class="card-body"><h2 class="h5">${plants[slug].name}</h2><p class="text-secondary">${plants[slug].description}</p><strong>${plants[slug].price}</strong><div class="d-flex gap-2 mt-3"><a class="btn btn-outline-dark btn-sm" href="product.html?plant=${slug}">Подробнее</a><button class="btn btn-room btn-sm" type="button" data-add-cart="${slug}">В корзину</button><button class="btn btn-outline-danger btn-sm" type="button" data-favorite="${slug}" aria-label="Убрать ${plants[slug].name} из избранного">Убрать</button></div></div></article></div>`).join("") : '<div class="col-12"><div class="room-empty"><h2 class="h4">Пока ничего нет</h2><p class="text-secondary">Нажмите на сердечко у понравившегося растения.</p><a class="btn btn-room" href="catalog.html">Перейти в каталог</a></div></div>';
  syncFavoriteButtons();
}
renderFavorites();

const profileForm = document.querySelector("#profileForm");
if (profileForm) {
  const profile = roomStore.read("profile", {});
  profileForm.querySelector("#profileName").value = profile.name || "";
  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = profileForm.querySelector("#profileName").value.trim().slice(0, 40);
    if (!name) return;
    roomStore.write("profile", { name });
    document.querySelector("#profileGreeting").textContent = `Привет, ${name}!`;
  });
  if (profile.name) document.querySelector("#profileGreeting").textContent = `Привет, ${profile.name}!`;
  const orders = roomStore.read("orders", []);
  document.querySelector("#orderHistory").innerHTML = orders.length ? orders.map((order) => `<article class="room-order mb-3"><div class="d-flex justify-content-between"><strong>${safeText(order.id)}</strong><span>${safeText(order.date)}</span></div><p class="mb-1">${Object.entries(order.items).filter(([slug]) => plants[slug]).map(([slug, count]) => `${plants[slug].name} × ${count}`).join(", ")}</p><strong>${money(order.total)}</strong><div class="small text-secondary">Сохранено только в этом браузере</div></article>`).join("") : '<p class="text-secondary">Пока нет сохранённых заявок из корзины.</p>';
}

// плавное появление блоков с учётом настройки уменьшения движения
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll("main section, .plant-item, .plant-card, .feature-card").forEach((item) => {
    item.classList.add("room-reveal");
    observer.observe(item);
  });
}
