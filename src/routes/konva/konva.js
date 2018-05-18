import React, {Component} from 'react';
import {Stage, Layer} from 'react-konva';
import * as _ from 'lodash';
import ColoredRect from './colored-rect';

class Konva extends Component{


    renderLayers = index => (
        <Layer key={`layer${index}`}>
            {_.times(1000, rectIndex =>
                <ColoredRect key={`layer${index}-rect${rectIndex}`}/>)}
        </Layer>
    );

    render(){
        const quantity = 10;
        return (
            <Stage width={1000} height={700} className="canvas">
                {_.times(quantity, this.renderLayers)}
            </Stage>
        );
    }
}

export default Konva;