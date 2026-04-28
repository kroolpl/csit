import type { APIRoute } from 'astro';
import { GoogleGenerativeAI } from '@google/generative-ai';
import knowledgeBase from '../../assets/knowledge.md?raw';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { messages } = await request.json();
    const apiKey = import.meta.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('GEMINI_API_KEY is missing');
      return new Response(JSON.stringify({ error: 'System configuration error: API Key missing' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: {
        role: 'system',
        parts: [{ text: knowledgeBase }]
      }
    });

    // Format history for Gemini
    const chat = model.startChat({
      history: messages.slice(0, -1).map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
    });

    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    const responseText = result.response.text();

    return new Response(JSON.stringify({ content: responseText }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('AI Chat Error Details:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate response',
      details: error.message || 'Unknown error'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

