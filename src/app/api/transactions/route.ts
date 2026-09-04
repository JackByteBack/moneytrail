import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const type = searchParams.get("type");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  let query = supabase
    .from("transactions")
    .select("*, category:categories(*)")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (category) {
    query = query.eq("category_id", category);
  }

  if (type) {
    query = query.eq("type", type);
  }

  if (from) {
    query = query.gte("date", from);
  }

  if (to) {
    query = query.lte("date", to);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from("transactions")
    .insert({
      user_id: user.id,
      category_id: body.category_id,
      amount: body.amount,
      type: body.type,
      note: body.note || null,
      date: body.date,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
