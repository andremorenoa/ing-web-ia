// @n8n/chat sends freeform action payloads (sendMessage, loadPreviousSession,
// and possibly others depending on library version/config), so unlike the
// quote form we can't allow-list every field. This is a floor, not a full
// schema: valid JSON, a plain object, a non-empty bounded "action" string,
// and a hard size cap so an attacker can't relay an arbitrarily large body
// through us into n8n.
const MAX_BODY_BYTES = 8_000;
const MAX_ACTION_LENGTH = 100;

export function isValidChatRequestBody(rawBody: string): boolean {
  if (rawBody.length === 0 || rawBody.length > MAX_BODY_BYTES) return false;

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return false;
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return false;

  const action = (parsed as Record<string, unknown>).action;
  return typeof action === "string" && action.length > 0 && action.length <= MAX_ACTION_LENGTH;
}
