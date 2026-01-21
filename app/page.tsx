"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  async function reset() {
    await fetch("/api/reset", { method: "POST" });
    router.refresh(); // forces all server components to reload fresh state
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Workflow Demo</h1>
      <button
        className="action-button"
        onClick={reset}
        style={{
          padding: "8px 12px",
          background: "#d9534f",
          color: "white",
          borderRadius: 4,
          marginBottom: 20,
        }}
      >
        Reset to Default
      </button>

      <p>Select a role to begin:</p>
      <ul>
        <li><Link href="/operator">Operator View</Link></li>
        <li><Link href="/qc">QC View</Link></li>
        <li><Link href="/shipping">Shipping View</Link></li>
        <li><Link href="/supervisor">Supervisor Dashboard</Link></li>
      </ul>
    </div>
  );
}