import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/quote/route";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("POST /api/quote", () => {
  it("forwards the request body to the n8n webhook with the shared-secret header", async () => {
    vi.stubEnv("N8N_QUOTE_WEBHOOK_URL", "https://andremorenoclaude.app.n8n.cloud/webhook-test/make_reservation");
    vi.stubEnv("N8N_QUOTE_WEBHOOK_SECRET", "test-secret-value");

    const upstreamBody = JSON.stringify({ ok: true });
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(upstreamBody, { status: 200, headers: { "Content-Type": "application/json" } }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const requestBody = JSON.stringify({
      process: "Fresado CNC",
      tolerance: "±0.001″",
      quantity: "50 piezas",
      dueDate: "01/01/2027",
      materials: ["D2", "H13"],
    });
    const request = new Request("http://localhost:3000/api/quote", {
      method: "POST",
      body: requestBody,
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [calledUrl, calledInit] = fetchMock.mock.calls[0];
    expect(calledUrl).toBe("https://andremorenoclaude.app.n8n.cloud/webhook-test/make_reservation");
    expect(calledInit.method).toBe("POST");
    expect(calledInit.body).toBe(requestBody);
    expect(calledInit.headers["x-webhook-secret"]).toBe("test-secret-value");

    expect(response.status).toBe(200);
    expect(await response.text()).toBe(upstreamBody);
  });

  it("relays a non-200 upstream status instead of masking it as success", async () => {
    vi.stubEnv("N8N_QUOTE_WEBHOOK_URL", "https://andremorenoclaude.app.n8n.cloud/webhook-test/make_reservation");
    vi.stubEnv("N8N_QUOTE_WEBHOOK_SECRET", "test-secret-value");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ message: "error" }), { status: 500 })),
    );

    const request = new Request("http://localhost:3000/api/quote", { method: "POST", body: "{}" });
    const response = await POST(request);
    expect(response.status).toBe(500);
  });

  it("returns 500 without calling the webhook when the server isn't configured", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const request = new Request("http://localhost:3000/api/quote", { method: "POST", body: "{}" });
    const response = await POST(request);

    expect(response.status).toBe(500);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
