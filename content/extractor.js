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
  const text = el => el?.innerText.trim() || "";

  /* ============================================================
     ===================== DEALS (UNTOUCHED) ====================
     ============================================================ */
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
        owner: text(card.querySelector("[data-zcqa='recordOwner']")),
        probability: text(card.querySelector("[cx-prop-value*='%']")),
        closingDate: text(card.querySelector("crux-date-component"))
      });
    });

    chrome.storage.local.get("zoho_data", r => {
      chrome.storage.local.set({
        zoho_data: { ...r.zoho_data, deals, lastSync: Date.now() }
      });
      show(`Extracted ${deals.length} deals`);
    });
    return;
  }

  /* ============================================================
     ===================== LEADS (LYTE GRID) ====================
     ============================================================ */

  const headerEls = document.querySelectorAll(".lyteDataviewHeaderCell");
  const rowEls = document.querySelectorAll(".lyteDataviewRow");

  if (!headerEls.length || !rowEls.length) {
    show("No supported module detected");
    return;
  }

  const headers = [...headerEls].map(h => h.innerText.trim());
  const leads = [];

  rowEls.forEach(row => {
    const cells = row.querySelectorAll(".lyteDataviewCell");
    if (cells.length !== headers.length) return;

    const record = { id: uid() };

    headers.forEach((h, i) => {
      const v = cells[i]?.innerText.trim() || "";

      if (h === "Lead Name") record.name = v;
      if (h === "Company") record.company = v;
      if (h === "Email") record.email = v;
      if (h === "Phone") record.phone = v;
      if (h === "Lead Source") record.source = v;
      if (h === "Lead Status") record.status = v;
      if (h === "Lead Owner") record.owner = v;
    });

    // 🚫 Skip Zoho UI rows
    if (
      !record.name ||
      record.name.includes("Feedback") ||
      record.name.includes("Help")
    ) return;

    leads.push(record);
  });

  if (!leads.length) {
    show("0 leads found");
    return;
  }

  chrome.storage.local.get("zoho_data", r => {
    chrome.storage.local.set({
      zoho_data: { ...r.zoho_data, leads, lastSync: Date.now() }
    });
    show(`Extracted ${leads.length} leads`);
  });
}, 500);
