export interface Item {
  id: number;
  orderId: number;
  state: WorkflowState;
  history: Event[];
  stateEntered: number;
};

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

export type WorkflowState = 
  | "Saw"
  | "Thread"
  | "CNC"
  | "QC"
  | "Hold"
  | "Rework"
  | "Ship"
  | "Complete";

  export interface TransitionRule {
  to: WorkflowState;
  allowedRoles: Role[];
};