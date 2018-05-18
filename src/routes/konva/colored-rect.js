import React from 'react';
import {Rect} from 'react-konva';
import Konva from 'konva';

class ColoredRect extends React.Component{
    position = {
        x: Math.floor((Math.random() * window.innerWidth) + 1),
        y: Math.floor((Math.random() * 700) + 1)
    };
    state = {
        color: 'green'
    };
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
                width={10}
                height={10}
                fill={this.state.color}
                dragBoundFunc={(pos) => (this.position = pos)}
                onClick={this.handleClick}
            />
        );
    }
}

export default ColoredRect;