import {TypedCopNode} from '@polygonjs/polygonjs/dist/src/engine/nodes/cop/_Base';
import {Vector2, DataTexture, RGBAFormat, UnsignedByteType, CanvasTexture, NearestFilter} from 'three';
import {NodeParamsConfig, ParamConfig} from '@polygonjs/polygonjs/dist/src/engine/nodes/utils/params/ParamsConfig';
import {TextureParamsController, TextureParamConfig} from '@polygonjs/polygonjs/dist/src/engine/nodes/cop/utils/TextureParamsController';
// import Hydra from 'hydra-synth';




// class CanvasCopParamConfig extends TextureParamConfig(CanvasCopNodeParamConfig(NodeParamsConfig)) {}

const DEFAULT_JS = `osc(10,0.1)
.modulate(noise(60),0.22)
.diff(o0)
.modulateScrollY(osc(2).modulate(osc().rotate(),1.11))
.scale(15.72).color(1.99,1.014,1)
.out()   `


export function HydraCustomCopParamsConfig(Base) {
    return class Mixin extends Base {
        /** @param text created */
        hydraCode = ParamConfig.STRING(DEFAULT_JS, {
            cook: false,
            language: 'typescript',
            hideLabel: true,
            multiline: true,
        });
        /** @param render resolution */
        resolution = ParamConfig.VECTOR2([256, 256]);
        /** @param show canvas */
        showCanvas = ParamConfig.BOOLEAN(false, {
            cook: false,
            callback: (node) => {
                HydraCustomCopNode.PARAM_CALLBACK_showCanvas(node);
            },
        });
        /** @param forces the texture to update */
        update = ParamConfig.BUTTON(null, {
            cook: false,
            callback: (node) => {
                HydraCustomCopNode.PARAM_CALLBACK_update(node);
            },
        });
    };
}
class CanvasCopParamConfig extends TextureParamConfig(HydraCustomCopParamsConfig(NodeParamsConfig)) {}

const ParamsConfig = new CanvasCopParamConfig();


export class HydraCustomCopNode extends TypedCopNode {
    HydraSynth = undefined
    hydra = undefined
    canvas = undefined
    paramsConfig = ParamsConfig;
    static type() {
        // This is the type of the node. All nodes within a specific context (such as SOP, COP, OBJ) must have a unique type.
        return 'hydraTextureCustom';
    }
    textureParamsController = new TextureParamsController(this);

    initializeNode() {
        import("hydra-synth").then((hydra) => {
            this.HydraSynth = hydra.default;
            console.log('hydra', this.HydraSynth); // true
        });
    }

    __dataTexture = undefined
    async cook(inputContents) {

        console.log('hydra', this.HydraSynth, this.hydra);
        if (this.HydraSynth && !this.hydra) {
            this.canvas = document.createElement('canvas');
            this.canvas.width = this.pv.resolution.x;
            this.canvas.height = this.pv.resolution.y;
            this.canvas.style.position = "absolute";
            this.canvas.style.left = "0px";
            this.canvas.style.top = "0px";
            this.canvas.style.zIndex = "100";
            this.canvas.style.background = 'red';
            this.canvas.id = 'hydraCanvas';
            document.body.appendChild(this.canvas);

            this.hydra = new this.HydraSynth({
                canvas: this.canvas, // canvas element to render to. If none is supplied, a canvas will be created and appended to the screen
                autoLoop: true,
                makeGlobal: true,
                detectAudio: false,
                numSources: 4, // number of source buffers to create initially
                numOutputs: 4, // number of output buffers to use. Note: untested with numbers other than 4. render() method might behave unpredictably
                extendTransforms: [], // An array of transforms to be added to the synth, or an object representing a single transform
                precision: 'lowp', // force precision of shaders, can be 'highp', 'mediump', or 'lowp' (recommended for ios). When no precision is specified, will use highp for ios, and mediump for everything else.
                pb: null,
            });
            console.log('hydra Done', this.hydra);
            // osc(4, 0.1, 1.2).out()
        } else {
        }

        await this._updateTex();
        HydraCustomCopNode.PARAM_CALLBACK_showCanvas(this);
    }

    static PARAM_CALLBACK_update(node) {
        node._updateTex().then(r => console.log('updated texture', r));
    }
    static PARAM_CALLBACK_showCanvas(node) {
        if (node.pv.showCanvas) {
            node.canvas.style.display = 'block';
        } else {
            node.canvas.style.display = 'none';
        }
    }

    async _updateTex() {
        console.log('updateTexture', this);
        await this._evalHydra()
        await this._CanvasToTexture();
    }
    async _evalHydra(update = false) {
        // const empty = Array(Math.round(Math.random()*50)).fill(' ').join('');
        const string = this.pv.hydraCode
        console.log('evalHydra', string);
        this.hydra.sandbox.sandbox.eval(string);
    }
    async _CanvasToTexture() {
        // const imageData = this._webGLtoTexture(this.canvas);

        // const hydraCanvas = document.querySelector('#hydraCanvas');
        const texture = new CanvasTexture(this.canvas);
        // await this.textureParamsController.update(texture);
        texture.needsUpdate = true;
        texture.magFilter = NearestFilter;
        texture.minFilter = NearestFilter;
        texture.name = 'hydraTexture';
        // this.textureParamsController.update(texture);
        this.setTexture(texture);
    }
    _webGLtoTexture(webglCanvas) {
        const offscreenCanvas = document.createElement("canvas");
        offscreenCanvas.width = webglCanvas.width;
        offscreenCanvas.height = webglCanvas.height;
        const ctx = offscreenCanvas.getContext("2d");
        ctx.drawImage(webglCanvas,0,0);
        // const imageData = ctx.getImageData(0,0, offscreenCanvas.width, offscreenCanvas.height);

        console.log('2d canvas:', offscreenCanvas);
        return offscreenCanvas;
    }
}
