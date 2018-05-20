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
        const {width, height} = props.containerSize;
        const getRandomPosition = (type) =>{
            let max = type === 'height' ? height - RECTANGLE_HEIGHT : width - RECTANGLE_WIDTH;
            return Math.floor((Math.random() * max) + 1);
        };

        this.position = {
            x: getRandomPosition('width'),
            y: getRandomPosition('height'),
        };
        this.onClick = this.onClick.bind(this);
        this.onDrag = this.onDrag.bind(this);
    }

    onClick = () =>{
        console.log('rect', this.rect.getAttrs());
        this.setState({
            color: Konva.Util.getRandomColor()
        });
    };

    onDrag(pos){
        let {width, height} = this.props.containerSize;
        height = height - RECTANGLE_WIDTH;
        width = width - RECTANGLE_HEIGHT;
        this.position = {
            x: pos.x < width ? (pos.x < 0 ? 0 : pos.x) : width,
            y: pos.y < height ? (pos.y < 0 ? 0 : pos.y) : height,
        };
        return this.position;
    }

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
                strokeWidth={3}
                stroke="black"
                dragBoundFunc={this.onDrag}
                onClick={this.onClick}
            />
        );
    }
}

export default ColoredRect;