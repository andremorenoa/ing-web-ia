import { describe, expect, it } from "vitest";
import { isValidChatRequestBody } from "@/app/api/chat/validate";

describe("isValidChatRequestBody", () => {
  it("accepts a well-formed n8n chat action payload", () => {
    expect(isValidChatRequestBody(JSON.stringify({ action: "sendMessage", chatInput: "hola" }))).toBe(true);
    expect(isValidChatRequestBody(JSON.stringify({ action: "loadPreviousSession" }))).toBe(true);
  });

  it("rejects an empty body", () => {
    expect(isValidChatRequestBody("")).toBe(false);
  });

  it("rejects malformed JSON", () => {
    expect(isValidChatRequestBody("{not json")).toBe(false);
  });

  it("rejects a JSON array or primitive instead of an object", () => {
    expect(isValidChatRequestBody("[1,2,3]")).toBe(false);
    expect(isValidChatRequestBody('"just a string"')).toBe(false);
  });

  it("rejects a payload missing a string action field", () => {
    expect(isValidChatRequestBody(JSON.stringify({ chatInput: "hola" }))).toBe(false);
    expect(isValidChatRequestBody(JSON.stringify({ action: 42 }))).toBe(false);
    expect(isValidChatRequestBody(JSON.stringify({ action: "" }))).toBe(false);
  });

  it("rejects an oversized body to cap abuse/DoS potential", () => {
    const hugeChatInput = "x".repeat(20_000);
    expect(isValidChatRequestBody(JSON.stringify({ action: "sendMessage", chatInput: hugeChatInput }))).toBe(
      false,
    );
  });
});
