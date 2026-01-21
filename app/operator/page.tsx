"use client";

import Link from "next/link";
import { useItems } from "@/app/hooks/useItems";
import { workflowRules } from "@/lib/workflow";

export default function OperatorPage() {
  const { items, setItems } = useItems();

  async function move(itemId: number, action: string) {
    const res = await fetch("/api/event", {
      method: "POST",
      body: JSON.stringify({
        itemId,
        action,
        actor: "operator-demo",
        actorRole: "Operator",
      }),
    });

    const json = await res.json();

    if (json.item) {
      // Always re-fetch full state from server to avoid stale UI
      const updated = await fetch("/api/items").then((r) => r.json());
      setItems(updated);
    } else {
      alert(json.error);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <Link href="/" style={{ display: "inline-block", marginBottom: 20 }}>
        Back
      </Link>

      <h1>Operator View</h1>

      {items.map((item) => {
        const rules = workflowRules[item.state] || [];

        return (
          <div
            key={item.id}
            style={{
              border: "1px solid #ccc",
              padding: 12,
              marginBottom: 16,
            }}
          >
            <h3>
              Item #{item.id} — State: <strong>{item.state}</strong>
            </h3>

            {/* Render allowed transitions */}
            {rules.length === 0 ? (
              <p>No further actions</p>
            ) : (
              rules.map((rule) => (
                <button
                  key={rule.to}
                  onClick={() => move(item.id, rule.to)}
                  style={{ marginRight: 8 }}
                >
                  Move to {rule.to}
                </button>
              ))
            )}

            <details style={{ marginTop: 10 }}>
              <summary>Audit History</summary>
              <ul>
                {item.history.map((h, idx) => (
                  <li key={idx}>
                    {h.timestamp}: {h.from} → {h.to} by {h.actor}
                  </li>
                ))}
              </ul>
            </details>
          </div>
        );
      })}
    </div>
  );
}