/* import '../styles/globals.css'
 */
import { AuthUserProvider } from "../auth/authUserProvider"

function MyApp({ Component, pageProps }) {
  return <AuthUserProvider><Component {...pageProps} /></AuthUserProvider>
   
}

export default MyApp
