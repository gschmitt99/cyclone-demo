"use client";

import Link from "next/link";
import { useItems } from "@/app/hooks/useItems";

function findBottleneck(counts: Record<string, number>): string | null {
  let bottleneckState: string | null = null;
  let maxCount = 0;

  for (const [state, count] of Object.entries(counts)) {
    if (count > maxCount) {
      bottleneckState = state;
      maxCount = count;
    }
  }

  return bottleneckState;
}

export default function SupervisorPage() {
  const { items } = useItems();

  // Count items by state
  const counts = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.state] = (acc[item.state] || 0) + 1;
    return acc;
  }, {});

  // Identify aging holds (over 5 minutes for demo purposes)
  const agingHolds = items.filter((item) => {
    if (item.state !== "Hold") return false;
    const last = item.history[item.history.length - 1];
    if (!last) return false;
    const ageMs = Date.now() - new Date(last.timestamp).getTime();
    return ageMs > 5 * 60 * 1000;
  });

  const bottleneck = findBottleneck(counts);

  return (
    <div style={{ padding: 20 }}>
      <Link href="/" style={{ display: "inline-block", marginBottom: 20 }}>Back</Link>

      <h1>Supervisor Dashboard</h1>
      <p>High-level production visibility and bottleneck detection.</p>

      {/* State counts */}
      <section style={{ marginTop: 20 }}>
        <h2>Items by State</h2>
        <ul>
          {Object.entries(counts).map(([state, count]) => (
            <li key={state}>
              {state}: <strong>{count}</strong>
            </li>
          ))}
        </ul>
      </section>

      {/* Bottleneck */}
      <section style={{ marginTop: 20 }}>
        <h2>Bottleneck</h2>
        {bottleneck ? (
          <p>
            Current bottleneck: <strong>{bottleneck}</strong> (highest WIP)
          </p>
        ) : (
          <p>No bottlenecks detected.</p>
        )}
      </section>

      {/* Aging holds */}
      <section style={{ marginTop: 20 }}>
        <h2>Aging QC Holds</h2>
        {agingHolds.length === 0 ? (
          <p>No aging holds.</p>
        ) : (
          <ul>
            {agingHolds.map((item) => (
              <li key={item.id}>
                Item #{item.id} — on Hold since{" "}
                {item.history[item.history.length - 1].timestamp}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Full item list */}
      <section style={{ marginTop: 20 }}>
        <h2>All Items</h2>
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
      </section>
    </div>
  );
}