import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/chat/route";

const N8N_CHAT_WEBHOOK_URL =
  "https://andremorenoclaude.app.n8n.cloud/webhook/a34ff6c9-3772-4153-84af-7f65e71f205b/chat";

function makeRequest(body: string, clientIp: string): Request {
  return new Request("http://localhost:3000/api/chat", {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json", "x-forwarded-for": clientIp },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("POST /api/chat", () => {
  it("forwards the request body to the n8n webhook (URL read from env, not hardcoded) and relays a successful response", async () => {
    vi.stubEnv("N8N_CHAT_WEBHOOK_URL", N8N_CHAT_WEBHOOK_URL);

    const upstreamBody = JSON.stringify({ output: "hola" });
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(upstreamBody, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const requestBody = JSON.stringify({ action: "sendMessage", chatInput: "hola" });
    const response = await POST(makeRequest(requestBody, "198.51.100.1"));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [calledUrl, calledInit] = fetchMock.mock.calls[0];
    expect(calledUrl).toBe(N8N_CHAT_WEBHOOK_URL);
    expect(calledInit.method).toBe("POST");
    expect(calledInit.body).toBe(requestBody);

    expect(response.status).toBe(200);
    expect(await response.text()).toBe(upstreamBody);
  });

  it("rejects a malformed or oversized chat payload with 400 without calling the webhook", async () => {
    vi.stubEnv("N8N_CHAT_WEBHOOK_URL", N8N_CHAT_WEBHOOK_URL);
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(makeRequest("{not json", "198.51.100.2"));

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns a generic 502 without leaking the upstream response body when the webhook fails", async () => {
    vi.stubEnv("N8N_CHAT_WEBHOOK_URL", N8N_CHAT_WEBHOOK_URL);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ message: "internal n8n workflow detail nobody outside should see" }),
          { status: 404 },
        ),
      ),
    );

    const requestBody = JSON.stringify({ action: "sendMessage", chatInput: "hola" });
    const response = await POST(makeRequest(requestBody, "198.51.100.3"));
    const text = await response.text();

    expect(response.status).toBe(502);
    expect(text).not.toContain("internal n8n workflow detail");
    expect(JSON.parse(text)).toHaveProperty("error");
  });

  it("returns a generic 502 without leaking the error when the fetch to the webhook throws", async () => {
    vi.stubEnv("N8N_CHAT_WEBHOOK_URL", N8N_CHAT_WEBHOOK_URL);
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED 10.0.0.5:443")));

    const requestBody = JSON.stringify({ action: "sendMessage", chatInput: "hola" });
    const response = await POST(makeRequest(requestBody, "198.51.100.4"));
    const text = await response.text();

    expect(response.status).toBe(502);
    expect(text).not.toContain("ECONNREFUSED");
    expect(text).not.toContain("10.0.0.5");
  });

  it("returns 500 without calling the webhook when the server isn't configured", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const requestBody = JSON.stringify({ action: "sendMessage", chatInput: "hola" });
    const response = await POST(makeRequest(requestBody, "198.51.100.5"));

    expect(response.status).toBe(500);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rate-limits repeated submissions from the same client", async () => {
    vi.stubEnv("N8N_CHAT_WEBHOOK_URL", N8N_CHAT_WEBHOOK_URL);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 200 })));

    const clientIp = "198.51.100.6";
    const requestBody = JSON.stringify({ action: "sendMessage", chatInput: "hola" });
    let lastResponse: Response | undefined;
    for (let i = 0; i < 6; i++) {
      lastResponse = await POST(makeRequest(requestBody, clientIp));
    }

    expect(lastResponse!.status).toBe(429);
  });

  it("keeps a separate rate-limit budget from /api/quote for the same client", async () => {
    const { POST: quotePost } = await import("@/app/api/quote/route");
    vi.stubEnv("N8N_CHAT_WEBHOOK_URL", N8N_CHAT_WEBHOOK_URL);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 200 })));

    const clientIp = "198.51.100.7";
    const chatBody = JSON.stringify({ action: "sendMessage", chatInput: "hola" });
    for (let i = 0; i < 5; i++) {
      await POST(makeRequest(chatBody, clientIp));
    }
    expect((await POST(makeRequest(chatBody, clientIp))).status).toBe(429);

    const quoteRequest = new Request("http://localhost:3000/api/quote", {
      method: "POST",
      body: JSON.stringify({
        process: "Fresado CNC",
        tolerance: "±0.001″",
        quantity: "50 piezas",
        dueDate: "",
        materials: [],
      }),
      headers: { "Content-Type": "application/json", "x-forwarded-for": clientIp },
    });
    expect((await quotePost(quoteRequest)).status).not.toBe(429);
  });
});
