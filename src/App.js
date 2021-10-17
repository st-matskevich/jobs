import './App.scss';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import firebase from "./api/firebase";

import LoginRoute from './components/LoginRoute';
import MainRoute from './components/MainRoute';

function App() {
    const { loaded, user } = firebase.useFirebaseAuthState();

    return (
        <div className="App">
            <Router>
                {!loaded ?
                    <LoginRoute loading={!loaded} /> :
                    <Switch>
                        <Route exact path="/">
                            {user ? <Redirect to="/tasks" /> : <LoginRoute />}
                        </Route>
                        <Route path="/:section">
                            {user ? <MainRoute /> : <Redirect to="/" />}
                        </Route>
                    </Switch>
                }
            </Router>
        </div>
    );
}

export default App;