import React from 'react';
import Loadable from 'react-loadable';

class Route{
    constructor(name, path){
        this.name = name;
        this.path = path;
    }

    get component(){
        const {name} = this;
        return Loadable({
            loader: () => import(`../routes/${name}`),
            loading: () => <div key={`${name}-loading`}>Loading...</div>,
            render: (loaded, props) => <loaded.default {...props}/>
        })
    }
}

export default Route;