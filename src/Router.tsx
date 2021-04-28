import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

interface IRoute {
    path: string;
    exact: boolean;
    render: JSX.Element;
}

interface IRouterProps {
    routes: IRoute[];
}

const Router: React.FC<IRouterProps> = ({ routes }) => {
    return (
        <BrowserRouter>
            <Switch>
                {routes.map(route => <Route path={route.path} exact={route.exact} render={() => route.render} />)}
                <Route component={() => <h1>404 Not Found!</h1>} />
            </Switch>
        </BrowserRouter>
    );
}

export default Router;