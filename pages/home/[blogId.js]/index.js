import React, {Fragment, useState, useEffect} from "react";
import Navbar from "../../../components/navbar/navbar";
import { useRouter } from "next/router";
import Link from "next/link";
import { deleteBlog } from "../../../firebase";

const blog = (props) => {
    const router = useRouter();
    const editPath = "/home/" + router.query.blogId + "/edit";

    const [isCreator, setIsCreator] = useState(false)
    console.log(props.blog)

    useEffect(() => {
        if(typeof window !== "undefined") {
            if(localStorage.getItem("user")){
                const userId = localStorage.getItem("user");
                if(props.blog.creatorId === userId){
                    setIsCreator(true);
                }
            } else {
                console.log("User was not found")
            }
        }
    }, [])

    const handleDelete = () => {
        deleteBlog(props.blog);
        router.push("/")
    }

    

    const creatorActions = () => {
        return (
            <div>
                <button onClick={handleDelete}>Delete post</button>
                <Link href={{
                pathname: editPath,
                query: props.blog
                }}>Edit post</Link>
            </div>
        )
    }

    return (
        <Fragment>
            <Navbar />
        <div key={props.blog.id}>
            <h3>{props.blog.title}</h3>
            <p>{props.blog.description}</p>
            {isCreator && creatorActions()}
        </div>
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

export default blog; 