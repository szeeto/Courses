import { useState, useRef, useEffect } from 'react';
import './DropdownMenu.css';

const DropdownMenu = ({ onLogout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  return (
    <div className="dropdown-root" ref={ref}>
      <button className="dropdown-trigger" onClick={() => setOpen((v) => !v)}>
        Options <span className="dropdown-arrow">▼</span>
      </button>
      {open && (
        <div className="dropdown-menu-box">
          <button className="dropdown-menu-item" tabIndex={0}>Account settings</button>
          <button className="dropdown-menu-item" tabIndex={0}>Support</button>
          <button className="dropdown-menu-item" tabIndex={0}>License</button>
          <button className="dropdown-menu-item logout" tabIndex={0} onClick={onLogout}>Sign out</button>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
