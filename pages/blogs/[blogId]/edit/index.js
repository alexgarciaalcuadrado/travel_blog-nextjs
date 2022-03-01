import { Fragment, useEffect, useState } from "react";
import { useAuth } from "../../../../auth/authUserProvider";
import { onSnapshot, query, where } from 'firebase/firestore';
import { blogsColRef, updateBlog} from "../../../../firebase";
import { useRouter } from "next/router";

const Edit = (props) => {
    const router = useRouter();
    const { authUser, loading } = useAuth();
    const [isSubmited, setIsSubmited] = useState(false);
    const [blog, setBlog] = useState([]);
    const [newBlog, setNewBlog] = useState({
        "title" : "",
        "description" : "",
        "image" : ""
    });

    useEffect(() => {
        let isMounted = true;
        if(isMounted){
        if (!loading && !authUser) router.push('/');
        const qBlog = query(blogsColRef, where("blogId", "==", props.blogId.blogId));
        onSnapshot(qBlog, (snapshot) => { 
            const blog = snapshot.docs.map((doc) => {
                return {...doc.data(), docId : doc.id }
            });
            setBlog(blog[0]);
        }); 

        if(isSubmited){
            updateBlog(blog.docId, newBlog);
            setIsSubmited(false);
            router.push("/blogs"); 
        }
    }
    return () => { isMounted = false };
    }, [isSubmited, authUser]);

    const handleOnSubmit = (e) => {
        console.log(e.target.title.value)
        e.preventDefault();
        setNewBlog({
            "title" : e.target.title.value,
            "description" : e.target.description.value,
            "image" : e.target.image.value
        })
        setIsSubmited(true)
    };

    const onChangeHandlerTitle = (e) => {
        setBlog({
            ...blog,
            "title" : e.target.value
        });
    };

    const onChangeHandlerStory = (e) => {
        setBlog({
            ...blog,
            "description" : e.target.value
        });
    };

    return (
        <Fragment>
            <div className="page-background">
                <h1 className="display-6 gradient__green__underline text-center">Edit your post</h1>
                <form onSubmit={handleOnSubmit}>
                <div className="mb-3">
                    <label className="form-label fw-bold">Edit your title</label>
                    <input className="form-control" type="text" name="title" onChange={onChangeHandlerTitle} value={blog.title}></input>
                </div>
                <div className="mb-3">
                    <label className="form-label fw-bold">Edit your story</label>
                    <input className="form-control" type="text" name="description" onChange={onChangeHandlerStory} value={blog.description}></input>
                </div>
                <div className="mb-3">
                    <label className="form-label fw-bold" name="image">Add another image</label>
                    <input className="form-control" type="file" name="image"></input>
                </div>
                <button className="btn btn-success">Submit</button>
                </form>
            </div>
            
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

export default Edit;