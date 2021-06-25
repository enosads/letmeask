import {AppProps} from "next/app";
import "../styles/global.scss";
import {AuthProvider} from "../contexts/AuthContext";
import 'react-toastify/dist/ReactToastify.css';
import {ThemeProvider} from "../contexts/ThemeContext";

function MyApp({Component, pageProps}: AppProps) {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Component  {...pageProps} />
            </AuthProvider>
        </ThemeProvider>
    );
}

export default MyApp
