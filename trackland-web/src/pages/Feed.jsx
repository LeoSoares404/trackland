import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import NewsCard from '../components/NewsCard'
import SkeletonCard from '../components/SkeletonCard'
import api from '../services/api'
import styles from './Feed.module.css'

const CATEGORIES = [
  { id: 'all', label: 'Todos' },
  { id: 'technology', label: 'Tecnologia' },
  { id: 'sport', label: 'Esportes' },
  { id: 'science', label: 'Ciência' },
  { id: 'business', label: 'Negócios' },
  { id: 'health', label: 'Saúde' },
  { id: 'environment', label: 'Meio Ambiente' },
  { id: 'culture', label: 'Cultura' },
]

export default function Feed() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [favorites, setFavorites] = useState([])

  const loadFeed = async (p = 1) => {
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
      setActiveCategory('all')
    } catch {
      setError('Erro ao buscar notícias.')
    } finally {
      setLoading(false)
    }
  }

  const handleCategory = async (categoryId) => {
    setActiveCategory(categoryId)
    setSearch('')
    setLoading(true)
    setError('')
    try {
      if (categoryId === 'all') {
        const res = await api.get('/News/feed?page=1')
        setArticles(res.data.articles)
        setTotalPages(res.data.totalPages)
      } else {
        const res = await api.get(`/News/search?q=${categoryId}&page=1`)
        setArticles(res.data.articles)
        setTotalPages(res.data.totalPages)
      }
      setPage(1)
    } catch {
      setError('Erro ao filtrar notícias.')
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = async (article) => {
    if (favorites.includes(article.id)) {
      await api.delete(`/Favorites?articleId=${encodeURIComponent(article.id)}`)
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

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        <div className={styles.searchBar}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Buscar notícias..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit" className={styles.searchBtn}>Buscar</button>
            <button
              type="button"
              className={styles.clearBtn}
              onClick={() => { setSearch(''); loadFeed(1); setActiveCategory('all') }}
            >
              Limpar
            </button>
          </form>
        </div>

        <div className={styles.categories}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`${styles.catBtn} ${activeCategory === cat.id ? styles.catActive : ''}`}
              onClick={() => handleCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {error && (
          <div className={styles.errorBox}>
            <p>{error}</p>
            <button onClick={() => loadFeed(1)} className={styles.retryBtn}>Tentar novamente</button>
          </div>
        )}

        {!error && !loading && articles.length === 0 && (
          <div className={styles.emptyBox}>
            <p>Nenhuma notícia encontrada.</p>
            <button onClick={() => loadFeed(1)} className={styles.retryBtn}>Voltar ao feed</button>
          </div>
        )}

        <div className={styles.grid}>
          {loading
            ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
            : articles.map(article => (
              <NewsCard
                key={article.id}
                article={article}
                isFavorite={favorites.includes(article.id)}
                onFavorite={toggleFavorite}
                onRead={handleRead}
              />
            ))
          }
        </div>

        {!loading && totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => loadFeed(page - 1)}
              disabled={page === 1}
              className={styles.pageBtn}
            >
              ← Anterior
            </button>
            <span className={styles.pageInfo}>Página {page} de {totalPages}</span>
            <button
              onClick={() => loadFeed(page + 1)}
              disabled={page === totalPages}
              className={styles.pageBtn}
            >
              Próxima →
            </button>
          </div>
        )}
      </main>
    </div>
  )
}