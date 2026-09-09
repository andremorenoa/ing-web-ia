// Manually inserts a newline at the textarea's cursor position and fires a
// bubbling "input" event so a framework's v-model/onChange picks up the
// change. Needed because we call preventDefault() on Enter to stop
// @n8n/chat's hardcoded send-on-Enter — which also blocks the browser's own
// default newline insertion, so we have to replicate it ourselves.
export function insertNewlineAtCursor(textarea: HTMLTextAreaElement): void {
  const { selectionStart, selectionEnd, value } = textarea;
  const start = selectionStart ?? value.length;
  const end = selectionEnd ?? value.length;

  textarea.value = `${value.slice(0, start)}\n${value.slice(end)}`;

  const cursorPosition = start + 1;
  textarea.setSelectionRange(cursorPosition, cursorPosition);
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}
