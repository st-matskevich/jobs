import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from 'react';

var firebase = null;

var config = {
    apiKey: "AIzaSyB2ayfhYcYE8NVM_7OQCoVCCdySLksLqtQ",
    authDomain: "jobs-2d511.firebaseapp.com",
    databaseURL: "https://jobs-2d511.firebaseio.com",
    projectId: "jobs-2d511",
    storageBucket: "jobs-2d511.appspot.com",
    messagingSenderId: "133221531100",
    appId: "1:133221531100:web:bd88985dea10dd74596319",
    measurementId: "G-4E5J3ND6SF"
};

export function InitializeApp() {
    firebase = initializeApp(config);
}

export function GetApp() {
    return firebase;
}

export function GetAuth() {
    return getAuth(firebase);
}

export function useFirebaseAuthState() {
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