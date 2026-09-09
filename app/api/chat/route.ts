import { getClientId, isRateLimited } from "@/lib/rateLimit";
import { isValidChatRequestBody } from "@/app/api/chat/validate";

// Server-side proxy for the @n8n/chat widget. Calling n8n directly from the
// browser depends on the Chat Trigger node's "Allowed Origins (CORS)" being
// kept in sync with every domain the site is served from (including Vercel
// preview URLs) — proxying through our own origin removes that dependency.
// Mirrors app/api/quote/route.ts: rate limit, validate before forwarding,
// and never relay an upstream error body/detail straight to the client.
function jsonError(message: string, status: number, extraHeaders?: Record<string, string>): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json", ...extraHeaders },
  });
}

export async function POST(request: Request): Promise<Response> {
  if (isRateLimited(getClientId(request), "chat")) {
    return jsonError("Demasiadas solicitudes. Intenta de nuevo en un minuto.", 429, {
      "Retry-After": "60",
    });
  }

  const webhookUrl = process.env.N8N_CHAT_WEBHOOK_URL;
  if (!webhookUrl) {
    return jsonError("El chat no está configurado en el servidor.", 500);
  }

  const body = await request.text();
  if (!isValidChatRequestBody(body)) {
    return jsonError("Solicitud de chat inválida.", 400);
  }

  try {
    const upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    if (!upstream.ok) {
      console.error(`[api/chat] upstream webhook responded with ${upstream.status}`);
      return jsonError("No pudimos conectar con el chat. Intenta de nuevo más tarde.", 502);
    }

    return new Response(await upstream.text(), {
      status: 200,
      headers: { "Content-Type": upstream.headers.get("Content-Type") ?? "application/json" },
    });
  } catch (error) {
    console.error("[api/chat] failed to reach the webhook:", error);
    return jsonError("No pudimos conectar con el chat. Intenta de nuevo más tarde.", 502);
  }
}
