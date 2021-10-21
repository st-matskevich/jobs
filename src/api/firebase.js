import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from 'react';
import config from "./firebase-config"

var firebase = null;

function InitializeApp() {
    firebase = initializeApp(config);
}

function GetApp() {
    return firebase;
}

function GetAuth() {
    return getAuth(firebase);
}

function useFirebaseAuthState() {
    const [state, setState] = useState({
        loaded: false,
        user: null
    });

    useEffect(() => {
        const unlisten = onAuthStateChanged(GetAuth(),
            user => {
                setState({ loaded: true, user: user });
            }
        );
        return () => {
            unlisten();
        }
    }, []);

    return state
}

export default { InitializeApp, GetApp, GetAuth, useFirebaseAuthState }