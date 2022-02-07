import { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/router";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addUserProfileInfo, usersColRef, updateProfile, storage } from "../../firebase";
import { onSnapshot, query, where  } from 'firebase/firestore';
import notProfilePicture from "../../public/blank-user-photo.png"

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
            if(isSubmitedFirstTime === true){
                addUserProfileInfo(profileData);
                setisSubmitedFirstTime(false);
                router.push("/profile");
            }
            if(isSubmitedEdit === true){
                
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
    },[userId, profileData, isSubmitedFirstTime, isSubmitedEdit, imageUrl]);


    const onSubmitEditProfile = (e) => {
        e.preventDefault();

        if(e.target[2].value === ""){
            setUserImage(e.target[2].value);
        } else {
            setUserImage(notProfilePicture.src);
        }

        const fileRef = ref(storage, `/profImages/${userId}`);
        uploadBytes(fileRef, userImage).then(
            getDownloadURL(fileRef).then(url => {
                setImageUrl(url);
            }).catch(err => { console.log(err) })    
        ).catch(err => { console.log(err) }); 

        setEditProfileData({
            "userId" : userId,
            "username" : username,
            "userDescription" : userDescription,
            "profilePicture" : notProfilePicture.src
        });

        setIsSubmitedEdit(true);
                
    }

    const onSubmitFirstTimeUser = (e) => {
        e.preventDefault();

        if(e.target[2].value === ""){
            setUserImage(e.target[2].value);
        } else {
            setUserImage(notProfilePicture.src);
        } 

        const fileRef = ref(storage, `/profImages/${userId}`);
        uploadBytes(fileRef, userImage).then(
            getDownloadURL(fileRef).then(url => {
                setImageUrl(url);
                console.log(imageUrl);
            }).catch(err => { console.log(err) })    
        ).catch(err => { console.log(err) }); 

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
                    <input className="form-control" type="file" name="profilePicture"></input>
                </div>
                <button className="btn btn-success">Submit</button>
            </form>
            </div>
        </Fragment>
        
    )
}


export default EditProfile