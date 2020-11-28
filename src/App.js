import './App.scss';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import { useState, useEffect } from 'react';
import firebase from "firebase";
import LoginRoute from './components/LoginRoute'
import MainRoute from './components/MainRoute'

function App() {

    const [loaded, setLoaded] = useState(false);
    const [fetchedUser, setFetchedUser] = useState(false);

    useEffect(() => {
        var unsubscirbeProfileUpdates = null;
        firebase.auth().onAuthStateChanged(function (user) {
            setLoaded(true);
            setFetchedUser(false);
            if (user) {
                user.profile = null;
                unsubscirbeProfileUpdates = firebase.firestore().collection("users").doc(user.uid)
                    .onSnapshot(function (doc) {
                        if (doc.exists)
                            user.profile = {
                                name: doc.data().name,
                                customer: doc.data().customer,
                            };
                        setFetchedUser(true);
                        console.log("Current profile: ", user.profile);
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
                <Switch>
                    <Route exact path="/">
                        {fetchedUser ? <Redirect to="/tasks" /> : <LoginRoute loading={!loaded} />}
                    </Route>
                    <Route path="/:section">
                        {fetchedUser ? <MainRoute /> : <Redirect to="/" />}
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;