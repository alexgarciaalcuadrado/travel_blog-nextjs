import { useEffect, useState } from "react";
import {useRouter} from "next/router";
import { Formik } from 'formik';
import { createAccount, signUserIn } from "../../firebase";
import styles from "../loginPage/loginPage.module.scss";


const Login = () => {
    const router = useRouter();
    const [userId, setUserId] = useState("");
    const [accountCreated, setAccountCreated] = useState(false);
    const [accountLogged, setAccountLogged] = useState(false);


    useEffect(() => {
        let isMounted = true;
        if(isMounted === true){
            
            if(typeof window !== "undefined") {
                if(localStorage.getItem("user")){
                    setUserId(localStorage.getItem("user"))
                }
            }
            if(accountCreated === true){
                    setTimeout(() => {
                        router.push("/profile");
                    }, 2000); 
            }  
            if (accountLogged === true){
                    setTimeout(() =>{ 
                        router.push("/");
                    }, 2000);
                } else {
                    console.log("user does not exist");
                }
                
            }
        
        
        return () => {
            clearTimeout()
            isMounted = false;
        };
    }, [accountLogged, accountCreated]);


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
                signUserIn(values);
                setAccountLogged(true);
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
                <label for="email" className="form-label">Email</label>
                <input
                 id="email"
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
                <label for="password" className="form-label">Password</label>
                <input 
                 id="password"
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
                createAccount(values);
                setAccountCreated(true)
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
               <label for="email" className="form-label">Email</label>
               <input
                id="email"
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
               <label for="password" className="form-label">Password</label>
               <input 
                id="password"
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