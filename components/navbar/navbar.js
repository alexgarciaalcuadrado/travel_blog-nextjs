import { useEffect, useState } from "react";
import Link from "next/link";
import {useRouter} from "next/router";
import { useAuth } from "../../auth/authUserProvider";
import { signUserOut } from "../../firebase";
import styles from "../navbar/navbar.module.scss";

const Navbar = () => {
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

    }, [authUser, loading])

    const signOut = () => {
        signUserOut(); 
        localStorage.removeItem("user");
        router.push("/");
    }


    const navbar = () => {
        if(isLogged){
            return(
                <nav className={`navbar navbar-expand-lg navbar-light bg-light ${styles.navbarCustom}`}>
                    <div className="container-fluid">
                      <a className={`navbar-brand ${styles.navbarCustom__brand}`} href="#">TravelPin</a>
                      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                      </button>
                      <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <span className="nav-link active">
                              <Link href="/"><a className={styles.navbarCustom__anchor}>Go to home page</a></Link>
                            </span>
                          </li>
                          <li className="nav-item">
                            <span className="nav-link active">
                              <Link href={`/profile/${userId}`}><a className={styles.navbarCustom__anchor}>Profile</a></Link>
                            </span>
                          </li>
                          <li className="nav-item">
                            <span className="nav-link active">
                              <Link href="/createBlog"><a className={styles.navbarCustom__anchor}>Post your own story</a></Link>
                            </span>
                          </li>
                        </ul>
                        <form className="d-flex">
                          <button className="btn btn-outline-danger" onClick={ signOut }>Log out</button>
                        </form>
                      </div>
                    </div>
                </nav>
                
            )
        } else {
            return (
                <nav className={`navbar navbar-expand-lg navbar-light bg-light ${styles.navbarCustom}`}>
                    <div className="container-fluid">
                      <a className={`navbar-brand ${styles.navbarCustom__brand}`} href="#">TravelPin</a>
                      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                      </button>
                      <div className="collapse navbar-collapse " id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                          <li className="nav-item">
                            <span className="nav-link active">
                              <Link href="/"><a className={styles.navbarCustom__anchor}>Go to home page</a></Link>
                            </span>
                          </li>
                          <li className="nav-item">
                          <span className="nav-link active">
                            <Link href="/login"><a className={styles.navbarCustom__anchor}>Log in to public blogs</a></Link>
                          </span> 
                          </li>
                        </ul>
                      </div>
                    </div>
                </nav>
                
            )
        }
    }

    return navbar();
}



export default Navbar;