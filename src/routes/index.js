class Route{
    constructor(name, path){
        this.name = name;
        this.path = path;
    }
}

export default [
    new Route('home', '/'),
    new Route('konva', '/konva'),
];
