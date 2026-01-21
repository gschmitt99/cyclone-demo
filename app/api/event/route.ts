import { NextResponse } from "next/server";
import { getItems } from "@/lib/db";
import { Role } from "@/lib/types";
import { allowedTransitions, workflowRules, WorkflowState } from "@/lib/workflow";

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

    // Update state
    item.state = action;

    // Append audit event
    item.history.push({
      timestamp: new Date().toISOString(),
      from: current,
      to: action as WorkflowState,
      actor: actor as string,
    });

    return NextResponse.json({ item });
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}