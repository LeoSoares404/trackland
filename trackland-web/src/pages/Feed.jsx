import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function Feed() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [favorites, setFavorites] = useState([])
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const loadFeed = async (p) => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get(`/News/feed?page=${p}`)
      setArticles(res.data.articles)
      setTotalPages(res.data.totalPages)
      setPage(p)
    } catch {
      setError('Erro ao carregar notícias. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFeed(1)
    api.get('/Favorites').then(res => setFavorites(res.data.map(f => f.articleId)))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!search.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await api.get(`/News/search?q=${encodeURIComponent(search)}&page=1`)
      setArticles(res.data.articles)
      setTotalPages(res.data.totalPages)
      setPage(1)
    } catch {
      setError('Erro ao buscar notícias.')
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = async (article) => {
    if (favorites.includes(article.id)) {
      await api.delete(`/Favorites/${encodeURIComponent(article.id)}`)
      setFavorites(prev => prev.filter(id => id !== article.id))
    } else {
      await api.post('/Favorites', {
        articleId: article.id,
        title: article.title,
        url: article.url,
        source: article.source
      })
      setFavorites(prev => [...prev, article.id])
    }
  }

  const handleRead = async (article) => {
    await api.post('/History', {
      articleId: article.id,
      title: article.title,
      url: article.url
    })
    window.open(article.url, '_blank')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h1 style={styles.logo}>Trackland</h1>
        <div style={styles.navLinks}>
          <Link to="/preferences" style={styles.navLink}>Preferências</Link>
          <Link to="/favorites" style={styles.navLink}>Favoritos</Link>
          <Link to="/history" style={styles.navLink}>Histórico</Link>
          <span style={styles.navUser}>{user?.email}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Sair</button>
        </div>
      </div>

      <div style={styles.searchBar}>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            style={styles.searchInput}
            type="text"
            placeholder="Buscar notícias..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit" style={styles.searchBtn}>Buscar</button>
          <button type="button" onClick={() => { setSearch(''); loadFeed(1) }} style={styles.clearBtn}>
            Limpar
          </button>
        </form>
      </div>

      {loading && <p style={styles.info}>Carregando notícias...</p>}
      {error && <p style={styles.error}>{error}</p>}
      {!loading && articles.length === 0 && (
        <p style={styles.info}>Nenhuma notícia encontrada. Tente outros termos ou ajuste suas preferências.</p>
      )}

      <div style={styles.grid}>
        {articles.map(article => (
          <div key={article.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.source}>{article.source}</span>
              <span style={styles.section}>{article.section}</span>
            </div>
            <p style={styles.articleTitle}>{article.title}</p>
            {article.description && (
              <p style={styles.description}
                dangerouslySetInnerHTML={{ __html: article.description }}
              />
            )}
            <p style={styles.date}>
              {new Date(article.publishedAt).toLocaleDateString('pt-BR')}
            </p>
            <div style={styles.cardActions}>
              <button onClick={() => handleRead(article)} style={styles.readBtn}>
                Ler notícia
              </button>
              <button onClick={() => toggleFavorite(article)} style={{
                ...styles.favBtn,
                background: favorites.includes(article.id) ? '#fef9c3' : '#f1f5f9',
                color: favorites.includes(article.id) ? '#ca8a04' : '#666'
              }}>
                {favorites.includes(article.id) ? '★ Salvo' : '☆ Salvar'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {!loading && totalPages > 1 && (
        <div style={styles.pagination}>
          <button onClick={() => loadFeed(page - 1)} disabled={page === 1} style={styles.pageBtn}>
            ← Anterior
          </button>
          <span style={styles.pageInfo}>Página {page} de {totalPages}</span>
          <button onClick={() => loadFeed(page + 1)} disabled={page === totalPages} style={styles.pageBtn}>
            Próxima →
          </button>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { maxWidth: '1100px', margin: '0 auto', padding: '1rem' },
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb' },
  logo: { margin: 0, fontSize: '24px', color: '#2563eb' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '16px' },
  navLink: { color: '#2563eb', textDecoration: 'none', fontSize: '15px' },
  navUser: { color: '#666', fontSize: '14px' },
  logoutBtn: { padding: '6px 14px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  searchBar: { marginBottom: '1.5rem' },
  searchForm: { display: 'flex', gap: '8px' },
  searchInput: { flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px' },
  searchBtn: { padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  clearBtn: { padding: '10px 16px', background: '#f1f5f9', color: '#666', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  info: { textAlign: 'center', color: '#666', marginTop: '3rem' },
  error: { textAlign: 'center', color: '#dc2626', marginTop: '1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' },
  card: { background: '#fff', padding: '1.25rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  source: { fontSize: '12px', color: '#2563eb', fontWeight: 600 },
  section: { fontSize: '12px', color: '#666', background: '#f1f5f9', padding: '2px 8px', borderRadius: '10px' },
  articleTitle: { margin: '0 0 8px', fontWeight: 600, color: '#1a1a1a', lineHeight: 1.4, flex: 1 },
  description: { margin: '0 0 8px', fontSize: '13px', color: '#555', lineHeight: 1.5 },
  date: { margin: '0 0 12px', fontSize: '12px', color: '#999' },
  cardActions: { display: 'flex', gap: '8px', marginTop: 'auto' },
  readBtn: { flex: 1, padding: '8px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  favBtn: { padding: '8px 12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '2rem', paddingBottom: '2rem' },
  pageBtn: { padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  pageInfo: { color: '#666', fontSize: '14px' }
}