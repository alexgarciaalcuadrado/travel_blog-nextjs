import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signOut,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential
} from "firebase/auth";
import { getStorage} from "firebase/storage";
import {
  getFirestore, 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  query, 
  where,
  onSnapshot 
} from 'firebase/firestore';


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
const passColRef = collection(db, "hashedPass");

const auth = getAuth();

const storage = getStorage();

///AUTH FUNCTIONS

const signUserOut = () => {
  signOut(auth)
  .then(() => {
  })
  .catch((err) => {
    console.log(err)
  })
};

const deleteSignedUser = async (password, passDocId) => {
  const credential  = EmailAuthProvider.credential(
    auth.currentUser.email,
    password 
    );
  const result = await reauthenticateWithCredential(
    auth.currentUser, 
    credential
    ); 
 
    deleteUser(result.user)
    .then(() =>{ 
      const userRef = doc(db, "users", result.user.uid);
      deleteDoc(userRef);

      const passRef = doc(db, "hashedPass", passDocId);
      deleteDoc(passRef);

      localStorage.removeItem("user");  
  
      const qBlogs = query(blogsColRef, where("creatorId", "==", result.user.uid));
      onSnapshot(qBlogs, (snapshot) => { 
      const blog = snapshot.docs.map((doc) => {return {...doc.data(), docId : doc.id }});
      if (blog.length){
        blog.map((blog) => {
          const docRef = doc(db, "blogs", blog.docId);
          deleteDoc(docRef);
        })
        
      }
      });
    })
    .catch(err => console.log(err.message));
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

const deleteBlog = (docId) => {
  const docRef = doc(db, "blogs", docId);
  deleteDoc(docRef);
}

const updateBlog = (docId, updates) => {
  const docRef = doc(db, "blogs", docId);
  updateDoc(docRef, updates);
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
  updateDoc(docRef, updates);
}






export {signUserOut, passColRef,auth, blogsColRef, addBlog, deleteBlog, updateBlog, addUserProfileInfo, 
  usersColRef,updateProfile, storage, deleteSignedUser}