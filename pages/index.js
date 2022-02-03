import {Fragment, useState, useEffect} from "react";
import { onSnapshot } from 'firebase/firestore';
import { blogsColRef, usersColRef } from "../firebase";
import Navbar from "../components/navbar/navbar";
import BlogRender from "../components/blogRender/blogRender";

const Home = () => {

    const [blogs, setBlogs] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => { 
        let isMounted = true; 
        if(isMounted){
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

    return (
        <Fragment>
        <Navbar />
        <h1>This is the home page</h1>
        {isLoading 
        ? 
        <p>Loading</p>
        :
        blogs.length !== 0 && blogs.map(blog => <BlogRender blog={blog} users={users}/>)
        }
        </Fragment>
    )
}



export default Home