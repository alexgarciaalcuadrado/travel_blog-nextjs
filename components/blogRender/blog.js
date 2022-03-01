import Link from "next/link";
import notProfilePicture from "../../public/blank-user-photo.png";

const Blog = ({blog, path, users}) => {
    let userCreator = [];
    let userImage = "";
    let username = "";

    users.map((user) => {
        if(blog.creatorId === user.userId){
            userCreator = user;
        }
    });

    if(userCreator.username === ""){
        username = "Anonymous";
    } else {
        username = userCreator.username;
    }

    if(userCreator.profilePicture === ""){
        userImage = notProfilePicture.src;
    } else {
        userImage = userCreator.profilePicture;
    }

    const profilePath = "/profile/" + userCreator.userId;
    
    return (
    <div className="blog__displaybox">    
    <div key={blog.blogId} className={`blog`}>
        <div className={`blog__box__user`}>
            <img className={`blog__profilePicture`} src={userImage}></img>
            <h3 className={`blog__userCreated`} >Posted by: </h3>
            <Link href={profilePath}><a>{username}</a></Link>
        </div>
        <div className={`blog__box__title`}>
            <h3>{blog.title}</h3>
        </div>
        <div className={`blog__box__description`}>
            <p>{blog.description}</p>
        </div>

        <div className={`blog__box__actions`}>
            <Link href={{
                pathname: path,
                query: {
                    blogId : blog.blogId,
                    userId : userCreator.userId
                }
            }}><a>See the whole story</a></Link>
        </div>
    </div>
    </div>
    )
}

export default Blog;