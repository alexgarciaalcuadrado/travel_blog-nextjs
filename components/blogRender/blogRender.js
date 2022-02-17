import {useState, useEffect, Fragment} from "react";
import { onSnapshot } from 'firebase/firestore';
import { blogsColRef, usersColRef } from "../../firebase";
import Blog from "./blog";

const BlogRender = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [blogsPerPage, setBlogsPerPage] = useState(5);
    const [blogs, setBlogs] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        let isMounted = true; 
        if(isMounted){
            onSnapshot(blogsColRef, (snapshot) => { 
                const blogs = snapshot.docs.map((doc) => {return {...doc.data(), docId : doc.id }});
                setBlogs(blogs);
            });
            onSnapshot(usersColRef, (snapshot) => { 
                const users = snapshot.docs.map((doc) => {return {...doc.data(), docId : doc.id }});
                setUsers(users);
                setIsLoading(false);
            });
                         
        }
                   
        return () => { isMounted = false };
        
    }, []);

    // Logic for displaying blogs
    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

    const renderBlogs = currentBlogs.map((blog) => {
        return <Blog blog={blog} path={"/home/" + blog.blogId} users={users}/>
      });

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(blogs.length / blogsPerPage); i++) {
      pageNumbers.push(i);
    }

    const RenderNumbers = ({number}) => {
        let isActive = "";
        if(number === currentPage){
            isActive = "active";
        }
        const handleClickNumbers = (event) => {
            setCurrentPage(Number(event.target.id));
        }
        
        return( 
            <div className={`page-item ${isActive}`}>
                <li className={`page-link`}
                  key={number}
                  id={number}
                  onClick={handleClickNumbers}
                >
                    {number} 
                </li>
            </div>
            
        )
    }

    const RenderPageNumbers = () => {
        let isDisabledPrev = "";
        let isDisabledNext = "";
        if(currentPage === 1){
            isDisabledPrev = "disabled";
        } else if (currentPage < (pageNumbers.length + 1)){
            isDisabledNext = "disabled";
        }

        const onClickPrev = (e) => {
            e.preventDefault();
            const number = currentPage - 1;
            setCurrentPage( number);
        }

        const onClickNext = (e) => {
            e.preventDefault();
            const number = currentPage + 1;
            setCurrentPage( number );
        }
        return (
            <div>
            <nav>
              <ul className="pagination pagination-lg">
                <li className={`page-item ${isDisabledPrev}`}>
                  <a className="page-link" onClick={onClickPrev} href="#" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                  </a>
                </li>
                {pageNumbers.map(number => <RenderNumbers key={number} number={number}/>)}
                <li className={`page-item ${isDisabledNext}`}>
                  <a className="page-link" onClick={onClickNext} href="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                  </a>
                </li>
              </ul>
            </nav>
          
          </div>
        )
    };

    return(
        <Fragment>
            {isLoading 
            ?
            <div className="page-background-setted-height">
              <p>Loading...</p>
            </div>
            
            :
            blogs.length !== 0 && 
            (
                <div>
                  <ul>
                    {renderBlogs}
                  </ul>
                  <ul>
                    <RenderPageNumbers />
                  </ul>
                </div>
              )
            
            }
        </Fragment>
        
    )
   

}

export default BlogRender;