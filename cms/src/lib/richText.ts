/** Helper to build minimal Lexical rich text documents for seeded content. */

type SeedBlock = { heading?: string; paragraphs?: string[]; list?: string[] };

function textNode(text: string) {
  return { type: "text", text, version: 1, detail: 0, format: 0, mode: "normal", style: "" };
}

function block(type: string, children: unknown[], extra: Record<string, unknown> = {}) {
  return { type, version: 1, format: "", indent: 0, direction: "ltr", children, ...extra };
}

export function richTextFromBlocks(blocks: SeedBlock[]) {
  const children: unknown[] = [];
  for (const item of blocks) {
    if (item.heading) {
      children.push(block("heading", [textNode(item.heading)], { tag: "h2" }));
    }
    for (const paragraph of item.paragraphs ?? []) {
      children.push(block("paragraph", [textNode(paragraph)]));
    }
    if (item.list && item.list.length > 0) {
      children.push(
        block(
          "list",
          item.list.map((entry, index) =>
            block("listitem", [textNode(entry)], { value: index + 1 })
          ),
          { listType: "bullet", tag: "ul", start: 1 }
        )
      );
    }
  }
  return {
    root: { type: "root", version: 1, format: "", indent: 0, direction: "ltr", children }
  };
}
