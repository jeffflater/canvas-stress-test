import {Handler, Path, point, LatLngBounds, Util, DomUtil, DomEvent} from 'leaflet';
import * as _ from 'lodash';

var END = {
    mousedown: 'mouseup',
    touchstart: 'touchend',
    pointerdown: 'touchend',
    MSPointerDown: 'touchend'
};

var MOVE = {
    mousedown: 'mousemove',
    touchstart: 'touchmove',
    pointerdown: 'touchmove',
    MSPointerDown: 'touchmove'
};

function distance(a, b){
    var dx = a.x - b.x, dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}


let moveable_paths = {};

/**
 * Drag handler
 * @class L.Path.Drag
 * @extends {L.Handler}
 */
Handler.PathDrag = Handler.extend(/** @lends  L.Path.Drag.prototype */ {

    statics: {
        DRAGGING_CLS: 'leaflet-path-draggable',
    },

    /**
     * @param  {L.Path} path
     * @constructor
     */
    initialize: function (path){
        /**
         * @type {L.Path}
         */
        this._path = path;

        /**
         * @type {Array.<Number>}
         */
        this._matrix = null;

        /**
         * @type {L.Point}
         */
        this._startPoint = null;

        /**
         * @type {L.Point}
         */
        this._dragStartPoint = null;

        /**
         * @type {Boolean}
         */
        this._mapDraggingWasEnabled = false;

    },

    /**
     * Enable dragging
     */
    addHooks: function (){
        this._path.on('click', this._onClick, this);
        this.setDraggable(this._path.options.draggable);

        this._path.options.className = this._path.options.className ?
            (this._path.options.className + ' ' + Handler.PathDrag.DRAGGING_CLS) :
            Handler.PathDrag.DRAGGING_CLS;

        if(this._path._path){
            DomUtil.addClass(this._path._path, Handler.PathDrag.DRAGGING_CLS);
        }
    },

    /**
     * Disable dragging
     */
    removeHooks: function (){
        if(this._path.options.draggable){
            this._path.off('mousedown', this._onDragStart, this);
        }

        this._path.options.className = this._path.options.className
            .replace(new RegExp('\\s+' + Handler.PathDrag.DRAGGING_CLS), '');
        if(this._path._path){
            DomUtil.removeClass(this._path._path, Handler.PathDrag.DRAGGING_CLS);
        }
    },

    /**
     * @return {Boolean}
     */
    moved: function (){
        return this._path._dragMoved;
    },

    setDraggable: function (draggable){
        const id = this._path.options.id;
        this._path.options.draggable = draggable;
        let color = 'blue';

        if(this._path.options.draggable){
            color = 'yellow';
            moveable_paths = {
                ...moveable_paths,
                [id]: this._path
            };
            this._path.on('mousedown', this._onDragStart, this);
        } else{
            delete moveable_paths[id];
            this._path.off('mousedown', this._onDragStart, this);
        }
        this._path.options.color = color;
        this._path.setStyle({});
    },

    _onClick: function (evt){
        this.setDraggable(!this._path.options.draggable);
    },
    /**
     * Start drag
     * @param  {L.MouseEvent} evt
     */
    _onDragStart: function (evt){
        var eventType = evt.originalEvent._simulated ? 'touchstart' : evt.originalEvent.type;
        this._mapDraggingWasEnabled = false;
        this._startPoint = evt.containerPoint.clone();
        this._dragStartPoint = evt.containerPoint.clone();
        this._matrix = [1, 0, 0, 1, 0, 0];
        DomEvent.stop(evt.originalEvent);


        DomUtil.addClass(this._path._renderer._container, 'leaflet-interactive');
        DomEvent
            .on(document, MOVE[eventType], this._onDrag, this)
            .on(document, END[eventType], this._onDragEnd, this);

        if(this._path._map.dragging.enabled()){
            // I guess it's required because mousdown gets simulated with a delay
            //this._path._map.dragging._draggable._onUp(evt);

            this._path._map.dragging.disable();
            this._mapDraggingWasEnabled = true;
        }
        this._path._dragMoved = false;

        if(this._path._popup){ // that might be a case on touch devices as well
            this._path._popup._close();
        }

        this._replaceCoordGetters(evt);
    },

    /**
     * Dragging
     * @param  {L.MouseEvent} evt
     */
    _onDrag: function (evt){
        DomEvent.stop(evt);

        var first = (evt.touches && evt.touches.length >= 1 ? evt.touches[0] : evt);
        var containerPoint = this._path._map.mouseEventToContainerPoint(first);

        // skip taps
        if(evt.type === 'touchmove' && !this._path._dragMoved){
            var totalMouseDragDistance = this._dragStartPoint.distanceTo(containerPoint);
            if(totalMouseDragDistance <= this._path._map.options.tapTolerance){
                return;
            }
        }

        var x = containerPoint.x;
        var y = containerPoint.y;

        var dx = x - this._startPoint.x;
        var dy = y - this._startPoint.y;

        // Send events only if point was moved
        if(dx || dy){
            if(!this._path._dragMoved){
                this._path._dragMoved = true;
                this._path.fire('dragstart', evt);
                // we don't want that to happen on click
                this._path.bringToFront();
            }

            this._matrix[4] += dx;
            this._matrix[5] += dy;

            this._startPoint.x = x;
            this._startPoint.y = y;

            this._path.fire('predrag', evt);
            _.forEach(moveable_paths, (path) =>{
                path._transform(this._matrix);
            });
            this._path.fire('drag', evt);
        }
    },

    /**
     * Dragging stopped, apply
     * @param  {L.MouseEvent} evt
     */
    _onDragEnd: function (evt){

        var moved = this.moved();

        // apply matrix
        if(moved){
            _.forEach(moveable_paths, (path) =>{
                this._transformPoints(path, this._matrix);
                path._updatePath();
                path._project();
                path._transform(null);
            });
            DomEvent.stop(evt);
        }


        DomEvent.off(document, 'mousemove touchmove', this._onDrag, this);
        DomEvent.off(document, 'mouseup touchend', this._onDragEnd, this);

        this._restoreCoordGetters();

        // consistency
        if(moved){
            _.forEach(moveable_paths, (path) =>{
                const containerPoint = path._map.mouseEventToContainerPoint(evt);
                path.fire('dragend', {
                    distance: distance(this._dragStartPoint, containerPoint)
                });

                // hack for skipping the click in canvas-rendered layers
                var contains = path._containsPoint;
                path._containsPoint = Util.falseFn;
                Util.requestAnimFrame(function (){
                    DomEvent.skipped({type: 'click'});
                    path._containsPoint = contains;
                }, this);
                path._dragMoved = false;
            })
        }

        this._matrix = null;
        this._startPoint = null;
        this._dragStartPoint = null;

        if(this._mapDraggingWasEnabled){
            if(moved) DomEvent.fakeStop({type: 'click'});
            this._path._map.dragging.enable();
        }
    },


    /**
     * Applies transformation, does it in one sweep for performance,
     * so don't be surprised about the code repetition.
     *
     * [ x ]   [ a  b  tx ] [ x ]   [ a * x + b * y + tx ]
     * [ y ] = [ c  d  ty ] [ y ] = [ c * x + d * y + ty ]
     *
     * @param {Array.<Number>} matrix
     */
    _transformPoints: function (path, matrix, dest){
        var i, len, latlng;

        var px = point(matrix[4], matrix[5]);

        var crs = path._map.options.crs;
        var transformation = crs.transformation;
        var scale = crs.scale(path._map.getZoom());
        var projection = crs.projection;

        var diff = transformation.untransform(px, scale)
            .subtract(transformation.untransform(point(0, 0), scale));
        var applyTransform = !dest;

        path._bounds = new LatLngBounds();
        // console.time('transform');
        // all shifts are in-place
        if(path._point){ // L.Circle
            dest = projection.unproject(
                projection.project(path._latlng)._add(diff));
            if(applyTransform){
                path._latlng = dest;
                path._point._add(px);
            }
        } else if(path._rings || path._parts){ // everything else
            var rings = path._rings || path._parts;
            var latlngs = path._latlngs;

            dest = dest || latlngs;
            if(!Util.isArray(latlngs[0])){ // polyline
                latlngs = [latlngs];
                dest = [dest];
            }
            for(i = 0, len = rings.length; i < len; i++){
                dest[i] = dest[i] || [];
                for(var j = 0, jj = rings[i].length; j < jj; j++){
                    latlng = latlngs[i][j];
                    dest[i][j] = projection
                        .unproject(projection.project(latlng)._add(diff));
                    if(applyTransform){
                        path._bounds.extend(latlngs[i][j]);
                        rings[i][j]._add(px);
                    }
                }
            }
        }

        return dest;
    },


    /**
     * If you want to read the latlngs during the drag - your right,
     * but they have to be transformed
     */
    _replaceCoordGetters: function (){
        _.forEach(moveable_paths, path =>{
            if(path.getLatLng){ // Circle, CircleMarker
                path.getLatLng_ = path.getLatLng;
                path.getLatLng = Util.bind(
                    () => this.dragging._transformPoints(path, this.dragging._matrix, {}), path);
            } else if(path.getLatLngs){
                path.getLatLngs_ = path.getLatLngs;
                path.getLatLngs = Util.bind(
                    () => this.dragging._transformPoints(path, this.dragging._matrix, {}), path);
            }
        });

    },


    /**
     * Put back the getters
     */
    _restoreCoordGetters: function (){
        _.forEach(moveable_paths, path =>{
            if(path.getLatLng_){
                path.getLatLng = path.getLatLng_;
                delete path.getLatLng_;
            } else if(path.getLatLngs_){
                path.getLatLngs = this._path.getLatLngs_;
                delete this._path.getLatLngs_;
            }
        });
    }

});


Path.addInitHook(function (){
    // ensure interactive
    this.options.interactive = true;
    this.dragging = new Handler.PathDrag(this);
    this.dragging.enable();
});
