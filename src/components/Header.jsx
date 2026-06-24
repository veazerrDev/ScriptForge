import { useState, useRef } from "react";
import styles from "./Header.module.css";

export default function Header({
  title,
  onTitleChange,
  onToggleSidebar,
  sidebarOpen,
  onExport,
  onExportJson,
  onImport,
  importError,
}) {
  const [editing, setEditing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // дозволяє вибрати той самий файл знову
    if (!file) return;
    const recognizedTitle = await onImport(file);
    if (recognizedTitle) onTitleChange(recognizedTitle);
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <span className={styles.logoMark}>SF</span>
          <span className={styles.logoText}>ScriptForge</span>
        </div>
        <div className={styles.divider} />
        {editing ? (
          <input
            className={styles.titleInput}
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => e.key === "Enter" && setEditing(false)}
            autoFocus
          />
        ) : (
          <span className={styles.title} onClick={() => setEditing(true)}>
            {title}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.5 1.5L10.5 3.5L4 10H2V8L8.5 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        )}
        {importError && <span className={styles.error}>{importError}</span>}
      </div>

      <div className={styles.right}>
        <button className={styles.iconBtn} onClick={onToggleSidebar} title="Структура">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="3" width="5" height="10" rx="1" stroke="currentColor" strokeWidth="1.3" fill={sidebarOpen ? "currentColor" : "none"} fillOpacity="0.15"/>
            <line x1="10" y1="5" x2="14" y2="5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            <line x1="10" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            <line x1="10" y1="11" x2="13" y2="11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.json"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <button
          className={styles.importBtn}
          onClick={() => fileInputRef.current?.click()}
          title="Імпортувати .txt або .json"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 9V1M4 4l3-3 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 11h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          Імпорт
        </button>

        <button className={styles.exportBtn} onClick={onExport} title="Завантажити як .txt">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1V9M4 6l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 11h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          Експорт
        </button>
        <button
          className={styles.exportJsonBtn}
          onClick={() => onExportJson(title)}
          title="Завантажити як .json (зі структурою секцій)"
        >
          .json
        </button>
      </div>
    </header>
  );
}
