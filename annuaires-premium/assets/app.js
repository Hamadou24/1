/* Mock data: replace later with API */
const listings = [
  { id: 1, name: "Pizzeria Bella Napoli", category: "Restaurant", city: "Lyon", rating: 4.7, premium: true, phone: "+33 4 72 00 00 01", website: "https://bella-napoli.example", email: "contact@bella-napoli.example" },
  { id: 2, name: "Plombier Express", category: "Artisan", city: "Paris", rating: 4.9, premium: true, phone: "+33 1 45 00 00 02", website: "https://plombier-express.example", email: "hello@plombier-express.example" },
  { id: 3, name: "Salon Élégance", category: "Coiffure", city: "Lille", rating: 4.4, premium: false, phone: "+33 3 20 00 00 03", website: "https://elegance.example", email: "info@elegance.example" },
  { id: 4, name: "Boulangerie du Marché", category: "Boulangerie", city: "Bordeaux", rating: 4.6, premium: false, phone: "+33 5 56 00 00 04", website: "https://boulangerie-marche.example", email: "bonjour@boulangerie-marche.example" },
  { id: 5, name: "Garage AutoPro", category: "Garage", city: "Marseille", rating: 4.2, premium: false, phone: "+33 4 91 00 00 05", website: "https://autopro.example", email: "contact@autopro.example" },
  { id: 6, name: "Maison Gourmande", category: "Restaurant", city: "Paris", rating: 4.8, premium: true, phone: "+33 1 42 00 00 06", website: "https://maison-gourmande.example", email: "bonjour@maison-gourmande.example" },
  { id: 7, name: "Studio Yoga Zen", category: "Sport & Bien-être", city: "Nantes", rating: 4.5, premium: false, phone: "+33 2 40 00 00 07", website: "https://yogazen.example", email: "hello@yogazen.example" },
];

/* Elements */
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const citySelect = document.getElementById("citySelect");
const sortSelect = document.getElementById("sortSelect");
const premiumOnlyInput = document.getElementById("premiumOnly");
const resultsGrid = document.getElementById("resultsGrid");
const resultsCount = document.getElementById("resultsCount");
const jsonldListing = document.getElementById("jsonld-listing");

/* Modal */
const addModal = document.getElementById("addBusinessModal");
const openAddModalBtn = document.getElementById("openAddModalBtn");
const footerAddBusiness = document.getElementById("footerAddBusiness");
const closeAddModalBtn = document.getElementById("closeAddModalBtn");
const cancelAddModalBtn = document.getElementById("cancelAddModalBtn");
const addBusinessForm = document.getElementById("addBusinessForm");

function openModal() {
  addModal.classList.add("open");
  addModal.setAttribute("aria-hidden", "false");
}
function closeModal() {
  addModal.classList.remove("open");
  addModal.setAttribute("aria-hidden", "true");
}

openAddModalBtn?.addEventListener("click", openModal);
footerAddBusiness?.addEventListener("click", (e) => { e.preventDefault(); openModal(); });
closeAddModalBtn?.addEventListener("click", closeModal);
cancelAddModalBtn?.addEventListener("click", closeModal);
addModal?.addEventListener("click", (e) => {
  if (e.target && e.target.hasAttribute("data-close-modal")) closeModal();
});

addBusinessForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(addBusinessForm);
  const business = Object.fromEntries(formData.entries());
  business.premium = formData.get("premium") === "on";
  console.log("Submission:", business);
  alert("Merci ! Votre demande a été envoyée. Nous vous contacterons prochainement.");
  addBusinessForm.reset();
  closeModal();
});

/* Populate filters */
(function initFilters() {
  const categories = Array.from(new Set(listings.map(l => l.category))).sort();
  const cities = Array.from(new Set(listings.map(l => l.city))).sort();

  categorySelect.innerHTML = '<option value="">Toutes catégories</option>' +
    categories.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
  citySelect.innerHTML = '<option value="">Toutes villes</option>' +
    cities.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
})();

/* Search/filter/sort */
function normalize(text) {
  return text.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

function filterAndSort() {
  const q = normalize(searchInput.value || "");
  const cat = categorySelect.value;
  const city = citySelect.value;
  const premiumOnly = premiumOnlyInput.checked;
  const sort = sortSelect.value;

  let result = listings.filter(l => {
    const inQuery = !q || [l.name, l.category, l.city].some(v => normalize(v).includes(q));
    const inCat = !cat || l.category === cat;
    const inCity = !city || l.city === city;
    const inPremium = !premiumOnly || l.premium;
    return inQuery && inCat && inCity && inPremium;
  });

  // Premium first for relevance
  if (sort === "relevance") {
    result.sort((a, b) => Number(b.premium) - Number(a.premium) || b.rating - a.rating);
  } else if (sort === "rating") {
    result.sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name));
  } else if (sort === "name") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  }

  renderResults(result);
  updateJsonLd(result);
}

[searchInput, categorySelect, citySelect, sortSelect, premiumOnlyInput]
  .forEach(el => el && el.addEventListener("input", filterAndSort));

/* Render */
function escapeHtml(s) { return String(s).replace(/[&<>\"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c])); }

function renderResults(items) {
  resultsGrid.innerHTML = items.map(item => {
    const websiteBtn = item.website ? `<a class="btn" href="${item.website}" target="_blank" rel="nofollow noopener">Site web</a>` : "";
    const phoneBtn = item.phone ? `<a class="btn" href="tel:${item.phone.replace(/\s+/g,'')}">Appeler</a>` : "";
    const emailBtn = item.email ? `<a class="btn" href="mailto:${item.email}">Email</a>` : "";
    return `
      <article class="card" role="listitem" aria-label="${escapeHtml(item.name)}">
        <div class="card-header">
          <h3 class="card-title">${escapeHtml(item.name)}</h3>
          ${item.premium ? '<span class="premium-badge"><span class="dot"></span> Premium</span>' : ''}
        </div>
        <div class="card-sub">${escapeHtml(item.category)} • ${escapeHtml(item.city)}</div>
        <div class="card-meta">
          <span class="rating">★ ${item.rating.toFixed(1)}</span>
          <span class="tag">${item.premium ? 'Mise en avant' : 'Standard'}</span>
        </div>
        <div class="card-actions">
          ${websiteBtn}
          ${phoneBtn}
          ${emailBtn}
        </div>
      </article>
    `;
  }).join("");

  const count = items.length;
  resultsCount.textContent = `${count} ${count > 1 ? 'résultats' : 'résultat'}`;
}

/* JSON-LD for first N items */
function updateJsonLd(items) {
  const top = items.slice(0, 10).map(item => ({
    "@type": "LocalBusiness",
    name: item.name,
    address: { "@type": "PostalAddress", addressLocality: item.city, addressCountry: "FR" },
    url: item.website || undefined,
    telephone: item.phone || undefined,
    aggregateRating: item.rating ? { "@type": "AggregateRating", ratingValue: item.rating, reviewCount: Math.round(item.rating * 20) } : undefined,
  }));
  const json = { "@context": "https://schema.org", "@type": "ItemList", itemListElement: top };
  jsonldListing.textContent = JSON.stringify(json, null, 2);
}

// Initial render
filterAndSort();