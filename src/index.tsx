import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App';
import Authentication from './components/Authentication/Authentication';
import reportWebVitals from './reportWebVitals';
import Router from './Router';
import { Provider } from 'react-redux';
import { store } from './redux';

const routes = [
    { path: '/', exact: true, render: <App /> },
    { path: '/login', exact: true, render: <Authentication /> }
];

ReactDOM.render(
    <Provider store={store}>
        <Router routes={routes} />
    </Provider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
