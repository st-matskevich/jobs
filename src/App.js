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

  const [user, setUser] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      setUser(user);
    });
  }, []);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            {!user ? <LoginRoute /> : <Redirect to="/tasks" />}
          </Route>
          <Route path="/:section">
            {user ? <MainRoute /> : <Redirect to="/" />}
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;