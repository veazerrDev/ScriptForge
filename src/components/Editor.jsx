import styles from "./Editor.module.css";

export default function Editor({ editorRef, onSelectionChange, onChange }) {
  return (
    <div className={styles.editorWrap}>
      <div
        ref={editorRef}
        className={styles.editor}
        contentEditable
        suppressContentEditableWarning
        onInput={onChange}
        onMouseUp={onSelectionChange}
        onKeyUp={onSelectionChange}
        data-placeholder="Почніть писати сценарій... Виділіть текст і натисніть A-Roll, B-Roll або Motion для структурування."
      />
    </div>
  );
}
