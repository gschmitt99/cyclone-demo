"use client";

import { Item } from "@/lib/db";
import { useState, useEffect } from "react";

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);

  // Load fresh state from server
  useEffect(() => {
    fetch("/api/items")
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  // Helper to update a single item after an event
  function updateItem(updated: Item) {
    setItems((prev) =>
      prev.map((i) => (i.id === updated.id ? updated : i))
    );
  }

  return { items, setItems, updateItem };
}