import React from 'react';
import {Rect} from 'react-konva';
import PropTypes from 'prop-types';
import Konva from 'konva';

const RECTANGLE_WIDTH = 100;
const RECTANGLE_HEIGHT = 100;


class ColoredRect extends React.Component{
    state = {
        color: 'green'
    };

    static propTypes = {
        containerSize: PropTypes.shape({
            width: PropTypes.number.isRequired,
            height: PropTypes.number.isRequired,
        })
    };

    static defaultProps = {
        containerSize: {
            width: 50,
            height: 50
        }
    };

    constructor(props, ...args){
        super(props, ...args);
        const getRandomPosition = max => Math.floor((Math.random() * max) + 1);
        const {width, height} = props.containerSize;
        this.position = {
            x: getRandomPosition(width),
            y: getRandomPosition(height),
        }
    }

    handleClick = () =>{
        console.log('rect', this.rect.getAttrs());
        this.setState({
            color: Konva.Util.getRandomColor()
        });
    };

    render(){
        return (
            <Rect
                ref={(element) => this.rect = element}
                draggable
                x={this.position.x}
                y={this.position.y}
                width={RECTANGLE_WIDTH}
                height={RECTANGLE_HEIGHT}
                fill={this.state.color}
                dragBoundFunc={(pos) => this.position = pos}
                onClick={this.handleClick}
            />
        );
    }
}

export default ColoredRect;