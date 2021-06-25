import {createContext, ReactNode, useEffect, useState} from "react";
import {auth, firebase} from "../services/firebase";

type User = {
    id: string,
    name: string,
    avatar: string,
}

type AuthContextType = {
    signInWithGoogle: () => Promise<void>,
    user: User | undefined,
    setUser: (user: User) => void,
    saveUserState: (user: firebase.User) => void
}


interface AuthProviderProps {
    children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType);


export function AuthProvider({children}: AuthProviderProps) {

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            saveUserState(user);
        });

        return () => unsubscribe();
    }, []);


    const [user, setUser] = useState<User>();

    async function signInWithGoogle() {
        await getCredentials()
            .then(credential => saveUserState(credential.user));

        function getCredentials() {
            return auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
        }
    }

    function saveUserState(user: firebase.User) {
        if (user) {
            const {displayName, photoURL, uid} = user;

            if (!displayName || !photoURL) {
                throw new Error('Missing information from Google Account.');
            }

            setUser({
                    id: uid,
                    name: displayName,
                    avatar: photoURL
                }
            )
        }
    }

    return (
        <AuthContext.Provider value={{user, setUser, signInWithGoogle, saveUserState}}>
            {children}
        </AuthContext.Provider>
    )
}

