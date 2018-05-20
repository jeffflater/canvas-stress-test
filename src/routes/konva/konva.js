import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Stage, Layer} from 'react-konva';
import * as _ from 'lodash';
import ColoredRect from './colored-rect';

const LAYER_QUANTITY = 1;
const RECTANGLE_QUANTITY = 10;

class Konva extends PureComponent{
    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired
    };
    static defaultProps = {
        width: window.innerWidth - 50,
        height: 500
    };

    get stage(){
        return this.refs.stage.getStage()
    }

    constructor(...args){
        super(...args);
        this.onZoom = this.onZoom.bind(this);
        this.renderLayers = this.renderLayers.bind(this);

    }

    /*componentDidMount(){
        this.stage.on('mousedown touchstart', function (){
            console.log('Mousedown or touchstart');
        });
        this.stage.on('mouseup touchend', function (){
            console.log('Mouseup or touchend');
        });
    }*/

    renderLayers = index => (
        <Layer key={`layer${index}`}>
            {_.times(RECTANGLE_QUANTITY, rectIndex =>
                <ColoredRect key={`layer${index}-rect${rectIndex}`}
                             containerSize={this.props}/>)}
        </Layer>
    );

    onZoom({evt}){
        evt.preventDefault();
        const zoomStep = 1.01;
        const oldScale = this.stage.scaleX();
        const newScale = evt.deltaY > 0 ? oldScale * zoomStep : oldScale / zoomStep;
        this.stage.scale({x: newScale, y: newScale});
        this.stage.batchDraw();
    }

    render(){
        return (
            <div ref='container'>
                <Stage
                    width={this.props.width}
                    height={this.props.height}
                    className='canvas'
                    ref='stage'
                    onWheel={this.onZoom}>
                    {_.times(LAYER_QUANTITY, this.renderLayers)}
                </Stage>
            </div>
        );
    }
}

export default Konva;