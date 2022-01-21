import {Fragment, useState, useEffect} from "react";
import { onSnapshot } from 'firebase/firestore';
import { colRef } from "../firebase";
import Navbar from "../components/navbar/navbar";
import BlogRender from "../components/blogRender/blogRender";

const Home = () => {

    const [blogs, setBlogs] = useState([]);

    useEffect(() => { 
        let isMounted = true; 
                onSnapshot(colRef, (snapshot) => { 
                if (isMounted) {
                const blogs = snapshot.docs.map((doc) => {return {...doc.data(), docId : doc.id }});
                setBlogs(blogs) 
                }
            });   
        
        return () => { isMounted = false };
    }, []);


    return (
        <Fragment>
        <Navbar />
        <h1>This is the home page</h1>
         {blogs.length !== 0 && blogs.map(blog => <BlogRender blog={blog} />) }
        </Fragment>
    )
}



export default Home