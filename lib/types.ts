import type { WorkflowState } from "./workflow";

export interface Event {
  timestamp: string;
  from: WorkflowState;
  to: WorkflowState;
  actor: string;
};

export type Role = 
| "Operator" 
| "QC" 
| "Shipping" 
| "Supervisor" 
| "Admin";
