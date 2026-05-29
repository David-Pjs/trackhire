import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI not configured. Add DEEPSEEK_API_KEY to your environment." },
      { status: 503 }
    );
  }

  const body = await req.json();
  const { company, role, stage, appliedDate, notes, salary } = body;

  if (!company || !role) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const prompt = `You are helping a job seeker write a professional follow-up message.

Write a short, confident follow-up message for this job application.

Company: ${company}
Role: ${role}
Pipeline stage: ${stage}
Applied: ${appliedDate || "recently"}${notes ? `\nNotes: ${notes}` : ""}${salary ? `\nSalary range: ${salary}` : ""}

Rules:
- 80 to 130 words total.
- Friendly, professional, and direct.
- No fake claims or fabricated details.
- No exaggerated excitement.
- Mention the role and company naturally.
- Express continued interest.
- Ask politely if there are any updates.
- Return only the message text. No subject line. No sign-off name.`;

  try {
    const res = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 250,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("DeepSeek error:", err);
      return NextResponse.json({ error: "AI generation failed. Try again." }, { status: 500 });
    }

    const data = await res.json();
    const message = data.choices?.[0]?.message?.content?.trim();

    if (!message) {
      return NextResponse.json({ error: "Empty response from AI." }, { status: 500 });
    }

    return NextResponse.json({ message });
  } catch (err) {
    console.error("Follow-up generation error:", err);
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
}
