import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/History').then(res => {
      setHistory(res.data)
      setLoading(false)
    })
  }, [])

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Histórico de leitura</h2>
        <Link to="/" style={styles.back}>← Voltar ao feed</Link>
      </div>

      {loading && <p style={styles.info}>Carregando...</p>}
      {!loading && history.length === 0 && (
        <p style={styles.info}>Você ainda não leu nenhuma notícia.</p>
      )}

      <div style={styles.list}>
        {history.map(item => (
          <div key={item.id} style={styles.card}>
            <a href={item.url} target="_blank" rel="noreferrer" style={styles.articleTitle}>
              {item.title}
            </a>
            <p style={styles.date}>
              Lido em {new Date(item.readAt).toLocaleDateString('pt-BR', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
              })}
            </p>
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
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  card: { background: '#fff', padding: '1.25rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  articleTitle: { display: 'block', marginBottom: '6px', color: '#1a1a1a', textDecoration: 'none', fontWeight: 500, lineHeight: 1.4 },
  date: { margin: 0, fontSize: '13px', color: '#666' }
}