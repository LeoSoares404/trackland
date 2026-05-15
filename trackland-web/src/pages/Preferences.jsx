import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const CATEGORIES = [
  { id: 'technology', label: 'Tecnologia' },
  { id: 'sport', label: 'Esportes' },
  { id: 'science', label: 'Ciência' },
  { id: 'business', label: 'Negócios' },
  { id: 'health', label: 'Saúde' },
  { id: 'environment', label: 'Meio Ambiente' },
  { id: 'culture', label: 'Cultura' },
  { id: 'world', label: 'Mundo' },
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
  }

  const handleSave = async () => {
    setLoading(true)
    await api.post('/Preferences', selected)
    setSaved(true)
    setLoading(false)
    setTimeout(() => navigate('/'), 1000)
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Seus interesses</h2>
        <p style={styles.subtitle}>Selecione as categorias que quer acompanhar</p>
        <div style={styles.grid}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => toggle(cat.id)}
              style={{
                ...styles.catBtn,
                background: selected.includes(cat.id) ? '#2563eb' : '#f1f5f9',
                color: selected.includes(cat.id) ? '#fff' : '#1a1a1a',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
        {saved && <p style={styles.success}>Preferências salvas! Redirecionando...</p>}
        <button style={styles.button} onClick={handleSave} disabled={loading || selected.length === 0}>
          {loading ? 'Salvando...' : 'Salvar preferências'}
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' },
  card: { background: '#fff', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '500px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' },
  title: { margin: '0 0 4px', fontSize: '24px', color: '#1a1a1a' },
  subtitle: { margin: '0 0 24px', color: '#666' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' },
  catBtn: { padding: '12px', borderRadius: '8px', border: 'none', fontSize: '15px', cursor: 'pointer', transition: 'all 0.2s' },
  button: { width: '100%', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' },
  success: { color: 'green', marginBottom: '12px', textAlign: 'center' }
}