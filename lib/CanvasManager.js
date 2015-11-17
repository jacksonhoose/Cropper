import {fabric} from '../bower_components/fabric.js';

import AbstractCanvas from './AbstractCanvas';
import {ELEMENT_DEFAULTS} from './FabricElement';
import CanvasSelection from './CanvasSelection';
import {cloneImage, getImageDimensions} from './ImageHelpers';

const DEFAULT_OPTIONS = {
  backgroundColor: '#fff'
};

export default class CanvasManager extends AbstractCanvas {
    constructor(options = {}){
        super();

        Object.assign(this, {
            _optons: null,

            /**
             * A reference to the canvas HTML element.
             * @type {HTMLElement}
             */
            _canvasElement: null,

            /**
             * Fabric Canvas instance.
             * @type {fabric.Canvas}
             */
            _canvas: null,

            /**
             * The container to insert the canvas into.
             * @type {HTMLElement}
             */
            _container: options.container,

            /**
             * The selection area.
             * @type {CanvasSelection}
             */
            _selection: null,

            /**
             * The height of the canvas editing area.
             * @type {Number}
             */
            _height: options.height,

             /**
             * The width of the canvas editing area.
             * @type {Number}
             */
            _width: options.width,

            /**
             * Initialize with an image.
             * @type {Image}
             */
            _image: null,

            /**
             * The aspect ratio the selection is locked to.
             * @type {Number}
             */
            _aspectRatio: null,

            /**
             * The original image.
             * @type {Image}
             */
            _originalImage: null
        });

        this._options = Object.assign({}, DEFAULT_OPTIONS, options);
        this._createCanvas();
    }

    _createCanvas(width, height){
      let canvas = document.createElement('canvas');
      canvas.setAttribute('width', this._width);
      canvas.setAttribute('height', this._height);

      this._canvasElement = canvas;
    }

    remove(){
      this._container.removeChild(this._canvasElement);
      this._removeSelection();
      this._canvas.remove();
      this._canvas = null;
      this._canvasElement = null;
      // RemoveCanvasObservers.
    }

    render(){
      this._container.appendChild(this._canvasElement);
      this._canvas = new fabric.Canvas(this._canvasElement, {
          renderOnAddRemove: true,
          selection: false,
          backgroundColor: this._options.backgroundColor
      });
      this._attachCanvasObservers();
    }

    getSelection(){
      return this._selection;
    }

    setAspectRatio(ratio = 1/1){
      let selection = this._selection;
      if(!selection) return;

      let scaleX = selection.get('scaleX');
      let scaleY = selection.get('scaleY');

      if(ratio === null || ratio === undefined){
        // Unlock scaling if null value is passed in.
        selection.set('lockUniScaling', false);
      } else {
        // There is a value.
        if(ratio === 1){
          selection.set('scaleX', scaleX);
          selection.set('scaleY', scaleX);
        } else if(ratio < 1){
          // Width smaller than height.
          selection.set('scaleY', scaleX * ratio);
        } else if(ratio > 1){
          // Height greater than width.
          selection.set('scaleX', scaleY * ratio);
        }
        selection.set('lockUniScaling', true);
      }

      this._canvas.renderAll();
    }

    _attachCanvasObservers(){
      this._canvas.observe('object:scaling', e => this._onObjectScaling(e));
      this._canvas.observe('object:moving', e => this._onObjectMoving(e));

      this._canvas.observe('mouse:down', e => this._onMouseDown(e));
      this._canvas.observe('mouse:move', e => this._onMouseMove(e));
      this._canvas.observe('mouse:up', e => this._onMouseUp(e));

      // let selectedObject;
      // this._canvas.on('object:selected', function(options) {
      //   selectedObject = options.target;
      // });
      // this._canvas.on('selection:cleared', function() {
      //   this._canvas.setActiveObject(selectedObject);
      // });
    }

    _onObjectScaling(e){
      // let target = e.target;
      // let selection = this._selection.getSelection();
      // if(target !== selection) return;

      // let canvas = this._canvas;
      // let dimensions = this._selection.getSelectionShape();

      // if(dimensions.left < 0){
      //   selection.set('left', 0); 
      // }

      // if(dimensions.top < 0){
      //   selection.set('top', 0);
      // }

      // let maxWidth = canvas.getWidth() - dimensions.width;
      // if(dimensions.left > maxWidth){
      //   selection.set('left', maxWidth);
      // }

      // let maxHeight = canvas.getHeight() - dimensions.height;
      // if(dimensions.top > maxHeight){
      //   selection.set('top', maxHeight);
      // }
    }

