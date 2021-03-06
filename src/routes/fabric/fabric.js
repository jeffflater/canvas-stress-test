import React, {Component} from 'react';
import {fabric} from 'fabric';
import {RECTANGLE_WIDTH, RECTANGLE_HEIGHT, CANVAS_HEIGHT, CANVAS_WIDTH} from '../../common/configuration';

class Fabric extends Component{

    static defaultProps = {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT
    };

    componentDidMount(){
        const {height, width} = this.props;
        const fabricCanvas = new fabric.StaticCanvas('canvas', {
            height,
            width
        });
        const rect = new fabric.Rect({
            width: RECTANGLE_WIDTH,
            height: RECTANGLE_HEIGHT,
            fill: 'green',
            strokeWidth: 5,
            stroke: 'rgba(100,200,200,0.5)'
        });

        fabricCanvas.add(rect);

    }

    render(){
        const {height, width} = this.props;

        return (
            <div>
                <canvas ref='canvas' id='canvas' className='canvas' width={width} height={height}/>
            </div>
        );
    }
}

export default Fabric;