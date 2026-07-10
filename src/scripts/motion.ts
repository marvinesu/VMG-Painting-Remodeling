/**
 * Site-wide motion built on the framer-motion vanilla DOM API (no React).
 *
 * - Hero content slides in on load.
 * - Sections, cards, grids, and lists reveal on scroll with a stagger.
 * - [data-count] numbers count up when they enter the viewport.
 * - The sticky header gains elevation once the page is scrolled.
 *
 * All initial hidden states are applied from JS, so content stays fully
 * visible when JS is unavailable, and every animation is skipped for
 * prefers-reduced-motion users (WCAG 2.3.3).
 */
import { animate, inView, stagger } from "framer-motion/dom";

const header = document.querySelector<HTMLElement>(".site-header");
if (header) {
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];
  const prepped = new Set<HTMLElement>();

  const prep = (el: HTMLElement) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(22px)";
    prepped.add(el);
  };
  const show = (el: HTMLElement, delay = 0) =>
    animate(el, { opacity: 1, transform: "translateY(0px)" }, { duration: 0.6, delay, ease: EASE });

  // Fire the callback the first time the element scrolls into view.
  const revealOnce = (trigger: Element, run: () => void) => {
    const stop = inView(
      trigger,
      () => {
        run();
        stop();
      },
      { margin: "0px 0px -70px 0px" }
    );
  };

  // Hero / page-hero entrance (above the fold, so it runs immediately).
  const hero = document.querySelector<HTMLElement>(".hero-inner, .page-hero-content");
  if (hero) {
    Array.from(hero.children).forEach((child, i) => {
      const el = child as HTMLElement;
      prep(el);
      show(el, 0.08 * i);
    });
  }

  // Grouped reveals: children stagger in together when the group enters.
  document
    .querySelectorAll<HTMLElement>(".grid, .trust-grid, .process-list, .check-list, .pill-row, .footer-grid")
    .forEach((group) => {
      if (group.closest(".hero, .page-hero")) return;
      const children = Array.from(group.children).filter(
        (c): c is HTMLElement => c instanceof HTMLElement && !prepped.has(c)
      );
      if (children.length === 0) return;
      children.forEach(prep);
      revealOnce(group, () => {
        animate(
          children,
          { opacity: 1, transform: "translateY(0px)" },
          { duration: 0.55, delay: stagger(0.07), ease: EASE }
        );
      });
    });

  // Single-element reveals (headings, leads, split columns, CTA band).
  document
    .querySelectorAll<HTMLElement>(".section .eyebrow, .section h2, .section .lead, .split > *, .cta-inner > *")
    .forEach((el) => {
      if (prepped.has(el)) return;
      if (el.closest(".hero, .page-hero")) return;
      // Skip when an ancestor already animates — it would double the motion.
      for (const p of prepped) {
        if (p !== el && p.contains(el)) return;
      }
      prep(el);
      revealOnce(el, () => show(el));
    });

  // Stat count-ups: <strong data-count="30" data-count-suffix="+">30+</strong>
  document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
    const target = Number(el.dataset.count ?? "0");
    if (!Number.isFinite(target) || target <= 0) return;
    const suffix = el.dataset.countSuffix ?? "";
    revealOnce(el, () => {
      animate(0, target, {
        duration: 1.1,
        ease: "easeOut",
        onUpdate: (v) => {
          el.textContent = `${Math.round(v)}${suffix}`;
        }
      });
    });
  });
}
