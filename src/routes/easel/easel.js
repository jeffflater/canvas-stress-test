import React from 'react';
import {CANVAS_HEIGHT, CANVAS_WIDTH} from '../../common/configuration';
import * as _ from 'lodash';

const Easel = (createjs) => class extends React.Component{
    static defaultProps = {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT
    };

    constructor(...args){
        super(...args);
        this.onDrag = this.onDrag.bind(this);
    }

    onDrag(evt){
        console.log('evt', evt);
        evt.currentTarget.x = evt.stageX;
        evt.currentTarget.y = evt.stageY;
        this.stage.update();
    }

    componentDidMount(){
        this.stage = new createjs.Stage('demoCanvas');
        _.times(50, (index) =>{
            const circle = new createjs.Shape();
            circle.graphics.beginFill('DeepSkyBlue').drawRect(index + (55 * index), index + (55 * index), 50, 50);
            circle.on('pressmove', this.onDrag);
            this.stage.addChild(circle);
        });
        this.stage.update();


    }


    render(){
        return (
            <div>
                <canvas id='demoCanvas'
                        style={{backgroundColor: 'white'}}
                        height={this.props.height}
                        width={this.props.width}/>
            </div>
        )
    }
};

export default Easel(createjs);
