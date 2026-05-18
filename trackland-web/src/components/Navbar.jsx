import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>📰</span>
          <span className={styles.logoText}>
            <span className={styles.logoBold}>TrackLand</span>
            <span className={styles.logoThin}>Journal</span>
          </span>
        </Link>
      </div>
      <div className={styles.links}>
        <Link to="/preferences" className={styles.link}>Preferências</Link>
        <Link to="/favorites" className={styles.link}>Favoritos</Link>
        <Link to="/history" className={styles.link}>Histórico</Link>
        <span className={styles.user}>{user?.email}</span>
        <button onClick={() => setDark(!dark)} className={styles.themeBtn}>
          {dark ? '☀️' : '🌙'}
        </button>
        <button onClick={handleLogout} className={styles.logoutBtn}>Sair</button>
      </div>
    </nav>
  )
}