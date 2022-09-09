import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useAppSelector } from './redux';

interface IRoute {
  path: string;
  exact: boolean;
  protected: boolean;
  render: JSX.Element;
}

interface IRouterProps {
  routes: IRoute[];
}

const Router: React.FC<IRouterProps> = ({ routes }) => {
  const userCredentialsId = useAppSelector(state => state.user.credentials._id);

  const isAuthenticated = (): boolean => {
    return !!userCredentialsId;
  };

  return (
    <BrowserRouter>
      <Switch>
        {routes.map((route, index) =>
          (route.protected === false || (route.protected === true && isAuthenticated() === true))
          ? <Route
            key={index}
            path={route.path}
            exact={route.exact}
            render={() => route.render}
          />
          : <Route
            key={index}
            path={route.path}
            exact={route.exact}
            render={() => <h1>403 Not Authorized!</h1>}
          />
        )}

        <Route component={() => <h1>404 Not Found!</h1>} />
      </Switch>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default Router;