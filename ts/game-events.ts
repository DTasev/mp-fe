import Draw from './draw';

/**
 * Implementation for the actions that will be executed according to player actions.
 * 
 * Functions are wrapped to keep `this` context. This is the (e) => {...} syntax.
 * 
 * In short, because the methods are added as event listeners (and are not called directly), the `this` reference starts pointing
 * towards the `window` object. The closure keeps the `this` to point towards this object.
 * 
 * For more details: https://github.com/Microsoft/TypeScript/wiki/'this'-in-TypeScript#red-flags-for-this
 */
export default class GameEvents {
    draw: Draw;
    constructor() {
        this.draw = new Draw();
    }
    mouseDown = (e) => {
        console.log("I am a potato");
    }
    mouseUp = (e) => { }
    mouseMove = (e) => {
        this.draw.updateMousePosition(e);
    }
    touchStart = (e) => { }
    touchEnd = (e) => { }
    touchMove = (e) => { }
}