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

    const [signedIn, setSignedIn] = useState(false);

    useEffect(() => {
        var unsubscirbeProfileUpdates = null;
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                user.profile = null;
                unsubscirbeProfileUpdates = firebase.firestore().collection("users").doc(user.uid)
                    .onSnapshot(function (doc) {
                        if (doc.exists)
                            user.profile = {
                                name: doc.data().name,
                                customer: doc.data().customer,
                            };
                        console.log("Current profile: ", user.profile);
                    });
                console.log("Current user uid: ", user.uid);
                console.log("Current user phone: ", user.phoneNumber);
            } else if (unsubscirbeProfileUpdates)
                unsubscirbeProfileUpdates();

            setSignedIn(user != null);
        });
    }, []);

    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route exact path="/">
                        {!signedIn ? <LoginRoute /> : <Redirect to="/tasks" />}
                    </Route>
                    <Route path="/:section">
                        {signedIn ? <MainRoute /> : <Redirect to="/" />}
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;