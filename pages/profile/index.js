import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { onSnapshot, query, where  } from 'firebase/firestore';
import { useAuth } from "../../auth/authUserProvider";
import { usersColRef } from "../../firebase";
import Navbar from "../../components/navbar/navbar";

const Profile = () => {
    const router = useRouter();
    const { authUser, loading } = useAuth();
    const [userId, setUserId] = useState("");
    const [profileCreated, setProfileCreated] = useState(false);
    const [userProfile, setUserProfile] = useState({
            "userId" : "",
            "username" : "",
            "userDescription" : "",
            "profilePicture" : ""
    })


    useEffect(() => {
      let isMounted = true; 
      if(isMounted){
      if (!loading && !authUser) router.push('/login');

      if(typeof window !== "undefined") {
        if(localStorage.getItem("user")){
            setUserId(localStorage.getItem("user"))
        } 
        else {
            console.log("User was not found")
            }
        }

        const q = query(usersColRef, where("userId", "==", userId));
        onSnapshot(q, (snapshot) => { 
            const user = snapshot.docs.map((doc) => {return {...doc.data(), docId : doc.id }});
            if (user.length){
                setProfileCreated(true);
                setUserProfile(user[0]);
            }
             
        });
        }
        
        
        return () => { isMounted = false };

    }, [userId, authUser, profileCreated]);

    const renderEdit = () => {
        router.push({
            pathname : "/profile/editProfile"    
            })
    }

    const renderCreate = () => {
        router.push("/profile/editProfile")
    }


    const ProfileRender = () => {
        if(profileCreated === false){
            return (
                <div>
                    <h1>This is the profile page</h1>
                    <h3>Create your profile</h3>
                    <button onClick={renderCreate}>Create</button>
                </div>
            )
        } else {
            return(
                <div>
                    <h1>This is the profile page</h1>
                    <h3>User picture</h3>
                    <h3>{userProfile.username}</h3>
                    <h6>{userProfile.userDescription}</h6>
                    <button onClick={renderEdit}>Edit profile</button>
                </div>
            )
            
        }
    }
    

    return (
        <Fragment>
        <Navbar />
        <ProfileRender />
        </Fragment>
    )
}

export default Profile