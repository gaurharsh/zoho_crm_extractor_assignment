import { useEffect, useState } from "react";

const MODULES = [
  { key: "deals", label: "Deals" },
  { key: "leads", label: "Leads" },
  { key: "contacts", label: "Contacts" },
  { key: "accounts", label: "Accounts" },
  { key: "tasks", label: "Tasks" }
];

export default function App() {
  const [active, setActive] = useState("deals");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  /* ---------- LOAD STORAGE ---------- */
  const loadData = () => {
    chrome.storage.local.get("zoho_data", r => {
      setData(r.zoho_data || {});
    });
  };

  useEffect(() => {
    loadData();
    chrome.storage.onChanged.addListener(loadData);
  }, []);

  /* ---------- EXTRACT ---------- */
  const extract = async () => {
    setLoading(true);

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content/extractor.js"]
    });

    setTimeout(() => setLoading(false), 1200);
  };

  /* ---------- CLEAR STORAGE ---------- */
  const clearAll = () => {
    if (!confirm("Clear all extracted Zoho CRM data?")) return;

    chrome.storage.local.set(
      {
        zoho_data: {
          deals: [],
          leads: [],
          contacts: [],
          accounts: [],
          tasks: [],
          lastSync: null
        }
      },
      loadData
    );
  };

  const records = data[active] || [];

  return (
    <div className="w-80 p-3 text-xs font-sans bg-white">
      {/* Header */}
      <h1 className="text-sm font-semibold mb-2">
        Zoho CRM Data Extractor
      </h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-2">
        {MODULES.map(m => (
          <button
            key={m.key}
            onClick={() => setActive(m.key)}
            className={`px-2 py-1 rounded border ${
              active === m.key
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Extract Button */}
      <button
        onClick={extract}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-1.5 rounded mb-2 disabled:opacity-60"
      >
        {loading ? "Extracting…" : "Extract Current Page"}
      </button>

      {/* Last Sync */}
      {data.lastSync && (
        <div className="text-gray-500 mb-2">
          Last sync: {new Date(data.lastSync).toLocaleTimeString()}
        </div>
      )}

      {/* Data View */}
      <div className="border rounded p-2 max-h-60 overflow-auto mb-2">
        {!records.length && (
          <div className="text-gray-400">
            No {active} data yet
          </div>
        )}

        {records.map((r, i) => (
          <div key={r.id || i} className="mb-2 border-b pb-1">
            <div className="font-medium">
              {r.name || r.subject}
            </div>
            <pre className="text-[10px] text-gray-600 whitespace-pre-wrap">
              {JSON.stringify(r, null, 2)}
            </pre>
          </div>
        ))}
      </div>

      {/* Clear Button */}
      <button
        onClick={clearAll}
        className="w-full bg-red-100 text-red-600 py-1 rounded"
      >
        Clear All Stored Data
      </button>
    </div>
  );
}
