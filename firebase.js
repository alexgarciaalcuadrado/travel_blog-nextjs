import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword,  
  signOut,
  signInWithEmailAndPassword
} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL, uploadString } from "firebase/storage";
import { addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { getFirestore, collection } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDFVVbAjiedl5jdYwwb7nMNhcVCM-cYIfY",
  authDomain: "nextjs-travel-blog.firebaseapp.com",
  projectId: "nextjs-travel-blog",
  storageBucket: "nextjs-travel-blog.appspot.com",
  messagingSenderId: "385953620096",
  appId: "1:385953620096:web:c703289d373d190b8e8665"
};


initializeApp(firebaseConfig);
const db = getFirestore();
const blogsColRef = collection(db, "blogs");
const usersColRef = collection(db, "users");

const auth = getAuth();

const storage = getStorage();

///AUTH FUNCTIONS

const createAccount = (values) => {
  createUserWithEmailAndPassword(auth, values.email, values.password)
  .then((cred) => {
    localStorage.setItem("user", cred.user.uid);
  })
  .catch(err => {
    console.log(err.message)
  
  })
}

const signUserOut = () => {
  signOut(auth)
  .then(() => {
  })
  .catch((err) => {
    console.log(err)
  })
}
 

const signUserIn = (values) => {
  signInWithEmailAndPassword(auth, values.email, values.password)
  .then((cred) => {
    localStorage.setItem("user", cred.user.uid);
    
  })
  .catch((err) => {
  })
}


///DB FUNCTIONS FOR BLOGS

const addBlog = (blog) => {
  addDoc(blogsColRef, {
            creatorId : blog.creatorId,
            blogId : blog.blogId,
            title : blog.title,
            description : blog.description,
            image : blog.image
             
  } ) 
}

const deleteBlog = (blog) => {
  const docRef = doc(db, "blogs", blog.docId);
  deleteDoc(docRef);
}

const updateBlog = (docId, updates) => {
  const docRef = doc(db, "blogs", docId);
  updateDoc(docRef, updates)
}

/// DB FUNCTIONS FOR USERS

const addUserProfileInfo = (user) => {
    addDoc(usersColRef, {
      userId : user.userId,
      username : user.username,
      userDescription : user.userDescription,
      profilePicture : user.profilePicture          
    } ) 
  
}

const updateProfile = (docId, updates) => {
  const docRef = doc(db, "users", docId);
  updateDoc(docRef, updates)
}




export {createAccount, signUserOut, signUserIn, auth, blogsColRef,
        addBlog, deleteBlog, updateBlog, addUserProfileInfo, usersColRef,
        updateProfile, storage}