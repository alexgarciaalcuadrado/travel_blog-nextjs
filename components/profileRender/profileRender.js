import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { onSnapshot, query, where  } from 'firebase/firestore';
import { useAuth } from "../../auth/authUserProvider";
import { usersColRef, deleteSignedUser, auth, passColRef } from "../../firebase";
import { decryptPassword } from "../../crypto";
import styles from "../profileRender/profileRender.module.scss";
import Modal from "react-bootstrap/Modal";

const Profile = ({queryUserId}) => {
    const router = useRouter();
    
    const { authUser, loading } = useAuth();
    const [userId, setUserId] = useState("");
    const [existingPass, setExistingPass] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
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

            const qPass = query(passColRef, where("userId", "==", userId));
            onSnapshot(qPass, (snapshot) => { 
            const hashedPassword = snapshot.docs.map((doc) => {return {...doc.data(), docId : doc.id }});
            if (hashedPassword.length){
                const password = decryptPassword(hashedPassword[0].password);
                setExistingPass(password);
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

    const renderEdit = () => {router.push("/profile/edit");}
    const handleOpenModal = () => {setShowModal(true)};
    const handleCloseModal = () => {setShowModal(false)};
    const deleteUser = async (e) => {
        e.preventDefault();
        if(e.target[0].value ===  existingPass){
            setDeleteError("");
            setDeleteLoading(true);
            await deleteSignedUser(e.target[0].value);
            setDeleteLoading(false);
            router.push("/");
        } else {
            setDeleteError("The password is incorrect, please try again");
        }
        
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
                                <button type="button" onClick={handleOpenModal} className="btn btn-danger">Delete profile</button>
                            </div>
                            }
                        </div>

                        <div>
                        <Modal class="modal" show={showModal} onHide={handleCloseModal}>
                          <Modal.Header class="modal-header" closeButton>
                            <Modal.Title class="modal-title">Are you sure?</Modal.Title>
                          </Modal.Header>
                        <Modal.Body class="modal-body">
                          <h5>Once you delete your profile, all your blogs will be deleted permanently.</h5>
                          <h5 className="fw-light">In order to continue, please write your password again</h5>
                          <form onSubmit={deleteUser}>
                            <div class="mb-3">
                              <label for="passwordInput" class="form-label">Password</label>
                              <input id="passwordInput" class="form-control" type="password"/>
                            </div>
                            {deleteLoading === true ?
                                (
                                <div class="spinner-border" role="status">
                                  <span class="visually-hidden">Loading...</span>
                                </div>
                                )
                                :
                                null
                            }    
                            {deleteError}
                            <div class="modal-footer d-flex justify-content-between">
                                <button type="submit" className="btn btn-danger">Delete profile</button>
                                <button className="btn btn-primary" onClick={handleCloseModal}>
                                  No, thanks
                                </button>
                            </div>
                          </form>
                          
                        </Modal.Body>
                        </Modal>
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