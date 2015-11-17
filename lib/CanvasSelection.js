import {ELEMENT_DEFAULTS} from './FabricElement';

function isVML(){ 
    return typeof window.G_vmlCanvasManager !== 'undefined'; 
}

const INKLING_TEAL = '#0099B7';

export default class CanvasSelection extends fabric.Rect {
    constructor(options = {}){
        super(Object.assign({}, ELEMENT_DEFAULTS, options));
    }

    /**
     * @override
     */
    drawControls(ctx){
        if(!this.hasControls){
          return this;
        }

        let {x: width, y: height} = this._calculateCurrentDimensions();
        let scaleOffset = this.cornerSize;
        let left = -(width + scaleOffset) / 2;
        let top = -(height + scaleOffset) / 2;
        let methodName = this.transparentCorners ? 'strokeRect' : 'fillRect';

        ctx.save();

        ctx.lineWidth = 1;

        ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
        ctx.strokeStyle = ctx.fillStyle = INKLING_TEAL;

        // top-left
        this._drawControl('tl', ctx, methodName,
            left,
            top);

        // top-right
        this._drawControl('tr', ctx, methodName,
            left + width,
            top);

        // bottom-left
        this._drawControl('bl', ctx, methodName,
            left,
            top + height);

        // bottom-right
        this._drawControl('br', ctx, methodName,
            left + width,
            top + height);

        if (!this.get('lockUniScaling')) {
            // middle-top
            this._drawControl('mt', ctx, methodName,
                left + width/2,
                top);

            // middle-bottom
            this._drawControl('mb', ctx, methodName,
                left + width/2,
                top + height);

            // middle-right
            this._drawControl('mr', ctx, methodName,
                left + width,
                top + height/2);

            // middle-left
            this._drawControl('ml', ctx, methodName,
                left,
                top + height/2);
        }

        // middle-top-rotate
        if (this.hasRotatingPoint) {
            this._drawControl('mtr', ctx, methodName,
                left + width / 2,
                top - this.rotatingPointOffset);
        }

        ctx.restore();

        return this;
    }

    /**
     * @override
     */
    _render(ctx){
        super._render(ctx);
        this._drawGrid(ctx);
        this._drawBorder(ctx);
    }

    /**
     * @override
     */
    _drawControl(control, ctx){
        if (!this.isControlVisible(control)) {
            return;
        }

        let {x: width, y: height} = this._calculateCurrentDimensions();
        let left = -(width/2);
        let top = -(height/2);
        let right = width/2;
        let bottom = height/2;
        const HANDLE_WIDTH = 25;

        ctx.shadowColor = INKLING_TEAL;
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        switch(control){
            case 'mt':
                ctx.fillRect(-12, top - 3, 24, 6);
                break;
            case 'ml':
                ctx.fillRect(left - 3, -12, 6, 24);
                break;
            case 'mr':
                ctx.fillRect(right - 3, -12, 6, 24);
                break;
            case 'mb':
                ctx.fillRect(-12, bottom - 3, 24, 6);
                break;
            case 'tl':
                ctx.beginPath();
                ctx.moveTo(left - 3, top - 3);
                ctx.lineTo(left - 3, top + 25);
                ctx.lineTo(left + 3, top + 25);
                ctx.lineTo(left + 3, top + 3);
                ctx.lineTo(left + 25, top + 3);
                ctx.lineTo(left + 25, top - 3);
                ctx.lineTo(left - 3, top - 3);
                ctx.fill();
                ctx.closePath();
                break;
            case 'tr':
                ctx.beginPath();
                ctx.moveTo(right + 3, top - 3);
                ctx.lineTo(right + 3, top + 25);
                ctx.lineTo(right - 3, top + 25);
                ctx.lineTo(right - 3, top + 3);
                ctx.lineTo(right - 25, top + 3);
                ctx.lineTo(right - 25, top - 3);
                ctx.lineTo(right + 3, top - 3);
                ctx.fill();
                ctx.closePath();
                break;
            case 'bl':
                ctx.beginPath();
                ctx.moveTo(left + 3, bottom + 3);
                ctx.lineTo(left + 25, bottom + 3);
                ctx.lineTo(left + 25, bottom - 3);
                ctx.lineTo(left + 3, bottom - 3);
                ctx.lineTo(left + 3, bottom - 25);
                ctx.lineTo(left - 3, bottom - 25);
                ctx.lineTo(left - 3, bottom + 3);
                ctx.fill();
                ctx.closePath();
                break;
            case 'br':
                ctx.beginPath();
                ctx.moveTo(right + 3, bottom + 3);
                ctx.lineTo(right - 25, bottom + 3);
                ctx.lineTo(right - 25, bottom - 3);
                ctx.lineTo(right - 3, bottom - 3);
                ctx.lineTo(right - 3, bottom - 25);
                ctx.lineTo(right + 3, bottom - 25);
                ctx.lineTo(right + 3, bottom + 3);
                ctx.fill();
                ctx.closePath();
                break;
        }
    }

    /**
     * @return {Void}
     */
    _drawGrid(ctx){
        let width = this.get('width');
        let height = this.get('height');

        ctx.fillStyle = INKLING_TEAL;

        ctx.save();
        ctx.setLineDash([8, 8]);

        ctx.beginPath();
        ctx.moveTo(-width/2 + 1/3 * width, -height / 2);
        ctx.lineTo(-width/2 + 1/3 * width, height / 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-width/2 + 2/3 * width, -height/2);
        ctx.lineTo(-width/2 + 2/3 * width, height/2);
        ctx.stroke();


        ctx.beginPath();
        ctx.moveTo(-width/2, -height/2 + 1/3 * height);
        ctx.lineTo(width/2, -height/2 + 1/3 * height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-width/2, -height/2 + 2/3 * height);
        ctx.lineTo(width/2, -height/2 + 2/3 * height);
        ctx.stroke();

        ctx.restore();
    }

    _drawBorder(ctx){
        let height = this.get('height');
        let width = this.get('width');

        ctx.save();

        ctx.strokeStyle = INKLING_TEAL;

        ctx.beginPath();
        ctx.moveTo(-width/2, -height/2); // upper left
        ctx.lineTo(width/2, -height/2); // upper right
        ctx.lineTo(width/2, height/2); // down right
        ctx.lineTo(-width/2, height/2); // down left
        ctx.lineTo(-width/2, -height/2); // upper left
        ctx.stroke();

        ctx.restore();
    }

    rotate(degrees = 90){
        let selection = this.getSelection();

        switch(Math.abs(degrees) % 360){
            case 90 || 270:
                this.setSelection(selection.top, selection.left, selection.height, selection.width);
                break;
            case 180:
                break;
        }
    }

    getSelection(){
        return this;
    }

    getSelectionShape(){
        let top = this.getTop();
        let left = this.getLeft();
        let width = this.getWidth();
        let height = this.getHeight();
       
        return {
            left,
            top,
            width,
            height
        };
    }

    setSelection(left = 0, top = 0, width, height){
        this.set('left', left);
        this.set('top', top);
        this.set('width', width);
        this.set('height', height);
        this.render();
    }
}