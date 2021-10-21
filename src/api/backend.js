import axios from 'axios';
import firebase from './firebase';
import { useState, useEffect } from 'react';

function GetUserProfile() {
    return firebase.GetAuth().currentUser.getIdToken()
        .then(idToken => {
            return axios.get('http://localhost:10000/profile', {
                headers: {
                    Authorization: 'Bearer ' + idToken
                }
            })
        });
}

function SetUserProfile(profile) {
    return firebase.GetAuth().currentUser.getIdToken()
        .then(idToken => {
            return axios.post('http://localhost:10000/profile', profile, {
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
            return axios.get('http://localhost:10000/tasks', {
                headers: {
                    Authorization: 'Bearer ' + idToken
                }
            })
        });
}

function CreateTask(task) {
    return firebase.GetAuth().currentUser.getIdToken()
        .then(idToken => {
            return axios.post('http://localhost:10000/tasks', task, {
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