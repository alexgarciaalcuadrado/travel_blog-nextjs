import { Fragment, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../auth/authUserProvider";
import Navbar from "../../components/navbar/navbar";

const Profile = () => {
    const { authUser, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !authUser)
        router.push('/login')
    }, [authUser, loading])

    return (
        <Fragment>
        <Navbar />
        <h1>This is the profile page</h1>
        </Fragment>
    )
}

export default Profile