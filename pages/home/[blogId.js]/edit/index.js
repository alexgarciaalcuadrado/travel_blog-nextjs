import { Fragment, useEffect, useState } from "react"
import { useRouter } from "next/router";
import Navbar from "../../../../components/navbar/navbar";
import { updateBlog } from "../../../../firebase";

const Edit = (props) => {
    const router = useRouter();
    const [titleValue, setTitleValues] = useState(props.blog.title)
    const [descriptionValue, setDescriptionValues] = useState(props.blog.description)
    const [isSubmited, setIsSubmited] = useState(false);
    const [newBlog, setNewBlog] = useState({
        "title" : "",
        "description" : "",
        "image" : ""
    });

    useEffect(() => {
        if(isSubmited){
            updateBlog(props.blog, newBlog);
            setIsSubmited(false);
            router.push("/"); 
        }
    }, [isSubmited])

    const handleOnSubmit = (e) => {
        console.log(e.target.title.value)
        e.preventDefault();
        setNewBlog({
            "title" : e.target.title.value,
            "description" : e.target.description.value,
            "image" : e.target.image.value
        })
        setIsSubmited(true)
    }

    return (
        <Fragment>
            <Navbar />
            <h1>Edit your post</h1>
            <form onSubmit={handleOnSubmit}>
                <label>Edit your title</label>
                <input type="text" name="title" onChange={e => setTitleValues(e.target.value)} value={titleValue}></input>
                <label>Edit your story</label>
                <input type="text" name="description" onChange={e => setDescriptionValues(e.target.value)} value={descriptionValue}></input>
                <label name="image">Add another image</label>
                <input type="file" name="image"></input>
                <button>Submit</button>
            </form>
        </Fragment>
    )
}

export async function getServerSideProps(context){
    return{
        props : {
            blog : context.query
        }
    }
}

export default Edit;