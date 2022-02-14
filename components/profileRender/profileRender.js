import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { onSnapshot, query, where  } from 'firebase/firestore';
import { useAuth } from "../../auth/authUserProvider";
import { usersColRef, deleteSignedUser, auth } from "../../firebase";
import styles from "../profileRender/profileRender.module.scss";

const Profile = ({queryUserId}) => {
    const router = useRouter();
    
    const { authUser, loading } = useAuth();
    const [userId, setUserId] = useState("");
    const [showModal, setShowModal] = useState(false);
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
            if(queryUserId){
                if(userId === queryUserId){
                    setIsUser(true);
                } 
            }
            
        } 
        else {
            console.log("User was not found")
            }
        }

        if(isUser === true){
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
        if (queryUserId !== undefined){
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
        
        }
        
        if(profileCreated === false){
            setIsLoading(false);
        }
        
        return () => { isMounted = false };

    }, [queryUserId ,userId, authUser, profileCreated, authUser]);

    const renderEdit = () => {
        router.push("/profile/edit");
    }

    const setModal = () => {setShowModal(true)};

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
{/*                                 <button type="button" onClick={setModal} className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal">Delete profile</button>
 */}                            </div>
                            }
                        </div>
                        {/* <div className="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>
                              <div className="modal-body">
                                ...
                              </div>
                              <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary">Save changes</button>
                              </div>
                            </div>
                          </div>
                        </div> */}
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