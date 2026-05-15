import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>Trackland</Link>
      <div className={styles.links}>
        <Link to="/preferences" className={styles.link}>Preferências</Link>
        <Link to="/favorites" className={styles.link}>Favoritos</Link>
        <Link to="/history" className={styles.link}>Histórico</Link>
        <span className={styles.user}>{user?.email}</span>
        <button onClick={handleLogout} className={styles.logoutBtn}>Sair</button>
      </div>
    </nav>
  )
}