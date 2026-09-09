import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/quote/route";

const VALID_PAYLOAD = {
  process: "Fresado CNC",
  tolerance: "±0.001″",
  quantity: "50 piezas",
  dueDate: "",
  materials: ["D2"],
};

function makeRequest(body: unknown, clientIp: string, rawBody?: string): Request {
  return new Request("http://localhost:3000/api/quote", {
    method: "POST",
    body: rawBody ?? JSON.stringify(body),
    headers: { "Content-Type": "application/json", "x-forwarded-for": clientIp },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("POST /api/quote", () => {
  it("forwards a sanitized copy of a valid payload to the webhook with the shared-secret header", async () => {
    vi.stubEnv("N8N_QUOTE_WEBHOOK_URL", "https://andremorenoclaude.app.n8n.cloud/webhook-test/make_reservation");
    vi.stubEnv("N8N_QUOTE_WEBHOOK_SECRET", "test-secret-value");
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(makeRequest(VALID_PAYLOAD, "203.0.113.1"));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://andremorenoclaude.app.n8n.cloud/webhook-test/make_reservation");
    expect(init.method).toBe("POST");
    expect(init.headers["x-webhook-secret"]).toBe("test-secret-value");
    expect(JSON.parse(init.body)).toEqual(VALID_PAYLOAD);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });

  it("rejects an invalid payload with 400 without calling the webhook", async () => {
    vi.stubEnv("N8N_QUOTE_WEBHOOK_URL", "https://example.com/webhook");
    vi.stubEnv("N8N_QUOTE_WEBHOOK_SECRET", "test-secret-value");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      makeRequest({ ...VALID_PAYLOAD, process: "Proceso inventado" }, "203.0.113.2"),
    );

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects malformed JSON with 400 without calling the webhook", async () => {
    vi.stubEnv("N8N_QUOTE_WEBHOOK_URL", "https://example.com/webhook");
    vi.stubEnv("N8N_QUOTE_WEBHOOK_SECRET", "test-secret-value");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(makeRequest(undefined, "203.0.113.3", "{not json"));

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns a generic 502 without leaking the upstream response body when the webhook fails", async () => {
    vi.stubEnv("N8N_QUOTE_WEBHOOK_URL", "https://example.com/webhook");
    vi.stubEnv("N8N_QUOTE_WEBHOOK_SECRET", "test-secret-value");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ hint: "internal n8n workflow detail nobody outside should see" }),
          { status: 404 },
        ),
      ),
    );

    const response = await POST(makeRequest(VALID_PAYLOAD, "203.0.113.4"));
    const text = await response.text();

    expect(response.status).toBe(502);
    expect(text).not.toContain("internal n8n workflow detail");
    expect(JSON.parse(text)).toHaveProperty("error");
  });

  it("returns a generic 502 without leaking the error when the fetch to the webhook throws", async () => {
    vi.stubEnv("N8N_QUOTE_WEBHOOK_URL", "https://example.com/webhook");
    vi.stubEnv("N8N_QUOTE_WEBHOOK_SECRET", "test-secret-value");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED 10.0.0.5:443")));

    const response = await POST(makeRequest(VALID_PAYLOAD, "203.0.113.6"));
    const text = await response.text();

    expect(response.status).toBe(502);
    expect(text).not.toContain("ECONNREFUSED");
    expect(text).not.toContain("10.0.0.5");
  });

  it("returns 500 without calling the webhook when the server isn't configured", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(makeRequest(VALID_PAYLOAD, "203.0.113.7"));

    expect(response.status).toBe(500);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rate-limits repeated submissions from the same client", async () => {
    vi.stubEnv("N8N_QUOTE_WEBHOOK_URL", "https://example.com/webhook");
    vi.stubEnv("N8N_QUOTE_WEBHOOK_SECRET", "test-secret-value");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 200 })));

    const clientIp = "203.0.113.9";
    let lastResponse: Response | undefined;
    for (let i = 0; i < 6; i++) {
      lastResponse = await POST(makeRequest(VALID_PAYLOAD, clientIp));
    }

    expect(lastResponse!.status).toBe(429);
  });
});
