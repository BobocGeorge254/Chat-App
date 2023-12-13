import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";

function OffcanvasExample() {
  const expand = false;
  const params = useParams();
  //const userId = params.userId;
  const { userId, idToken } = params;
  useEffect(() => {
    console.log(userId);
  });
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
              <Nav.Link
                as={Link}
                to={`/profile/${idToken}/${userId}/${userId}`}
              >
                Profile
              </Nav.Link>
              <Nav.Link as={Link} to={`/userlist/${idToken}/${userId}`}>
                Search people
              </Nav.Link>
              <Nav.Link as={Link} to="/signin">
                Log Out
              </Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default OffcanvasExample;
