import { Navbar, Container, Nav } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { navLinks } from "../data/index.js"
import { useState, useEffect} from 'react'

const NavbarComponents = () => {
  const [changeColor, setChangeColor] = useState(false);

  const changeBackgroundColor = () => {
    if (window.scrollY > 10) {
      setChangeColor(true);
    } else {
      setChangeColor(false);
    }
  }
  useEffect(() => {
    changeBackgroundColor();

    window.addEventListener('scroll', changeBackgroundColor);
  });
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
          <div className='text-center'>
            <button className="btn btn-outline-danger rounded-1"> <a href="#">Join With Us</a></button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );

}

export default NavbarComponents
