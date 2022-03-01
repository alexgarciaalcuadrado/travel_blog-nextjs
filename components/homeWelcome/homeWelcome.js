import styles from "../homeWelcome/homeWelcome.module.scss";

const HomeWelcome = () => {
    return(
        <div className={styles.home}>
            <h1><span>TravelPin</span></h1>
            <h2>Share your stories and places</h2>
            <h3>
                The world is so big! And you don't know where to go?
                Join our community of travelers to discover faces of the 
                world you've never seen!
            </h3>
        </div>
    )
}

export default HomeWelcome;