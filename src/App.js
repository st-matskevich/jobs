import './App.scss';
import {
    Switch,
    Route,
    Redirect,
    useLocation
} from "react-router-dom";
import { useFirebaseAuthState, useAnalyticsRouterEvents } from "./api/firebase";

import LoginPage from './components/LoginPage';
import HomeTabsNavigator from './components/HomeTabsNavigator';

function App() {
    const { loaded, user } = useFirebaseAuthState();

    const location = useLocation();
    useAnalyticsRouterEvents(location);

    return (
        <div className="App">
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
        </div>
    );
}

export default App;