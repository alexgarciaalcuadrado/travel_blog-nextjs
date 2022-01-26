import { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/router";
import { addUserProfileInfo, usersColRef, updateProfile } from "../../firebase";
import { onSnapshot, query, where  } from 'firebase/firestore';
import Navbar from "../../components/navbar/navbar";

const EditProfile = () => {
    const router = useRouter();
    const [isSubmitedFirstTime, setisSubmitedFirstTime] = useState(false);
    const [isSubmitedEdit, setIsSubmitedEdit] = useState(false);
    const [prevProfileExist, setPrevProfileExist] = useState(false);
    const [userId, setUserId] = useState("");
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
    const [username, setUsername] = useState("");
    const [userDescription, setUserDescription] = useState("");

    useEffect(() => {
        let isMounted = true;
        if(isMounted){
            if(typeof window !== "undefined") {
                if(localStorage.getItem("user")){
                    setUserId(localStorage.getItem("user"))
                }
                if(isSubmitedFirstTime === true){
                    addUserProfileInfo(profileData);
                    setisSubmitedFirstTime(false);
                }
                /* if(isSubmitedEdit === true){
                    //updateProfile(editProfileData.docId, editProfileData)
                    
                    setIsSubmitedEdit(false);
                } */
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
    },[userId, profileData, isSubmitedFirstTime, isSubmitedEdit]);

    const onSubmitEditProfile = (e) => {
        e.preventDefault();
        setEditProfileData({
            "userId" : userId,
            "username" : username,
            "userDescription" : userDescription,
            "profilePicture" : e.target.profilePicture.value
        });
        setIsSubmitedEdit(true);
        updateProfile(editProfileData.docId, editProfileData)
        router.push("/profile")
    }

    const onSubmitFirstTimeUser = (e) => {
        e.preventDefault();
        setProfileData({
            "userId" : userId,
            "username" : username,
            "userDescription" : userDescription,
            "profilePicture" : e.target.profilePicture.value
        });
        setisSubmitedFirstTime(true)
        router.push("/profile")
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


    return(
        <Fragment>
            <Navbar />
            <div>
            <h3>Edit your profile</h3>
            <form onSubmit={prevProfileExist ? onSubmitEditProfile : onSubmitFirstTimeUser}>
                <label>Your username</label>
                <input type="text" name="username" onChange={onChangeHandlerUsername} value={editProfileData.username != "" ? editProfileData.username : username}></input>
                <label>Tell us about yourself</label>
                <input type="text" name="userDescription" onChange={onChangeHandlerDescription} value={editProfileData.userDescription != "" ? editProfileData.userDescription : userDescription}></input>
                <label>Add a profile picture</label>
                <input type="file" name="profilePicture"></input>
                <button>Submit</button>
            </form>
            </div>
        </Fragment>
        
    )
}


export default EditProfile