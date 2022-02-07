import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { onSnapshot, query, where  } from 'firebase/firestore';
import { useAuth } from "../../auth/authUserProvider";
import { usersColRef } from "../../firebase";
import defaultUserPhoto from "../../public/blank-user-photo.png";
import styles from "../profileRender/profileRender.module.scss";

const Profile = () => {
    const router = useRouter();
    const { authUser, loading } = useAuth();
    const [userId, setUserId] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [profileCreated, setProfileCreated] = useState(false);
    const [userProfile, setUserProfile] = useState({
            "userId" : "",
            "username" : "",
            "userDescription" : "",
            "profilePicture" : ""
    });


    useEffect(() => {
      let isMounted = true; 
      if(isMounted){
      if (!loading && !authUser) router.push('/');

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
                setIsLoading(false);
            }
             
        }); 
        }
        
        
        return () => { isMounted = false };

    }, [userId, authUser, profileCreated, authUser]);

    const renderEdit = () => {
        router.push("/profile/editProfile");
    }

    const ProfileRender = () => {
        if(profileCreated === false){
            if(isLoading === true){
                return (
                    <div className="page-background-setted-height">
                        <p>Loading...</p>
                    </div>
                    
                )
            } else {
                return (
                    <div className="page-background-setted-height">
                        <div className={styles.profile}>
                            <h3>Create your profile</h3>
                            <button onClick={renderEdit} className="btn btn-dark">Create</button>  
                        </div>
                        
                    </div>
                )
            }
            
        } else {
            if(isLoading === true){
                return (
                    <p>Loading</p>
                )
            } else {
                return(
                    <div className="page-background">
                        <div className={styles.profile}>
                            <div className={styles.profile__top}>
                                <img className="" src={userProfile.profilePicture =! "" && defaultUserPhoto.src}/>
                                <div className={styles.profile__top__name}>
                                    <div><h3>{userProfile.username}</h3></div>
                                </div> 
                            </div>
                            
                            <h4>About me...</h4>
                            <h6>{userProfile.userDescription}</h6>
                            <button onClick={renderEdit} className="btn btn-dark">Edit profile</button>
                        </div>
                    </div>
                )
            }  
        }
    }

    return (
        <Fragment>
        <ProfileRender />
        </Fragment>
    )
}


export default Profile;