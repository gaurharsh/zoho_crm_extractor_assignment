chrome.runtime.onMessage.addListener(async (msg) => {
  if (msg.type !== "STORE_DATA") return;

  const key = "zoho_data";
  const data = (await chrome.storage.local.get(key))[key] || {};
  const existing = data[msg.module] || [];

  const map = new Map(existing.map(r => [r.id, r]));
  msg.records.forEach(r => map.set(r.id, r));

  data[msg.module] = [...map.values()];
  data.lastSync = Date.now();

  await chrome.storage.local.set({ [key]: data });
});
