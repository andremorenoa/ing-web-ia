import { getClientId, isRateLimited } from "@/lib/rateLimit";
import { validateQuotePayload } from "@/app/api/quote/validate";

// Server-side proxy for QuoteForm submissions. The browser never talks to
// n8n directly: it POSTs here, and this route forwards a validated copy to
// the webhook with the shared secret attached, which must stay server-only.
// Upstream failures are logged server-side but never relayed verbatim to the
// client, so internal n8n details (hints, URLs, stack traces) never leak.
function jsonError(message: string, status: number, extraHeaders?: Record<string, string>): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json", ...extraHeaders },
  });
}

export async function POST(request: Request): Promise<Response> {
  if (isRateLimited(getClientId(request), "quote")) {
    return jsonError("Demasiadas solicitudes. Intenta de nuevo en un minuto.", 429, {
      "Retry-After": "60",
    });
  }

  const webhookUrl = process.env.N8N_QUOTE_WEBHOOK_URL;
  const webhookSecret = process.env.N8N_QUOTE_WEBHOOK_SECRET;
  if (!webhookUrl || !webhookSecret) {
    return jsonError("El webhook de cotizaciones no está configurado en el servidor.", 500);
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return jsonError("El cuerpo de la solicitud no es JSON válido.", 400);
  }

  const payload = validateQuotePayload(rawBody);
  if (!payload) {
    return jsonError("Datos de la solicitud inválidos.", 400);
  }

  try {
    const upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-webhook-secret": webhookSecret,
      },
      body: JSON.stringify(payload),
    });

    if (!upstream.ok) {
      console.error(`[api/quote] upstream webhook responded with ${upstream.status}`);
      return jsonError("No pudimos procesar tu solicitud. Intenta de nuevo más tarde.", 502);
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[api/quote] failed to reach the webhook:", error);
    return jsonError("No pudimos procesar tu solicitud. Intenta de nuevo más tarde.", 502);
  }
}
