"use client";

import { useEffect, useState } from "react";
import type { Item } from "@/lib/types";

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch("/api/items")
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  useEffect(() => {
    //const ws = new WebSocket("ws://${window.location.hostname}:3002");
    //const ws = new WebSocket("ws://phoenix2025:3002");
    // by all accounts this will not work on vercel and need to perform a different approach.
    const ws = new WebSocket(`ws://${window.location.hostname}:3002`);

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      switch (data.type) {
        case "item-updated": {
          const updated = data.payload.item;
          setItems((prev) =>
            prev.map((i) => (i.id === updated.id ? updated : i))
          );
          break;
        }

        case "reset": {
          fetch("/api/items")
            .then((res) => res.json())
            .then((items) => setItems(items));
          break;
        }

        default:
          console.warn("Unknown WS message:", data);
      }
    };

    return () => ws.close();
  }, []);

  function updateItem(updated: Item) {
    setItems((prev) =>
      prev.map((i) => (i.id === updated.id ? updated : i))
    );
  }

  function replaceAll(newItems: Item[]) {
    setItems(newItems);
  }

  return {
    items,
    setItems: replaceAll,
    updateItem,
  };
}