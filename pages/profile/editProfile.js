import { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/router";
import { ref, uploadBytes, getDownloadURL, uploadString } from "firebase/storage";
import { addUserProfileInfo, usersColRef, updateProfile, storage } from "../../firebase";
import { onSnapshot, query, where  } from 'firebase/firestore';
import notProfilePicture from "../../public/blank-user-photo.png"
import Navbar from "../../components/navbar/navbar";

const EditProfile = () => {
    const router = useRouter();
    const [userId, setUserId] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSubmitedFirstTime, setisSubmitedFirstTime] = useState(false);
    const [isSubmitedEdit, setIsSubmitedEdit] = useState(false);
    const [prevProfileExist, setPrevProfileExist] = useState(false);
    const [editProfileData, setEditProfileData] = useState({
        "userId" : "",
        "username" : "",
        "userDescription" : "",
        "profilePicture" : ""
    });
    const [profileData, setProfileData] = useState({
        "userId" : "",
        "username" : "",
        "userDescription" : "",
        "profilePicture" : ""
    });
    const [userImage, setUserImage] = useState("");
    const [username, setUsername] = useState("");
    const [userDescription, setUserDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        let isMounted = true;
        if(isMounted){
            if(typeof window !== "undefined") {
                if(localStorage.getItem("user")){
                    setUserId(localStorage.getItem("user"))
                }
                if(isSubmitedFirstTime === true){
                    addUserProfileInfo(profileData);
                    setProfileData({
                        "userId" : userId,
                        "username" : username,
                        "userDescription" : userDescription,
                        "profilePicture" : notProfilePicture.src
                    });
                    
                    setisSubmitedFirstTime(false);
                    router.push("/profile");
                }
                if(isSubmitedEdit === true){
                    setEditProfileData({
                        "userId" : userId,
                        "username" : username,
                        "userDescription" : userDescription,
                        "profilePicture" : notProfilePicture.src
                    });
                    updateProfile(editProfileData.docId, editProfileData);
                    setIsSubmitedEdit(false);
                    router.push("/profile");
                }

                const q = query(usersColRef, where("userId", "==", userId));
                onSnapshot(q, (snapshot) => { 
                    const user = snapshot.docs.map((doc) => {return {...doc.data(), docId : doc.id }});
                    if (user.length){
                        setEditProfileData(user[0]);
                        setPrevProfileExist(true);
                    }
                     
                });
        }
    }
    },[userId, profileData, isSubmitedFirstTime, isSubmitedEdit, imageUrl]);


    const onSubmitEditProfile = (e) => {
        e.preventDefault();
        /* const fileRef = ref(storage, `/profImages/${userId}`);
        uploadBytes(fileRef, userImage).then(
            getDownloadURL(fileRef).then(url => {
                setImageUrl(url);
            }).catch(err => { console.log(err) })    
        ).catch(err => { console.log(err) }); */
        setIsSubmitedEdit(true);
                
    }

    const onSubmitFirstTimeUser = (e) => {
        e.preventDefault();
        /* const fileRef = ref(storage, `/profImages/${userId}`);
        uploadBytes(fileRef, userImage).then(
            getDownloadURL(fileRef).then(url => {
                setImageUrl(url);
            }).catch(err => { console.log(err) })    
        ).catch(err => { console.log(err) }); */
        
        setisSubmitedFirstTime(true);    
    }

    const onChangeHandlerUsername = (e) => {
        if(prevProfileExist === true){
            setEditProfileData({
                ...editProfileData,
                "username" : e.target.value
            })
        } else {
            setUsername(e.target.value);
        }
    }

    const onChangeHandlerDescription = (e) => {
        if(prevProfileExist === true){
            setEditProfileData({
                ...editProfileData,
                "userDescription" : e.target.value
            })
        } else {
            setUserDescription(e.target.value);
        }
    }

    const onChangeHandleProfilePicture = (e) => {
        if(e.target.files[0]){
            setUserImage(e.target.files[0]);
        } else {
            setUserImage(notProfilePicture.src);
        }
    }


    return(
        <Fragment>
            <Navbar />
            <div>
            {loading === true && <p>Loading</p>}
            <h3>Edit your profile</h3>
            <form onSubmit={prevProfileExist ? onSubmitEditProfile : onSubmitFirstTimeUser}>
                <label>Your username</label>
                <input type="text" name="username" onChange={onChangeHandlerUsername} value={editProfileData.username != "" ? editProfileData.username : username}></input>
                <label>Tell us about yourself</label>
                <input type="text" name="userDescription" onChange={onChangeHandlerDescription} value={editProfileData.userDescription != "" ? editProfileData.userDescription : userDescription}></input>
                <label>Add a profile picture</label>
                <input type="file" name="profilePicture" onChange={onChangeHandleProfilePicture}></input>
                <button>Submit</button>
            </form>
            </div>
        </Fragment>
        
    )
}


export default EditProfile