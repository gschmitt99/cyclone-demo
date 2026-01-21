import { workflowRules } from "@/lib/workflow";

describe("workflow rules", () => {
  test("Saw → Thread is allowed", () => {
    const rules = workflowRules["Saw"];
    expect(rules.some(r => r.to === "Thread")).toBe(true);
  });

  test("Saw → CNC is NOT allowed", () => {
    const rules = workflowRules["Saw"];
    expect(rules.some(r => r.to === "CNC")).toBe(false);
  });

  test("QC Hold blocks Shipping", () => {
    const rules = workflowRules["Hold"];
    expect(rules.some(r => r.to === "Ship")).toBe(false);
  });
});
