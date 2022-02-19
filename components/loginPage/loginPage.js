import { useEffect, useState } from "react";
import {useRouter} from "next/router";
import { Formik } from 'formik';
import {  
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
  } from "firebase/auth";
import { addDoc } from "firebase/firestore"; 
import {auth, passColRef} from "../../firebase";
import {encryptPassword} from "../../crypto";
import styles from "../loginPage/loginPage.module.scss";


const Login = () => {
    const router = useRouter();
    const [userId, setUserId] = useState("");
    const [loginErrorMessage, setLoginErrorMessage] = useState("");
    const [createAccountErrorMessage, setCreateAccountErrorMessage] = useState("");
    const [passwordToHash, setPasswordToHash] = useState("");

    useEffect(() => {
        let isMounted = true;
        if(isMounted === true){
            
            if(typeof window !== "undefined") {
                if(localStorage.getItem("user")){
                    setUserId(localStorage.getItem("user"))
                }
            }
            
            if(passwordToHash !== ""){
                const hashedPassword = encryptPassword(passwordToHash);
                addDoc(passColRef, {
                    userId : userId,
                    password : hashedPassword
                });
            }

        }
        return () => {
            clearTimeout()
            isMounted = false;
        };
        
    }, [passwordToHash, userId]);


    return (
        <div className={styles.container}>
        <div className={styles.login}>
        <div className={styles.login__forms}>
        <h1 className="gradient__green__underline">Sign in</h1>
        <Formik
           initialValues={{ email: '', password: ''}}
           validate={values => {
               const errors = {};
               if (!values.password) {
                   errors.password = 'Required';
               } else if (!values.email) {
                   errors.email = 'Required';
               } else if (
                   !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
               ) {
               errors.email = 'Invalid email address';
               }
               return errors;
           }}
            onSubmit={(values) => {
                signInWithEmailAndPassword(auth, values.email, values.password)
                .then((cred) => {
                    setUserId(cred.user.uid);
                    localStorage.setItem("user", cred.user.uid);
                    setPasswordToHash(values.password);
                    router.push("/");
                })
                .catch((err) => {
                    console.log(err.message)
                    if(err.message === "Firebase: Error (auth/user-not-found)."){
                        setLoginErrorMessage("This account doesn't exist.")
                    } else if(err.message === "Firebase: Error (auth/wrong-password)."){
                        setLoginErrorMessage("The password is incorrect");
                    }
                })
            }}
        > 
        {({
         values,
         errors,
         touched,
         handleChange,
         handleBlur,
         handleSubmit
        }) => (
         <form onSubmit={handleSubmit} autoComplete="off">
             <div className={`mb-3 ${styles.login__box}`}> 
                <label for="emailLogin" className="form-label">Email</label>
                <input
                 id="emailLogin"
                 className={`form-control ${styles.login__input}`}
                 aria-describedby="emailError"
                 type="email"
                 name="email"
                 onChange={handleChange}
                 onBlur={handleBlur}
                 value={values.email}
                />
                <div class="form-text" id="emailError">{errors.email && touched.email && errors.email}</div>
                
             </div>
            
            <div className={`mb-3 ${styles.login__box}`}> 
                <label for="passwordLogin" className="form-label">Password</label>
                <input 
                 id="passwordLogin"
                 className={`form-control ${styles.login__input}`}
                 aria-describedby="passError"
                 type="password"
                 name="password"
                 onChange={handleChange}
                 onBlur={handleBlur}
                 value={values.password}
                />
                <div class="form-text" id="passError">{errors.password && touched.password && errors.password}</div>
                
             </div>
            {loginErrorMessage}
            <br />
            <button className="btn btn-success" type="submit">
             Submit
            </button>
         </form>
        )}
        </Formik>
        </div>

        <div className={styles.login__forms}>
        <h1 className="gradient__green__underline">Don't have an account? Create one!</h1>
        <Formik
            initialValues={{ email: '', password: ''}}
            validate={values => {
                const errors = {};
                if (!values.password) {
                    errors.password = 'Required';
                } else if (!values.email) {
                    errors.email = 'Required';
                } else if (
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                errors.email = 'Invalid email address';
                }
                return errors;
            }}
            onSubmit={(values) => {
                createUserWithEmailAndPassword(auth, values.email, values.password)
                .then((cred) => {
                  localStorage.setItem("user", cred.user.uid);
                  router.push(`/profile/${userId}`);
                })
                .catch(err => {
                  console.log(err.message);
                  if(err.message === "Firebase: Error (auth/email-already-in-use)."){
                    setCreateAccountErrorMessage("There is an existing account with this email")
                  } else if(err.message === "Firebase: Password should be at least 6 characters (auth/weak-password)."){
                      setCreateAccountErrorMessage("This is a weak password, please make it at least 6 characters long");
                  }
                });
                
            }}
        >
        {({
         values,
         errors,
         touched,
         handleChange,
         handleBlur,
         handleSubmit
        }) => (
            <form onSubmit={handleSubmit} autoComplete="off">
            <div className={`mb-3 ${styles.login__box}`}> 
               <label for="emailCreate" className="form-label">Email</label>
               <input
                id="emailCreate"
                className={`form-control ${styles.login__input}`}
                aria-describedby="emailError"
                type="email"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
               />
               <div class="form-text" id="emailError">{errors.email && touched.email && errors.email}</div>
               
            </div>
           
           <div className={`mb-3 ${styles.login__box}`}> 
               <label for="passwordCreate" className="form-label">Password</label>
               <input 
                id="passwordCreate"
                className={`form-control ${styles.login__input}`}
                aria-describedby="passError"
                type="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
               />
               <span class="form-text">
                    Must be at least 6 characters long.
               </span>
               <div class="form-text" id="passError">{errors.password && touched.password && errors.password}</div>
            </div>
           {createAccountErrorMessage}
           <br />
           <button className="btn btn-success" type="submit">
            Submit
           </button>
        </form>
        )}
        </Formik>
        </div>
        </div>
    </div>
    )
}

export default Login;