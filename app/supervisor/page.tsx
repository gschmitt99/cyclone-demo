"use client";

import Link from "next/link";
import { useItems } from "@/app/hooks/useItems";
import { useEffect, useState } from "react";

export default function SupervisorPage() {
  const { items } = useItems();

  // Force re-render every second so timers update
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Count items by state
  const counts = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.state] = (acc[item.state] || 0) + 1;
    return acc;
  }, {});

  // Identify bottlenecked items (stuck > 10 seconds)
  const bottleneckedItems = items.filter((item) => {
    const ageSeconds = (Date.now() - item.stateEntered) / 1000;
    return ageSeconds > 10;
  });

  return (
    <div style={{ padding: 20 }}>
      <Link href="/" style={{ display: "inline-block", marginBottom: 20 }}>
        Back
      </Link>

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

      {/* Bottlenecked items */}
      <section style={{ marginTop: 20 }}>
        <h2>Bottlenecked Items (stuck more than 10s)</h2>

        {bottleneckedItems.length === 0 ? (
          <p>No bottlenecks detected.</p>
        ) : (
          <ul>
            {bottleneckedItems.map((item) => {
              const ageSeconds = Math.floor(
                (Date.now() - item.stateEntered) / 1000
              );

              return (
                <li key={item.id}>
                  Item #{item.id} — State: <strong>{item.state}</strong> —{" "}
                  {ageSeconds}s in state
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Full item list */}
      <section style={{ marginTop: 20 }}>
        <h2>All Items</h2>

        {items.map((item) => {
          const inState = Math.floor(
            (Date.now() - item.stateEntered) / 1000
          );

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
      </section>
    </div>
  );
}