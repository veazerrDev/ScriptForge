import styles from "./Sidebar.module.css";

const TYPE_LABELS = { aroll: "A-Roll", broll: "B-Roll", motion: "Motion" };
const TYPE_CLASS  = { aroll: styles.aroll, broll: styles.broll, motion: styles.motion };

export default function Sidebar({ sections, onJump }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <span>Структура</span>
        <span className={styles.count}>{sections.length}</span>
      </div>

      {sections.length === 0 ? (
        <div className={styles.empty}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="4" y="6" width="24" height="3" rx="1.5" fill="currentColor" opacity=".2"/>
            <rect x="4" y="13" width="18" height="3" rx="1.5" fill="currentColor" opacity=".2"/>
            <rect x="4" y="20" width="21" height="3" rx="1.5" fill="currentColor" opacity=".2"/>
          </svg>
          <p>Ще немає секцій.<br/>Виділіть текст і натисніть A-Roll, B-Roll або Motion.</p>
        </div>
      ) : (
        <ul className={styles.list}>
          {sections.map((sec, i) => (
            <li key={i} className={styles.item} onClick={() => onJump(sec.id)}>
              <span className={`${styles.badge} ${TYPE_CLASS[sec.type]}`}>
                {TYPE_LABELS[sec.type]}
              </span>
              <span className={styles.label}>{sec.preview || "—"}</span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
