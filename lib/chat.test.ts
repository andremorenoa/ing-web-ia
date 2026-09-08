import { describe, expect, it } from "vitest";
import { CHAT_GREETINGS, CHAT_WEBHOOK_PROXY_PATH, pickRandomGreeting } from "@/lib/chat";

describe("CHAT_WEBHOOK_PROXY_PATH", () => {
  it("points at our same-origin proxy route, not the external n8n URL", () => {
    expect(CHAT_WEBHOOK_PROXY_PATH).toBe("/api/chat");
  });
});

describe("CHAT_GREETINGS", () => {
  it("has between 3 and 5 greeting options", () => {
    expect(CHAT_GREETINGS.length).toBeGreaterThanOrEqual(3);
    expect(CHAT_GREETINGS.length).toBeLessThanOrEqual(5);
  });
});

describe("pickRandomGreeting", () => {
  it("picks the first greeting when the random source returns 0", () => {
    expect(pickRandomGreeting(() => 0)).toBe(CHAT_GREETINGS[0]);
  });

  it("picks the last greeting when the random source returns just under 1", () => {
    expect(pickRandomGreeting(() => 0.999999)).toBe(CHAT_GREETINGS[CHAT_GREETINGS.length - 1]);
  });

  it("defaults to Math.random when no source is given", () => {
    const result = pickRandomGreeting();
    expect(CHAT_GREETINGS).toContain(result);
  });
});
