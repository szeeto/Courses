import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { deleteCookie } from '../utils/cookieUtils'
import './UserDropdown.css'

const UserDropdown = ({ userName, isAdmin }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    // Only attach listener when dropdown is open
    if (isOpen) {
      // Use setTimeout to avoid catching the opening click
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
      }, 0)
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen])

  const handleLogout = () => {
    if (!window.confirm('Are you sure you want to logout?')) return

    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    deleteCookie('authToken')
    deleteCookie('userInfo')
    deleteCookie('userEmail')

    setIsOpen(false)
    navigate('/')
  }

  const handleMenuItemClick = () => {
    setIsOpen(false)
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="user-dropdown" ref={dropdownRef}>
      <button 
        className="dropdown-toggle"
        onClick={toggleDropdown}
        title="User Menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="user-icon">👤</span>
        <span className="user-name">{userName}</span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="dropdown-menu visible">
          {isAdmin && (
            <>
              <NavLink 
                to="/admin" 
                className="dropdown-item admin-item" 
                onClick={handleMenuItemClick}
              >
                <span className="item-icon">⚙️</span>
                <span className="item-text">Admin Dashboard</span>
                <span className="badge">Admin</span>
              </NavLink>
              <div className="dropdown-divider"></div>
            </>
          )}
          
          <NavLink 
            to="/settings" 
            className="dropdown-item" 
            onClick={handleMenuItemClick}
          >
            <span className="item-icon">⚙️</span>
            <span className="item-text">Settings</span>
          </NavLink>

          <div className="dropdown-divider"></div>

          <button 
            className="dropdown-item logout-item"
            onClick={handleLogout}
          >
            <span className="item-icon">🚪</span>
            <span className="item-text">Logout</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default UserDropdown
