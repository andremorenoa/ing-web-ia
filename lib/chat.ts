// Routed through app/api/chat (a same-origin proxy to the n8n webhook) so the
// widget's fetch never crosses origins — see that route for why.
export const CHAT_WEBHOOK_PROXY_PATH = "/api/chat";

export const CHAT_GREETINGS = [
  "¿En qué proceso o pieza estás trabajando? Cuéntame los detalles y te oriento.",
  "Bienvenido a Vektor Precision CNC. ¿Buscas cotizar un proceso o tienes una duda técnica?",
  "Hola, soy el asistente de planta. ¿Fresado, torneado, shims o algo más?",
  "¿Tienes un plano o especificación en mente? Cuéntame qué necesitas maquinar.",
  "Gracias por visitarnos. ¿En qué puedo ayudarte con tu próximo proceso de maquinado?",
] as const;

export function pickRandomGreeting(random: () => number = Math.random): string {
  const index = Math.floor(random() * CHAT_GREETINGS.length);
  return CHAT_GREETINGS[index];
}
