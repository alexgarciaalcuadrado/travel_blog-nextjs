import { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/router";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addUserProfileInfo, usersColRef, updateProfile, storage } from "../../../firebase";
import { onSnapshot, query, where  } from 'firebase/firestore';

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
            }
            

            const q = query(usersColRef, where("userId", "==", userId));
            onSnapshot(q, (snapshot) => { 
                const user = snapshot.docs.map((doc) => {return {...doc.data(), docId : doc.id }});
                if (user.length){
                    setEditProfileData(user[0]);
                    setUsername(editProfileData.username);
                    setUserDescription(editProfileData.userDescription)
                    setPrevProfileExist(true);
                }

            });

            if(isSubmitedFirstTime === true){
                const profilePath = "/profile/" + userId;
                addUserProfileInfo(profileData);
                setisSubmitedFirstTime(false);
                router.push(profilePath);
            }
        
        }
    },[userId, profileData, isSubmitedFirstTime, isSubmitedEdit, imageUrl]);


    const onSubmitEditProfile = (e) => {
        e.preventDefault();
        const profilePath = "/profile/" + userId;
        setEditProfileData({
            "userId" : userId,
            "username" : username,
            "userDescription" : userDescription,
            "profilePicture" : imageUrl
        });

        updateProfile(editProfileData.docId, editProfileData);
        setIsSubmitedEdit(false);
        router.push(profilePath);
                
    }

    const onSubmitFirstTimeUser = (e) => {
        e.preventDefault();
        setProfileData({
            "userId" : userId,
            "username" : username,
            "userDescription" : userDescription,
            "profilePicture" : imageUrl
        });

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

    const onChangeHandlerFile = (e) => {
        const file = e.target.files[0];
        //const blob = new Blob([e.target.files[0]]);
        //const file = new File([blob], "profileImage");

        const fileRef = ref(storage, `/profImages/${userId}`);
        
        uploadBytes(fileRef, file).then(
            getDownloadURL(fileRef).then(url => {
                setImageUrl(url);
            }).catch(err => { console.log(err) })    
        ).catch(err => { console.log(err) }); 
    }

    return(
        <Fragment>
            <div className="page-background">
            {loading === true && <p>Loading</p>}
            <h1 className="display-6 gradient__green__underline text-center">Edit your profile</h1>
            <form onSubmit={prevProfileExist ? onSubmitEditProfile : onSubmitFirstTimeUser}>
                <div className="mb-3">
                    <label className="form-label fw-bold">Your username</label>
                    <input className="form-control" type="text" name="username" onChange={onChangeHandlerUsername} value={editProfileData.username != "" ? editProfileData.username : username}></input>
                </div>
                <div className="mb-3">
                    <label className="form-label  fw-bold">Tell us about yourself</label>
                    <textarea className="form-control" rows="5" type="text" name="userDescription" onChange={onChangeHandlerDescription} value={editProfileData.userDescription != "" ? editProfileData.userDescription : userDescription}></textarea>
                </div>
                <div className="mb-3">
                    <label className="form-label fw-bold">Add a profile picture</label>
                    <input className="form-control" onChange={onChangeHandlerFile} type="file" name="profilePicture"></input>
                </div>
                <button className="btn btn-success">Submit</button>
            </form>
            </div>
        </Fragment>
        
    )
}


export default EditProfile