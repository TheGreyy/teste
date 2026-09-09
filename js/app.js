import { benefits, portfolio, plans, tickerText } from "./data.js";
import { initTheme } from "./theme.js";
import { initContactModal } from "./contact.js";

function renderTicker() {
  const track = document.querySelector("#ticker-track");
  track.innerHTML = Array.from({ length: 4 }, (_, index) =>
    `<span ${index ? 'aria-hidden="true"' : ''}>${tickerText}</span>`
  ).join("");
}

function renderBenefits() {
  document.querySelector("#benefit-grid").innerHTML = benefits.map(({ icon, title, text }) => `
    <article>
      <div class="benefit-icon">${icon}</div>
      <h3>${title}</h3>
      <p>${text}</p>
    </article>
  `).join("");
}

function renderPortfolio() {
  document.querySelector("#portfolio-grid").innerHTML = portfolio.map((item, index) => `
    <a class="work-card work-${index + 1}" href="${item.url}" target="_blank" rel="noreferrer" aria-label="Ver ${item.title} no Instagram">
      <img src="${item.image}" alt="Arte de ${item.title} produzida pela HUC Studios" loading="lazy" />
      <div class="portfolio-placeholder" aria-hidden="true">${item.title}<br><small>adicione a imagem em /portfolio</small></div>
      <div class="work-overlay"><span>${item.category}</span><h3>${item.title}</h3><b>↗</b></div>
    </a>
  `).join("");

  document.querySelectorAll(".work-card img").forEach((image) => {
    const placeholder = image.nextElementSibling;
    image.addEventListener("load", () => { placeholder.hidden = true; });
    image.addEventListener("error", () => { image.classList.add("is-missing"); placeholder.hidden = false; });
  });
}

function renderPlans() {
  document.querySelector("#plans-grid").innerHTML = plans.map((plan) => `
    <article class="plan-card ${plan.featured ? "featured" : ""} ${plan.color}">
      ${plan.featured ? '<div class="popular">MAIS ESCOLHIDO</div>' : ""}
      <div class="plan-head"><p>${plan.tag}</p><h3>${plan.name}</h3></div>
      <div class="plan-price"><span>R$</span><strong>${plan.price}</strong><small>/mês</small></div>
      <ul>${plan.items.map(item => `<li><b>✓</b>${item}</li>`).join("")}</ul>
      <button class="button plan-button js-contact" data-plan="${plan.name}" type="button">Quero o ${plan.name} <span>↗</span></button>
    </article>
  `).join("");
}

function showLocalDevelopmentNote() {
  if (location.protocol === "file:") document.querySelector("#dev-note").hidden = false;
}

renderTicker();
renderBenefits();
renderPortfolio();
renderPlans();
initTheme();
initContactModal();
showLocalDevelopmentNote();
