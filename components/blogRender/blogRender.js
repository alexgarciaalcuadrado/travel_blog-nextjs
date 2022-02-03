import React, {useState, useEffect} from "react";
import Link from "next/link";
import notProfilePicture from "../../public/blank-user-photo.png";
import styles from "../blogRender/blogRender.module.scss";

const BlogRender = ({ blog, users }) => {
    const path = "/home/" + blog.blogId;
    const [userPicture, setUserPicture] = useState("");
    
    useEffect(() => {
        setUserPicture(notProfilePicture.src);
        /* for(let i = 0; i < users.length; i++){
            if(blog.creatorId === users[i].userId){
                setUserPicture(users[i].profilePicture);
            } else {
                setUserPicture(notProfilePicture.src)
            }  
    } */
    }, []);

    
   

    return (
        <div key={blog.blogId}>
            <img className={styles.profilePicture__profilePage} src={userPicture}></img>
            <h3>{blog.title}</h3>
            <p>{blog.description}</p>
            <Link href={{
            pathname: path,
            query: blog
            }}>See the whole story</Link>
         </div>
    )
}

export default BlogRender;