import {useRouter} from "next/router";
import { Formik } from 'formik';
import { createAccount, signUserIn } from "../../firebase";
import Navbar from "../../components/navbar/navbar";

const Login = () => {
    const router = useRouter();

    return (
        <div>
        <Navbar />
        <div>
        <h1>Sign in</h1>
        <Formik
            initialValues={{ password: '', email: "" }}
            validate={values => {
                const errors = {};
                if (!values.password) {
                    errors.password = 'Required';
                }else if (!values.email) {
                    errors.email = 'Required';
                } else if (
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                errors.email = 'Invalid email address';
                }
            }}
            onSubmit={(values) => {
                signUserIn(values);
                router.push("/")
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
         <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
             type="email"
             name="email"
             onChange={handleChange}
             onBlur={handleBlur}
             value={values.email}
            />
            {errors.email && touched.email && errors.email}
            <label>Password</label>
            <input
             type="password"
             name="password"
             onChange={handleChange}
             onBlur={handleBlur}
             value={values.password}
            />
            {errors.password && touched.password && errors.password}
            <button type="submit">
             Submit
            </button>
         </form>
        )}
        </Formik>


        <h1>Don't have an account? Create one!</h1>
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
                router.push("/")
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
         <form onSubmit={handleSubmit}>
         <label>Email</label>
           <input
             type="email"
             name="email"
             onChange={handleChange}
             onBlur={handleBlur}
             value={values.email}
           />
           {errors.email && touched.email && errors.email}
            <label>Password</label>
           <input
             type="password"
             name="password"
             onChange={handleChange}
             onBlur={handleBlur}
             value={values.password}
           />
           {errors.password && touched.password && errors.password}
           <button type="submit">
             Submit
           </button>
         </form>
        )}
        </Formik>
        </div>
        </div>
    )
}

export default Login;