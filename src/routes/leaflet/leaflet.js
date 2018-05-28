import React, {Component} from 'react'
import {
    Map,
    TileLayer
} from 'react-leaflet';
import './leaflet.css';
import {CANVAS_HEIGHT, CANVAS_WIDTH} from '../../common/configuration';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import DraggableRectangle from './component/draggable-rectangle';
import * as moment from 'moment';

class Leaflet extends Component{

    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired
    };
    static defaultProps = {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT
    };

    constructor(...args){
        super(...args);

        this.time = moment();
        this.state = {
            rectangles: {}
        };
        this.addRectangle = this.addRectangle.bind(this);
    }

    addRectangle(element){
        if(element){
            const rectangle = this.state.rectangles[element.props.id];
            if(!rectangle){
                this.setState({
                    rectangles: {
                        ...this.state.rectangles,
                        [element.props.id]: element
                    }
                });
            }
        }

    }

    createDraggableRectangle(column, index, active){
        const position = [[index, column], [index + 0.5, column + 0.5]];
        return (
            <DraggableRectangle ref={this.addRectangle}
                                key={`rect-${column}-${index}`}
                                id={`rect-${column}-${index}`}
                                bounds={position}
                                draggable={active}
                                color='blue'/>
        );
    }

    render(){
        const center = [1, 1];
        const columnQuantityDrag = 10;
        const columnQuantity = 290;
        const {width, height} = this.props;
        return (
            <div>
                <Map center={center}
                     zoom={5}
                     style={{width, height}}
                >
                    <TileLayer
                        url="'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'"
                    />
                    {_.times(columnQuantityDrag, columnIndex =>
                        _.times(10, (index) => this.createDraggableRectangle(columnIndex, index, true)))}
                    {_.times(columnQuantity, columnIndex =>
                        _.times(10, (index) => this.createDraggableRectangle(columnIndex + 10, index, false)))}
                </Map>
            </div>
        )
    }
}

export default Leaflet;