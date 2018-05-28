import './extension/SVG';
import './extension/SVG.VML';
import './extension/Canvas';
import './extension/Path.Drag';
import './extension/Path.Transform';

import {Rectangle as LeafletRectangle} from 'leaflet';
import {Rectangle} from 'react-leaflet';

class DraggableRectangle extends Rectangle{

    createLeafletElement(props){
        return new LeafletRectangle(props.bounds, this.getOptions(props));
    }

}

export default DraggableRectangle;
