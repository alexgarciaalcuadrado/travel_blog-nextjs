import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { onSnapshot, query, where  } from 'firebase/firestore';
import { useAuth } from "../../auth/authUserProvider";
import { usersColRef } from "../../firebase";
import defaultUserPhoto from "../../public/blank-user-photo.png";
import styles from "../profileRender/profileRender.module.scss";

const Profile = ({queryUserId}) => {
    const router = useRouter();
    const { authUser, loading } = useAuth();
    const [userId, setUserId] = useState("");
    const [isUser, setIsUser] = useState(false);
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
            setUserId(localStorage.getItem("user"));
            if(userId === queryUserId){
                setIsUser(true);
            }
        } 
        else {
            console.log("User was not found")
            }
        }

        const q = query(usersColRef, where("userId", "==", queryUserId));
        onSnapshot(q, (snapshot) => { 
            const user = snapshot.docs.map((doc) => {return {...doc.data(), docId : doc.id }});
            if (user.length){
                setProfileCreated(true);
                setUserProfile(user[0]);
                setIsLoading(false);
            }
             
        }); 
        }
        
        if(profileCreated === false){
            setIsLoading(false);
        }
        
        return () => { isMounted = false };

    }, [queryUserId ,userId, authUser, profileCreated, authUser]);

    const renderEdit = () => {
        router.push("/profile/edit");
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
                        <span className={styles.profile__title}>My profile</span> 
                        <hr className={styles.profile__title__hr}></hr>
                        <div className={styles.profile__createAcount}>
                            <h3 className={styles.profile__createAcount__item}>Create your profile</h3>
                            <button onClick={renderEdit} className={`btn btn-dark ${styles.profile__createAcount__item}`}>Create</button>  
                        </div>
                    </div>
                )
            }
            
        } else {
            if(isLoading === true){
                return (
                    <div className="page-background-setted-height">
                        <p>Loading</p>
                    </div>
                    
                )
            } else {
                return(
                    <div className="page-background">
                        <div className={styles.profile}>
                        <span className={styles.profile__title}>My profile</span> 
                        <hr className={styles.profile__title__hr}></hr>
                            <div className={styles.profile__top}>
                                <img className="" src={userProfile.profilePicture}/>
                                <div className={styles.profile__top__name}>
                                    <div><h3>{userProfile.username}</h3></div>
                                </div> 
                            </div>
                            <h4>About me...</h4>
                            <h6>{userProfile.userDescription}</h6>
                            {isUser && 
                            <div className={styles.profile__actions}>
                                <button onClick={renderEdit} className="btn btn-dark">Edit profile</button>
                            </div>
                            }
                            
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