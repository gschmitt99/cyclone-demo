"use client";

import { useState } from "react";
import Link from "next/link";
import { useItems } from "@/app/hooks/useItems";
import { allowedTransitions } from "@/lib/workflow";

export default function ShippingPage() {
  const {items, setItems} = useItems();

  async function act(itemId: number) {
    const res = await fetch("/api/event", {
      method: "POST",
      body: JSON.stringify({
        itemId,
        action: "Complete",
        actor: "shipping-tech",
        actorRole: "Shipping",
      }),
    });

    const json = await res.json();
    if (json.item) {
      // Always re-fetch fresh state from server
      const updated = await fetch("/api/items").then((r) => r.json());
      setItems(updated);
    } else {
      alert(json.error);
    }

  }

    return (
    <div style={{ padding: 20 }}>
      <Link href="/" style={{ display: "inline-block", marginBottom: 20 }}>Back</Link>

      <h1>Shipping View</h1>
      <p>Stage or ship items. QC Hold collisions will be blocked.</p>

      {items.map((item) => (
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

          <button
            onClick={() => act(item.id)}
            disabled={item.state === "Hold"}
            style={{
              marginRight: 8,
              background: item.state === "Hold" ? "#ccc" : "#4caf50",
              color: "white",
              padding: "6px 12px",
              borderRadius: 4,
              cursor: item.state === "Hold" ? "not-allowed" : "pointer",
            }}
          >
            Ship Item
          </button>

          {item.state === "Hold" && (
            <p style={{ color: "red", marginTop: 8 }}>
              Cannot ship — item is on QC Hold.
            </p>
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
      ))}
    </div>
  );
}
