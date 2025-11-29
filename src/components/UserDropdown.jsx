
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteCookie } from '../utils/cookieUtils';
import './UserDropdown.css';

const UserDropdown = ({ userName }) => {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click or ESC
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const handleEsc = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEsc);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEsc);
      };
    }
  }, [open]);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      deleteCookie('authToken');
      deleteCookie('userInfo');
      deleteCookie('userEmail');
      setOpen(false);
      setLoggingOut(false);
      setShowLogoutModal(false);
      navigate('/');
      setTimeout(() => { window.location.reload(); }, 100);
    }, 900);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleAccountSettings = () => {
    setOpen(false);
    navigate('/settings');
  };

  // Ambil email dari localStorage jika ada
  let userPic = '', userObj = {}, userEmail = '';
  try {
    userObj = JSON.parse(localStorage.getItem('user')) || {};
    userEmail = userObj?.email || '';
    userPic = userObj?.picture || '';
  } catch {}

  const isAdmin = userObj?.role === 'admin' || userEmail === 'admin@ngoding.id' || userEmail === 'patrasawali93@gmail.com';

  return (
    <div className="user-dropdown" ref={ref}>
      <button
        className="dropdown-trigger minimal"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="User menu"
        onClick={() => setOpen((v) => !v)}
        tabIndex={0}
      >
        <span className="user-avatar-minimal">
          {userPic ? (
            <img src={userPic} alt="avatar" />
          ) : (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#B2E3F6"/><path d="M16 17.5c2.485 0 4.5-2.015 4.5-4.5s-2.015-4.5-4.5-4.5-4.5 2.015-4.5 4.5 2.015 4.5 4.5 4.5Zm0 2c-3.038 0-9 1.523-9 4.5V26h18v-2c0-2.977-5.962-4.5-9-4.5Z" fill="#2B3A4A"/></svg>
          )}
        </span>
        <span className="user-name-minimal">{userName}</span>
        <span className="dropdown-arrow-minimal">▼</span>
      </button>
      {open && (
        <div className="dropdown-menu-minimal" role="menu">
          <button className="dropdown-menu-item-minimal" tabIndex={0} onClick={() => { setOpen(false); navigate(isAdmin ? '/adminPanel/profile' : '/profile'); }} role="menuitem">
            <span className="icon-minimal" aria-hidden="true">
              <svg width="20" height="20" fill="none"><circle cx="10" cy="7" r="4" stroke="#2B3A4A" strokeWidth="1.5"/><path d="M2 17c0-2.761 3.582-5 8-5s8 2.239 8 5" stroke="#2B3A4A" strokeWidth="1.5"/></svg>
            </span>
            <span>View profile</span>
          </button>
          {isAdmin && (
            <button className="dropdown-menu-item-minimal" tabIndex={0} onClick={() => { setOpen(false); navigate('/admin'); }} role="menuitem">
              <span className="icon-minimal" aria-hidden="true">
                <svg width="20" height="20" fill="none"><rect x="3" y="3" width="14" height="14" rx="2" stroke="#2B3A4A" strokeWidth="1.5"/><path d="M3 8h14M8 3v14" stroke="#2B3A4A" strokeWidth="1.5"/></svg>
              </span>
              <span>Dashboard</span>
            </button>
          )}
          <button className="dropdown-menu-item-minimal logout" tabIndex={0} onClick={handleLogout} role="menuitem" disabled={loggingOut} style={loggingOut ? {opacity:0.6, pointerEvents:'none'} : {}}>
            <span className="icon-minimal" aria-hidden="true">
              <svg width="20" height="20" fill="none"><circle cx="10" cy="10" r="9" stroke="#2B3A4A" strokeWidth="1.5"/><path d="M10 6v4l3 3" stroke="#2B3A4A" strokeWidth="1.5"/></svg>
            </span>
            <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
          {showLogoutModal && (
            <div className="logout-modal-overlay">
              <div className="logout-modal">
                <div className="logout-modal-title">Konfirmasi Logout</div>
                <div className="logout-modal-msg">Apakah Anda yakin ingin logout dari akun ini?</div>
                <div className="logout-modal-actions">
                  <button className="logout-modal-btn logout-modal-yes" onClick={confirmLogout} disabled={loggingOut}>{loggingOut ? 'Logging out...' : 'Ya, Logout'}</button>
                  <button className="logout-modal-btn logout-modal-cancel" onClick={cancelLogout} disabled={loggingOut}>Batal</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
