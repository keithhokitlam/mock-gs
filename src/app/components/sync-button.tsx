"use client";

import { useState } from "react";

export default function SyncButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSync = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/sync/subscriptions-to-sheets", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        const inactiveMsg = data.inactiveCount > 0 ? `, marked ${data.inactiveCount} as inactive` : "";
        setMessage(`✅ Successfully synced ${data.count || 0} subscriptions${inactiveMsg}!`);
      } else {
        const details = data.details ? `\n\nDetails: ${data.details}` : "";
        setMessage(`❌ Error: ${data.error || "Failed to sync"}${details}`);
      }
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message || "Failed to sync"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <button
        onClick={handleSync}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
      >
        {loading ? "Syncing..." : "Sync to Google Sheets"}
      </button>
      {message && (
        <p className={`mt-2 text-sm ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
