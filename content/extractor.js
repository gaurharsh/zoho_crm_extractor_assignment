setTimeout(() => {
  /* ================= STATUS ================= */
  function show(msg) {
    let host = document.getElementById("zoho-status");
    if (!host) {
      host = document.createElement("div");
      host.id = "zoho-status";
      document.body.appendChild(host);
      host.attachShadow({ mode: "open" });
    }
    host.shadowRoot.innerHTML = `
      <style>
        div {
          position: fixed;
          top: 12px;
          right: 12px;
          background: #111;
          color: #fff;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 12px;
          z-index: 999999;
        }
      </style>
      <div>${msg}</div>
    `;
  }

  const uid = () => crypto.randomUUID();
  const text = el => el?.innerText?.trim() || "";

  /* ======================================================
     ================= DEALS / TASKS (KANBAN) ==============
     ================= UNTOUCHED ===========================
     ====================================================== */
  if (document.querySelector("lyte-card.crm-kv-card")) {
    const deals = [];

    document.querySelectorAll("lyte-card.crm-kv-card").forEach(card => {
      const board = card.closest("lyte-board");
      const name = text(card.querySelector("a.crm-kv-header-link"));
      if (!name) return;

      deals.push({
        id: uid(),
        name,
        amount:
          text(card.querySelector(".counterValue")) ||
          text(card.querySelector(".numberDivCurrencyView")),
        stage: board?.getAttribute("data-zcqa")?.replace("kanbanHeader_", ""),
        pipeline: board?.getAttribute("data-pipelines") || "Default",
        probability: text(card.querySelector("[cx-prop-value*='%']")),
        closingDate: text(card.querySelector("crux-date-component")),
        owner: text(card.querySelector("[data-zcqa='recordOwner']")),
        related:
          text(card.querySelector("a[href*='/Accounts/']")) ||
          text(card.querySelector("a[href*='/Contacts/']"))
      });
    });

    chrome.storage.local.get("zoho_data", r => {
      chrome.storage.local.set({
        zoho_data: { ...(r.zoho_data || {}), deals, lastSync: Date.now() }
      });
      show(`Extracted ${deals.length} deals`);
    });
    return;
  }

  /* ======================================================
     ========== LEADS / CONTACTS / ACCOUNTS (CRUX TABLE) ===
     ====================================================== */

  const crux = document.querySelector("crux-table-component");
  if (!crux) {
    show("No supported module detected");
    return;
  }

  const module = crux.getAttribute("cx-prop-module");
  if (!["Leads", "Contacts", "Accounts"].includes(module)) {
    show("Unsupported module");
    return;
  }

  show(`Extracting ${module}...`);

  /* ---------- HEADERS ---------- */
  const headers = Array.from(
    crux.querySelectorAll(
      'lyte-exptable-tr#listviewHeaderRow lyte-exptable-th lyte-text'
    )
  ).map(h => h.innerText.trim());

  /* ---------- ROWS ---------- */
  const rows = crux.querySelectorAll(
    'lyte-exptable-tr[data-zcqa="detailView"]'
  );

  if (!headers.length || !rows.length) {
    show("No records found");
    return;
  }

  const records = [];

  rows.forEach(row => {
    const cells = Array.from(row.querySelectorAll("lyte-exptable-td"));
    if (cells.length < headers.length) return;

    const record = { id: uid() };

    headers.forEach((h, i) => {
      const v = text(cells[i]);

      if (module === "Leads") {
        if (h === "Lead Name") record.name = v;
        if (h === "Company") record.company = v;
        if (h === "Email") record.email = v;
        if (h === "Phone") record.phone = v;
        if (h === "Lead Source") record.source = v;
        if (h === "Lead Status") record.status = v;
        if (h === "Lead Owner") record.owner = v;
      }

      if (module === "Contacts") {
        if (h === "Contact Name") record.name = v;
        if (h === "Email") record.email = v;
        if (h === "Phone") record.phone = v;
        if (h === "Account Name") record.account = v;
        if (h === "Contact Owner") record.owner = v;
        if (h.includes("Mailing")) record.address = v;
      }

      if (module === "Accounts") {
        if (h === "Account Name") record.name = v;
        if (h === "Website") record.website = v;
        if (h === "Phone") record.phone = v;
        if (h === "Industry") record.industry = v;
        if (h === "Account Owner") record.owner = v;
        if (h.includes("Revenue")) record.revenue = v;
      }
    });

    if (!record.name) return;
    records.push(record);
  });

  chrome.storage.local.get("zoho_data", r => {
    chrome.storage.local.set({
      zoho_data: {
        ...(r.zoho_data || {}),
        [module.toLowerCase()]: records,
        lastSync: Date.now()
      }
    });
    show(`Extracted ${records.length} ${module}`);
  });
}, 600);
