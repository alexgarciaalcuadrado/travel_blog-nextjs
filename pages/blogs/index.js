import {Fragment} from "react";
import BlogRender from "../../components/blogRender/blogRender";
import IntroBlogs from "../../components/blogRender/introBlogs";

const Blogs = () => {
    return (
        <Fragment>
            <div className="page-background">
            <IntroBlogs />
            <BlogRender/>
            </div>
        </Fragment>
    )
}



export default Blogs;