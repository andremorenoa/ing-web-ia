import { describe, expect, it } from "vitest";
import { getClientId, isRateLimited } from "@/lib/rateLimit";

describe("isRateLimited", () => {
  it("allows requests under the limit", () => {
    const clientId = "client-under-limit";
    const now = 1_000_000;
    for (let i = 0; i < 5; i++) {
      expect(isRateLimited(clientId, "test-scope", now)).toBe(false);
    }
  });

  it("blocks the request once the limit is exceeded within the window", () => {
    const clientId = "client-over-limit";
    const now = 2_000_000;
    for (let i = 0; i < 5; i++) {
      isRateLimited(clientId, "test-scope", now);
    }
    expect(isRateLimited(clientId, "test-scope", now)).toBe(true);
  });

  it("resets the count once the window has elapsed", () => {
    const clientId = "client-window-reset";
    const windowStart = 3_000_000;
    for (let i = 0; i < 5; i++) {
      isRateLimited(clientId, "test-scope", windowStart);
    }
    expect(isRateLimited(clientId, "test-scope", windowStart)).toBe(true);

    const afterWindow = windowStart + 60_001;
    expect(isRateLimited(clientId, "test-scope", afterWindow)).toBe(false);
  });

  it("tracks separate clients independently", () => {
    const now = 4_000_000;
    for (let i = 0; i < 5; i++) {
      isRateLimited("client-a", "test-scope", now);
    }
    expect(isRateLimited("client-a", "test-scope", now)).toBe(true);
    expect(isRateLimited("client-b", "test-scope", now)).toBe(false);
  });

  it("tracks separate scopes independently for the same client, so /api/chat traffic can't exhaust /api/quote's budget", () => {
    const clientId = "client-multi-scope";
    const now = 5_000_000;
    for (let i = 0; i < 5; i++) {
      isRateLimited(clientId, "chat", now);
    }
    expect(isRateLimited(clientId, "chat", now)).toBe(true);
    expect(isRateLimited(clientId, "quote", now)).toBe(false);
  });
});

describe("getClientId", () => {
  it("uses the first address in x-forwarded-for", () => {
    const request = new Request("http://localhost/api/quote", {
      headers: { "x-forwarded-for": "203.0.113.5, 70.41.3.18" },
    });
    expect(getClientId(request)).toBe("203.0.113.5");
  });

  it("falls back to a shared bucket when the header is absent", () => {
    const request = new Request("http://localhost/api/quote");
    expect(getClientId(request)).toBe("unknown");
  });
});
