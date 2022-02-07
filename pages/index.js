import {Fragment} from "react";
import HomeWelcome from "../components/homeWelcome/homeWelcome";
import BlogRender from "../components/blogRender/blogRender";

const Home = () => {
    return (
        <Fragment>
            <div className="page-background">
            <HomeWelcome /> 
            <BlogRender/>
            </div>
        </Fragment>
    )
}



export default Home