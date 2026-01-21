import type { Event, Item, WorkflowState } from "./types";

const SEED_ITEMS_BASE: Omit<Item, "stateEntered" | "history">[] = [
  { id: 1, orderId: 1001, state: "Saw" },
  { id: 2, orderId: 1001, state: "Saw" },
];

let _items: Item[] | null = null;

function buildSeedItems(): Item[] {
  const now = Date.now();

  return SEED_ITEMS_BASE.map((item) => ({
    ...item,
    stateEntered: now,
    history: [],
  }));
}

export function getItems(): Item[] {
  if (!_items) {
    _items = buildSeedItems();
  }
  return _items;
}

export function resetItems() {
  _items = buildSeedItems();
  return _items;
}
