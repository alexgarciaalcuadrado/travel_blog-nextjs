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
}

export default CreateBlog;