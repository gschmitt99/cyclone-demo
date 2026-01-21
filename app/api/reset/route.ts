import { NextResponse } from "next/server";
import { resetItems } from "@/lib/db";

export function POST() {
  const items = resetItems();
  return NextResponse.json({ items });
}