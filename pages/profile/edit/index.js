import { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/router";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
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
    const [startLoading, setStartLoading] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(0);
    const [username, setUsername] = useState("");
    const [userDescription, setUserDescription] = useState("");

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
        return () => isMounted = false;
    },[userId, profileData, isSubmitedFirstTime, isSubmitedEdit]);


    const onSubmitEditProfile = (e) => {
        e.preventDefault();
        const profilePath = "/profile/" + userId;
        updateProfile(editProfileData.docId, editProfileData);
        setIsSubmitedEdit(false);
        router.push(profilePath); 
                
    }
    const onSubmitFirstTimeUser = (e) => {
        e.preventDefault();
        setProfileData({
            ...profileData,
            "userId" : userId,
            "username" : username,
            "userDescription" : userDescription
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

    const getUrl = (snap) => { 
            
    }

    const onChangeHandlerFile = async (e) => {
        const file = e.target.files[0];
        const fileRef = ref(storage, `/profImages/${userId}`);
        const uploadTask = uploadBytesResumable(fileRef, file, { contentType: "image/jpeg" });
        uploadTask.on('state_changed',
          (snapshot) => {
            setStartLoading(true);
            const progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setUploadLoading(progress)
          }, 
          (error) => {
            console.log(error);
          },
          () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => { 
            if(prevProfileExist === true){
                setEditProfileData({
                    ...editProfileData,
                    "profilePicture" : url
                });
            } else {
                setProfileData({
                    ...profileData,
                    "profilePicture" : url
                });
            }
        setStartLoading(false);
        })})
    }

    const showLoading = () => {
            if(uploadLoading !== 100){
                if(startLoading === true){
                    return (
                        <div>
                            <p className="fs-3 text">{uploadLoading}%</p>
                            <br></br>
                            <button className="btn btn-success" disabled>Submit</button>
                        </div>
                    )
                } else {
                    return(
                        <button className="btn btn-success" disabled>Submit</button>
                    )
                }
            } else {
                return (
                    <div>
                        <h3>Image Uploaded!</h3>
                        <input type="submit" value="Submit" className="btn btn-success"></input>
                    </div>
                )
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
                    <input className="form-control" onChange={onChangeHandlerFile} type="file" name="profilePicture"></input>
                </div>
                {showLoading()}
            </form>
            </div>
        </Fragment>
        
    )
}


export default EditProfile