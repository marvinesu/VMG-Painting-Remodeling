"use client";
import React, { useState } from "react";

/**
 * "Send Test Email" button rendered inside the SMTP Settings global.
 * Calls the admin-only POST /api/admin/test-smtp endpoint with the current
 * admin session. Save the settings before testing.
 */
export const TestEmailButton: React.FC = () => {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const send = async () => {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/test-smtp", {
        method: "POST",
        credentials: "include"
      });
      const result = await response.json().catch(() => ({}));
      setIsError(!response.ok || !result.ok);
      setMessage(result.message ?? result.error ?? (response.ok ? "Test email sent." : "Test failed."));
    } catch {
      setIsError(true);
      setMessage("Request failed — check the server logs.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ margin: "12px 0 24px" }}>
      <button
        type="button"
        onClick={send}
        disabled={busy}
        style={{
          background: "#e5a63a",
          color: "#1f1a12",
          border: 0,
          borderRadius: 999,
          padding: "10px 20px",
          fontWeight: 700,
          cursor: busy ? "wait" : "pointer"
        }}
      >
        {busy ? "Sending…" : "Send Test Email"}
      </button>
      <p style={{ marginTop: 8, fontSize: 13, color: isError ? "#b32d2e" : "#2e7d32" }} role="status">
        {message || "Save your settings first, then send a test email."}
      </p>
    </div>
  );
};
