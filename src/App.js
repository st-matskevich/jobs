import './App.scss';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { UpdateProfile } from "./actions/actions";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import 'firebase/compat/firestore';

import LoginRoute from './components/LoginRoute';
import MainRoute from './components/MainRoute';

function App() {

    const [loaded, setLoaded] = useState(false);
    const [fetchedUser, setFetchedUser] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        var unsubscirbeProfileUpdates = null;
        firebase.auth().onAuthStateChanged(function (user) {
            setLoaded(true);
            setFetchedUser(false);

            if (user) {
                dispatch(UpdateProfile(null));
                unsubscirbeProfileUpdates = firebase.firestore().collection("users").doc(user.uid)
                    .onSnapshot(function (doc) {
                        if (doc.exists)
                            dispatch(UpdateProfile({
                                name: doc.data().name,
                                customer: doc.data().customer,
                                reference: doc.ref
                            }));
                        setFetchedUser(true);
                    });
                console.log("Current user uid: ", user.uid);
                console.log("Current user phone: ", user.phoneNumber);
            } else if (unsubscirbeProfileUpdates)
                unsubscirbeProfileUpdates();
        });
    }, []);

    return (
        <div className="App">
            <Router>
                {!loaded || (firebase.auth().currentUser && !fetchedUser) ?
                    <LoginRoute loading={!loaded || (firebase.auth().currentUser && !fetchedUser)} /> :
                    <Switch>
                        <Route exact path="/">
                            {firebase.auth().currentUser ? <Redirect to="/tasks" /> : <LoginRoute loading={!loaded} />}
                        </Route>
                        <Route path="/:section">
                            {firebase.auth().currentUser ? <MainRoute /> : <Redirect to="/" />}
                        </Route>
                    </Switch>
                }
            </Router>
        </div>
    );
}

export default App;