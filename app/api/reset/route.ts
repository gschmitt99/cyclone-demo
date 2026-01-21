import { NextResponse } from "next/server";
import { resetItems } from "@/lib/db";
import { broadcast } from "@/lib/ws";

export function POST() {
  const items = resetItems();
  broadcast("reset", { timestamp: Date.now() });

  return NextResponse.json({ items });
}