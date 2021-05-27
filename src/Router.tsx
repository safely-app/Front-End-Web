import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { RootState } from './redux';

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
    const userCredientialsId = useSelector((state: RootState) => state.user.credentials._id);

    const isAuthenticated = (): boolean => {
        return !!userCredientialsId;
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
                    : <Route key={index} component={() => <h1>403 Not Authorized!</h1>} />
                )}

                <Route component={() => <h1>404 Not Found!</h1>} />
            </Switch>
        </BrowserRouter>
    );
}

export default Router;