    _onObjectMoving(e){
      let target = e.target;
      let selection = this._selection;
      if(target !== selection || !selection) return;

      let canvas = this._canvas;
      let image = this._image;
      let dimensions = selection.getSelectionShape();

      if(dimensions.left < 0){
        selection.set('left', );
      }

      if(dimensions.top < 0){
        selection.set('top', 0);
      }

      let maxWidth = canvas.getWidth() - dimensions.left;
      if(dimensions.left > maxWidth){
        selection.set('left', maxWidth);
      }

      let maxHeight = canvas.getHeight() - dimensions.top;
      if(dimensions.top > maxHeight){
        selection.set('top', maxHeight);
      }
    }

    _onMouseUp(e){

    }

    _onMouseMove(e){

    }

    _onMouseDown(e){
      let selection = this._selection && this._selection.getSelection();
      let canvas = this._canvas;
      let {x, y} = canvas.getPointer(e.e);
      let point = new fabric.Point(x, y);

      let onMouseMove = e => {
        canvas.off('mouse:move', onMouseMove);
        console.log('move');
      };
      canvas.on('mouse:move', onMouseMove);

      let onMouseUp = e => {
        canvas.off('mouse:up', onMouseUp);
        console.log('up');
      };
      canvas.on('mouse:up', onMouseUp);
    }

    _removeSelection(){
      this._selection.remove();
      this._selection = null;
    }

    /**
     * Returns the currently cropped image as a Blob.
     *
     * @return {Blob}
     */
    getCanvasAsBlob(){
        // Grab dataURI from canvas.
        let dataURL = this.canvas_.toDataURL({
            left: this._image.getLeft(),
            top: this._image.getTop(),
            width: this._image.getWidth(),
            height: this._image.getHeight()
        });

        let parts = dataURL.split(';base64,');
        let contentType = parts[0].split(':')[1];
        let raw = window.atob(parts[1]);
        let rawLength = raw.length;

        let uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }

        return new Blob([uInt8Array], {type: contentType});
    }

    /**
     * Trigger a crop on the current Selection
     *
     * @return {Void}.
     */
    crop(){
        if (!this._image || !this._selection) return;

        let dimensions = this._selection.getSelectionShape();

        // Clear the selection when a crop is made.
        this._selection.remove();
        this._selection = null;

        cloneImage(this._canvas.toDataURL(dimensions), clone => {
            this._setCroppableImage(clone);
        });
    }

    rotate(degrees = 90){
      if (!this._selection) return;
      this._selection.rotate(degrees);
    }

    setSelection(left = 0, top = 0, width, height){
        if(this._selection){
            this._selection.remove();
            this._selection = null;
        }

        let options = Object.assign({}, ELEMENT_DEFAULTS, {
            left,
            top,
            width: this._canvas.getWidth(),
            height: this._canvas.getHeight()
        });
        this._selection = new CanvasSelection(options);
        // Add selection to canvas instance.
        this._canvas.add(this._selection)
            .setActiveObject(this._selection);
    }

    _setCroppableImage(image){
        if (this._image) {
            this._canvas.remove(this._image);
            this._image = null;
        }

        let dimensions = getImageDimensions(image, 
              {width:this._canvas.getWidth(), height:this._canvas.getHeight()});
        let options = Object.assign({}, ELEMENT_DEFAULTS, {
            height: dimensions.height,
            width: dimensions.width,
            selectable: false,
            evented: false
        });
        let imgInstance = new fabric.Image(image, options);
        this._image = imgInstance;
        this._canvas.add(this._image);
        this._image.center();
    }

    _setImage(image){
        this._originalImage = image;

        cloneImage(image.getAttribute('src'), clone => {
            this._setCroppableImage(clone);
        });

        this._originalImage.style.display = 'none';
    }

    _loadImageFromFile(file, callback){
      let reader = new FileReader();
      let loadListener = e => {
        reader.removeEventListener('load', loadListener);
        if(callback) callback(e);
      };
      reader.addEventListener('load', loadListener);
      readAsDataURL(file);
    }

    setImage(image){
      // if(image instanceof Image){
        this._setImage(image);
      // }
      // let setImage = this._setImage.bind(this);
      // if(typeof image === 'string'){
      //   fabric.Image.fromURL(image, image => {
      //     setImage(image);
      //   });
      // } else if(image instanceof Image){
        // this._setImage(image);
      // } else if(image instanceof File){
      //   this._loadImageFromFile(image, image => {
      //   });
      // }
    }
}