import { Navbar, Container, Nav } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { navLinks } from "../data/index.js"
import { useState, useEffect, useMemo } from 'react'
import UserDropdown from './UserDropdown'

const NavbarComponents = () => {
  const [changeColor, setChangeColor] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  const ADMIN_EMAILS = useMemo(() => ['patrasawali93@gmail.com'], [])

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

    // Check if user is logged in
    const token = localStorage.getItem('authToken')
    const user = localStorage.getItem('user')
    if (token && user) {
      setIsLoggedIn(true)
      try {
        const userData = JSON.parse(user)
        setUserName(userData.name || 'User')
        // Check if user is admin
        if (ADMIN_EMAILS.includes(userData.email)) {
          setIsAdmin(true)
        }
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }

    return () => window.removeEventListener('scroll', changeBackgroundColor)
  }, [ADMIN_EMAILS])

  return (
    <Navbar expand="lg" className={changeColor ? 'color-active' : ''}>
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
          {/* <div className='text-center d-flex gap-2 justify-content-center'>
            {isLoggedIn ? (
              <UserDropdown userName={userName} isAdmin={isAdmin} />
            ) : (
             <NavLink to="/login" className="btn btn-outline-danger rounded-1">Login</NavLink>
            )}
          </div> */}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavbarComponents
