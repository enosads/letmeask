import {createContext, ReactNode, useState} from "react";
import {firebase} from "../services/firebase";

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

    const [user, setUser] = useState<User>();

    async function signInWithGoogle() {
        await getCredentials()
            .then(credential => saveUserState(credential.user));

        function getCredentials() {
            return firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
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

