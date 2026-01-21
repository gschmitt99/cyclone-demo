import { getItems, resetItems } from "@/lib/db";

describe("in-memory DB", () => {
  test("getItems initializes items only once", () => {
    const a = getItems();
    const b = getItems();
    expect(a).toBe(b); // same reference
  });

  test("resetItems resets to seed state", () => {
    const before = getItems();
    before[0].state = "CNC";

    const after = resetItems();
    expect(after[0].state).toBe("Saw");
  });
});
