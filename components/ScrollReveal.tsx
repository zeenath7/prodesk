"use client";

import { useEffect } from "react";

const selector = "[data-scroll-reveal]";

export default function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.01, rootMargin: "0px 0px -24px 0px" },
    );

    const observeReveals = (root: ParentNode) => {
      if (
        root instanceof HTMLElement &&
        root.matches(selector) &&
        !root.classList.contains("is-revealed")
      ) {
        observeReveal(root);
      }

      root
        .querySelectorAll<HTMLElement>(`${selector}:not(.is-revealed)`)
        .forEach(observeReveal);
    };

    const observeReveal = (element: HTMLElement) => {
      observer.observe(element);
    };

    observeReveals(document);

    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) observeReveals(node);
        });
      }
    });

    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);

  return null;
}
