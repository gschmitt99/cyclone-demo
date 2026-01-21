import { NextResponse } from "next/server";
import { getItems } from "@/lib/db";

export function GET() {
  const items = getItems();
  return NextResponse.json(items);
}