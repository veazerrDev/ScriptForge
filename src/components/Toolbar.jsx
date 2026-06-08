import styles from "./Toolbar.module.css";

const FONTS = [
  { label: "Instrument Sans", value: "Instrument Sans, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Courier New", value: "Courier New, monospace" },
  { label: "Syne", value: "Syne, sans-serif" },
];

const SIZES = [12, 14, 16, 18, 20, 24, 28, 32];

export default function Toolbar({
  onBold, onItalic, onUnderline,
  onFontSize, onFontFamily,
  onAddARoll, onAddBRoll, onAddMotion,
  onUndo, onRedo,
  activeFormats, fontSize, fontFamily,
}) {
  return (
    <div className={styles.toolbar}>
      {/* Undo / Redo */}
      <div className={styles.group}>
        <button className={styles.btn} onClick={onUndo} title="Скасувати (Ctrl+Z)">
          <UndoIcon />
        </button>
        <button className={styles.btn} onClick={onRedo} title="Повторити (Ctrl+Y)">
          <RedoIcon />
        </button>
      </div>

      <div className={styles.sep} />

      {/* Font */}
      <div className={styles.group}>
        <select
          className={styles.select}
          value={fontFamily}
          onChange={(e) => onFontFamily(e.target.value)}
          title="Шрифт"
        >
          {FONTS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
        <select
          className={styles.selectSmall}
          value={fontSize}
          onChange={(e) => onFontSize(e.target.value)}
          title="Розмір"
        >
          {SIZES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className={styles.sep} />

      {/* Formatting */}
      <div className={styles.group}>
        <button
          className={`${styles.btn} ${activeFormats.bold ? styles.active : ""}`}
          onClick={onBold} title="Жирний (Ctrl+B)"
        >
          <b>B</b>
        </button>
        <button
          className={`${styles.btn} ${activeFormats.italic ? styles.active : ""}`}
          onClick={onItalic} title="Курсив (Ctrl+I)"
        >
          <i>I</i>
        </button>
        <button
          className={`${styles.btn} ${activeFormats.underline ? styles.active : ""}`}
          onClick={onUnderline} title="Підкреслення (Ctrl+U)"
        >
          <u>U</u>
        </button>
      </div>

      <div className={styles.sep} />

      {/* Section tags */}
      <div className={styles.group}>
        <button className={`${styles.tagBtn} ${styles.aroll}`} onClick={onAddARoll}>
          A-Roll
        </button>
        <button className={`${styles.tagBtn} ${styles.broll}`} onClick={onAddBRoll}>
          B-Roll
        </button>
        <button className={`${styles.tagBtn} ${styles.motion}`} onClick={onAddMotion}>
          Motion
        </button>
      </div>
    </div>
  );
}

function UndoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 5h5a4 4 0 1 1 0 8H5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 5l3-3M2 5l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function RedoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M12 5H7a4 4 0 1 0 0 8h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 5l-3-3M12 5l-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
