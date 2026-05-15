import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'
import styles from './Favorites.module.css'

export default function Favorites() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/Favorites').then(res => {
      setFavorites(res.data)
      setLoading(false)
    })
  }, [])

  const removeFavorite = async (articleId) => {
    await api.delete(`/Favorites?articleId=${encodeURIComponent(articleId)}`)
    setFavorites(prev => prev.filter(f => f.articleId !== articleId))
}

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Favoritos</h2>
            <p className={styles.subtitle}>{favorites.length} notícias salvas</p>
          </div>
          <Link to="/" className={styles.backLink}>← Voltar ao feed</Link>
        </div>

        {loading && <p className={styles.info}>Carregando...</p>}

        {!loading && favorites.length === 0 && (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>Nenhum favorito ainda</p>
            <p className={styles.emptyDesc}>Salve notícias do feed para acessá-las aqui.</p>
            <Link to="/" className={styles.goFeed}>Ir para o feed</Link>
          </div>
        )}

        <div className={styles.grid}>
          {favorites.map(fav => (
            <div key={fav.id} className={styles.card}>
              <p className={styles.source}>{fav.source}</p>
              <a href={fav.url} target="_blank" rel="noreferrer" className={styles.articleTitle}>
                {fav.title}
              </a>
              <div className={styles.cardFooter}>
                <span className={styles.date}>
                  {new Date(fav.savedAt).toLocaleDateString('pt-BR')}
                </span>
                <button onClick={() => removeFavorite(fav.articleId)} className={styles.removeBtn}>
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}