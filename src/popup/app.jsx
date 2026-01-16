import { useEffect, useState } from "react";

export default function App() {
  const [data, setData] = useState({});

  useEffect(() => {
    chrome.storage.local.get("zoho_data", r => setData(r.zoho_data || {}));
    chrome.storage.onChanged.addListener(() => {
      chrome.storage.local.get("zoho_data", r => setData(r.zoho_data || {}));
    });
  }, []);

  const extract = async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  if (!tab.url.includes("crm.zoho")) {
    alert("Open Zoho CRM first");
    return;
  }

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content/extractor.js"]
  });
};

  return (
    <div className="p-3 text-xs">
      <button
        className="bg-black text-white px-2 py-1 rounded"
        onClick={extract}
      >
        Extract Current Module
      </button>

      <pre className="mt-2 overflow-auto max-h-60">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
