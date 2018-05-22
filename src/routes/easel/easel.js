import React, {Component} from 'react';
import {RECTANGLE_WIDTH, RECTANGLE_HEIGHT} from '../../common/configuration';

class Fabric extends Component{

    static defaultProps = {
        width: window.innerWidth - 50,
        height: 500
    };

    componentDidMount(){
        /*console.log('createjs', createjs);
        const stage = new createjs.Stage('easel-canvas');
        //Create a Shape DisplayObject.
        const circle = new createjs.Shape();
        circle.graphics.beginFill('red').drawCircle(0, 0, 40);
        //Set position of Shape instance.
        circle.x = circle.y = 50;
        //Add Shape instance to stage display list.
        stage.addChild(circle);
        //Update stage will render next frame
        stage.update();*/

    }

    render(){
        const {height, width} = this.props;

        return (
            <div>
                <canvas ref='canvas' id='easel-canvas' className='canvas' width={width} height={height}/>
            </div>
        );
    }
}

export default Fabric;