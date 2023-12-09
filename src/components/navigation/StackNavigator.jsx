import { Container, Form, Button, Nav, Navbar, NavLink, Offcanvas } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

function OffcanvasExample() {
  const expand = false; 
  const params = useParams();
  const userId = params.userId;
  return (
    <Navbar expand={expand} className="bg-body-tertiary mb-3">
      <Container fluid>
        <Navbar.Brand href="#">Chat App </Navbar.Brand>
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-${expand}`}
          aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
              Menu
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
           <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link as={Link} to={`/profile/${userId}`}>Profile</Nav.Link>
                <Nav.Link as={Link} to={`/userlist/${userId}`}>Search people</Nav.Link>
                <Nav.Link as={Link} to="/signin">Log Out</Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default OffcanvasExample;
