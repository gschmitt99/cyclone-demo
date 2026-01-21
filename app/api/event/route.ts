import "@/lib/ws"
import { NextResponse } from "next/server";
import { getItems } from "@/lib/db";
import { Role, WorkflowState } from "@/lib/types";
import { canTransition, workflowRules } from "@/lib/workflow";
import { broadcast } from "@/lib/ws";

export async function POST(req: Request) {
  try {
    const { itemId, action, actor, actorRole } = await req.json();
    const items = getItems();

    if (!actorRole) {
        return NextResponse.json(
            { error: "Actor role is required" },
            { status: 400 }
        );
    }

    const role = actorRole as Role;

    const item = items.find((i) => i.id === itemId);
    if (!item) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    const current = item.state as WorkflowState;
    const rules = workflowRules[current] || [];
    const rule = rules.find((r) => r.to === action);

    if (!rule) {
       return NextResponse.json(
        {
           error: `No transition rule for ${current} → ${action}`,
           allowedTransitions: rules.map(r => r.to),
        },
           { status: 400 }
       );
    }

    if (!rule.allowedRoles.includes(role)) {
       return NextResponse.json(
         {
            error: `Role ${role} not allowed to perform transition ${current} → ${action}`,
            allowedRoles: rule.allowedRoles,
         },
         { status: 403 }
        );
    }

    // server side check the state transition
    if (!canTransition(item.state, action)) {
      return NextResponse.json(
        {
          error: `Invalid transition: ${item.state} → ${action}`,
          allowed: workflowRules[item.state],
        },
        { status: 400 }
      );
    }

    // Update state
    item.state = action;
    item.stateEntered = Date.now();

    // Append audit event
    item.history.push({
      timestamp: new Date().toISOString(),
      from: current,
      to: action as WorkflowState,
      actor: actor as string,
    });

    broadcast( "item-updated", { item });

    return NextResponse.json({ item });
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}