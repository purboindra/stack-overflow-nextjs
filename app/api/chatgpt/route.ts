import { NextResponse } from "next/server";

import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(req: Request) {
  const { question } = await req.json();

  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are a helpful assistant." }],
      model: "gpt-3.5-turbo",
    });
    console.log(response.choices[0]);

    return NextResponse.json({ message: "Oke" });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({
      error: error.message,
    });
  }
}
