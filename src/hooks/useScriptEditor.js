import { useRef, useState, useCallback, useEffect } from "react";
import { parseSections } from "../utils/parseSections";
import { exportAsText, exportAsJson } from "../utils/exportAsText";
import { importFromFile } from "../utils/importFromFile";

export function useScriptEditor() {
  const editorRef = useRef(null);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
  });
  const [fontSize, setFontSizeState] = useState(16);
  const [fontFamily, setFontFamilyState] = useState(
    "Instrument Sans, sans-serif",
  );
  const [sections, setSections] = useState([]);
  const [importError, setImportError] = useState(null);

  // ── завантажуємо збережений контент при старті ──
  useEffect(() => {
    const saved = localStorage.getItem("scriptforge_content");
    if (saved && editorRef.current) {
      editorRef.current.innerHTML = saved;
      setSections(parseSections(editorRef.current));
    }
  }, []);

  /* ── helpers ── */
  const exec = (cmd, val = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
  };

  const updateFormats = useCallback(() => {
    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
    });
  }, []);

  /* ── selection change ── */
  const handleSelectionChange = useCallback(() => {
    updateFormats();
  }, [updateFormats]);

  /* ── content change → parse sections ── */
  const handleChange = useCallback(() => {
    if (!editorRef.current) return;
    localStorage.setItem("scriptforge_content", editorRef.current.innerHTML);
    setSections(parseSections(editorRef.current));
  }, []);

  /* ── formatting ── */
  const toggleBold = () => exec("bold");
  const toggleItalic = () => exec("italic");
  const toggleUnderline = () => exec("underline");

  const setFontSize = (size) => {
    setFontSizeState(Number(size));
    exec("styleWithCSS", true);
    exec("fontSize", 3);
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    const span = document.createElement("span");
    span.style.fontSize = `${size}px`;
    range.surroundContents(span);
  };

  const setFontFamily = (family) => {
    setFontFamilyState(family);
    exec("styleWithCSS", true);
    exec("fontName", family);
  };

  /* ── undo / redo ── */
  const undo = () => exec("undo");
  const redo = () => exec("redo");

  /* ── insert section block ── */
  const insertSection = useCallback((type) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();

    const sel = window.getSelection();
    const selectedText = sel?.toString() || "";

    const id = `section-${Date.now()}`;
    const typeLabels = { aroll: "A-Roll", broll: "B-Roll", motion: "Motion" };

    const block = document.createElement("div");
    block.className = `section-block ${type}`;
    block.setAttribute("data-section-id", id);
    block.setAttribute("data-section-type", type);

    const label = document.createElement("span");
    label.className = `section-label ${type}`;
    label.contentEditable = "false";
    label.textContent = typeLabels[type];

    const textNode = document.createTextNode(selectedText || " ");

    block.appendChild(label);
    block.appendChild(textNode);

    if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(block);
    } else {
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        range.insertNode(block);
      } else {
        editor.appendChild(block);
      }
    }

    const newRange = document.createRange();
    newRange.setStartAfter(block);
    newRange.collapse(true);
    sel?.removeAllRanges();
    sel?.addRange(newRange);

    setSections(parseSections(editor));
  }, []);

  const insertARoll = () => insertSection("aroll");
  const insertBRoll = () => insertSection("broll");
  const insertMotion = () => insertSection("motion");

  /* ── jump to section ── */
  const jumpToSection = useCallback((id) => {
    const el = editorRef.current?.querySelector(`[data-section-id="${id}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  /* ── export ── */
  const handleExport = useCallback(() => {
    if (!editorRef.current) return;
    exportAsText(editorRef.current.innerText);
  }, []);

  const handleExportJson = useCallback((title) => {
    if (!editorRef.current) return;
    exportAsJson(title, editorRef.current.innerHTML);
  }, []);

  /* ── import ──
   * Reads the chosen file, replaces the editor content with the
   * recognized text/structure, and returns the recognized title (if any)
   * so the caller (App) can update the project title state.
   */
  const handleImport = useCallback(async (file) => {
    setImportError(null);
    try {
      const result = await importFromFile(file);
      if (!editorRef.current) return null;

      editorRef.current.innerHTML = result.html;
      localStorage.setItem("scriptforge_content", result.html);
      setSections(parseSections(editorRef.current));

      return result.title || null;
    } catch (err) {
      setImportError(err.message || "Не вдалося імпортувати файл.");
      return null;
    }
  }, []);

  return {
    editorRef,
    activeFormats,
    fontSize,
    fontFamily,
    sections,
    importError,
    toggleBold,
    toggleItalic,
    toggleUnderline,
    setFontSize,
    setFontFamily,
    undo,
    redo,
    insertARoll,
    insertBRoll,
    insertMotion,
    handleSelectionChange,
    handleChange,
    jumpToSection,
    handleExport,
    handleExportJson,
    handleImport,
  };
}
