const CONTACT_EMAIL = "hucstudios.contato@gmail.com";

async function sendEmailNotification(leadId, token, formData, plan) {
  const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      _subject: `Novo contato HUC Studios — ${plan}`,
      _template: "table",
      _captcha: "false",
      _replyto: formData.email,
      "ID no painel": `#${leadId}`,
      Nome: formData.name,
      "E-mail do interessado": formData.email,
      "Instagram ou empresa": formData.company || "Não informado",
      Plano: plan,
      "Melhor período para contato": formData.period,
      "Objetivo do projeto": formData.project,
    }),
  });

  const result = await response.json().catch(() => null);
  if (!response.ok || result?.success === false || result?.success === "false") {
    throw new Error(result?.message || "O serviço de e-mail não aceitou a notificação.");
  }

  await fetch("/api/leads/notification", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: leadId, token }),
  });
}

export function initContactModal() {
  const modal = document.querySelector("#contact-modal");
  const closeButton = document.querySelector("#modal-close");
  const successClose = document.querySelector("#success-close");
  const loading = document.querySelector("#contact-loading");
  const content = document.querySelector("#contact-content");
  const success = document.querySelector("#contact-success");
  const planLabel = document.querySelector("#selected-plan");
  const form = document.querySelector("#contact-form");
  const submitButton = document.querySelector("#contact-submit");
  const errorBox = document.querySelector("#contact-error");

  let selectedPlan = "Personalizado";
  let loadingTimer = null;

  function setError(message = "") {
    errorBox.hidden = !message;
    errorBox.innerHTML = message
      ? `${message} Se preferir, escreva para <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.`
      : "";
  }

  function openModal(plan) {
    selectedPlan = plan || "Personalizado";
    planLabel.textContent = selectedPlan;
    setError();
    form.reset();
    loading.hidden = false;
    content.hidden = true;
    success.hidden = true;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    clearTimeout(loadingTimer);
    loadingTimer = window.setTimeout(() => {
      loading.hidden = true;
      content.hidden = false;
      form.querySelector("input[name=name]")?.focus();
    }, 850);
  }

  function closeModal() {
    clearTimeout(loadingTimer);
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest(".js-contact");
    if (trigger) openModal(trigger.dataset.plan);
  });

  closeButton.addEventListener("click", closeModal);
  successClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => { if (event.target === modal) closeModal(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && modal.classList.contains("is-open")) closeModal(); });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setError();
    submitButton.disabled = true;
    submitButton.firstChild.textContent = "Enviando... ";

    const raw = new FormData(form);
    const contact = {
      name: String(raw.get("name") || ""),
      email: String(raw.get("email") || ""),
      company: String(raw.get("company") || ""),
      project: String(raw.get("project") || ""),
      period: String(raw.get("period") || ""),
    };

    try {
      if (location.protocol === "file:" || location.hostname.endsWith("github.io")) {
        throw new Error("O formulário precisa ser usado na versão online com o backend configurado.");
      }

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan, ...contact, website: raw.get("website") }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Não foi possível enviar.");

      if (!result.notificationSent && result.lead?.id && result.notificationClientToken) {
        try {
          await sendEmailNotification(result.lead.id, result.notificationClientToken, contact, selectedPlan);
        } catch (emailError) {
          console.error("Não foi possível enviar a notificação por e-mail.", emailError);
        }
      }

      content.hidden = true;
      success.hidden = false;
      form.reset();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Não foi possível enviar agora.");
    } finally {
      submitButton.disabled = false;
      submitButton.firstChild.textContent = "Enviar solicitação ";
    }
  });
}
