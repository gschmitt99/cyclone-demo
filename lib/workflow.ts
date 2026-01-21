import type { Role, TransitionRule, WorkflowState } from "./types";


export const workflowRules: Record<WorkflowState, TransitionRule[]> = {
  Saw: [
    { to: "Thread", allowedRoles: ["Operator"] },
  ],
  Thread: [
    { to: "CNC", allowedRoles: ["Operator"] },
  ],
  CNC: [
    { to: "QC", allowedRoles: ["Operator"] },
  ],
  QC: [
    { to: "Ship", allowedRoles: ["QC"] },
    { to: "Hold", allowedRoles: ["QC"] },
  ],
  Hold: [
    { to: "Rework", allowedRoles: ["QC"] },
    { to: "QC", allowedRoles: ["QC"] }, // release hold
  ],
  Rework: [ // rework state allowing for some finer tracking
    { to: "Thread", allowedRoles: ["Operator"] },
  ],
  Ship: [
    { to: "Complete", allowedRoles: ["Shipping"] },
  ],
  Complete: [],
};

export const allowedTransitions: Record<WorkflowState, WorkflowState[]> = {
  Saw: ["Thread"],
  Thread: ["CNC"],
  CNC: ["QC"],
  QC: ["Ship"],
  Hold: ["Rework", "QC"],
  Rework: ["QC"],
  Ship: ["Complete"],
  Complete: [],
};

export function canTransition(from: WorkflowState, to: WorkflowState): boolean {
  const rules = workflowRules[from] || [];
  return rules.some(rule => rule.to === to);
}
