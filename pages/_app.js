import 'bootstrap/dist/css/bootstrap.css';
import "../styles/mixin.scss";
import "../styles/variables.scss";
import "../styles/global.scss";
import { useEffect, Fragment } from "react";
import { AuthUserProvider } from "../auth/authUserProvider";
import Head from "next/head";
import Navbar from '../components/navbar/navbar';
import Footer from '../components/footer/footer';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    typeof document !== undefined ? require('bootstrap/dist/js/bootstrap') : null;
  }, []);
  
  return (
    <Fragment>
      <Head>
        <title>TravelPin</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,200;0,400;1,100;1,500&display=swap" rel="stylesheet"></link>
      </Head>
      <AuthUserProvider>
      <Navbar />
      <div className='layout'>
              <Component {...pageProps} />
              <Footer />
      </div>
      
      </AuthUserProvider>
    </Fragment>
  )
   
}

export default MyApp
