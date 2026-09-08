import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/chat/route";

const N8N_CHAT_WEBHOOK_URL =
  "https://andremorenoclaude.app.n8n.cloud/webhook/a34ff6c9-3772-4153-84af-7f65e71f205b/chat";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("POST /api/chat", () => {
  it("forwards the request body to the n8n webhook and relays its response", async () => {
    const upstreamBody = JSON.stringify({ output: "hola" });
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(upstreamBody, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const requestBody = JSON.stringify({ action: "sendMessage", chatInput: "hola" });
    const request = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      body: requestBody,
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [calledUrl, calledInit] = fetchMock.mock.calls[0];
    expect(calledUrl).toBe(N8N_CHAT_WEBHOOK_URL);
    expect(calledInit.method).toBe("POST");
    expect(calledInit.body).toBe(requestBody);

    expect(response.status).toBe(200);
    expect(await response.text()).toBe(upstreamBody);
  });

  it("relays a non-200 upstream status instead of masking it as success", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: "not registered" }), { status: 404 }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const request = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      body: "{}",
    });

    const response = await POST(request);
    expect(response.status).toBe(404);
  });
});
