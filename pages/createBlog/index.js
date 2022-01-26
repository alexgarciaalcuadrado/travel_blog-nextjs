import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {v4 as uuidv4} from 'uuid';
import { addBlog } from "../../firebase";
import Navbar from "../../components/navbar/navbar";

const CreateBlog = () => {
    const router = useRouter();

    const [userId, setUserId] = useState("");
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
        if(typeof window !== "undefined") {
            if(localStorage.getItem("user")){
                setUserId(localStorage.getItem("user"))
            } else {
                console.log("User was not found")
            }
        }

        if(isSubmited){
            addBlog(newBlog);
            setIsSubmited(false);
            router.push("/"); 
        }
        }

        return () => { isMounted = false };

    }, [isSubmited, newBlog])

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


    return(
        <div>
            <Navbar />
            <h1>Write your experience</h1>
            <form onSubmit={submitHandler}>
                <label name="title">Title of your post</label>
                <input type="text" name="title"></input>
                <label name="description">Your story</label>
                <input type="text" name="description"></input>
                <label name="image">Add an image</label>
                <input type="file" name="image"></input>
                <button>Submit</button>
            </form>
        </div>
    )
}

export default CreateBlog;