/**
 * Minimal, safe server-side renderer for Payload Lexical rich text.
 * Everything is HTML-escaped; only http(s)/mailto/tel links are allowed.
 */
import type { LexicalContent, LexicalNode } from "./types";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function safeHref(url: unknown): string | null {
  if (typeof url !== "string") return null;
  const trimmed = url.trim();
  if (/^(https?:\/\/|mailto:|tel:|\/)/i.test(trimmed)) return escapeHtml(trimmed);
  return null;
}

// Lexical text format bitmask
const BOLD = 1;
const ITALIC = 2;
const STRIKETHROUGH = 4;
const UNDERLINE = 8;
const CODE = 16;

function renderText(node: LexicalNode): string {
  let html = escapeHtml(node.text ?? "");
  const format = typeof node.format === "number" ? node.format : 0;
  if (format & CODE) html = `<code>${html}</code>`;
  if (format & BOLD) html = `<strong>${html}</strong>`;
  if (format & ITALIC) html = `<em>${html}</em>`;
  if (format & UNDERLINE) html = `<u>${html}</u>`;
  if (format & STRIKETHROUGH) html = `<s>${html}</s>`;
  return html;
}

function renderChildren(node: LexicalNode): string {
  return (node.children ?? []).map(renderNode).join("");
}

function renderNode(node: LexicalNode): string {
  switch (node.type) {
    case "text":
      return renderText(node);
    case "linebreak":
      return "<br>";
    case "paragraph": {
      const inner = renderChildren(node);
      return inner.trim() === "" ? "" : `<p>${inner}</p>`;
    }
    case "heading": {
      const tag = typeof node.tag === "string" && /^h[1-6]$/.test(node.tag) ? node.tag : "h2";
      // Never render additional h1s inside content — demote to h2.
      const safeTag = tag === "h1" ? "h2" : tag;
      return `<${safeTag}>${renderChildren(node)}</${safeTag}>`;
    }
    case "quote":
      return `<blockquote>${renderChildren(node)}</blockquote>`;
    case "list": {
      const tag = node.listType === "number" ? "ol" : "ul";
      return `<${tag}>${renderChildren(node)}</${tag}>`;
    }
    case "listitem":
      return `<li>${renderChildren(node)}</li>`;
    case "link":
    case "autolink": {
      const href = safeHref(node.fields?.url ?? node.url);
      const inner = renderChildren(node);
      if (!href) return inner;
      const newTab = node.fields?.newTab ? ' target="_blank" rel="noopener noreferrer"' : "";
      return `<a href="${href}"${newTab}>${inner}</a>`;
    }
    case "horizontalrule":
      return "<hr>";
    case "upload": {
      const value = typeof node.value === "object" && node.value !== null ? node.value : null;
      let src = safeHref(value?.url);
      if (!src) return "";
      // Media files live on the CMS host; make relative URLs absolute.
      if (src.startsWith("/") && currentAssetBase) src = `${currentAssetBase}${src}`;
      const alt = escapeHtml(value?.alt ?? "");
      const size =
        value?.width && value?.height ? ` width="${Number(value.width)}" height="${Number(value.height)}"` : "";
      return `<img src="${src}" alt="${alt}"${size} loading="lazy" decoding="async">`;
    }
    default:
      // Unknown block: render children so content degrades gracefully.
      return renderChildren(node);
  }
}

let currentAssetBase = "";

/** Absolute base URL of the CMS (for media files referenced in content). */
export function cmsAssetBase(): string {
  return (process.env.PAYLOAD_PUBLIC_SERVER_URL ?? "").replace(/\/$/, "");
}

export function renderLexical(content: LexicalContent | null | undefined): string {
  if (!content?.root) return "";
  currentAssetBase = cmsAssetBase();
  return renderChildren(content.root);
}
