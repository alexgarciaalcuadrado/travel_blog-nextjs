import { useEffect, useState } from "react";
import {useRouter} from "next/router";
import { useAuth } from "../../auth/authUserProvider";
import { signUserOut } from "../../firebase";
import Navbar from 'react-bootstrap/Navbar';
import Nav from "react-bootstrap/Nav";
import Container from 'react-bootstrap/Container';

import styles from "../navbar/navbar.module.scss";

const ResponsiveNavbar = () => {
    const router = useRouter();

    const { authUser, loading } = useAuth();
    const [ isLogged, setIsLogged ] = useState(false);
    const [userId, setUserId] = useState("");

    useEffect(() => {
      if (!loading && !authUser){
        setIsLogged(false);
      } else {
        setIsLogged(true);
      }

      if(typeof window !== "undefined") {
        if(localStorage.getItem("user")){
            setUserId(localStorage.getItem("user"))
        }
    }

    }, [authUser, loading, userId])

    const signOut = () => {
        signUserOut(); 
        localStorage.removeItem("user");
        router.push("/");
    }


    const navbar = () => {
        if(isLogged){
            return(
              <Navbar  className={`navbar navbar-expand-lg navbar-light bg-light ${styles.navbarCustom}`} collapseOnSelect expand="lg">
                <Container>
                <Navbar.Brand className={`navbar-brand ${styles.navbarCustom__brand}`} href="/">TravelPin</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                  <Nav className="navbar-nav ms-auto mb-2 mb-lg-0">
                    <Nav.Link className={styles.navbarCustom__anchor} href="/">
                    <span className="nav-link active">
                    Go to home page
                    </span>
                    </Nav.Link>
                    <Nav.Link className={styles.navbarCustom__anchor} href="/blogs">
                    <span className="nav-link active">
                    Read all the blogs
                    </span>
                    </Nav.Link>
                    <Nav.Link className={styles.navbarCustom__anchor} href="/createBlog">
                    <span className="nav-link active">
                    Post your own story
                    </span>
                    </Nav.Link>
                    <Nav.Link className={styles.navbarCustom__anchor} href={`/profile/${userId}`}>
                    <span className="nav-link active">
                    <b>Profile</b>
                    </span>
                    </Nav.Link>
                  </Nav>
                  <form className="d-flex">
                    <button className="btn btn-outline-danger" onClick={ signOut }>Log out</button>
                  </form>
                </Navbar.Collapse>
                </Container>
              </Navbar>
            )
        } else {
            return (
              <Navbar  className={`navbar navbar-expand-lg navbar-light bg-light ${styles.navbarCustom}`} collapseOnSelect expand="lg">
                <Container>
                <Navbar.Brand className={`navbar-brand ${styles.navbarCustom__brand}`} href="/">TravelPin</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                  <Nav className="navbar-nav ms-auto mb-2 mb-lg-0">
                    <Nav.Link className={styles.navbarCustom__anchor} href="/">
                    <span className="nav-link active">
                    Go to home page
                    </span>
                    </Nav.Link>
                    <Nav.Link className={styles.navbarCustom__anchor} href="/blogs">
                    <span className="nav-link active">
                    Read all the blogs
                    </span>
                    </Nav.Link>
                    <Nav.Link className={styles.navbarCustom__anchor} href="/login">
                    <span className="nav-link active">
                    Log in to public blogs
                    </span>
                    </Nav.Link>
                  </Nav>
                </Navbar.Collapse>
                </Container>
              </Navbar>
            )
        }
    }

    return navbar();
}



export default ResponsiveNavbar;