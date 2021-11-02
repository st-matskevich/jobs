import './App.scss';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import { useFirebaseAuthState } from "./api/firebase";

import LoginPage from './components/LoginPage';
import HomeTabsNavigator from './components/HomeTabsNavigator';

function App() {
    const { loaded, user } = useFirebaseAuthState();

    return (
        <div className="App">
            <Router>
                {!loaded ?
                    <LoginPage loading={!loaded} /> :
                    <Switch>
                        <Route exact path="/">
                            {user ? <Redirect to="/tasks" /> : <LoginPage />}
                        </Route>
                        <Route path="/:section">
                            {user ? <HomeTabsNavigator /> : <Redirect to="/" />}
                        </Route>
                    </Switch>
                }
            </Router>
        </div>
    );
}

export default App;