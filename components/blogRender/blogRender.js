import {useState, useEffect, Fragment} from "react";
import { onSnapshot } from 'firebase/firestore';
import { blogsColRef, usersColRef } from "../../firebase";
import Link from "next/link";
import notProfilePicture from "../../public/blank-user-photo.png";

const BlogRender = () => {
    const [blogs, setBlogs] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        let isMounted = true; 
        if(isMounted){
        /* for(let i = 0; i < users.length; i++){
            if(blog.creatorId === users[i].userId){
                setUserPicture(users[i].profilePicture);
            } else {
                setUserPicture(notProfilePicture.src)
            }  
    } */
            onSnapshot(blogsColRef, (snapshot) => { 
                const blogs = snapshot.docs.map((doc) => {return {...doc.data(), docId : doc.id }});
                setBlogs(blogs);
            });
            onSnapshot(usersColRef, (snapshot) => { 
                const users = snapshot.docs.map((doc) => {return {...doc.data(), docId : doc.id }});
                setUsers(users);
                setIsLoading(false);
            });
                         
        }
                   
        return () => { isMounted = false };
        
    }, []);

    const Blog = ({blog, path}) => {
        let userCreator = [];
        let userImage = notProfilePicture.src;
        let username = "";

        users.map((user) => {
            if(blog.creatorId === user.userId){
                userCreator = user;
            }
        });

        if(userCreator.username === ""){
            username = "Anonymous";
        } else {
            username = userCreator.username;
        }

        const profilePath = "/profile/" + userCreator.userId;
        
        return (
        <div key={blog.blogId} className={`blog`}>
            <div className={`blog__box__user`}>
                <img className={`blog__profilePicture`} src={userImage}></img>
                <h3 className={`blog__userCreated`} >Posted by: </h3>
                <Link href={profilePath}><a>{username}</a></Link>
            </div>
            <div className={`blog__box__title`}>
                <h3>{blog.title}</h3>
            </div>
            <div className={`blog__box__description`}>
                <p>{blog.description}</p>
            </div>

            <div className={`blog__box__actions`}>
                <Link href={{
                    pathname: path,
                    query: {
                        blogId : blog.blogId,
                        userId : userCreator.userId
                    }
                }}><a>See the whole story</a></Link>
            </div>
        
        </div>
        )
    }

    return(
        <Fragment>
            {isLoading 
            ?
            <p>Loading</p>
            :
            blogs.length !== 0 && blogs.map(blog => <Blog blog={blog} path={"/home/" + blog.blogId}/>) 
            }
        </Fragment>
        
    )
   

}

export default BlogRender;