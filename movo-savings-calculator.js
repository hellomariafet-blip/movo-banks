(() => {
  const benefitsMarkup = `
    <div class="transfer-benefits" aria-label="Service benefits">
      <div class="transfer-benefit">
        <span class="benefit-check" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M7 16V11M12 16V8M17 16V5"/></svg></span>
        <span>Compare 20+ partners</span>
      </div>
      <div class="transfer-benefit">
        <span class="benefit-check" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3 4 7v5c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V7l-8-4z"/><path d="m9 12 2 2 4-4"/></svg></span>
        <span>Licensed and trusted partners</span>
      </div>
      <div class="transfer-benefit">
        <span class="benefit-check" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="9" cy="9" r="2"/><circle cx="15" cy="15" r="2"/><path d="m5 19 14-14"/></svg></span>
        <span>Best rates &amp; low fees</span>
      </div>
      <div class="transfer-benefit">
        <span class="benefit-check" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/><circle cx="12" cy="16" r="1"/></svg></span>
        <span>Secure and confidential</span>
      </div>
    </div>`;

  function markup(initiallyHidden) {
    return `
      <form id="savings-form" novalidate${initiallyHidden ? " hidden" : ""}>
        <div class="savings-form-grid">
          <label class="movo-field movo-field--calculator transfer-field">
            <span class="movo-label transfer-label">Amount</span>
            <span class="movo-field__control-row movo-field__control-row--split amount-combo">
              <input class="movo-field__control transfer-input" id="savings-amount" type="text" inputmode="decimal" placeholder="Enter amount" aria-describedby="savings-error"/>
              <span class="movo-field__control savings-currency-label">AED</span>
            </span>
          </label>
          <label class="movo-field movo-field--calculator transfer-field">
            <span class="movo-label transfer-label">Holding period</span>
            <span class="movo-field__control-row select-wrap">
              <select class="movo-field__control transfer-select" id="savings-period" aria-label="Savings period">
                <option>1 month</option>
                <option>3 months</option>
                <option>6 months</option>
                <option selected>12 months</option>
                <option>24 months</option>
                <option>36 months</option>
              </select>
            </span>
          </label>
          <button class="transfer-submit savings-submit" type="submit" aria-label="See Top Offers">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
            <span>See Top Offers</span>
          </button>
        </div>
        <p class="savings-error" id="savings-error" hidden>Please enter an amount greater than zero.</p>
      </form>
      ${benefitsMarkup}`;
  }

  const formatInput = input => {
    const raw = input.value.replace(/,/g, "").replace(/[^0-9.]/g, "");
    const parts = raw.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    input.value = parts.length > 1 ? `${parts[0]}.${parts[1]}` : parts[0];
  };

  const money = value => `AED ${new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 }).format(value)}`;
  let originalRateCards = [];
  let activeSavingsFilter = "all";
  let activeSavingsSort = "earnings";

  function removeTimelineFields() {
    document.querySelectorAll(".rates-grid .rate-card").forEach(card => {
      const timeline = [...card.children].find(child => child.querySelector(".label")?.textContent.trim() === "Timeline");
      timeline?.remove();
      card.querySelector(".view")?.remove();
    });
  }

  function formatTableValues() {
    document.querySelectorAll(".rates-grid .rate-card").forEach(card => {
      card.querySelectorAll(".detail-value").forEach(value => {
        const text = value.textContent.trim();
        if (/^(not specified|set in app|variable)$/i.test(text)) {
          value.textContent = "N/A";
          return;
        }
        if (/^no minimum/i.test(text)) {
          value.textContent = "No";
          return;
        }
        const currency = text.match(/^AED\s+(.+)$/i);
        if (currency) value.innerHTML = `<span class="dirham-mark" aria-label="AED"></span> ${currency[1]}`;
      });

      card.querySelectorAll(".value").forEach(value => {
        if (/^variable$/i.test(value.textContent.trim())) value.textContent = "N/A";
      });
    });
  }

  function getOriginalRateCards() {
    const ratesGrid = document.querySelector(".rates-grid");
    if (!ratesGrid) return [];
    if (!originalRateCards.length) originalRateCards = [...ratesGrid.querySelectorAll(".rate-card")];
    return originalRateCards;
  }

  function resetSavingsTable() {
    const rates = document.querySelector(".rates");
    const ratesGrid = document.querySelector(".rates-grid");
    const summary = document.querySelector(".rates-results-summary");
    rates?.classList.remove("has-earnings");
    summary?.remove();
    getOriginalRateCards().forEach(card => {
      card.hidden = false;
      card.querySelector(".earn-field")?.remove();
      ratesGrid?.appendChild(card);
    });
    applySavingsControls();
  }

  function getFieldByLabel(card, label) {
    return [...card.children].find(child => child.querySelector(".label")?.textContent.trim().toLowerCase() === label);
  }

  function getReturnRate(card) {
    const field = [...card.children].find(child => {
      const label = child.querySelector(".label")?.textContent.trim().toLowerCase() || "";
      return label.includes("return") || label.includes("profit");
    });
    const text = field?.querySelector(".value")?.textContent || "";
    const match = text.replace(",", ".").match(/(\d+(?:\.\d+)?)/);
    return match ? Number(match[1]) / 100 : null;
  }

  function getMinimumAmount(card) {
    const field = getFieldByLabel(card, "minimum amount");
    const text = field?.querySelector(".detail-value")?.textContent || "";
    const match = text.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
    return match ? Number(match[1]) : 0;
  }

  function getEarnAmount(card) {
    const text = card.querySelector(".earn-value")?.textContent || "";
    if (/N\/A/i.test(text)) return -Infinity;
    const match = text.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
    return match ? Number(match[1]) : -Infinity;
  }

  function isNoMinimumCard(card) {
    return getFieldByLabel(card, "minimum amount")?.querySelector(".detail-value")?.textContent.trim() === "No";
  }

  function getComparableRate(card) {
    const rate = getReturnRate(card);
    return Number.isFinite(rate) ? rate : -Infinity;
  }

  function applySavingsControls() {
    const ratesGrid = document.querySelector(".rates-grid");
    if (!ratesGrid) return;

    const cards = [...getOriginalRateCards()];
    cards.sort((a, b) => {
      if (activeSavingsSort === "return") return getComparableRate(b) - getComparableRate(a);
      return getEarnAmount(b) - getEarnAmount(a) || getComparableRate(b) - getComparableRate(a);
    });

    cards.forEach(card => {
      card.hidden = activeSavingsFilter === "no-minimum" && !isNoMinimumCard(card);
      ratesGrid.appendChild(card);
    });
  }

  function initSavingsControls() {
    const sort = document.querySelector("#savings-sort");
    const filters = document.querySelectorAll("[data-savings-filter]");

    sort?.addEventListener("change", () => {
      activeSavingsSort = sort.value;
      applySavingsControls();
    });

    filters.forEach(button => {
      button.addEventListener("click", () => {
        activeSavingsFilter = button.dataset.savingsFilter;
        filters.forEach(item => {
          const active = item === button;
          item.classList.toggle("savings-chip-active", active);
          item.classList.toggle("savings-chip-default", !active);
          item.setAttribute("aria-pressed", String(active));
        });
        applySavingsControls();
      });
    });
  }

  function updateSavingsTable(amount, months) {
    const rates = document.querySelector(".rates");
    const ratesGrid = document.querySelector(".rates-grid");
    if (!rates || !ratesGrid) return;

    rates.classList.add("has-earnings");

    const cards = getOriginalRateCards();
    cards.forEach(card => {
      card.querySelector(".earn-field")?.remove();
      const rate = getReturnRate(card);
      const minimumAmount = getMinimumAmount(card);
      const earnText = amount < minimumAmount
        ? "Not eligible"
        : rate === null
          ? "Variable"
          : new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 }).format(amount * rate * months / 12);
      const earnField = document.createElement("div");
      earnField.className = "earn-field";
      earnField.innerHTML = `<div class="label">You Will Earn</div><div class="value earn-value">${earnText === "Not eligible" || earnText === "Variable" ? "N/A" : `<span class="dirham-mark" aria-label="AED"></span> ${earnText}`}</div>`;
      card.insertBefore(earnField, card.children[1] || card.querySelector(".special"));
    });
    applySavingsControls();
  }

  removeTimelineFields();
  formatTableValues();
  getOriginalRateCards();
  initSavingsControls();
  applySavingsControls();

  document.querySelectorAll("[data-movo-savings-calculator]").forEach(container => {
    const initiallyHidden = container.dataset.initiallyHidden === "true";
    const mode = container.dataset.mode || "inline";
    container.innerHTML = markup(initiallyHidden);

    const form = container.querySelector("#savings-form");
    const amountInput = container.querySelector("#savings-amount");
    const periodSelect = container.querySelector("#savings-period");
    const error = container.querySelector("#savings-error");

    const params = new URLSearchParams(window.location.search);
    if (params.get("amount")) amountInput.value = params.get("amount");
    if (params.get("term")) {
      const option = [...periodSelect.options].find(item => parseInt(item.value, 10) === Number(params.get("term")));
      if (option) periodSelect.value = option.value;
    }
    formatInput(amountInput);

    amountInput.addEventListener("input", () => {
      error.hidden = true;
      amountInput.removeAttribute("aria-invalid");
      formatInput(amountInput);
      if (mode === "inline") resetSavingsTable();
    });
    periodSelect.addEventListener("change", () => {
      if (mode === "inline") resetSavingsTable();
    });

    form.addEventListener("submit", event => {
      event.preventDefault();
      const amount = Number(amountInput.value.replace(/,/g, ""));
      const months = parseInt(periodSelect.value, 10);
      const invalid = !Number.isFinite(amount) || amount <= 0;

      if (mode === "redirect") {
        error.hidden = true;
        amountInput.removeAttribute("aria-invalid");
        const query = invalid ? "" : `?${new URLSearchParams({ amount: String(amount), term: String(months) }).toString()}`;
        window.location.href = `saving-rates.html${query}`;
        return;
      }

      error.hidden = !invalid;
      amountInput.setAttribute("aria-invalid", String(invalid));
      if (invalid) {
        amountInput.focus();
        return;
      }

      updateSavingsTable(amount, months);
    });

    if (mode === "inline" && Number(params.get("amount")) > 0) {
      form.requestSubmit();
    }
  });
})();
