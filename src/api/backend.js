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
        profile: null,
        error: null
    });

    useEffect(() => {
        GetUserProfile()
            .then(response => {
                setState({ ...state, profile: response.data })
            })
            .catch(error => {
                console.log(error)
                setState({ ...state, profile: error.response.data })
            })
    }, []);

    return state
}

export default { useUserProfile, SetUserProfile }