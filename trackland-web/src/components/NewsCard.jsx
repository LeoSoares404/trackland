import styles from './NewsCard.module.css'

export default function NewsCard({ article, isFavorite, onFavorite, onRead }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.source}>{article.source}</span>
        <span className={styles.section}>{article.section}</span>
      </div>

      <h3 className={styles.title}>{article.title}</h3>

      {article.description && (
        <p
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: article.description }}
        />
      )}

      <div className={styles.footer}>
        <span className={styles.date}>
          {new Date(article.publishedAt).toLocaleDateString('pt-BR')}
        </span>
        <div className={styles.actions}>
          <button
            className={`${styles.favBtn} ${isFavorite ? styles.favActive : ''}`}
            onClick={() => onFavorite(article)}
          >
            {isFavorite ? '★ Salvo' : '☆ Salvar'}
          </button>
          <button className={styles.readBtn} onClick={() => onRead(article)}>
            Ler →
          </button>
        </div>
      </div>
    </div>
  )
}