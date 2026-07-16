import { useRef, useCallback } from "react";

/**
 * Screen reader announcements via an ARIA live region.
 * Usage:
 *   const { announce, AnnouncerRegion } = useAnnouncer();
 *   announce("New message received from AI doctor");
 *   // Render <AnnouncerRegion /> once in the component tree
 */
export function useAnnouncer() {
  const ref = useRef(null);

  const announce = useCallback((message, priority = "polite") => {
    if (ref.current) {
      ref.current.setAttribute("aria-live", priority);
      // Clear then set to trigger re-announcement
      ref.current.textContent = "";
      setTimeout(() => {
        if (ref.current) ref.current.textContent = message;
      }, 50);
    }
  }, []);

  function AnnouncerRegion() {
    return (
      <div
        ref={ref}
        aria-live="polite"
        aria-atomic="true"
        role="status"
        className="sr-only"
      />
    );
  }

  return { announce, AnnouncerRegion };
}
