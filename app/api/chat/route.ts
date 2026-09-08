// Server-side proxy for the @n8n/chat widget. Calling n8n directly from the
// browser depends on the Chat Trigger node's "Allowed Origins (CORS)" being
// kept in sync with every domain the site is served from (including Vercel
// preview URLs) — proxying through our own origin removes that dependency.
const N8N_CHAT_WEBHOOK_URL =
  "https://andremorenoclaude.app.n8n.cloud/webhook/a34ff6c9-3772-4153-84af-7f65e71f205b/chat";

export async function POST(request: Request): Promise<Response> {
  const body = await request.text();

  const upstream = await fetch(N8N_CHAT_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: { "Content-Type": upstream.headers.get("Content-Type") ?? "application/json" },
  });
}
