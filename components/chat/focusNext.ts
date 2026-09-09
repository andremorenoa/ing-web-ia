const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Moves focus to the next focusable element after `current` within
// `container`, mimicking native Tab — used to make Enter jump to the next
// control instead of submitting (see N8nChatWidget's keydown interception).
export function focusNextElement(container: HTMLElement, current: Element): void {
  const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
  const index = focusable.indexOf(current as HTMLElement);
  if (index === -1) return;

  const next = focusable[index + 1];
  next?.focus();
}
