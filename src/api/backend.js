import axios from 'axios';
import { GetAuth } from './firebase';
import { useState, useEffect } from 'react';

const URL_BASE = process.env.REACT_APP_BACKEND_URL

export const FEED_SCOPE = {
    NOT_ASSIGNED: "NOT_ASSIGNED",
    CUSTOMER: "CUSTOMER",
    DOER: "DOER"
}

export const NOTIFICATIONS_TYPES = {
    TASK_CLOSE: 0,
    NEW_REPLY: 10000
}

function GetUserProfile() {
    return GetAuth().currentUser.getIdToken()
        .then(idToken => {
            return axios.get(`${URL_BASE}/profile`, {
                headers: {
                    Authorization: 'Bearer ' + idToken
                }
            })
        });
}

export function SetUserProfile(profile) {
    return GetAuth().currentUser.getIdToken()
        .then(idToken => {
            return axios.post(`${URL_BASE}/profile`, profile, {
                headers: {
                    Authorization: 'Bearer ' + idToken
                }
            })
        });
}

export function useUserProfile() {
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

function GetTasksFeed(scope, query) {
    return GetAuth().currentUser.getIdToken()
        .then(idToken => {
            return axios.get(`${URL_BASE}/tasks`, {
                params: {
                    scope: scope,
                    query: query
                },
                headers: {
                    Authorization: 'Bearer ' + idToken
                }
            })
        });
}

function GetTask(taskID) {
    return GetAuth().currentUser.getIdToken()
        .then(idToken => {
            return axios.get(`${URL_BASE}/tasks/${taskID}`, {
                headers: {
                    Authorization: 'Bearer ' + idToken
                }
            })
        });
}

export function CreateTask(task) {
    return GetAuth().currentUser.getIdToken()
        .then(idToken => {
            return axios.post(`${URL_BASE}/tasks`, task, {
                headers: {
                    Authorization: 'Bearer ' + idToken
                }
            })
        });
}

//TODO: add pagination
export function useTasksFeed(scope, query) {
    const [state, setState] = useState({
        data: null,
        error: null,
        loading: false
    });

    useEffect(() => {
        setState(s => ({ ...s, loading: true }));
        const timeout = setTimeout(() =>
            GetTasksFeed(scope, query)
                .then(response => {
                    setState({ data: response.data, loading: false, error: null })
                })
                .catch(error => {
                    console.log(error)
                    setState({ error: error.response?.data, loading: false, data: null })
                })
            , 300)

        return () => clearTimeout(timeout)
    }, [scope, query]);

    return state
}

export function useTask(taskID) {
    const [state, setState] = useState({
        data: null,
        error: null
    });

    useEffect(() => {
        GetTask(taskID)
            .then(response => {
                setState(s => { return { ...s, data: response.data } })
            })
            .catch(error => {
                console.log(error)
                setState(s => { return { ...s, error: error.response?.data } })
            })
    }, [taskID]);

    return { ...state, loading: state.data == null && state.error == null }
}

//TODO: add pagination
function GetReplies(taskID) {
    return GetAuth().currentUser.getIdToken()
        .then(idToken => {
            return axios.get(`${URL_BASE}/tasks/${taskID}/replies`, {
                headers: {
                    Authorization: 'Bearer ' + idToken
                }
            })
        });
}

export function CreateReply(taskID, reply) {
    return GetAuth().currentUser.getIdToken()
        .then(idToken => {
            return axios.post(`${URL_BASE}/tasks/${taskID}/replies`, reply, {
                headers: {
                    Authorization: 'Bearer ' + idToken
                }
            })
        });
}

export function useReplies(taskID) {
    const [state, setState] = useState({
        data: null,
        error: null
    });

    useEffect(() => {
        GetReplies(taskID)
            .then(response => {
                setState(s => { return { ...s, data: response.data } })
            })
            .catch(error => {
                console.log(error)
                setState(s => { return { ...s, error: error.response?.data } })
            })
    }, [taskID]);

    return { ...state, loading: state.data == null && state.error == null }
}

export function CloseTask(taskID, userID) {
    return GetAuth().currentUser.getIdToken()
        .then(idToken => {
            return axios.post(`${URL_BASE}/tasks/${taskID}/close`, {
                id: userID
            }, {
                headers: {
                    Authorization: 'Bearer ' + idToken
                }
            })
        });
}

export function HideReply(taskID, replyID) {
    return GetAuth().currentUser.getIdToken()
        .then(idToken => {
            return axios.delete(`${URL_BASE}/tasks/${taskID}/replies/${replyID}`, {
                headers: {
                    Authorization: 'Bearer ' + idToken
                }
            })
        });
}

//TODO: add pagination
function GetNotifications() {
    return GetAuth().currentUser.getIdToken()
        .then(idToken => {
            return axios.get(`${URL_BASE}/notifications`, {
                headers: {
                    Authorization: 'Bearer ' + idToken
                }
            })
        });
}

export function useNotifications() {
    const [state, setState] = useState({
        data: null,
        error: null
    });

    useEffect(() => {
        GetNotifications()
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

export function SearchTags(query) {
    if (query.length === 0)
        return Promise.resolve([]);

    return GetAuth().currentUser.getIdToken()
        .then(idToken => {
            return axios.get(`${URL_BASE}/tags`, {
                params: {
                    query: query
                },
                headers: {
                    Authorization: 'Bearer ' + idToken
                }
            })
        });
}

export function useTags(query) {
    const [state, setState] = useState({
        data: null,
        error: null,
        loading: false
    });

    useEffect(() => {
        setState(s => ({ ...s, loading: true }));
        const timeout = setTimeout(() =>
            SearchTags(query)
                .then(response => {
                    setState({ data: response.data, loading: false, error: null })
                })
                .catch(error => {
                    console.log(error)
                    setState({ error: error.response?.data, loading: false, data: null })
                })
            , 300)

        return () => clearTimeout(timeout)
    }, [query]);

    return state
}