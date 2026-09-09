import { fireEvent, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CHAT_GREETINGS, CHAT_WEBHOOK_PROXY_PATH } from "@/lib/chat";

const createChatMock = vi.fn();

vi.mock("@n8n/chat", () => ({
  createChat: (...args: unknown[]) => createChatMock(...args),
}));
vi.mock("@n8n/chat/style.css", () => ({}));

import { N8nChatWidget } from "@/components/chat/N8nChatWidget";

describe("N8nChatWidget", () => {
  let unmountAppMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    unmountAppMock = vi.fn();
    createChatMock.mockReset();
    createChatMock.mockReturnValue({ unmount: unmountAppMock });
  });

  it("renders the chat mount target", () => {
    const { container } = render(<N8nChatWidget />);
    expect(container.querySelector("#n8n-chat")).not.toBeNull();
  });

  it("mounts n8n chat as a floating window using the configured webhook", () => {
    render(<N8nChatWidget />);
    expect(createChatMock).toHaveBeenCalledTimes(1);
    const config = createChatMock.mock.calls[0][0];
    expect(config.webhookUrl).toBe(CHAT_WEBHOOK_PROXY_PATH);
    expect(config.target).toBe("#n8n-chat");
    expect(config.mode).toBe("window");
  });

  it("opens with a single greeting drawn from CHAT_GREETINGS", () => {
    render(<N8nChatWidget />);
    const config = createChatMock.mock.calls[0][0];
    expect(config.initialMessages).toHaveLength(1);
    expect(CHAT_GREETINGS).toContain(config.initialMessages[0]);
  });

  it("does not restore a previous session, so the random greeting always shows", () => {
    render(<N8nChatWidget />);
    const config = createChatMock.mock.calls[0][0];
    expect(config.loadPreviousSession).toBe(false);
  });

  it("labels the widget chrome in Spanish instead of the library's English defaults", () => {
    render(<N8nChatWidget />);
    const config = createChatMock.mock.calls[0][0];
    expect(config.defaultLanguage).toBe("es");
    const es = config.i18n.es;
    expect(es.title).toBe("Vektor Precision CNC");
    expect(es.inputPlaceholder).not.toMatch(/type your/i);
    expect(es.closeButtonTooltip).not.toMatch(/close chat/i);
    expect(es.getStarted).not.toMatch(/new conversation/i);
  });

  it("unmounts the underlying chat app on unmount, so a remount (e.g. Strict Mode) doesn't collide", () => {
    const { unmount } = render(<N8nChatWidget />);
    unmount();
    expect(unmountAppMock).toHaveBeenCalledTimes(1);
  });

  describe("Enter key in the chat textarea", () => {
    // @n8n/chat mounts its own Vue app (mocked here), so we simulate the
    // textarea + send button it would render inside #n8n-chat.
    function renderWithFakeChatInput() {
      const { container } = render(<N8nChatWidget />);
      const textarea = document.createElement("textarea");
      const sendButton = document.createElement("button");
      sendButton.textContent = "Enviar";
      container.querySelector("#n8n-chat")!.append(textarea, sendButton);
      return { textarea, sendButton };
    }

    it("does not submit on Enter — moves focus to the next control instead", () => {
      const { textarea, sendButton } = renderWithFakeChatInput();
      textarea.focus();

      const event = fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });

      expect(event).toBe(false); // fireEvent returns false when preventDefault() was called
      expect(document.activeElement).toBe(sendButton);
    });

    it("leaves Shift+Enter alone (newline), not intercepted", () => {
      const { textarea } = renderWithFakeChatInput();
      textarea.focus();

      const event = fireEvent.keyDown(textarea, { key: "Enter", shiftKey: true });

      expect(event).toBe(true); // not prevented
      expect(document.activeElement).toBe(textarea);
    });

    it("does not intercept Enter outside the chat textarea", () => {
      render(<N8nChatWidget />);
      const outsideInput = document.createElement("textarea");
      document.body.appendChild(outsideInput);
      outsideInput.focus();

      const event = fireEvent.keyDown(outsideInput, { key: "Enter" });

      expect(event).toBe(true); // not prevented — this listener leaves it alone
      expect(document.activeElement).toBe(outsideInput);
    });
  });
});
