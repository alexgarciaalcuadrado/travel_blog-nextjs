import { useEffect, useState } from "react";
import Link from "next/link";
import {useRouter} from "next/router";
import { useAuth } from "../../auth/authUserProvider";
import { signUserOut } from "../../firebase";

const Navbar = () => {
    const router = useRouter();

    const { authUser, loading } = useAuth();
    const [ isLogged, setIsLogged ] = useState(false);

    useEffect(() => {
      if (!loading && !authUser){
        setIsLogged(false);
      } else {
        setIsLogged(true);
      }
    }, [authUser, loading])

    const signOut = () => {
        signUserOut();
        localStorage.removeItem("user");
        router.push("/login");
    }

    const navbar = () => {
        if(isLogged){
            return(
                <div>
                    <Link href="/">Go to home page</Link>
                    <Link href="/profile">Profile</Link>
                    <Link href="/createBlog">Post your own story</Link>
                    <button onClick={ signOut }>Log out</button>
                </div>
            )
        } else {
            return (
                <div>
                    <Link href="/">Go to home page</Link>
                    <Link href="/login">Log in to public blogs</Link>
                </div>
            )
        }
    }

    return navbar();
}

export default Navbar;