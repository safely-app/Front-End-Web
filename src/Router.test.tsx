import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './redux';
import Router from './Router';

test('renders Router', () => {
  render(
    <Provider store={store}>
      <Router routes={[]} />
    </Provider>
  );
});

test('renders Router with routes', () => {
  render(
    <Provider store={store}>
      <Router routes={[
        { path: '/exact-access', exact: true, protected: false, render: <div /> },
        { path: '/not-exact-access', exact: false, protected: false, render: <div /> },
        { path: '/exact-protected', exact: true, protected: true, render: <div /> },
        { path: '/not-exact-protected', exact: false, protected: true, render: <div /> }
      ]} />
    </Provider>
  );
});