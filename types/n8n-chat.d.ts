// @n8n/chat@1.36.4 ships a broken "types" path in its package.json
// (points at dist/index.d.ts, which doesn't exist — the real file is at
// dist/src/index.d.ts, a subpath its "exports" map doesn't expose). This
// fills in the gap with the options we actually pass to createChat().
declare module "@n8n/chat" {
  export interface ChatOptions {
    webhookUrl: string;
    target?: string;
    mode?: "window" | "fullscreen";
    showWelcomeScreen?: boolean;
    initialMessages?: string[];
    loadPreviousSession?: boolean;
    i18n?: Record<string, unknown>;
    [key: string]: unknown;
  }

  export function createChat(options: ChatOptions): { unmount: () => void };
}

declare module "@n8n/chat/style.css";
