import { Navbar, Container, Nav } from 'react-bootstrap'
import { NavLink, useNavigate } from 'react-router-dom'
import { navLinks } from "../data/index.js"
import { useState, useEffect } from 'react'
import { useSupabaseAuth } from '../hooks/useSupabaseAuth'

const NavbarComponents = () => {
  const [changeColor, setChangeColor] = useState(false)
  const { user, isLoggedIn, signOut } = useSupabaseAuth()
  const navigate = useNavigate()

  const changeBackgroundColor = () => {
    if (window.scrollY > 10) {
      setChangeColor(true)
    } else {
      setChangeColor(false)
    }
  }

  useEffect(() => {
    changeBackgroundColor()
    window.addEventListener('scroll', changeBackgroundColor)

    return () => window.removeEventListener('scroll', changeBackgroundColor)
  }, [])

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <Navbar expand="lg" fixed="top" className={changeColor ? 'color-active' : ''}>
      <Container>
        <Navbar.Brand className='fs-3 fw-bold' href="#home">Ngoding.</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto text-center">
            {navLinks.map((item) => {
              return (
                <div key={item.id} className='nav-link'>
                  <NavLink to={item.path} className={({ isActive, isPending }) =>
                    isPending ? "pending" : isActive ? "active" : ""
                  }>{item.text}</NavLink>
                </div>
              )
            })}
          </Nav>
          <div className='text-center d-flex gap-2 justify-content-center'>
            {isLoggedIn ? (
              <div className="d-flex align-items-center gap-2">
                <span className="text-dark">Halo, {user?.name || 'User'}</span>
                <button
                  className="btn btn-outline-dark rounded-1"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <NavLink to="/login" className="btn btn-outline-danger rounded-1">
                Login
              </NavLink>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavbarComponents
