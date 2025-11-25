import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { getRelevantContext } from "@/lib/rag";

export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const lastMessage = messages[messages.length - 1];

        // Get relevant context from resume
        const context = await getRelevantContext(lastMessage.content);

        const systemPrompt = `
    You are an AI assistant for Atharva Kale's portfolio website.
    Your role is to answer questions about Atharva's experience, skills, and projects based strictly on the provided context.
    
    Context from Resume:
    ${context}

    Instructions:
    - Be professional, concise, and friendly.
    - If the answer is not in the context, say "I don't have that information in my current context, but you can contact Atharva directly."
    - Do not hallucinate information.
    - Highlight key skills or projects if relevant.
    - Keep answers under 3-4 sentences unless asked for details.
    `;

        const result = await streamText({
            model: google("gemini-1.5-flash"),
            system: systemPrompt,
            messages,
        });

        return result.toTextStreamResponse();
    } catch (error) {
        console.error("Chat API Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
