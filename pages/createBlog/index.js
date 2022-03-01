import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {v4 as uuidv4} from 'uuid';
import { onSnapshot, query, where  } from 'firebase/firestore';
import { addBlog, usersColRef } from "../../firebase";
import { useAuth } from "../../auth/authUserProvider";


const CreateBlog = () => {
    const router = useRouter();

    const { authUser, loading } = useAuth();
    const [userId, setUserId] = useState("");
    const [userProfileExist, setUserProfileExist] = useState(false);
    const [isSubmited, setIsSubmited] = useState(false);
    const [newBlog, setNewBlog] = useState({
        "creatorId" : "",
        "blogId": "",
        "title" : "",
        "description" : "",
        "image" : ""
    });

    useEffect(() => {
        let isMounted = true; 
        if(isMounted){
        if (!loading && !authUser) router.push('/');

        if(typeof window !== "undefined") {
            if(localStorage.getItem("user")){
                setUserId(localStorage.getItem("user"));
                
            } else {
                console.log("User was not found")
            }
        }

        const q = query(usersColRef, where("userId", "==", userId));
            onSnapshot(q, (snapshot) => { 
            const user = snapshot.docs.map((doc) => {return {...doc.data(), docId : doc.id }});
            if (user.length){
                setUserProfileExist(true);
            } 
            });

        if(isSubmited){
            addBlog(newBlog);
            setIsSubmited(false);
            router.push("/blogs"); 
        }
        return () => { isMounted = false };

        }


    }, [authUser, isSubmited, newBlog, userId])

    const submitHandler = (e) => {
        e.preventDefault();
        setNewBlog({
            "creatorId" : userId,
            "blogId" : uuidv4(),
            "title" : e.target.title.value,
            "description" : e.target.description.value,
            "image" : e.target.image.value
        })
        setIsSubmited(true)
        
    }

    if(userProfileExist === true){
        return(
            <div className="page-background">
                <h1 className="display-6 gradient__green__underline text-center">Write your experience</h1>
                <form onSubmit={submitHandler}>
                <div className="mb-3">
                    <label className="form-label fw-bold" name="title">Title of your post</label>
                    <input className="form-control" type="text" name="title"></input>
                </div>
                <div className="mb-3">
                    <label className="form-label  fw-bold">Your story</label>
                    <textarea className="form-control" rows="5" type="text" name="description" ></textarea>
                </div>
                <div className="mb-3">
                    <label className="form-label fw-bold">Add an image</label>
                    <input className="form-control" type="file" name="image"></input>
                </div>
                <button className="btn btn-success">Submit</button>
                </form>
            </div>
        )
    } else {
        return(
            <div className="page-background-setted-height">
                <h3 className="text-center fw-light">You haven't created your profile yet, please do so in order to be able to create blogs.</h3>
            </div>

        )
    }

    
}

export default CreateBlog;