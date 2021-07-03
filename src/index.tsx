import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {
    App,
    Authentication,
    Monitor,
    Safeplace,
    SignOut,
    Profile,
    ResetPassword
} from './components';
import reportWebVitals from './reportWebVitals';
import Router from './Router';
import { Provider } from 'react-redux';
import { store, persistor } from './redux';
import { PersistGate } from 'redux-persist/integration/react';
import log from 'loglevel';

const routes = [
    { path: '/', exact: true, protected: false, render: <App /> },
    { path: '/login', exact: true, protected: false, render: <Authentication /> },
    { path: '/logout', exact: true, protected: false, render: <SignOut /> },
    { path: '/admin', exact: true, protected: true, render: <Monitor /> },
    { path: '/safeplace', exact: true, protected: true, render: <Safeplace /> },
    { path: '/profile', exact: true, protected: true, render: <Profile /> },
    { path: '/reset', exact: false, protected: false, render: <ResetPassword /> }
];

log.setLevel((process.env.REACT_APP_STAGE === "prod")
    ? log.levels.SILENT
    : log.levels.TRACE
);

ReactDOM.render(
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <Router routes={routes} />
        </PersistGate>
    </Provider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
