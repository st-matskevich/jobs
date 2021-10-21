import axios from 'axios';
import firebase from './firebase';
import { useState, useEffect } from 'react';

const URL_BASE = process.env.REACT_APP_BACKEND_URL

function GetUserProfile() {
    return firebase.GetAuth().currentUser.getIdToken()
        .then(idToken => {
            return axios.get(new URL('profile', URL_BASE), {
                headers: {
                    Authorization: 'Bearer ' + idToken
                }
            })
        });
}

function SetUserProfile(profile) {
    return firebase.GetAuth().currentUser.getIdToken()
        .then(idToken => {
            return axios.post(new URL('profile', URL_BASE), profile, {
                headers: {
                    Authorization: 'Bearer ' + idToken
                }
            })
        });
}

function useUserProfile() {
    const [state, setState] = useState({
        data: null,
        error: null
    });

    useEffect(() => {
        GetUserProfile()
            .then(response => {
                setState(s => { return { ...s, data: response.data } })
            })
            .catch(error => {
                console.log(error)
                setState(s => { return { ...s, error: error.response?.data } })
            })
    }, []);

    return { ...state, loading: state.data == null && state.error == null }
}

function GetTasksFeed() {
    return firebase.GetAuth().currentUser.getIdToken()
        .then(idToken => {
            return axios.get(new URL('tasks', URL_BASE), {
                headers: {
                    Authorization: 'Bearer ' + idToken
                }
            })
        });
}

function CreateTask(task) {
    return firebase.GetAuth().currentUser.getIdToken()
        .then(idToken => {
            return axios.post(new URL('tasks', URL_BASE), task, {
                headers: {
                    Authorization: 'Bearer ' + idToken
                }
            })
        });
}

//TODO: add pagination
function useTasksFeed() {
    const [state, setState] = useState({
        data: null,
        error: null
    });

    useEffect(() => {
        GetTasksFeed()
            .then(response => {
                setState(s => { return { ...s, data: response.data } })
            })
            .catch(error => {
                console.log(error)
                setState(s => { return { ...s, error: error.response?.data } })
            })
    }, []);

    return { ...state, loading: state.data == null && state.error == null }
}

export default { useUserProfile, SetUserProfile, useTasksFeed, CreateTask }