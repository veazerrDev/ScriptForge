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
