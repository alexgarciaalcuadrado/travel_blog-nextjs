import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword,  
  signOut,
  signInWithEmailAndPassword
} from "firebase/auth";
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
const colRef = collection(db, "users")
const auth = getAuth();


///AUTH FUNCTIONS

const createAccount = (values) => {
  createUserWithEmailAndPassword(auth, values.email, values.password)
  .then((cred) => {
    localStorage.setItem("user", cred.user.uid)
  })
  .catch(err => {
    console.log(err.message)
  
  })
}

const signUserOut = () => {
  signOut(auth)
  .then(() => {
    console.log("user sign out")

  })
  .catch((err) => {
    console.log(err)
  })
}
 

const signUserIn = (values) => {
  signInWithEmailAndPassword(auth, values.email, values.password)
  .then((cred) => {
    localStorage.setItem("user", cred.user.uid)
  })
  .catch((err) => {
  })
}


///DB FUNCTIONS

const addBlog = (blog) => {
  addDoc(colRef, {
            creatorId : blog.creatorId,
            blogId : blog.blogId,
            title : blog.title,
            description : blog.description,
            image : blog.image
             
  } ) 
}

const deleteBlog = (blog) => {
  const docRef = doc(db, "users", blog.docId);
  deleteDoc(docRef);
}

const updateBlog = (blog, updates) => {
  const docRef = doc(db, "users", blog.docId);
  updateDoc(docRef, updates)
}

export {createAccount, signUserOut, signUserIn, auth, colRef,
        addBlog, deleteBlog, updateBlog}