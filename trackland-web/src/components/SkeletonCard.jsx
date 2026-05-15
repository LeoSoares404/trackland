import styles from './SkeletonCard.module.css'

export default function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={`${styles.bone} ${styles.source}`} />
        <div className={`${styles.bone} ${styles.section}`} />
      </div>
      <div className={`${styles.bone} ${styles.title}`} />
      <div className={`${styles.bone} ${styles.titleShort}`} />
      <div className={`${styles.bone} ${styles.desc}`} />
      <div className={`${styles.bone} ${styles.desc}`} />
      <div className={`${styles.bone} ${styles.descShort}`} />
      <div className={styles.footer}>
        <div className={`${styles.bone} ${styles.date}`} />
        <div className={`${styles.bone} ${styles.btn}`} />
      </div>
    </div>
  )
}