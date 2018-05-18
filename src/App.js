import React from 'react';
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';
import Loadable from 'react-loadable';
import Routes from './routes';
import * as _ from 'lodash';


const CreateLink = ({name, path}) => path !== '/' && (
    <Route
        path={path}
        exact
        children={({match}) => (
            <div className={`item ${match ? 'active' : ''}`}>
                <Link to={path}>{_.capitalize(name)}</Link>
            </div>
        )}
    />
);


const LoadableRoute = ({name, path}) =>{
    const routeProps = {
        component: Loadable({
            loader: () => import(`./routes/${name}`),
            loading: () => <div>Loading...</div>
        }),
        path
    };
    return (<Route exact {...routeProps}/>)
};


const App = () => (
    <Router>
        <Switch>
            <div className="app">
                <header className="app-header">
                    <div className="menu">
                        {_.map(Routes, CreateLink)}
                    </div>
                </header>
                <div className="page">
                {_.map(Routes, LoadableRoute)}
                </div>
            </div>
        </Switch>
    </Router>
);

export default App;
