import styles from './NewsCard.module.css'

export default function NewsCard({ article, isFavorite, onFavorite, onRead, featured }) {
  return (
    <div className={featured ? styles.cardFeatured : styles.card}>
      <div className={styles.header}>
        <span className={styles.source}>{article.source}</span>
        <span className={styles.section}>{article.section}</span>
      </div>

      <h3 className={featured ? styles.titleFeatured : styles.title}>
        {article.title}
      </h3>

      {article.description && (
        <p
          className={featured ? styles.descriptionFeatured : styles.description}
          dangerouslySetInnerHTML={{ __html: article.description }}
        />
      )}

      <div className={styles.footer}>
        <span className={styles.date}>
          {new Date(article.publishedAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          })}
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