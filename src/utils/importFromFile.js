const SECTION_TYPES = {
  aroll: { label: "A-Roll", match: /^a[\s-]?roll\b\s*:?\s*/i },
  broll: { label: "B-Roll", match: /^b[\s-]?roll\b\s*:?\s*/i },
  motion: { label: "Motion", match: /^motion\b\s*:?\s*/i },
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Converts plain text into editor HTML, auto-detecting lines that start
 * with "A-ROLL", "B-ROLL", or "MOTION" (case-insensitive, optional colon)
 * and wrapping them — together with the lines that follow, until the next
 * recognized header or a blank line — into a colored section-block, same
 * as the ones created manually via the toolbar buttons.
 */
function textToEditorHtml(raw) {
  const lines = String(raw).split(/\r\n|\r|\n/);
  const htmlParts = [];

  let current = null; // { type, contentLines: [] }

  const flushCurrent = () => {
    if (!current) return;
    const { type, contentLines } = current;
    const id = `section-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const text = contentLines.join("<br>");
    htmlParts.push(
      `<div class="section-block ${type}" data-section-id="${id}" data-section-type="${type}">` +
        `<span class="section-label ${type}" contenteditable="false">${SECTION_TYPES[type].label}</span>` +
        (text || " ") +
        `</div>`,
    );
    current = null;
  };

  for (const rawLine of lines) {
    const line = rawLine;
    let matchedType = null;
    for (const [type, def] of Object.entries(SECTION_TYPES)) {
      if (def.match.test(line.trim())) {
        matchedType = type;
        break;
      }
    }

    if (matchedType) {
      flushCurrent();
      const rest = line.trim().replace(SECTION_TYPES[matchedType].match, "");
      current = {
        type: matchedType,
        contentLines: rest ? [escapeHtml(rest)] : [],
      };
      continue;
    }

    if (line.trim() === "") {
      // blank line ends the current section block
      flushCurrent();
      htmlParts.push("<br>");
      continue;
    }

    if (current) {
      current.contentLines.push(escapeHtml(line));
    } else {
      htmlParts.push(escapeHtml(line) + "<br>");
    }
  }
  flushCurrent();

  return htmlParts.join("");
}

/**
 * Reads a file selected by the user (.txt or .json) and returns its content
 * in a shape the editor can render.
 *
 * - .txt  -> auto-detects A-ROLL / B-ROLL / MOTION headers and converts
 *            them into colored section-blocks identical to the ones made
 *            via the toolbar; returns { type: "text", html }
 * - .json -> expects { title?: string, html: string } (our own export format)
 *            returns { type: "json", title, html }
 *
 * Throws an Error with a user-friendly message if the file can't be read
 * or parsed, so the caller can show feedback instead of failing silently.
 */
export function importFromFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("Файл не вибрано."));
      return;
    }

    const name = file.name || "";
    const ext = name.split(".").pop().toLowerCase();

    if (ext !== "txt" && ext !== "json") {
      reject(new Error("Підтримуються лише файли .txt та .json."));
      return;
    }

    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error("Не вдалося прочитати файл."));
    };

    reader.onload = () => {
      const raw = reader.result;

      if (ext === "json") {
        try {
          const data = JSON.parse(raw);
          if (typeof data.html !== "string") {
            throw new Error("missing html field");
          }
          resolve({
            type: "json",
            title: typeof data.title === "string" ? data.title : null,
            html: data.html,
          });
        } catch {
          reject(
            new Error("Файл .json має невірний формат сценарію ScriptForge."),
          );
        }
        return;
      }

      // .txt — auto-detect A-ROLL / B-ROLL / MOTION headers into section-blocks
      const html = textToEditorHtml(raw);

      resolve({ type: "text", html });
    };

    reader.readAsText(file);
  });
}
