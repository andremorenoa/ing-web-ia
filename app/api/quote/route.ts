// Server-side proxy for QuoteForm submissions. The browser never talks to
// n8n directly: it POSTs here, and this route forwards to the webhook with
// the shared secret attached, which must stay server-only.
export async function POST(request: Request): Promise<Response> {
  const webhookUrl = process.env.N8N_QUOTE_WEBHOOK_URL;
  const webhookSecret = process.env.N8N_QUOTE_WEBHOOK_SECRET;

  if (!webhookUrl || !webhookSecret) {
    return new Response(
      JSON.stringify({ error: "El webhook de cotizaciones no está configurado en el servidor." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  const body = await request.text();

  const upstream = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-webhook-secret": webhookSecret,
    },
    body,
  });

  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: { "Content-Type": upstream.headers.get("Content-Type") ?? "application/json" },
  });
}
