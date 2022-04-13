import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from 'react';
import { getAnalytics, logEvent, setUserProperties } from "firebase/analytics";

var firebase = null;
var analytics = null;

const config = {
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
    analytics = getAnalytics(firebase);
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

export function useAnalyticsRouterEvents(location) {
    useEffect(() => {
        const page_path = location.pathname + location.search;
        logEvent(analytics, 'page_view', {
            page_location : page_path
        });
    }, [location]);
}

export const ANALYTICS_EVENTS = {
    CREATE_TASK: "create_task",
    ADD_REPLY: "add_reply",
    LIKE_TASK: "like_task",
    CLOSE_TASK: "close_task",
    UPDATE_PROFILE: "update_profile",
    CHANGE_TASKS_FILTER: "change_tasks_filter"
}

export function logAnalyticsEvent(event, payload) {
    logEvent(analytics, event, payload);
}

export function setAnalyticsProperties(properties) {
    setUserProperties(analytics, properties);
}