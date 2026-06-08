/**
 * Scans the editor DOM for section blocks and returns a list of sections
 * suitable for the Sidebar component.
 */
export function parseSections(editorEl) {
  if (!editorEl) return [];
  const blocks = editorEl.querySelectorAll(".section-block[data-section-id]");
  return Array.from(blocks).map((block) => {
    const type = block.getAttribute("data-section-type") || "aroll";
    const id   = block.getAttribute("data-section-id");
    // strip the label span text, get only the rest
    const labelEl = block.querySelector(".section-label");
    const clone   = block.cloneNode(true);
    clone.querySelector(".section-label")?.remove();
    const preview = (clone.textContent || "").trim().slice(0, 60);
    return { id, type, preview };
  });
}
