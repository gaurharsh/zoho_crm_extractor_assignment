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

  useEffect(() => {
    const load = () =>
      chrome.storage.local.get("zoho_data", r =>
        setData(r.zoho_data || {})
      );

    load();
    chrome.storage.onChanged.addListener(load);
  }, []);

  const extract = async () => {
    setLoading(true);
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content/extractor.js"]
    });

    setTimeout(() => setLoading(false), 1200);
  };

  const records = data[active] || [];

  return (
    <div className="w-80 p-3 text-xs font-sans">
      {/* Header */}
      <h1 className="text-sm font-semibold mb-2">
        Zoho CRM Extractor
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
                : "bg-white text-gray-700"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Extract button */}
      <button
        onClick={extract}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-1.5 rounded mb-2 disabled:opacity-60"
      >
        {loading ? "Extracting…" : `Extract ${active}`}
      </button>

      {/* Last sync */}
      {data.lastSync && (
        <div className="text-gray-500 mb-2">
          Last sync: {new Date(data.lastSync).toLocaleTimeString()}
        </div>
      )}

      {/* Data */}
      <div className="border rounded p-2 max-h-64 overflow-auto">
        {!records.length && (
          <div className="text-gray-400">
            No {active} data
          </div>
        )}

        {records.map((r, i) => (
          <div key={i} className="mb-2 border-b pb-1">
            <div className="font-medium">
              {r.name || r.subject}
            </div>
            <pre className="text-[10px] text-gray-600 whitespace-pre-wrap">
              {JSON.stringify(r, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
