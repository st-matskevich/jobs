import axios from 'axios';
import { GetAuth } from './firebase';
import { useState, useEffect, useMemo } from 'react';

const URL_BASE = process.env.REACT_APP_BACKEND_URL

export const FEED_SCOPE = {
    NOT_ASSIGNED: "NOT_ASSIGNED",
    CUSTOMER: "CUSTOMER",
    DOER: "DOER",
    LIKED: "LIKED"
}

export const NOTIFICATIONS_TYPES = {
    TASK_CLOSE: 0,
    NEW_REPLY: 10000
}

export function GetUserProfile() {
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

function GetTasksFeed(deps) {
    const { scope, query } = deps;
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

function GetTask(deps) {
    const { taskID } = deps;
    return GetAuth().currentUser.getIdToken()
        .then(idToken => {
            return axios.get(`${URL_BASE}/tasks/${taskID}`, {
                headers: {
                    Authorization: 'Bearer ' + idToken
                }
            })
        });
}

export function LikeTask(taskID, value) {
    return GetAuth().currentUser.getIdToken()
    .then(idToken => {
        return axios.post(`${URL_BASE}/tasks/${taskID}/like`, null, {
            params: {
                value: value
            },
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
    const deps = useMemo(() => ({ scope, query }), [scope, query])
    return useAPI(GetTasksFeed, deps)
}

export function useTask(taskID) {
    const deps = useMemo(() => ({ taskID }), [taskID])
    return useAPI(GetTask, deps)
}

//TODO: add pagination
function GetReplies(deps) {
    const { taskID } = deps;
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
    const deps = useMemo(() => ({ taskID }), [taskID])
    return useAPI(GetReplies, deps)
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
    return useAPI(GetNotifications)
}

export function SearchTags(deps) {
    const { query } = deps;
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
    const deps = useMemo(() => ({ query }), [query])
    return useAPI(SearchTags, deps, true)
}

function debounceCall(action) {
    const timeout = setTimeout(action, 300);
    return () => clearTimeout(timeout)
}

export function useAPI(promise, deps, debounce) {
    const [state, setState] = useState({
        data: null,
        error: null,
        loading: true
    });

    useEffect(() => {
        setState(s => ({ ...s, loading: true }));
        const fetchAPI = () => {
            promise(deps)
                .then(response => {
                    setState({ data: response.data, loading: false, error: null })
                })
                .catch(error => {
                    console.log(error)
                    setState({ error: error.response?.data, loading: false, data: null })
                })
        }

        return debounce ? debounceCall(fetchAPI) : fetchAPI();
    }, [promise, deps, debounce]);

    return state
}