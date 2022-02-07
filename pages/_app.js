import 'bootstrap/dist/css/bootstrap.css';
import "../styles/mixin.scss";
import "../styles/variables.scss";
import "../styles/global.scss";
import { useEffect, Fragment } from "react";
import { AuthUserProvider } from "../auth/authUserProvider";
import Head from "next/head";
import Navbar from '../components/navbar/navbar';

//Fonts
//https://fonts.google.com/specimen/Raleway#standard-styles
//Thin 100 italic
//Extra-light 200
//Regular 400
//Medium 500 italic

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);
  
  return (
    <Fragment>
      <Head>
        <title>TravelPin</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,200;0,400;1,100;1,500&display=swap" rel="stylesheet"></link>
      </Head>
      <AuthUserProvider>
      <Navbar />
      <div className='layout'>
              <Component {...pageProps} />
      </div>
      </AuthUserProvider>
    </Fragment>
  )
   
}

export default MyApp
