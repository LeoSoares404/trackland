import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'
import styles from './Preferences.module.css'

const CATEGORIES = [
  { id: 'technology', label: 'Tecnologia', emoji: '💻' },
  { id: 'sport', label: 'Esportes', emoji: '⚽' },
  { id: 'science', label: 'Ciência', emoji: '🔬' },
  { id: 'business', label: 'Negócios', emoji: '💼' },
  { id: 'health', label: 'Saúde', emoji: '❤️' },
  { id: 'environment', label: 'Meio Ambiente', emoji: '🌱' },
  { id: 'culture', label: 'Cultura', emoji: '🎭' },
  { id: 'world', label: 'Mundo', emoji: '🌍' },
]

export default function Preferences() {
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/Preferences').then(res => setSelected(res.data))
  }, [])

  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
    setSaved(false)
  }

  const handleSave = async () => {
    setLoading(true)
    await api.post('/Preferences', selected)
    setSaved(true)
    setLoading(false)
    setTimeout(() => navigate('/'), 1200)
  }

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.header}>
          <h2 className={styles.title}>Seus interesses</h2>
          <p className={styles.subtitle}>Selecione as categorias que quer acompanhar no seu feed</p>
        </div>

        <div className={styles.grid}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => toggle(cat.id)}
              className={`${styles.catBtn} ${selected.includes(cat.id) ? styles.catActive : ''}`}
            >
              <span className={styles.emoji}>{cat.emoji}</span>
              <span className={styles.catLabel}>{cat.label}</span>
              {selected.includes(cat.id) && <span className={styles.check}>✓</span>}
            </button>
          ))}
        </div>

        {saved && <p className={styles.success}>✓ Preferências salvas! Redirecionando...</p>}

        <button
          className={styles.saveBtn}
          onClick={handleSave}
          disabled={loading || selected.length === 0}
        >
          {loading ? 'Salvando...' : `Salvar ${selected.length} categorias`}
        </button>
      </main>
    </div>
  )
}