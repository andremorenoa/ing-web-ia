"use client";

import { useEffect } from "react";
import { createChat } from "@n8n/chat";
import "@n8n/chat/style.css";
import "./n8n-chat-theme.css";
import { CHAT_WEBHOOK_PROXY_PATH, pickRandomGreeting } from "@/lib/chat";

export function N8nChatWidget() {
  useEffect(() => {
    const app = createChat({
      webhookUrl: CHAT_WEBHOOK_PROXY_PATH,
      target: "#n8n-chat",
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
      app.unmount();
    };
  }, []);

  return <div id="n8n-chat" />;
}
