import { describe, expect, it } from "vitest";
import { focusNextElement } from "@/components/chat/focusNext";

function buildContainer(): { container: HTMLDivElement; textarea: HTMLTextAreaElement; nextButton: HTMLButtonElement } {
  const container = document.createElement("div");
  const textarea = document.createElement("textarea");
  const nextButton = document.createElement("button");
  const afterButton = document.createElement("button");
  container.append(textarea, nextButton, afterButton);
  document.body.appendChild(container);
  return { container, textarea, nextButton };
}

describe("focusNextElement", () => {
  it("moves focus to the next focusable element after the given one", () => {
    const { container, textarea, nextButton } = buildContainer();
    focusNextElement(container, textarea);
    expect(document.activeElement).toBe(nextButton);
  });

  it("does nothing when the given element is the last focusable one", () => {
    const container = document.createElement("div");
    const textarea = document.createElement("textarea");
    container.append(textarea);
    document.body.appendChild(container);

    focusNextElement(container, textarea);
    expect(document.activeElement).not.toBe(textarea);
  });

  it("skips disabled elements", () => {
    const container = document.createElement("div");
    const textarea = document.createElement("textarea");
    const disabledButton = document.createElement("button");
    disabledButton.disabled = true;
    const enabledButton = document.createElement("button");
    container.append(textarea, disabledButton, enabledButton);
    document.body.appendChild(container);

    focusNextElement(container, textarea);
    expect(document.activeElement).toBe(enabledButton);
  });

  it("ignores an element that isn't inside the container", () => {
    const { container } = buildContainer();
    const outsider = document.createElement("textarea");
    document.body.appendChild(outsider);

    expect(() => focusNextElement(container, outsider)).not.toThrow();
  });
});
