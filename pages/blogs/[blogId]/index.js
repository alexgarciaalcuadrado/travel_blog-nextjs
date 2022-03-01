import {Fragment, useState, useEffect} from "react";
import { onSnapshot, query, where } from 'firebase/firestore';
import { blogsColRef, usersColRef, deleteBlog } from "../../../firebase";
import { useRouter } from "next/router";
import Link from "next/link";
import defaultImage from "../../../public/blank-user-photo.png";

const blog = (props) => {
    const router = useRouter();
    const editPath = "/blogs/" + props.blogId.blogId + "/edit";
    const [loading, setLoading] = useState(true);
    const [deleteAction, setDeleteAction] = useState(false);
    const [blog, setBlog] = useState([]);
    const [user, setUser] = useState([]);
    const [userId, setUserId] = useState("");

    useEffect(() => {
        let isMounted = true; 
        if(isMounted){

        if(deleteAction === true){
            deleteBlog(blog.docId);
            router.push("/blogs");
        }

        if(typeof window !== "undefined") {
            if(localStorage.getItem("user")){
                setUserId(localStorage.getItem("user"));
            } else {
                console.log("User was not found")
            }
        }

        const qBlog = query(blogsColRef, where("blogId", "==", props.blogId.blogId));

        onSnapshot(qBlog, (snapshot) => { 
            const blog = snapshot.docs.map((doc) => {
                return {...doc.data(), docId : doc.id }
            });
            setBlog(blog[0]);
            setLoading(false);
        }); 

        const qUser = query(usersColRef, where("userId", "==", props.blogId.userId));
        onSnapshot(qUser, (snapshot) => { 
            const user = snapshot.docs.map((doc) => {return {...doc.data(), docId : doc.id }});
            if(user.length){
                setUser(user[0]);
            } 
            
        });
        return () => { isMounted = false };
        }
    }, [deleteAction]);

    const handleDelete = () => {
        setDeleteAction(true)
        
    }

    const creatorActions = () => {
        return (
            <div className={`blog__box__actionsSinglePost`}>
                <div>
                     <Link href={{
                    pathname: editPath,
                    query: {
                        blogId:props.blogId.blogId
                    }
                    }}><a>Edit post</a></Link>
                </div>
                <button className="btn btn-danger" onClick={handleDelete}>Delete post</button>
                
               
            </div>
        )
    } 
    
    const profilePath = "/profile/" + user.userId;
    return (
        <Fragment>
            {loading === true ?
            <div className="page-background-setted-height">
               <p>Loading...</p> 
            </div>
            :
            (
                <div className="page-background-setted-height">
                    <div className="blog">
                    <div className={`blog__box__user`}>
                        <img className={`blog__profilePicture`} src={user.profilePicture === "" ? defaultImage.src : user.profilePicture} />
                        <p className={`blog__userCreated`}>Posted by: </p>
                        <Link href={{ pathname: profilePath}}><a>{user.username}</a></Link>
                    </div>
                    <div className={`blog__box__title`}>
                        <h3>{blog.title}</h3>
                    </div>
                    <div className={`blog__box__description lh-base`}>
                        <p>{blog.description}</p>
                    </div>
                    {blog.creatorId === userId && creatorActions()}
                    
                    </div> 
                </div>
            )
            }
            
        </Fragment> 
    )  
}

        

export async function getServerSideProps(context){
    return{
        props : {
            blogId : context.query
        }
    }
}

export default blog; 