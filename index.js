var CANVAS_ELEMENT_DEFAULTS = {
    left: 150,
    top: 200,
    originX: 'left',
    originY: 'top',
    width: 150,
    height: 120,
    angle: 0,
    fill: 'transparent',
    transparentCorners: false,
    hasRotatingPoint: false
};

function CanvasSelection(options){
    options = options || {};
    options = Object.assign({}, CANVAS_ELEMENT_DEFAULTS, options);

    var rect = new fabric.Rect(options);
    this._el = rect;
    this._canvas = options.canvas;
}

CanvasSelection.prototype.setProperty = function(prop, value){
    this._el[prop] = value;
    this._canvas.render();
};

function CanvasWrapper(selector, options){
    options = options || {};

    var canvas = this._createCanvas(options);
    var container = document.querySelector(selector);
    container.appendChild(canvas);

    this._el = new fabric.Canvas(canvas, {
        renderOnAddRemove: true,
        selection: false
    });
    this._selections = new WeakMap();
    this._height = options.height || container.offsetHeight;
    this._width = options.width || container.offsetWidth;
    this._image = null;

    if(options.image){
        this.setImage(options.image);
    }
}

CanvasWrapper.prototype.crop = function(){

};

CanvasWrapper.prototype.setImage = function(image){

    var options = {};
    if(image.height > this._height){
        // Scale height.
        var scale = this._height / image.height;
        options.height = image.height * scale;
        options.width = image.width * scale;
    } else if(image.width > this._width){
        
        
    }

    image = typeof image === 'string' ? document.querySelector(image) : image;

    options = Object.assign({}, CANVAS_ELEMENT_DEFAULTS, {
      left: (this._width / 2) - (options.width / 2),
      top: 0,
      angle: 0,
      opacity: 1,
      height: options.height,
      width: options.width,
      selectable: false,
      evented: false
    });
    
    var imgInstance = new fabric.Image(image, options);
    this._image = imgInstance;
    this._el.add(this._image);
    
    image.style.display = 'none';

    // this.render();
};

CanvasWrapper.prototype._createCanvas = function(options){
    var canvas = document.createElement('canvas');
    canvas.setAttribute('height', options.height);
    canvas.setAttribute('width', options.width);
    return canvas;
};

CanvasWrapper.prototype.render = function(){
    // this._el.renderAll();
};

CanvasWrapper.prototype.addSelection = function(selection, setSelected){
    var el = selection._el;
    this._el.add(el).setActiveObject(el);
};

CanvasWrapper.prototype.createSelection = function(options, addToCanvas){
    options = Object.assign({}, {canvas: this._el}, options || {});

    var selection = new CanvasSelection(options);
    if(addToCanvas){
        this.addSelection(selection);
    }
};