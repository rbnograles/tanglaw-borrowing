import { createContext, useContext, useEffect, useState } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updatePassword,
    updateEmail
} from 'firebase/auth';
import { auth } from '../firebase';

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState({});

    const createUser = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const signinUser = (email, password) =>  {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const resetPassword = (newPassword) => {
        return updatePassword(auth.currentUser, newPassword);
    }

    const resetEmail = (newEmail) => {
        return updateEmail(auth.currentUser, newEmail);
    }

    const logout = () => {
        localStorage.removeItem('uid');
        localStorage.removeItem('userType');
        return signOut(auth)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <UserContext.Provider value={{ createUser, user, logout, signinUser, resetPassword, resetEmail }}>
            {children}
        </UserContext.Provider>
    );
};

export const UserAuth = () => {
  return useContext(UserContext);
};