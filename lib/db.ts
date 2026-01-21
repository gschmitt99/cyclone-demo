import type { WorkflowState } from "./workflow";
import type { Event } from "./types";

export interface Item {
  id: number;
  orderId: number;
  state: WorkflowState;
  history: Event[];
}

// Single source of truth for initial data
const SEED_ITEMS: Item[] = [
  { id: 1, orderId: 1001, state: "Saw", history: [] },
  { id: 2, orderId: 1001, state: "Saw", history: [] },
];

let _items: Item[] | null = null;

export function getItems(): Item[] {
  if (!_items) {
    _items = structuredClone(SEED_ITEMS);
  }
  return _items;
}

export function resetItems() {
  _items = structuredClone(SEED_ITEMS);
  return _items;
}