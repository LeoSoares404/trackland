import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'
import styles from './History.module.css'

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
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Histórico de leitura</h2>
            <p className={styles.subtitle}>{history.length} notícias lidas</p>
          </div>
          <Link to="/" className={styles.backLink}>← Voltar ao feed</Link>
        </div>

        {loading && <p className={styles.info}>Carregando...</p>}

        {!loading && history.length === 0 && (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>Nenhuma leitura ainda</p>
            <p className={styles.emptyDesc}>As notícias que você ler aparecerão aqui.</p>
            <Link to="/" className={styles.goFeed}>Ir para o feed</Link>
          </div>
        )}

        <div className={styles.list}>
          {history.map((item, index) => (
            <div key={item.id} className={styles.card}>
              <span className={styles.index}>{index + 1}</span>
              <div className={styles.content}>
                <a href={item.url} target="_blank" rel="noreferrer" className={styles.articleTitle}>
                  {item.title}
                </a>
                <p className={styles.date}>
                  Lido em {new Date(item.readAt).toLocaleDateString('pt-BR', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
              <a href={item.url} target="_blank" rel="noreferrer" className={styles.readAgain}>
                Ler →
              </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}