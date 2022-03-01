import {Fragment} from "react";
import HomeWelcome from "../components/homeWelcome/homeWelcome";
import Cards from "../components/homeWelcome/cards";

const Home = () => {
    return (
        <Fragment>
            <div className="page-background">
            <HomeWelcome /> 
            <Cards />
            </div>
        </Fragment>
    )
}



export default Home