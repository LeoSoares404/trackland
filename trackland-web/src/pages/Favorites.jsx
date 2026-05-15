import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

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
    await api.delete(`/Favorites/${encodeURIComponent(articleId)}`)
    setFavorites(prev => prev.filter(f => f.articleId !== articleId))
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Favoritos</h2>
        <Link to="/" style={styles.back}>← Voltar ao feed</Link>
      </div>

      {loading && <p style={styles.info}>Carregando...</p>}
      {!loading && favorites.length === 0 && (
        <p style={styles.info}>Você ainda não salvou nenhuma notícia.</p>
      )}

      <div style={styles.grid}>
        {favorites.map(fav => (
          <div key={fav.id} style={styles.card}>
            <p style={styles.source}>{fav.source}</p>
            <a href={fav.url} target="_blank" rel="noreferrer" style={styles.articleTitle}>
              {fav.title}
            </a>
            <button onClick={() => removeFavorite(fav.articleId)} style={styles.removeBtn}>
              Remover
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth: '900px', margin: '0 auto', padding: '2rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
  title: { margin: 0, fontSize: '24px', color: '#1a1a1a' },
  back: { color: '#2563eb', textDecoration: 'none' },
  info: { textAlign: 'center', color: '#666', marginTop: '2rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' },
  card: { background: '#fff', padding: '1.25rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  source: { margin: '0 0 6px', fontSize: '12px', color: '#2563eb', fontWeight: 600 },
  articleTitle: { display: 'block', marginBottom: '12px', color: '#1a1a1a', textDecoration: 'none', fontWeight: 500, lineHeight: 1.4 },
  removeBtn: { padding: '6px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }
}