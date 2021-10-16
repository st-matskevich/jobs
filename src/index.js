import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';

import firebase from "firebase/compat/app";
import "firebase/compat/analytics"

import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers/reducer'

var firebaseConfig = {
  apiKey: "AIzaSyB2ayfhYcYE8NVM_7OQCoVCCdySLksLqtQ",
  authDomain: "jobs-2d511.firebaseapp.com",
  databaseURL: "https://jobs-2d511.firebaseio.com",
  projectId: "jobs-2d511",
  storageBucket: "jobs-2d511.appspot.com",
  messagingSenderId: "133221531100",
  appId: "1:133221531100:web:bd88985dea10dd74596319",
  measurementId: "G-4E5J3ND6SF"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

const store = createStore(reducer)

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
