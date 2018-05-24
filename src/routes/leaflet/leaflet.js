import React, {Component} from 'react'
import {
    Map,
    LayerGroup,
    Rectangle,
    TileLayer
} from 'react-leaflet';
import './leaflet.css';
import {CANVAS_HEIGHT, CANVAS_WIDTH} from '../../common/configuration';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import 'leaflet-path-drag';
import 'leaflet-editable';

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
        this.state = {
            rectangles: {}
        };
        this.addRectangle = this.addRectangle.bind(this);
    }

    componentDidMount(){
        console.log('componentDidMount');
    }

    componentDidUpdate(){
        console.log('componentDidUpdate');
    }

    addRectangle(element){
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

    createRectangle(index){
        const position = [[index + 0.5, index - 0.5], [index - 0.5, index + 0.5]];
        return (
            <Rectangle ref={this.addRectangle}
                       id={`rect-${index}`}
                       bounds={position}
                       draggable
                       color='blue'/>
        );
    }

    render(){
        const center = [1, 1];


        const {width, height} = this.props;
        return (
            <div>
                <Map center={center}
                     zoom={5}
                     style={{width, height}}>
                    <TileLayer
                        url="'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'"
                    />
                    {_.times(10, (index) => this.createRectangle(index))}
                </Map>
            </div>
        )
    }
}

export default Leaflet;