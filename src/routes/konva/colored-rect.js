import React from 'react';
import {Rect} from 'react-konva';
import PropTypes from 'prop-types';
import {RECTANGLE_WIDTH, RECTANGLE_HEIGHT} from '../../common/configuration';


class ColoredRect extends React.Component{
    state = {
        color: 'green'
    };

    static propTypes = {
        containerSize: PropTypes.shape({
            width: PropTypes.number.isRequired,
            height: PropTypes.number.isRequired,
        }),
        onClick: PropTypes.func,
        id: PropTypes.string.isRequired,
        color: PropTypes.string,
    };

    static defaultProps = {
        containerSize: {
            width: 50,
            height: 50
        },
        color: 'green'
    };

    constructor(props, ...args){
        super(props, ...args);
        const {width, height} = props.containerSize;
        const getRandomPosition = (type) =>{
            let max = type === 'height' ? height - RECTANGLE_HEIGHT : width - RECTANGLE_WIDTH;
            return Math.floor((Math.random() * max) + 1);
        };

        this.state = {
            position: {
                x: getRandomPosition('width'),
                y: getRandomPosition('height'),
            },
            color: props.color
        };
        this.onClick = this.onClick.bind(this);
        this.onDrag = this.onDrag.bind(this);
        this.move = this.move.bind(this);
        this.changeColor = this.changeColor.bind(this);
    }

    onClick = () => this.props.onClick && this.props.onClick(this);

    changeColor(color){
        this.setState({
            color
        });
    }

    move(x, y){
        this.setState({
            position: {
                x: this.state.position.x + x,
                y: this.state.position.y + y,
            }
        });
    }

    onDrag(pos){
        let {width, height} = this.props.containerSize;
        height = height - RECTANGLE_WIDTH;
        width = width - RECTANGLE_HEIGHT;
        const position = {
            x: pos.x < width ? (pos.x < 0 ? 0 : pos.x) : width,
            y: pos.y < height ? (pos.y < 0 ? 0 : pos.y) : height,
        };

        this.setState({
            position
        });
        return position;
    }

    render(){
        const {position, color} = this.state;
        return (
            <Rect
                x={position.x}
                y={position.y}
                width={RECTANGLE_WIDTH}
                height={RECTANGLE_HEIGHT}
                fill={color}
                strokeWidth={3}
                stroke="black"
                onClick={this.onClick}
            />
        );
    }
}

export default ColoredRect;