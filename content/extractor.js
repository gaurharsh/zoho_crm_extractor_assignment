(() => {
  /* ---------- STATUS BADGE ---------- */
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

  /* ---------- DEALS DETECTION (DOM BASED) ---------- */
  const hasKanban =
    document.querySelector("lyte-kanban-card") ||
    document.querySelector("lyte-kanban-view");

  const hasTable =
    document.querySelector("table") &&
    document.querySelector("table tbody tr");

  if (!hasKanban && !hasTable) {
    show("Deals UI not detected");
    return;
  }

  show("Extracting Deals...");

  const records = [];

  /* ---------- KANBAN EXTRACTION ---------- */
  document.querySelectorAll("lyte-kanban-card").forEach(card => {
    const text = card.innerText.trim();
    if (!text) return;

    const lines = text
      .split("\n")
      .map(l => l.trim())
      .filter(Boolean);

    records.push({
      id: crypto.randomUUID(),
      name: lines[0] || "",
      stage:
        card.closest("lyte-kanban-column")
          ?.querySelector("header")
          ?.innerText || "",
      amount:
        text.match(/(₹|Rs\.|\$)\s?[\d,]+/)?.[0] || "",
      raw: text
    });
  });

  /* ---------- LIST VIEW FALLBACK ---------- */
  if (!records.length) {
    document.querySelectorAll("table tbody tr").forEach(row => {
      const cols = [...row.querySelectorAll("td")]
        .map(td => td.innerText.trim())
        .filter(Boolean);

      if (!cols.length) return;

      records.push({
        id: crypto.randomUUID(),
        name: cols[0] || "",
        stage: cols[3] || "",
        amount: cols[2] || "",
        raw: cols.join(" | ")
      });
    });
  }

  if (!records.length) {
    show("0 deals found (wait for UI to load)");
    return;
  }

  /* ---------- STORAGE ---------- */
  chrome.storage.local.get("zoho_data", res => {
    const data = res.zoho_data || {};
    data.deals = records;
    data.lastSync = Date.now();

    chrome.storage.local.set({ zoho_data: data }, () => {
      show(`Extracted ${records.length} deals`);
    });
  });
})();
