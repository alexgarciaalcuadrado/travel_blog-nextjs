import React from "react";
import Link from "next/link";

const BlogRender = ({ blog }) => {
    const path = "/home/" + blog.blogId;
    return (
        <div key={blog.blogId}>
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