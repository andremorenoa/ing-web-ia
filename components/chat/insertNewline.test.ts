import { describe, expect, it, vi } from "vitest";
import { insertNewlineAtCursor } from "@/components/chat/insertNewline";

function makeTextarea(value: string, selectionStart: number, selectionEnd = selectionStart): HTMLTextAreaElement {
  const textarea = document.createElement("textarea");
  document.body.appendChild(textarea);
  textarea.value = value;
  textarea.setSelectionRange(selectionStart, selectionEnd);
  return textarea;
}

describe("insertNewlineAtCursor", () => {
  it("inserts a newline at the cursor position", () => {
    const textarea = makeTextarea("hola mundo", 4); // right after "hola"
    insertNewlineAtCursor(textarea);
    expect(textarea.value).toBe("hola\n mundo");
  });

  it("moves the cursor to right after the inserted newline", () => {
    const textarea = makeTextarea("hola mundo", 4);
    insertNewlineAtCursor(textarea);
    expect(textarea.selectionStart).toBe(5);
    expect(textarea.selectionEnd).toBe(5);
  });

  it("replaces a selected range with the newline instead of just inserting", () => {
    const textarea = makeTextarea("hola mundo", 0, 4); // "hola" selected
    insertNewlineAtCursor(textarea);
    expect(textarea.value).toBe("\n mundo");
  });

  it("dispatches a bubbling input event so a v-model/onChange listener picks up the change", () => {
    const textarea = makeTextarea("hola", 4);
    const handler = vi.fn();
    textarea.addEventListener("input", handler);

    insertNewlineAtCursor(textarea);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][0].bubbles).toBe(true);
  });
});
