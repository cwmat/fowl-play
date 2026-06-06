"use client";

import { useEffect } from "react";
import { getRandomButtonSfx } from "@/lib/button-sfx";

const BUTTON_SELECTOR = "button,a[role='button'],a[data-button-sfx='true']";

export function ButtonSfx() {
  useEffect(() => {
    function playButtonSound(event: MouseEvent) {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const button = target.closest(BUTTON_SELECTOR);

      if (!button || isDisabledButton(button)) {
        return;
      }

      const audio = new Audio(getRandomButtonSfx());
      audio.volume = 0.55;
      void audio.play().catch(() => {
        // Browsers can reject playback during edge-case autoplay policies.
      });
    }

    document.addEventListener("click", playButtonSound, { capture: true });

    return () => {
      document.removeEventListener("click", playButtonSound, { capture: true });
    };
  }, []);

  return null;
}

function isDisabledButton(element: Element) {
  return element instanceof HTMLButtonElement && element.disabled;
}
