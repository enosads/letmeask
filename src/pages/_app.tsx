import {AppProps} from "next/app";
import "../styles/global.scss";
import {AuthProvider} from "../contexts/AuthContext";
import 'react-toastify/dist/ReactToastify.css';


function MyApp({Component, pageProps}: AppProps) {
    return (
        <AuthProvider>
            <Component {...pageProps} />
        </AuthProvider>
    );
}

export default MyApp
