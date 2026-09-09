"use client";

import { useEffect } from "react";
import { createChat } from "@n8n/chat";
import "@n8n/chat/style.css";
import "./n8n-chat-theme.css";
import { CHAT_WEBHOOK_PROXY_PATH, pickRandomGreeting } from "@/lib/chat";
import { focusNextElement } from "./focusNext";

const CHAT_CONTAINER_ID = "n8n-chat";

export function N8nChatWidget() {
  useEffect(() => {
    // @n8n/chat hardcodes Enter-to-send inside its own textarea keydown
    // handler, with no option to disable it. Intercept in the capture phase
    // (before the library's own bubble-phase listener runs) so Enter jumps
    // to the next control — e.g. the send button — instead of submitting;
    // Shift+Enter and IME composition are left untouched.
    const container = document.getElementById(CHAT_CONTAINER_ID);
    if (!container) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key !== "Enter" ||
        event.shiftKey ||
        event.isComposing ||
        !(event.target instanceof HTMLTextAreaElement)
      ) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      focusNextElement(container, event.target);
    };

    container.addEventListener("keydown", handleKeyDown, true);

    const app = createChat({
      webhookUrl: CHAT_WEBHOOK_PROXY_PATH,
      target: `#${CHAT_CONTAINER_ID}`,
      mode: "window",
      showWelcomeScreen: false,
      loadPreviousSession: false,
      initialMessages: [pickRandomGreeting()],
      defaultLanguage: "es",
      i18n: {
        es: {
          title: "Vektor Precision CNC",
          subtitle: "Escríbenos sobre tu proceso o cotización.",
          footer: "",
          getStarted: "Nueva conversación",
          inputPlaceholder: "Escribe tu pregunta...",
          closeButtonTooltip: "Cerrar chat",
        },
      },
    });

    return () => {
      container.removeEventListener("keydown", handleKeyDown, true);
      app.unmount();
    };
  }, []);

  return <div id={CHAT_CONTAINER_ID} />;
}
