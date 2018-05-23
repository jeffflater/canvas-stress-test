import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Stage, Layer, Group} from 'react-konva';
import * as _ from 'lodash';
import ColoredRect from './colored-rect';
import {CANVAS_HEIGHT, CANVAS_WIDTH} from '../../common/configuration'

const LAYER_QUANTITY = 2;
const RECTANGLE_QUANTITY = {
    0: 1000,
    1: 100,
};

class Konva extends PureComponent{
    selectedSquares = [];

    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired
    };
    static defaultProps = {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT
    };

    get stage(){
        return this.refs.stage.getStage()
    }

    constructor(...args){
        super(...args);
        this.onZoom = this.onZoom.bind(this);
        this.renderLayers = this.renderLayers.bind(this);
        this.onSquareClick = this.onSquareClick.bind(this);
        this.onDrag = this.onDrag.bind(this);

    }

    /*componentDidMount(){
        this.stage.on('mousedown touchstart', function (){
            console.log('Mousedown or touchstart');
        });
        this.stage.on('mouseup touchend', function (){
            console.log('Mouseup or touchend');
        });
    }*/

    renderLayers = index =>{
        const layerId = `layer${index}`;
        return (
            <Layer key={layerId}>
                <Group draggable dragBoundFunc={pos => this.onDrag(pos, layerId)}>
                    {_.times(RECTANGLE_QUANTITY[index], rectIndex =>{
                        const key = `layer${index}-rect${rectIndex}`;
                        return <ColoredRect key={key}
                                            id={key}
                                            containerSize={this.props}
                                            onClick={this.onSquareClick}/>;
                    })}
                </Group>
            </Layer>
        );
    };

    onDrag = (pos, layerId) => pos;

    onSquareClick(square){
        if(_.some(this.selectedSquares, selectedSquare => selectedSquare === square.props.id)){
            square.changeColor('yellow');
            _.remove(this.selectedSquares, selectedSquare => selectedSquare === square.props.id)
        } else{
            square.changeColor('green');
            this.selectedSquares = [
                ...this.selectedSquares,
                square.props.id
            ];
        }
    }

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
            <div>
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