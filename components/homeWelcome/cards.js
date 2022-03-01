import { useState, useEffect } from "react";
import styles from "../homeWelcome/cards.module.scss";
import {useRouter} from "next/router";
import navigationIcon from "../../public/cardImages/cardIcons/navigation.png"
import aroundIcon from "../../public/cardImages/cardIcons/around.png";
import writingIcon from "../../public/cardImages/cardIcons/writing.png";

const Cards = () => {
    const router = useRouter();
    const [userExist, setUserExist] = useState(false);

    useEffect(() => {
        if(typeof window !== "undefined") {
            if(localStorage.getItem("user")){
                setUserExist(true);
            }
        }
    }, []);

    return(
        <div className={styles.flexCenterContainer}>
        <div className={styles.cards}>
            <div className={styles.card}>
                <div className={styles.card__container}>
                    <div className={styles.card__front}>
                        <div className={styles.card__front__1}>
                            <div className={styles.card__title}>
                                <h3>Explore the world form your computer</h3>    
                            </div>
                            <img className={styles.card__icon} src={navigationIcon.src}/>
                        </div>
                    </div>
                    <div className={styles.card__back}>
                        <div className={styles.card__back__1}>
                            <button className={`btn btn-success ${styles.card__back__button}`} onClick={() => {router.push("/blogs")}}>See the blogs</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.card}>
                <div className={styles.card__container}>
                    <div className={styles.card__front}>
                        <div className={styles.card__front__2}>
                            <div className={styles.card__title}>
                                <h3>Find your next destination, it's easier than you think</h3>    
                            </div>
                            <img className={styles.card__icon} src={aroundIcon.src}/>
                        </div>
                    </div>
                    <div className={styles.card__back}>
                        <div className={styles.card__back__2}>
                            <button className={`btn btn-success ${styles.card__back__button}`} onClick={() => {router.push("/blogs")}}>See the blogs</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.card}>
                <div className={styles.card__container}>
                    <div className={styles.card__front}>
                        <div className={styles.card__front__3}>
                            <div className={styles.card__title}>
                                <h3>Share your experience with the community</h3>    
                            </div>
                            <img className={styles.card__icon} src={writingIcon.src}/>
                        </div>
                    </div>
                    <div className={styles.card__back}>
                        <div className={styles.card__back__3}>
                            {userExist === true ?
                                <button className={`btn btn-success ${styles.card__back__button}`} onClick={() => {router.push("/createBlog")}}>Create your blog</button>
                                :
                                <button className={`btn btn-success ${styles.card__back__button}`} onClick={() => {router.push("/login")}}>Log in</button>
                            }
                        </div>
                        
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}


export default Cards;