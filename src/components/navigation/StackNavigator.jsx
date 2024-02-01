import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  getFirestore,
} from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useState, useEffect } from "react";

function OffcanvasExample() {
  const [userId, setUserId] = useState("");
  const expand = false;
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const currentUserEmail = auth.currentUser.email;
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(
          query(usersRef, where("email", "==", currentUserEmail))
        );

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          setUserId(userDoc.id);
        } else {
          console.error("User document not found for email: " + currentUserEmail);
        }
      } catch (error) {
        console.error("Error fetching userId:", error);
      }
    };

    if (auth.currentUser) {
      fetchUserId();
    }
  }, []);
  
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
                to= {`/profile/${userId}`}
                state={{receiverEmail : auth.currentUser.email}}
              >
                Profile
              </Nav.Link>
              <Nav.Link as={Link} to={`/userlist/`}>
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
