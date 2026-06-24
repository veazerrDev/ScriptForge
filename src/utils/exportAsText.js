/**
 * Downloads the editor content as a plain .txt file.
 */
export function exportAsText(text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = "script.txt";
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Downloads the editor content as a .json file that preserves the
 * A-Roll / B-Roll / Motion section structure (and formatting), so it can
 * be re-imported later with importFromFile without losing the structure.
 */
export function exportAsJson(title, html) {
  const data = { title, html };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const safeName = (title || "script").trim().replace(/[\\/:*?"<>|]+/g, "_") || "script";
  a.download = `${safeName}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
