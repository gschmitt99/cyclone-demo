"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useItems } from "@/app/hooks/useItems";
import { workflowRules } from "@/lib/workflow";

export default function OperatorPage() {
  const { items, setItems } = useItems();

  // Force a re-render every second for the "time in state" timer
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

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
        const inState = Math.floor((Date.now() - item.stateEntered) / 1000);

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
            <p style={{ marginTop: 4, color: "#555" }}>
              Time in state: {inState}s
            </p>

            {/* Render allowed transitions */}
            {rules.length === 0 ? (
              <p>No further actions</p>
            ) : (
              rules.map((rule) => (
                <button
                  className="action-button"
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