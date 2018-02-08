/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return GameState; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__game_events_tank_moving__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__game_events_tank_placing__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__game_events_tank_shooting__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__game_events_tank_selection__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__game_events_menu__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__game_objects_player__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__game_events_shared_state__ = __webpack_require__(6);







var GameState;
(function (GameState) {
    GameState[GameState["MENU"] = 0] = "MENU";
    GameState[GameState["TANK_PLACING"] = 1] = "TANK_PLACING";
    GameState[GameState["TANK_MOVING"] = 2] = "TANK_MOVING";
    GameState[GameState["TANK_SELECTION"] = 3] = "TANK_SELECTION";
    GameState[GameState["TANK_SHOOTING"] = 4] = "TANK_SHOOTING";
})(GameState || (GameState = {}));
/**
 * Implementation for the actions that will be executed according to player actions.
 *
 * Functions are wrapped to keep `this` context. This is the (e:MouseEvent) => {...} syntax.
 *
 * In short, because the methods are added as event listeners (and are not called directly), the `this` reference starts pointing
 * towards the `window` object. The closure keeps the `this` to point towards the proper instance of the object.
 *
 * For more details: https://github.com/Microsoft/TypeScript/wiki/'this'-in-TypeScript#red-flags-for-this
 */
class EventController {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;
        this.player = new __WEBPACK_IMPORTED_MODULE_5__game_objects_player__["a" /* Player */]();
        this.shared = new __WEBPACK_IMPORTED_MODULE_6__game_events_shared_state__["b" /* TanksSharedState */]();
        this.changeGameState(GameState.MENU);
    }
    changeGameState(new_state) {
        this.state = new_state;
        // clears any old events that were added
        this.canvas.onmousedown = null;
        window.onmouseup = null;
        this.canvas.onmousemove = null;
        switch (new_state) {
            case GameState.MENU:
                this.action = new __WEBPACK_IMPORTED_MODULE_4__game_events_menu__["a" /* MenuState */](this, this.context);
                console.log("Initialising MENU");
                break;
            case GameState.TANK_PLACING:
                this.action = new __WEBPACK_IMPORTED_MODULE_1__game_events_tank_placing__["a" /* PlacingState */](this, this.context, this.player);
                console.log("Initialising TANK PLACING");
                break;
            case GameState.TANK_SELECTION:
                console.log("Initialising TANK SELECTION");
                this.action = new __WEBPACK_IMPORTED_MODULE_3__game_events_tank_selection__["a" /* SelectionState */](this, this.context, this.player);
                break;
            case GameState.TANK_MOVING:
                console.log("Initialising TANK MOVEMENT");
                this.action = new __WEBPACK_IMPORTED_MODULE_0__game_events_tank_moving__["a" /* MovingState */](this, this.context, this.player);
                break;
            case GameState.TANK_SHOOTING:
                throw new Error("Not implemented yet");
                this.action = new __WEBPACK_IMPORTED_MODULE_2__game_events_tank_shooting__["a" /* ShootingState */](this, this.context);
                break;
            default:
                throw new Error("The game should never be stateless, something has gone terribly wrong");
        }
        // add the mouse events for the new state
        this.action.addEventListeners(this.canvas);
    }
    /** Clears everything from the canvas on the screen. To show anything afterwards it needs to be redrawn. */
    clearCanvas() {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = EventController;

//# sourceMappingURL=event-controller.js.map

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return DrawState; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__cartesian_coords__ = __webpack_require__(2);

class Color {
    constructor() {
        this.red = 0;
        this.green = 0;
        this.blue = 0;
        this.alpha = 1.0;
    }
    toRGB() {
        return "rgb(" + this.red + "," + this.green + "," + this.blue + ")";
    }
    toRGBA() {
        return "rgba(" + this.red + "," + this.green + "," + this.blue + "," + this.alpha + ")";
    }
    set(red, green, blue) {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }
    goYellow() {
        this.set(255, 255, 0);
    }
    goRed() {
        this.set(255, 0, 0);
    }
    goGreen() {
        this.set(0, 255, 0);
    }
    goBlue() {
        this.set(0, 0, 255);
    }
    goWhite() {
        this.set(255, 255, 255);
    }
    goBlack() {
        this.set(0, 0, 0);
    }
    next() {
        if (this.red != 0) {
            this.goGreen();
        }
        else if (this.green != 0) {
            this.goBlue();
        }
        else if (this.blue != 0) {
            this.goRed();
        }
        else {
            this.goRed();
        }
    }
}
class Draw {
    constructor() {
        this.mouse = new __WEBPACK_IMPORTED_MODULE_0__cartesian_coords__["a" /* CartesianCoords */]();
        this.last = new __WEBPACK_IMPORTED_MODULE_0__cartesian_coords__["a" /* CartesianCoords */]();
        this.color = new Color();
    }
    dot(context, coords, width, outline = false, outline_width = 1) {
        // Let's use black by setting RGB values to 0, and 255 alpha (completely opaque)
        // Select a fill style
        context.fillStyle = this.color.toRGBA();
        context.lineWidth = outline_width;
        // Draw a filled circle
        context.beginPath();
        context.arc(coords.X, coords.Y, width, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();
        if (outline) {
            context.strokeStyle = this.color.toRGBA();
            context.stroke();
        }
    }
    circle(context, coords, width, outline = false, outline_width = 1) {
        // Let's use black by setting RGB values to 0, and 255 alpha (completely opaque)
        // Select a fill style
        context.strokeStyle = this.color.toRGBA();
        context.lineWidth = outline_width;
        // Draw a filled circle
        context.beginPath();
        context.arc(coords.X, coords.Y, width, 0, Math.PI * 2, true);
        context.closePath();
        context.stroke();
        if (outline) {
            context.strokeStyle = this.color.toRGBA();
            context.stroke();
        }
    }
    /**
     * Draw a line between the last known position of the mouse, and the current position.
     * @param context The canvas context that we're drawing on
     * @param update_last Whether to update the last position of the mouse
     */
    line(context, width, update_last = true) {
        // If lastX is not set, set lastX and lastY to the current position 
        if (this.last.X == -1) {
            this.last.X = this.mouse.X;
            this.last.Y = this.mouse.Y;
        }
        // Select a fill style
        context.strokeStyle = this.color.toRGBA();
        // Set the line "cap" style to round, so lines at different angles can join into each other
        context.lineCap = "round";
        context.lineJoin = "round";
        // Draw a filled line
        context.beginPath();
        // First, move to the old (previous) position
        context.moveTo(this.last.X, this.last.Y);
        // Now draw a line to the current touch/pointer position
        context.lineTo(this.mouse.X, this.mouse.Y);
        // Set the line thickness and draw the line
        context.lineWidth = width;
        context.stroke();
        context.closePath();
        if (update_last) {
            // Update the last position to reference the current position
            this.last.X = this.mouse.X;
            this.last.Y = this.mouse.Y;
        }
    }
    updateMousePosition(e) {
        if (!e) {
            var e = event;
        }
        if (e.offsetX) {
            this.mouse.X = e.offsetX;
            this.mouse.Y = e.offsetY;
        }
    }
    updateTouchPosition(e) {
        if (!e) {
            var e = event;
        }
        if (e.touches) {
            // Only deal with one finger
            if (e.touches.length == 1) {
                // Get the information for finger #1
                const touch = e.touches[0];
                // the 'target' will be the canvas element
                this.mouse.X = touch.pageX - touch.target.offsetLeft;
                this.mouse.Y = touch.pageY - touch.target.offsetTop;
            }
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Draw;

var DrawState;
(function (DrawState) {
    DrawState[DrawState["DRAWING"] = 0] = "DRAWING";
    DrawState[DrawState["STOPPED"] = 1] = "STOPPED";
})(DrawState || (DrawState = {}));
//# sourceMappingURL=draw.js.map

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class CartesianCoords {
    constructor(x = -1, y = -1) {
        this.X = x;
        this.Y = y;
    }
    copy() {
        return new CartesianCoords(this.X, this.Y);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CartesianCoords;

//# sourceMappingURL=cartesian-coords.js.map

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__cartesian_coords__ = __webpack_require__(2);

class Tank {
    constructor(x, y) {
        this.position = new __WEBPACK_IMPORTED_MODULE_0__cartesian_coords__["a" /* CartesianCoords */](x, y);
    }
    draw(context, draw) {
        draw.color.goBlack();
        draw.circle(context, this.position, Tank.DEFAULT_WIDTH);
    }
    highlight(context, draw) {
        draw.color.goRed();
        draw.dot(context, this.position, Tank.DEFAULT_WIDTH + 5, true, 5);
        draw.color.goGreen();
        draw.circle(context, this.position, Tank.DEFAULT_MOVEMENT_RANGE);
        draw.color.goBlack();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Tank;

Tank.DEFAULT_WIDTH = 12;
Tank.DEFAULT_MOVEMENT_RANGE = 100;
Tank.DEFAULT_MOVEMENT_LINE_WIDTH = 3;
//# sourceMappingURL=tank.js.map

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Point {
    /**
     * Calculate the distance between two points, on a 2D plane using Pythogorean Theorem
     * @param start First point with 2D coordinates
     * @param end Second point with 2D coordinates
     */
    dist2d(start, end) {
        const delta_x = end.X - start.X;
        const delta_y = end.Y - start.Y;
        return Math.sqrt(Math.abs(delta_x * delta_x + delta_y * delta_y));
    }
    /**
     * Calculate if the point collides with the circle.
     * @param point The coordinates of the point (user's click)
     * @param object The coordinates of the object
     * @param radius The radius of the object
     * @returns true if there is collision, false otherwise
     */
    collide_circle(point, object, radius) {
        const distance = this.dist2d(point, object);
        if (distance > radius) {
            return false;
        }
        return true;
    }
}
class TanksMath {
}
/* harmony export (immutable) */ __webpack_exports__["a"] = TanksMath;

TanksMath.point = new Point();
//# sourceMappingURL=tanks-math.js.map

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class ActionLimiter {
    constructor(limit = 5) {
        this.limit = limit;
        this.num_actions = 0;
        this.num_actions = 0;
    }
    end() {
        this.num_actions += 1;
        return this.num_actions >= this.limit;
    }
    next() {
        this.num_actions = 0;
        this.turns += 1;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ActionLimiter;

//# sourceMappingURL=action-limiter.js.map

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class ActiveTank {
    constructor(id, position) {
        this.valid_position = false;
        this.id = id;
        this.position = position;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ActiveTank;

class TanksSharedState {
    constructor() {
        this.active = new SingleAccess();
        this.next = new SingleAccess();
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = TanksSharedState;

class SingleAccess {
    constructor() {
        this.resource = null;
        this.accessed = false;
    }
    set(resource) {
        this.resource = resource;
        this.accessed = false;
    }
    available() {
        return !this.accessed && this.resource !== null;
    }
    get() {
        if (!this.accessed) {
            const x = this.resource;
            this.resource = null;
            return x;
        }
        else {
            throw new Error("This single access object has already been accessed.");
        }
    }
}
//# sourceMappingURL=shared-state.js.map

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__build_site_controls__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__build_canvas__ = __webpack_require__(9);
// Classes added to the `window` object are global, and visible inside the HTML code.
// Any classes not added to the `window` are invisible (not accessible) from the HTML.
// Global classes

window.Controls = __WEBPACK_IMPORTED_MODULE_0__build_site_controls__["a" /* default */];

// Internal classes


var ID_GAME_CANVAS = "tanks-canvas";

// Set-up the canvas and add our event handlers after the page has loaded
function init() {
    let canvas = new __WEBPACK_IMPORTED_MODULE_1__build_canvas__["a" /* Canvas */](ID_GAME_CANVAS);
    canvas.setDOMResolution(window.innerWidth - 32, window.innerHeight * 0.9);
}

init(); 

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Controls {
    static toggle_w3_show(html_elem) {
        if (html_elem.className.indexOf("w3-show") == -1) {
            html_elem.className += " w3-show";
        }
        else {
            html_elem.className = html_elem.className.replace(" w3-show", "");
        }
    }
    static w3_open() {
        document.getElementById("mySidebar").style.display = "block";
        document.getElementById("myOverlay").style.display = "block";
    }
    static w3_close() {
        document.getElementById("mySidebar").style.display = "none";
        document.getElementById("myOverlay").style.display = "none";
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Controls;

//# sourceMappingURL=site-controls.js.map

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__event_controller__ = __webpack_require__(0);

class Canvas {
    constructor(id) {
        this.canvas = document.getElementById(id);
        this.events = new __WEBPACK_IMPORTED_MODULE_0__event_controller__["a" /* EventController */](this.canvas, this.canvas.getContext("2d"));
        // initialise as empty removal function 
        {
            // Browsers really don't like styluses yet. Only pointermove is called when stylus hovers
            // and pointerleave is called when the stylus is pressed down
            //     let down_times: number = 0;
            //     let up_times: number = 0;
            //     let move_times: number = 0;
            //     this.canvas.addEventListener('pointerdown', (e) => { this.showEvent(e, "pointerdown", down_times++); }, false);
            //     this.canvas.addEventListener('pointerup', (e) => { this.showEvent(e, "pointerup", up_times++); }, false);
            //     this.canvas.addEventListener('pointermove', (e) => { this.showEvent(e, "pointermove", move_times++); }, false);
            //     let over_times = 0;
            //     this.canvas.addEventListener('pointerover', (e) => { this.showEvent(e, "pointerover", over_times++); }, false);
            //     let leave_times = 0;
            //     this.canvas.addEventListener('pointerleave', (e) => { this.showEvent(e, "pointerleave", leave_times++); }, false);
            //     let enter_times = 0;
            //     this.canvas.addEventListener('pointerenter', (e) => { this.showEvent(e, "pointerenter", enter_times++); }, false);
            //     let out_times = 0;
            //     this.canvas.addEventListener('pointerout', (e) => { this.showEvent(e, "pointerout", out_times++); }, false);
            //     let cancel_times = 0;
            //     this.canvas.addEventListener('pointercancel', (e) => { this.showEvent(e, "pointercancel", cancel_times++); }, false);
            //     let capture_times = 0;
            //     this.canvas.addEventListener('gotpointercapture', (e) => { this.showEvent(e, "gotpointercapture", capture_times++); }, false);
            //     let lost_capture_times = 0;
            //     this.canvas.addEventListener('lostpointercapture', (e) => { this.showEvent(e, "lostpointercapture", lost_capture_times++); }, false);
        }
    }
    /**
     * Debug function to display which event is triggered, and how many times.
     * @param e The actual event class
     * @param message Message to be displayed, this should identify the event
     * @param times How many times it has been repeated, the counting must be done externally
     */
    showEvent(e, message, times) {
        document.getElementById("debug-status").innerHTML = message + "times: " + times;
        event.preventDefault();
    }
    setDOMResolution(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Canvas;

//# sourceMappingURL=canvas.js.map

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__draw__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__line_limiter__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__action_limiter__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__event_controller__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__cartesian_coords__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__game_objects_tank__ = __webpack_require__(3);






class MovingState {
    constructor(controller, context, player) {
        this.startMovement = (e) => {
            // limit the start of the line to be the tank
            this.draw.last = new __WEBPACK_IMPORTED_MODULE_4__cartesian_coords__["a" /* CartesianCoords */](this.active.position.X, this.active.position.Y);
            this.draw.state = __WEBPACK_IMPORTED_MODULE_0__draw__["b" /* DrawState */].DRAWING;
            // limit the lenght of the line to the maximum allowed tank movement
            if (this.line.in(this.active.position, this.draw.mouse)) {
                this.validMove();
            }
        };
        this.endMovement = (e) => {
            this.draw.state = __WEBPACK_IMPORTED_MODULE_0__draw__["b" /* DrawState */].STOPPED;
            // reset the line limit as the user has let go of the button
            this.line.reset();
            // only draw if the position is valid
            if (this.active.valid_position) {
                // update the position of the tank in the player array
                this.player.tanks[this.active.id].position = this.draw.mouse.copy();
                this.showUserWarning("");
            }
            // redraw canvas with all current tanks
            this.redraw(this.player.tanks);
            // To add: if out of actions, then next state is TANK_SHOOTING
            // come back to moving after selection
            this.controller.shared.next.set(__WEBPACK_IMPORTED_MODULE_3__event_controller__["b" /* GameState */].TANK_MOVING);
            // go to tank selection state
            this.controller.changeGameState(__WEBPACK_IMPORTED_MODULE_3__event_controller__["b" /* GameState */].TANK_SELECTION);
        };
        this.drawMoveLine = (e) => {
            this.draw.updateMousePosition(e);
            // draw the movement line if the mouse button is currently being pressed
            if (this.draw.state == __WEBPACK_IMPORTED_MODULE_0__draw__["b" /* DrawState */].DRAWING) {
                if (this.line.in(this.active.position, this.draw.mouse)) {
                    this.validMove();
                }
                else {
                    this.active.valid_position = false;
                }
            }
        };
        this.controller = controller;
        this.context = context;
        this.player = player;
        this.draw = new __WEBPACK_IMPORTED_MODULE_0__draw__["a" /* Draw */]();
        this.line = new __WEBPACK_IMPORTED_MODULE_1__line_limiter__["a" /* LineLimiter */](__WEBPACK_IMPORTED_MODULE_5__game_objects_tank__["a" /* Tank */].DEFAULT_MOVEMENT_RANGE);
        this.turn = new __WEBPACK_IMPORTED_MODULE_2__action_limiter__["a" /* ActionLimiter */]();
        this.active = this.controller.shared.active.get();
    }
    addEventListeners(canvas) {
        canvas.onmousedown = this.startMovement;
        canvas.onmousemove = this.drawMoveLine;
        // NOTE: mouseup is on the whole window, so that even if the cursor exits the canvas, the event will trigger
        window.onmouseup = this.endMovement;
        // canvas.addEventListener('touchstart', this.touchMove, false);
        // canvas.addEventListener('touchend', this.mouseUp, false);
        // canvas.addEventListener('touchmove', this.touchMove, false);
    }
    showUserWarning(message) {
        document.getElementById("user-warning").innerHTML = message;
    }
    validMove() {
        this.active.valid_position = true;
        this.draw.line(this.context, __WEBPACK_IMPORTED_MODULE_5__game_objects_tank__["a" /* Tank */].DEFAULT_MOVEMENT_LINE_WIDTH);
    }
    // CONSIDER: Move this into controller? We'll have to redraw all player objects, and the controller will be the one that knows them all
    redraw(tanks) {
        this.controller.clearCanvas();
        for (const tank of tanks) {
            tank.draw(this.context, this.draw);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MovingState;

//# sourceMappingURL=tank-moving.js.map

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tanks_math__ = __webpack_require__(4);

class LineLimiter {
    /**
     * Calcualtes and keeps track of the total length of a line.
     *
     * @param limit Maximum length of each line, in canvas pixels
     */
    constructor(limit = 200) {
        this.limit = limit;
        this.current = 0;
    }
    reset() {
        this.current = 0;
    }
    /**
     * Calculate distance of Cartesian coordinates, and increment the total length of the line.
     *
     * @param start Start coordinates
     * @param end End coordinates
     * @returns true if the line is below the limit, false if the line is longer than the limit
     */
    add(start, end) {
        this.current += __WEBPACK_IMPORTED_MODULE_0__tanks_math__["a" /* TanksMath */].point.dist2d(start, end);
        return this.current <= this.limit;
    }
    /**
     * Check if the distance between the two points is greater than the limit.
     *
     * @param start Start coordinates
     * @param end End coordinates
     * @returns true if the line is below the limit, false otherwise
     */
    in(start, end) {
        const distance = __WEBPACK_IMPORTED_MODULE_0__tanks_math__["a" /* TanksMath */].point.dist2d(start, end);
        return distance <= this.limit;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = LineLimiter;

//# sourceMappingURL=line-limiter.js.map

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__event_controller__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__game_objects_tank__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__draw__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__action_limiter__ = __webpack_require__(5);




class PlacingState {
    /**
     *
     * @param controller The events controller, which is used to change the game state after this event is finished.
     * @param context Context on which the objects are drawn
     * @param player
     */
    constructor(controller, context, player) {
        this.addTank = (e) => {
            this.draw.updateMousePosition(e);
            const tank = new __WEBPACK_IMPORTED_MODULE_1__game_objects_tank__["a" /* Tank */](this.draw.mouse.X, this.draw.mouse.Y);
            tank.player = this.player;
            this.player.tanks.push(tank);
            tank.draw(this.context, this.draw);
            // if we've placed as many objects as allowed, then go to next state
            if (this.turn.end()) {
                this.controller.shared.next.set(__WEBPACK_IMPORTED_MODULE_0__event_controller__["b" /* GameState */].TANK_MOVING);
                this.controller.changeGameState(__WEBPACK_IMPORTED_MODULE_0__event_controller__["b" /* GameState */].TANK_SELECTION);
            }
        };
        this.controller = controller;
        this.context = context;
        this.draw = new __WEBPACK_IMPORTED_MODULE_2__draw__["a" /* Draw */]();
        this.turn = new __WEBPACK_IMPORTED_MODULE_3__action_limiter__["a" /* ActionLimiter */]();
        this.player = player;
    }
    addEventListeners(canvas) {
        canvas.onmousedown = this.addTank;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PlacingState;

//# sourceMappingURL=tank-placing.js.map

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__event_controller__ = __webpack_require__(0);

class ShootingState {
    constructor(controller, context) {
        this.someFunc = () => {
            console.log("Changing state from TANK SHOOTING to MENU");
            this.controller.changeGameState(__WEBPACK_IMPORTED_MODULE_0__event_controller__["b" /* GameState */].MENU);
        };
        console.log("Initialising TANK SHOOTING");
        this.controller = controller;
        this.context = context;
    }
    addEventListeners(canvas) {
        canvas.addEventListener("mousedown", this.someFunc, false);
    }
    removeEventListeners(canvas) {
        canvas.removeEventListener("mousedown", this.someFunc, false);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ShootingState;

//# sourceMappingURL=tank-shooting.js.map

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tanks_math__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__draw__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__game_objects_tank__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shared_state__ = __webpack_require__(6);




class SelectionState {
    constructor(controller, context, player) {
        this.highlightTank = (e) => {
            this.draw.updateMousePosition(e);
            // Check if the user has clicked any tank.
            for (const [id, tank] of this.player.tanks.entries()) {
                if (__WEBPACK_IMPORTED_MODULE_0__tanks_math__["a" /* TanksMath */].point.collide_circle(this.draw.mouse, tank.position, __WEBPACK_IMPORTED_MODULE_2__game_objects_tank__["a" /* Tank */].DEFAULT_WIDTH)) {
                    // highlight the selected tank
                    tank.highlight(this.context, this.draw);
                    // store the details of the active tank
                    this.controller.shared.active.set(new __WEBPACK_IMPORTED_MODULE_3__shared_state__["a" /* ActiveTank */](id, tank.position));
                    // only highlight the first tank
                    break;
                }
            }
        };
        this.mouseUp = (e) => {
            // if the user has clicked on any of the objects, go into movement state
            if (this.controller.shared.active.available()) {
                this.controller.changeGameState(this.controller.shared.next.get());
            }
        };
        this.controller = controller;
        this.context = context;
        this.player = player;
        this.draw = new __WEBPACK_IMPORTED_MODULE_1__draw__["a" /* Draw */]();
    }
    addEventListeners(canvas) {
        canvas.onmousedown = this.highlightTank;
        // NOTE: mouseup is on the whole window, so that even if the cursor exits the canvas, the event will trigger
        window.onmouseup = this.mouseUp;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SelectionState;

//# sourceMappingURL=tank-selection.js.map

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__event_controller__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__draw__ = __webpack_require__(1);


class Menu {
    constructor(title, options) {
        this.start_height = 150;
        this.height_increment = 100;
        this.title = title;
        this.options = options;
    }
    draw(context, draw) {
        const width = context.canvas.width;
        const height = context.canvas.height;
        context.fillStyle = "Black";
        context.fillRect(0, 0, width, height);
        context.textAlign = "center";
        context.fillStyle = "rgb(135,206,250)";
        context.font = "60px Georgia";
        let text_height = this.start_height;
        context.fillText(this.title, width / 2, text_height);
        context.fillStyle = "White";
        context.font = "30px Georgia";
        text_height += this.height_increment;
        for (const [id, option] of this.options.entries()) {
            if (this.selected(id)) {
                context.fillStyle = "Yellow";
                context.font = "40px Georgia";
            }
            else {
                context.fillStyle = "White";
                context.font = "30px Georgia";
            }
            context.fillText(option, width / 2, text_height);
            text_height += this.height_increment;
        }
    }
    selected(id) {
        return this.selected_item === id;
    }
}
class MenuState {
    constructor(controller, context) {
        this.selectMenuitem = (e) => {
            this.draw.updateMousePosition(e);
        };
        this.someFunc = () => {
            console.log("Changing state from MENU EVENT to TANK PLACING");
            this.controller.clearCanvas();
            this.controller.changeGameState(__WEBPACK_IMPORTED_MODULE_0__event_controller__["b" /* GameState */].TANK_PLACING);
        };
        this.controller = controller;
        this.context = context;
        this.draw = new __WEBPACK_IMPORTED_MODULE_1__draw__["a" /* Draw */]();
        this.menu = new Menu("Tanks", ["Start game"]);
        this.menu.draw(this.context, this.draw);
    }
    addEventListeners(canvas) {
        canvas.onmousedown = this.someFunc;
        canvas.onmousemove = this.selectMenuitem;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MenuState;

//# sourceMappingURL=menu.js.map

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Player {
    constructor() {
        this.tanks = new Array();
    }
    ;
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Player;

//# sourceMappingURL=player.js.map

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYzM1OGJmYTRjYjI4OWIwMWMwMjkiLCJ3ZWJwYWNrOi8vLy4vYnVpbGQvZXZlbnQtY29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly8vLi9idWlsZC9kcmF3LmpzIiwid2VicGFjazovLy8uL2J1aWxkL2NhcnRlc2lhbi1jb29yZHMuanMiLCJ3ZWJwYWNrOi8vLy4vYnVpbGQvZ2FtZS1vYmplY3RzL3RhbmsuanMiLCJ3ZWJwYWNrOi8vLy4vYnVpbGQvdGFua3MtbWF0aC5qcyIsIndlYnBhY2s6Ly8vLi9idWlsZC9hY3Rpb24tbGltaXRlci5qcyIsIndlYnBhY2s6Ly8vLi9idWlsZC9nYW1lLWV2ZW50cy9zaGFyZWQtc3RhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9idWlsZC9zaXRlLWNvbnRyb2xzLmpzIiwid2VicGFjazovLy8uL2J1aWxkL2NhbnZhcy5qcyIsIndlYnBhY2s6Ly8vLi9idWlsZC9nYW1lLWV2ZW50cy90YW5rLW1vdmluZy5qcyIsIndlYnBhY2s6Ly8vLi9idWlsZC9saW5lLWxpbWl0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vYnVpbGQvZ2FtZS1ldmVudHMvdGFuay1wbGFjaW5nLmpzIiwid2VicGFjazovLy8uL2J1aWxkL2dhbWUtZXZlbnRzL3Rhbmstc2hvb3RpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vYnVpbGQvZ2FtZS1ldmVudHMvdGFuay1zZWxlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vYnVpbGQvZ2FtZS1ldmVudHMvbWVudS5qcyIsIndlYnBhY2s6Ly8vLi9idWlsZC9nYW1lLW9iamVjdHMvcGxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQzdEc0I7QUFDQztBQUNDO0FBQ0M7QUFDTDtBQUNIO0FBQ1U7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLDhCQUE4QjtBQUMvQjtBQUNBO0FBQ0E7QUFDQSxnRkFBZ0YsSUFBSTtBQUNwRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQSw0Qzs7Ozs7Ozs7O0FDdkUwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLDhCQUE4QjtBQUMvQixnQzs7Ozs7OztBQ3RKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0EsNEM7Ozs7Ozs7O0FDVDBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDOzs7Ozs7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0Esc0M7Ozs7Ozs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBLDBDOzs7Ozs7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Qzs7Ozs7Ozs7O0FDcENBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNpQjs7QUFFakI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxPOzs7Ozs7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQSx5Qzs7Ozs7Ozs7QUNsQjBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1RUFBdUUsZ0RBQWdELEVBQUU7QUFDekgscUVBQXFFLDRDQUE0QyxFQUFFO0FBQ25ILHVFQUF1RSxnREFBZ0QsRUFBRTtBQUN6SDtBQUNBLHVFQUF1RSxnREFBZ0QsRUFBRTtBQUN6SDtBQUNBLHdFQUF3RSxrREFBa0QsRUFBRTtBQUM1SDtBQUNBLHdFQUF3RSxrREFBa0QsRUFBRTtBQUM1SDtBQUNBLHNFQUFzRSw4Q0FBOEMsRUFBRTtBQUN0SDtBQUNBLHlFQUF5RSxvREFBb0QsRUFBRTtBQUMvSDtBQUNBLDZFQUE2RSx5REFBeUQsRUFBRTtBQUN4STtBQUNBLDhFQUE4RSwrREFBK0QsRUFBRTtBQUMvSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBLGtDOzs7Ozs7Ozs7Ozs7O0FDOUMwQjtBQUNKO0FBQ0U7QUFDSjtBQUNNO0FBQ1g7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQSx1Qzs7Ozs7Ozs7QUMvRW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQSx3Qzs7Ozs7Ozs7Ozs7QUNyQ29CO0FBQ0w7QUFDQTtBQUNTO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQSx3Qzs7Ozs7Ozs7QUNsQ29CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0EseUM7Ozs7Ozs7Ozs7O0FDbEJvQjtBQUNMO0FBQ0E7QUFDTTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0EsMEM7Ozs7Ozs7OztBQ3JDb0I7QUFDTDtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBLGdDOzs7Ozs7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQSxrQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA3KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBjMzU4YmZhNGNiMjg5YjAxYzAyOSIsImltcG9ydCB7IE1vdmluZ1N0YXRlIH0gZnJvbSBcIi4vZ2FtZS1ldmVudHMvdGFuay1tb3ZpbmdcIjtcclxuaW1wb3J0IHsgUGxhY2luZ1N0YXRlIH0gZnJvbSBcIi4vZ2FtZS1ldmVudHMvdGFuay1wbGFjaW5nXCI7XHJcbmltcG9ydCB7IFNob290aW5nU3RhdGUgfSBmcm9tIFwiLi9nYW1lLWV2ZW50cy90YW5rLXNob290aW5nXCI7XHJcbmltcG9ydCB7IFNlbGVjdGlvblN0YXRlIH0gZnJvbSBcIi4vZ2FtZS1ldmVudHMvdGFuay1zZWxlY3Rpb25cIjtcclxuaW1wb3J0IHsgTWVudVN0YXRlIH0gZnJvbSBcIi4vZ2FtZS1ldmVudHMvbWVudVwiO1xyXG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tICcuL2dhbWUtb2JqZWN0cy9wbGF5ZXInO1xyXG5pbXBvcnQgeyBUYW5rc1NoYXJlZFN0YXRlIH0gZnJvbSBcIi4vZ2FtZS1ldmVudHMvc2hhcmVkLXN0YXRlXCI7XHJcbmV4cG9ydCB2YXIgR2FtZVN0YXRlO1xyXG4oZnVuY3Rpb24gKEdhbWVTdGF0ZSkge1xyXG4gICAgR2FtZVN0YXRlW0dhbWVTdGF0ZVtcIk1FTlVcIl0gPSAwXSA9IFwiTUVOVVwiO1xyXG4gICAgR2FtZVN0YXRlW0dhbWVTdGF0ZVtcIlRBTktfUExBQ0lOR1wiXSA9IDFdID0gXCJUQU5LX1BMQUNJTkdcIjtcclxuICAgIEdhbWVTdGF0ZVtHYW1lU3RhdGVbXCJUQU5LX01PVklOR1wiXSA9IDJdID0gXCJUQU5LX01PVklOR1wiO1xyXG4gICAgR2FtZVN0YXRlW0dhbWVTdGF0ZVtcIlRBTktfU0VMRUNUSU9OXCJdID0gM10gPSBcIlRBTktfU0VMRUNUSU9OXCI7XHJcbiAgICBHYW1lU3RhdGVbR2FtZVN0YXRlW1wiVEFOS19TSE9PVElOR1wiXSA9IDRdID0gXCJUQU5LX1NIT09USU5HXCI7XHJcbn0pKEdhbWVTdGF0ZSB8fCAoR2FtZVN0YXRlID0ge30pKTtcclxuLyoqXHJcbiAqIEltcGxlbWVudGF0aW9uIGZvciB0aGUgYWN0aW9ucyB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgYWNjb3JkaW5nIHRvIHBsYXllciBhY3Rpb25zLlxyXG4gKlxyXG4gKiBGdW5jdGlvbnMgYXJlIHdyYXBwZWQgdG8ga2VlcCBgdGhpc2AgY29udGV4dC4gVGhpcyBpcyB0aGUgKGU6TW91c2VFdmVudCkgPT4gey4uLn0gc3ludGF4LlxyXG4gKlxyXG4gKiBJbiBzaG9ydCwgYmVjYXVzZSB0aGUgbWV0aG9kcyBhcmUgYWRkZWQgYXMgZXZlbnQgbGlzdGVuZXJzIChhbmQgYXJlIG5vdCBjYWxsZWQgZGlyZWN0bHkpLCB0aGUgYHRoaXNgIHJlZmVyZW5jZSBzdGFydHMgcG9pbnRpbmdcclxuICogdG93YXJkcyB0aGUgYHdpbmRvd2Agb2JqZWN0LiBUaGUgY2xvc3VyZSBrZWVwcyB0aGUgYHRoaXNgIHRvIHBvaW50IHRvd2FyZHMgdGhlIHByb3BlciBpbnN0YW5jZSBvZiB0aGUgb2JqZWN0LlxyXG4gKlxyXG4gKiBGb3IgbW9yZSBkZXRhaWxzOiBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L1R5cGVTY3JpcHQvd2lraS8ndGhpcyctaW4tVHlwZVNjcmlwdCNyZWQtZmxhZ3MtZm9yLXRoaXNcclxuICovXHJcbmV4cG9ydCBjbGFzcyBFdmVudENvbnRyb2xsZXIge1xyXG4gICAgY29uc3RydWN0b3IoY2FudmFzLCBjb250ZXh0KSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcclxuICAgICAgICB0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXIoKTtcclxuICAgICAgICB0aGlzLnNoYXJlZCA9IG5ldyBUYW5rc1NoYXJlZFN0YXRlKCk7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VHYW1lU3RhdGUoR2FtZVN0YXRlLk1FTlUpO1xyXG4gICAgfVxyXG4gICAgY2hhbmdlR2FtZVN0YXRlKG5ld19zdGF0ZSkge1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSBuZXdfc3RhdGU7XHJcbiAgICAgICAgLy8gY2xlYXJzIGFueSBvbGQgZXZlbnRzIHRoYXQgd2VyZSBhZGRlZFxyXG4gICAgICAgIHRoaXMuY2FudmFzLm9ubW91c2Vkb3duID0gbnVsbDtcclxuICAgICAgICB3aW5kb3cub25tb3VzZXVwID0gbnVsbDtcclxuICAgICAgICB0aGlzLmNhbnZhcy5vbm1vdXNlbW92ZSA9IG51bGw7XHJcbiAgICAgICAgc3dpdGNoIChuZXdfc3RhdGUpIHtcclxuICAgICAgICAgICAgY2FzZSBHYW1lU3RhdGUuTUVOVTpcclxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9uID0gbmV3IE1lbnVTdGF0ZSh0aGlzLCB0aGlzLmNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJbml0aWFsaXNpbmcgTUVOVVwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIEdhbWVTdGF0ZS5UQU5LX1BMQUNJTkc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGlvbiA9IG5ldyBQbGFjaW5nU3RhdGUodGhpcywgdGhpcy5jb250ZXh0LCB0aGlzLnBsYXllcik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkluaXRpYWxpc2luZyBUQU5LIFBMQUNJTkdcIik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBHYW1lU3RhdGUuVEFOS19TRUxFQ1RJT046XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkluaXRpYWxpc2luZyBUQU5LIFNFTEVDVElPTlwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9uID0gbmV3IFNlbGVjdGlvblN0YXRlKHRoaXMsIHRoaXMuY29udGV4dCwgdGhpcy5wbGF5ZXIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgR2FtZVN0YXRlLlRBTktfTU9WSU5HOlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJbml0aWFsaXNpbmcgVEFOSyBNT1ZFTUVOVFwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9uID0gbmV3IE1vdmluZ1N0YXRlKHRoaXMsIHRoaXMuY29udGV4dCwgdGhpcy5wbGF5ZXIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgR2FtZVN0YXRlLlRBTktfU0hPT1RJTkc6XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQgeWV0XCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hY3Rpb24gPSBuZXcgU2hvb3RpbmdTdGF0ZSh0aGlzLCB0aGlzLmNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgZ2FtZSBzaG91bGQgbmV2ZXIgYmUgc3RhdGVsZXNzLCBzb21ldGhpbmcgaGFzIGdvbmUgdGVycmlibHkgd3JvbmdcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGFkZCB0aGUgbW91c2UgZXZlbnRzIGZvciB0aGUgbmV3IHN0YXRlXHJcbiAgICAgICAgdGhpcy5hY3Rpb24uYWRkRXZlbnRMaXN0ZW5lcnModGhpcy5jYW52YXMpO1xyXG4gICAgfVxyXG4gICAgLyoqIENsZWFycyBldmVyeXRoaW5nIGZyb20gdGhlIGNhbnZhcyBvbiB0aGUgc2NyZWVuLiBUbyBzaG93IGFueXRoaW5nIGFmdGVyd2FyZHMgaXQgbmVlZHMgdG8gYmUgcmVkcmF3bi4gKi9cclxuICAgIGNsZWFyQ2FudmFzKCkge1xyXG4gICAgICAgIHRoaXMuY29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jb250ZXh0LmNhbnZhcy53aWR0aCwgdGhpcy5jb250ZXh0LmNhbnZhcy5oZWlnaHQpO1xyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWV2ZW50LWNvbnRyb2xsZXIuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9idWlsZC9ldmVudC1jb250cm9sbGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IENhcnRlc2lhbkNvb3JkcyB9IGZyb20gXCIuL2NhcnRlc2lhbi1jb29yZHNcIjtcclxuY2xhc3MgQ29sb3Ige1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5yZWQgPSAwO1xyXG4gICAgICAgIHRoaXMuZ3JlZW4gPSAwO1xyXG4gICAgICAgIHRoaXMuYmx1ZSA9IDA7XHJcbiAgICAgICAgdGhpcy5hbHBoYSA9IDEuMDtcclxuICAgIH1cclxuICAgIHRvUkdCKCkge1xyXG4gICAgICAgIHJldHVybiBcInJnYihcIiArIHRoaXMucmVkICsgXCIsXCIgKyB0aGlzLmdyZWVuICsgXCIsXCIgKyB0aGlzLmJsdWUgKyBcIilcIjtcclxuICAgIH1cclxuICAgIHRvUkdCQSgpIHtcclxuICAgICAgICByZXR1cm4gXCJyZ2JhKFwiICsgdGhpcy5yZWQgKyBcIixcIiArIHRoaXMuZ3JlZW4gKyBcIixcIiArIHRoaXMuYmx1ZSArIFwiLFwiICsgdGhpcy5hbHBoYSArIFwiKVwiO1xyXG4gICAgfVxyXG4gICAgc2V0KHJlZCwgZ3JlZW4sIGJsdWUpIHtcclxuICAgICAgICB0aGlzLnJlZCA9IHJlZDtcclxuICAgICAgICB0aGlzLmdyZWVuID0gZ3JlZW47XHJcbiAgICAgICAgdGhpcy5ibHVlID0gYmx1ZTtcclxuICAgIH1cclxuICAgIGdvWWVsbG93KCkge1xyXG4gICAgICAgIHRoaXMuc2V0KDI1NSwgMjU1LCAwKTtcclxuICAgIH1cclxuICAgIGdvUmVkKCkge1xyXG4gICAgICAgIHRoaXMuc2V0KDI1NSwgMCwgMCk7XHJcbiAgICB9XHJcbiAgICBnb0dyZWVuKCkge1xyXG4gICAgICAgIHRoaXMuc2V0KDAsIDI1NSwgMCk7XHJcbiAgICB9XHJcbiAgICBnb0JsdWUoKSB7XHJcbiAgICAgICAgdGhpcy5zZXQoMCwgMCwgMjU1KTtcclxuICAgIH1cclxuICAgIGdvV2hpdGUoKSB7XHJcbiAgICAgICAgdGhpcy5zZXQoMjU1LCAyNTUsIDI1NSk7XHJcbiAgICB9XHJcbiAgICBnb0JsYWNrKCkge1xyXG4gICAgICAgIHRoaXMuc2V0KDAsIDAsIDApO1xyXG4gICAgfVxyXG4gICAgbmV4dCgpIHtcclxuICAgICAgICBpZiAodGhpcy5yZWQgIT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmdvR3JlZW4oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5ncmVlbiAhPSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ29CbHVlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMuYmx1ZSAhPSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ29SZWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ29SZWQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIERyYXcge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5tb3VzZSA9IG5ldyBDYXJ0ZXNpYW5Db29yZHMoKTtcclxuICAgICAgICB0aGlzLmxhc3QgPSBuZXcgQ2FydGVzaWFuQ29vcmRzKCk7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IG5ldyBDb2xvcigpO1xyXG4gICAgfVxyXG4gICAgZG90KGNvbnRleHQsIGNvb3Jkcywgd2lkdGgsIG91dGxpbmUgPSBmYWxzZSwgb3V0bGluZV93aWR0aCA9IDEpIHtcclxuICAgICAgICAvLyBMZXQncyB1c2UgYmxhY2sgYnkgc2V0dGluZyBSR0IgdmFsdWVzIHRvIDAsIGFuZCAyNTUgYWxwaGEgKGNvbXBsZXRlbHkgb3BhcXVlKVxyXG4gICAgICAgIC8vIFNlbGVjdCBhIGZpbGwgc3R5bGVcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMuY29sb3IudG9SR0JBKCk7XHJcbiAgICAgICAgY29udGV4dC5saW5lV2lkdGggPSBvdXRsaW5lX3dpZHRoO1xyXG4gICAgICAgIC8vIERyYXcgYSBmaWxsZWQgY2lyY2xlXHJcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjb250ZXh0LmFyYyhjb29yZHMuWCwgY29vcmRzLlksIHdpZHRoLCAwLCBNYXRoLlBJICogMiwgdHJ1ZSk7XHJcbiAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgICAgICBpZiAob3V0bGluZSkge1xyXG4gICAgICAgICAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gdGhpcy5jb2xvci50b1JHQkEoKTtcclxuICAgICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjaXJjbGUoY29udGV4dCwgY29vcmRzLCB3aWR0aCwgb3V0bGluZSA9IGZhbHNlLCBvdXRsaW5lX3dpZHRoID0gMSkge1xyXG4gICAgICAgIC8vIExldCdzIHVzZSBibGFjayBieSBzZXR0aW5nIFJHQiB2YWx1ZXMgdG8gMCwgYW5kIDI1NSBhbHBoYSAoY29tcGxldGVseSBvcGFxdWUpXHJcbiAgICAgICAgLy8gU2VsZWN0IGEgZmlsbCBzdHlsZVxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSB0aGlzLmNvbG9yLnRvUkdCQSgpO1xyXG4gICAgICAgIGNvbnRleHQubGluZVdpZHRoID0gb3V0bGluZV93aWR0aDtcclxuICAgICAgICAvLyBEcmF3IGEgZmlsbGVkIGNpcmNsZVxyXG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY29udGV4dC5hcmMoY29vcmRzLlgsIGNvb3Jkcy5ZLCB3aWR0aCwgMCwgTWF0aC5QSSAqIDIsIHRydWUpO1xyXG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICBpZiAob3V0bGluZSkge1xyXG4gICAgICAgICAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gdGhpcy5jb2xvci50b1JHQkEoKTtcclxuICAgICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIERyYXcgYSBsaW5lIGJldHdlZW4gdGhlIGxhc3Qga25vd24gcG9zaXRpb24gb2YgdGhlIG1vdXNlLCBhbmQgdGhlIGN1cnJlbnQgcG9zaXRpb24uXHJcbiAgICAgKiBAcGFyYW0gY29udGV4dCBUaGUgY2FudmFzIGNvbnRleHQgdGhhdCB3ZSdyZSBkcmF3aW5nIG9uXHJcbiAgICAgKiBAcGFyYW0gdXBkYXRlX2xhc3QgV2hldGhlciB0byB1cGRhdGUgdGhlIGxhc3QgcG9zaXRpb24gb2YgdGhlIG1vdXNlXHJcbiAgICAgKi9cclxuICAgIGxpbmUoY29udGV4dCwgd2lkdGgsIHVwZGF0ZV9sYXN0ID0gdHJ1ZSkge1xyXG4gICAgICAgIC8vIElmIGxhc3RYIGlzIG5vdCBzZXQsIHNldCBsYXN0WCBhbmQgbGFzdFkgdG8gdGhlIGN1cnJlbnQgcG9zaXRpb24gXHJcbiAgICAgICAgaWYgKHRoaXMubGFzdC5YID09IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMubGFzdC5YID0gdGhpcy5tb3VzZS5YO1xyXG4gICAgICAgICAgICB0aGlzLmxhc3QuWSA9IHRoaXMubW91c2UuWTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gU2VsZWN0IGEgZmlsbCBzdHlsZVxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSB0aGlzLmNvbG9yLnRvUkdCQSgpO1xyXG4gICAgICAgIC8vIFNldCB0aGUgbGluZSBcImNhcFwiIHN0eWxlIHRvIHJvdW5kLCBzbyBsaW5lcyBhdCBkaWZmZXJlbnQgYW5nbGVzIGNhbiBqb2luIGludG8gZWFjaCBvdGhlclxyXG4gICAgICAgIGNvbnRleHQubGluZUNhcCA9IFwicm91bmRcIjtcclxuICAgICAgICBjb250ZXh0LmxpbmVKb2luID0gXCJyb3VuZFwiO1xyXG4gICAgICAgIC8vIERyYXcgYSBmaWxsZWQgbGluZVxyXG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgLy8gRmlyc3QsIG1vdmUgdG8gdGhlIG9sZCAocHJldmlvdXMpIHBvc2l0aW9uXHJcbiAgICAgICAgY29udGV4dC5tb3ZlVG8odGhpcy5sYXN0LlgsIHRoaXMubGFzdC5ZKTtcclxuICAgICAgICAvLyBOb3cgZHJhdyBhIGxpbmUgdG8gdGhlIGN1cnJlbnQgdG91Y2gvcG9pbnRlciBwb3NpdGlvblxyXG4gICAgICAgIGNvbnRleHQubGluZVRvKHRoaXMubW91c2UuWCwgdGhpcy5tb3VzZS5ZKTtcclxuICAgICAgICAvLyBTZXQgdGhlIGxpbmUgdGhpY2tuZXNzIGFuZCBkcmF3IHRoZSBsaW5lXHJcbiAgICAgICAgY29udGV4dC5saW5lV2lkdGggPSB3aWR0aDtcclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgaWYgKHVwZGF0ZV9sYXN0KSB7XHJcbiAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgbGFzdCBwb3NpdGlvbiB0byByZWZlcmVuY2UgdGhlIGN1cnJlbnQgcG9zaXRpb25cclxuICAgICAgICAgICAgdGhpcy5sYXN0LlggPSB0aGlzLm1vdXNlLlg7XHJcbiAgICAgICAgICAgIHRoaXMubGFzdC5ZID0gdGhpcy5tb3VzZS5ZO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHVwZGF0ZU1vdXNlUG9zaXRpb24oZSkge1xyXG4gICAgICAgIGlmICghZSkge1xyXG4gICAgICAgICAgICB2YXIgZSA9IGV2ZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZS5vZmZzZXRYKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW91c2UuWCA9IGUub2Zmc2V0WDtcclxuICAgICAgICAgICAgdGhpcy5tb3VzZS5ZID0gZS5vZmZzZXRZO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHVwZGF0ZVRvdWNoUG9zaXRpb24oZSkge1xyXG4gICAgICAgIGlmICghZSkge1xyXG4gICAgICAgICAgICB2YXIgZSA9IGV2ZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZS50b3VjaGVzKSB7XHJcbiAgICAgICAgICAgIC8vIE9ubHkgZGVhbCB3aXRoIG9uZSBmaW5nZXJcclxuICAgICAgICAgICAgaWYgKGUudG91Y2hlcy5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBpbmZvcm1hdGlvbiBmb3IgZmluZ2VyICMxXHJcbiAgICAgICAgICAgICAgICBjb25zdCB0b3VjaCA9IGUudG91Y2hlc1swXTtcclxuICAgICAgICAgICAgICAgIC8vIHRoZSAndGFyZ2V0JyB3aWxsIGJlIHRoZSBjYW52YXMgZWxlbWVudFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3VzZS5YID0gdG91Y2gucGFnZVggLSB0b3VjaC50YXJnZXQub2Zmc2V0TGVmdDtcclxuICAgICAgICAgICAgICAgIHRoaXMubW91c2UuWSA9IHRvdWNoLnBhZ2VZIC0gdG91Y2gudGFyZ2V0Lm9mZnNldFRvcDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5leHBvcnQgdmFyIERyYXdTdGF0ZTtcclxuKGZ1bmN0aW9uIChEcmF3U3RhdGUpIHtcclxuICAgIERyYXdTdGF0ZVtEcmF3U3RhdGVbXCJEUkFXSU5HXCJdID0gMF0gPSBcIkRSQVdJTkdcIjtcclxuICAgIERyYXdTdGF0ZVtEcmF3U3RhdGVbXCJTVE9QUEVEXCJdID0gMV0gPSBcIlNUT1BQRURcIjtcclxufSkoRHJhd1N0YXRlIHx8IChEcmF3U3RhdGUgPSB7fSkpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kcmF3LmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYnVpbGQvZHJhdy5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgY2xhc3MgQ2FydGVzaWFuQ29vcmRzIHtcclxuICAgIGNvbnN0cnVjdG9yKHggPSAtMSwgeSA9IC0xKSB7XHJcbiAgICAgICAgdGhpcy5YID0geDtcclxuICAgICAgICB0aGlzLlkgPSB5O1xyXG4gICAgfVxyXG4gICAgY29weSgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IENhcnRlc2lhbkNvb3Jkcyh0aGlzLlgsIHRoaXMuWSk7XHJcbiAgICB9XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y2FydGVzaWFuLWNvb3Jkcy5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2J1aWxkL2NhcnRlc2lhbi1jb29yZHMuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgQ2FydGVzaWFuQ29vcmRzIH0gZnJvbSBcIi4uL2NhcnRlc2lhbi1jb29yZHNcIjtcclxuZXhwb3J0IGNsYXNzIFRhbmsge1xyXG4gICAgY29uc3RydWN0b3IoeCwgeSkge1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXcgQ2FydGVzaWFuQ29vcmRzKHgsIHkpO1xyXG4gICAgfVxyXG4gICAgZHJhdyhjb250ZXh0LCBkcmF3KSB7XHJcbiAgICAgICAgZHJhdy5jb2xvci5nb0JsYWNrKCk7XHJcbiAgICAgICAgZHJhdy5jaXJjbGUoY29udGV4dCwgdGhpcy5wb3NpdGlvbiwgVGFuay5ERUZBVUxUX1dJRFRIKTtcclxuICAgIH1cclxuICAgIGhpZ2hsaWdodChjb250ZXh0LCBkcmF3KSB7XHJcbiAgICAgICAgZHJhdy5jb2xvci5nb1JlZCgpO1xyXG4gICAgICAgIGRyYXcuZG90KGNvbnRleHQsIHRoaXMucG9zaXRpb24sIFRhbmsuREVGQVVMVF9XSURUSCArIDUsIHRydWUsIDUpO1xyXG4gICAgICAgIGRyYXcuY29sb3IuZ29HcmVlbigpO1xyXG4gICAgICAgIGRyYXcuY2lyY2xlKGNvbnRleHQsIHRoaXMucG9zaXRpb24sIFRhbmsuREVGQVVMVF9NT1ZFTUVOVF9SQU5HRSk7XHJcbiAgICAgICAgZHJhdy5jb2xvci5nb0JsYWNrKCk7XHJcbiAgICB9XHJcbn1cclxuVGFuay5ERUZBVUxUX1dJRFRIID0gMTI7XHJcblRhbmsuREVGQVVMVF9NT1ZFTUVOVF9SQU5HRSA9IDEwMDtcclxuVGFuay5ERUZBVUxUX01PVkVNRU5UX0xJTkVfV0lEVEggPSAzO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD10YW5rLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYnVpbGQvZ2FtZS1vYmplY3RzL3RhbmsuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY2xhc3MgUG9pbnQge1xyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGUgdGhlIGRpc3RhbmNlIGJldHdlZW4gdHdvIHBvaW50cywgb24gYSAyRCBwbGFuZSB1c2luZyBQeXRob2dvcmVhbiBUaGVvcmVtXHJcbiAgICAgKiBAcGFyYW0gc3RhcnQgRmlyc3QgcG9pbnQgd2l0aCAyRCBjb29yZGluYXRlc1xyXG4gICAgICogQHBhcmFtIGVuZCBTZWNvbmQgcG9pbnQgd2l0aCAyRCBjb29yZGluYXRlc1xyXG4gICAgICovXHJcbiAgICBkaXN0MmQoc3RhcnQsIGVuZCkge1xyXG4gICAgICAgIGNvbnN0IGRlbHRhX3ggPSBlbmQuWCAtIHN0YXJ0Llg7XHJcbiAgICAgICAgY29uc3QgZGVsdGFfeSA9IGVuZC5ZIC0gc3RhcnQuWTtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGguYWJzKGRlbHRhX3ggKiBkZWx0YV94ICsgZGVsdGFfeSAqIGRlbHRhX3kpKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQ2FsY3VsYXRlIGlmIHRoZSBwb2ludCBjb2xsaWRlcyB3aXRoIHRoZSBjaXJjbGUuXHJcbiAgICAgKiBAcGFyYW0gcG9pbnQgVGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBwb2ludCAodXNlcidzIGNsaWNrKVxyXG4gICAgICogQHBhcmFtIG9iamVjdCBUaGUgY29vcmRpbmF0ZXMgb2YgdGhlIG9iamVjdFxyXG4gICAgICogQHBhcmFtIHJhZGl1cyBUaGUgcmFkaXVzIG9mIHRoZSBvYmplY3RcclxuICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlcmUgaXMgY29sbGlzaW9uLCBmYWxzZSBvdGhlcndpc2VcclxuICAgICAqL1xyXG4gICAgY29sbGlkZV9jaXJjbGUocG9pbnQsIG9iamVjdCwgcmFkaXVzKSB7XHJcbiAgICAgICAgY29uc3QgZGlzdGFuY2UgPSB0aGlzLmRpc3QyZChwb2ludCwgb2JqZWN0KTtcclxuICAgICAgICBpZiAoZGlzdGFuY2UgPiByYWRpdXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgVGFua3NNYXRoIHtcclxufVxyXG5UYW5rc01hdGgucG9pbnQgPSBuZXcgUG9pbnQoKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGFua3MtbWF0aC5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2J1aWxkL3RhbmtzLW1hdGguanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGNsYXNzIEFjdGlvbkxpbWl0ZXIge1xyXG4gICAgY29uc3RydWN0b3IobGltaXQgPSA1KSB7XHJcbiAgICAgICAgdGhpcy5saW1pdCA9IGxpbWl0O1xyXG4gICAgICAgIHRoaXMubnVtX2FjdGlvbnMgPSAwO1xyXG4gICAgICAgIHRoaXMubnVtX2FjdGlvbnMgPSAwO1xyXG4gICAgfVxyXG4gICAgZW5kKCkge1xyXG4gICAgICAgIHRoaXMubnVtX2FjdGlvbnMgKz0gMTtcclxuICAgICAgICByZXR1cm4gdGhpcy5udW1fYWN0aW9ucyA+PSB0aGlzLmxpbWl0O1xyXG4gICAgfVxyXG4gICAgbmV4dCgpIHtcclxuICAgICAgICB0aGlzLm51bV9hY3Rpb25zID0gMDtcclxuICAgICAgICB0aGlzLnR1cm5zICs9IDE7XHJcbiAgICB9XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YWN0aW9uLWxpbWl0ZXIuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9idWlsZC9hY3Rpb24tbGltaXRlci5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgY2xhc3MgQWN0aXZlVGFuayB7XHJcbiAgICBjb25zdHJ1Y3RvcihpZCwgcG9zaXRpb24pIHtcclxuICAgICAgICB0aGlzLnZhbGlkX3Bvc2l0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgVGFua3NTaGFyZWRTdGF0ZSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmFjdGl2ZSA9IG5ldyBTaW5nbGVBY2Nlc3MoKTtcclxuICAgICAgICB0aGlzLm5leHQgPSBuZXcgU2luZ2xlQWNjZXNzKCk7XHJcbiAgICB9XHJcbn1cclxuY2xhc3MgU2luZ2xlQWNjZXNzIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMucmVzb3VyY2UgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuYWNjZXNzZWQgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIHNldChyZXNvdXJjZSkge1xyXG4gICAgICAgIHRoaXMucmVzb3VyY2UgPSByZXNvdXJjZTtcclxuICAgICAgICB0aGlzLmFjY2Vzc2VkID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBhdmFpbGFibGUoKSB7XHJcbiAgICAgICAgcmV0dXJuICF0aGlzLmFjY2Vzc2VkICYmIHRoaXMucmVzb3VyY2UgIT09IG51bGw7XHJcbiAgICB9XHJcbiAgICBnZXQoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmFjY2Vzc2VkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLnJlc291cmNlO1xyXG4gICAgICAgICAgICB0aGlzLnJlc291cmNlID0gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIHg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGlzIHNpbmdsZSBhY2Nlc3Mgb2JqZWN0IGhhcyBhbHJlYWR5IGJlZW4gYWNjZXNzZWQuXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zaGFyZWQtc3RhdGUuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9idWlsZC9nYW1lLWV2ZW50cy9zaGFyZWQtc3RhdGUuanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gQ2xhc3NlcyBhZGRlZCB0byB0aGUgYHdpbmRvd2Agb2JqZWN0IGFyZSBnbG9iYWwsIGFuZCB2aXNpYmxlIGluc2lkZSB0aGUgSFRNTCBjb2RlLlxyXG4vLyBBbnkgY2xhc3NlcyBub3QgYWRkZWQgdG8gdGhlIGB3aW5kb3dgIGFyZSBpbnZpc2libGUgKG5vdCBhY2Nlc3NpYmxlKSBmcm9tIHRoZSBIVE1MLlxyXG4vLyBHbG9iYWwgY2xhc3Nlc1xyXG5pbXBvcnQgQ29udHJvbHMgZnJvbSAnLi9idWlsZC9zaXRlLWNvbnRyb2xzJztcclxud2luZG93LkNvbnRyb2xzID0gQ29udHJvbHM7XHJcblxyXG4vLyBJbnRlcm5hbCBjbGFzc2VzXHJcbmltcG9ydCB7IENhbnZhcyB9IGZyb20gXCIuL2J1aWxkL2NhbnZhc1wiXHJcblxyXG52YXIgSURfR0FNRV9DQU5WQVMgPSBcInRhbmtzLWNhbnZhc1wiO1xyXG5cclxuLy8gU2V0LXVwIHRoZSBjYW52YXMgYW5kIGFkZCBvdXIgZXZlbnQgaGFuZGxlcnMgYWZ0ZXIgdGhlIHBhZ2UgaGFzIGxvYWRlZFxyXG5mdW5jdGlvbiBpbml0KCkge1xyXG4gICAgbGV0IGNhbnZhcyA9IG5ldyBDYW52YXMoSURfR0FNRV9DQU5WQVMpO1xyXG4gICAgY2FudmFzLnNldERPTVJlc29sdXRpb24od2luZG93LmlubmVyV2lkdGggLSAzMiwgd2luZG93LmlubmVySGVpZ2h0ICogMC45KTtcclxufVxyXG5cclxuaW5pdCgpOyBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL21haW4uanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udHJvbHMge1xyXG4gICAgc3RhdGljIHRvZ2dsZV93M19zaG93KGh0bWxfZWxlbSkge1xyXG4gICAgICAgIGlmIChodG1sX2VsZW0uY2xhc3NOYW1lLmluZGV4T2YoXCJ3My1zaG93XCIpID09IC0xKSB7XHJcbiAgICAgICAgICAgIGh0bWxfZWxlbS5jbGFzc05hbWUgKz0gXCIgdzMtc2hvd1wiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaHRtbF9lbGVtLmNsYXNzTmFtZSA9IGh0bWxfZWxlbS5jbGFzc05hbWUucmVwbGFjZShcIiB3My1zaG93XCIsIFwiXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHN0YXRpYyB3M19vcGVuKCkge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlTaWRlYmFyXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteU92ZXJsYXlcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgIH1cclxuICAgIHN0YXRpYyB3M19jbG9zZSgpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15U2lkZWJhclwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteU92ZXJsYXlcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNpdGUtY29udHJvbHMuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9idWlsZC9zaXRlLWNvbnRyb2xzLmpzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IEV2ZW50Q29udHJvbGxlciB9IGZyb20gXCIuL2V2ZW50LWNvbnRyb2xsZXJcIjtcclxuZXhwb3J0IGNsYXNzIENhbnZhcyB7XHJcbiAgICBjb25zdHJ1Y3RvcihpZCkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgIHRoaXMuZXZlbnRzID0gbmV3IEV2ZW50Q29udHJvbGxlcih0aGlzLmNhbnZhcywgdGhpcy5jYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpKTtcclxuICAgICAgICAvLyBpbml0aWFsaXNlIGFzIGVtcHR5IHJlbW92YWwgZnVuY3Rpb24gXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLyBCcm93c2VycyByZWFsbHkgZG9uJ3QgbGlrZSBzdHlsdXNlcyB5ZXQuIE9ubHkgcG9pbnRlcm1vdmUgaXMgY2FsbGVkIHdoZW4gc3R5bHVzIGhvdmVyc1xyXG4gICAgICAgICAgICAvLyBhbmQgcG9pbnRlcmxlYXZlIGlzIGNhbGxlZCB3aGVuIHRoZSBzdHlsdXMgaXMgcHJlc3NlZCBkb3duXHJcbiAgICAgICAgICAgIC8vICAgICBsZXQgZG93bl90aW1lczogbnVtYmVyID0gMDtcclxuICAgICAgICAgICAgLy8gICAgIGxldCB1cF90aW1lczogbnVtYmVyID0gMDtcclxuICAgICAgICAgICAgLy8gICAgIGxldCBtb3ZlX3RpbWVzOiBudW1iZXIgPSAwO1xyXG4gICAgICAgICAgICAvLyAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcmRvd24nLCAoZSkgPT4geyB0aGlzLnNob3dFdmVudChlLCBcInBvaW50ZXJkb3duXCIsIGRvd25fdGltZXMrKyk7IH0sIGZhbHNlKTtcclxuICAgICAgICAgICAgLy8gICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIChlKSA9PiB7IHRoaXMuc2hvd0V2ZW50KGUsIFwicG9pbnRlcnVwXCIsIHVwX3RpbWVzKyspOyB9LCBmYWxzZSk7XHJcbiAgICAgICAgICAgIC8vICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIChlKSA9PiB7IHRoaXMuc2hvd0V2ZW50KGUsIFwicG9pbnRlcm1vdmVcIiwgbW92ZV90aW1lcysrKTsgfSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAvLyAgICAgbGV0IG92ZXJfdGltZXMgPSAwO1xyXG4gICAgICAgICAgICAvLyAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcm92ZXInLCAoZSkgPT4geyB0aGlzLnNob3dFdmVudChlLCBcInBvaW50ZXJvdmVyXCIsIG92ZXJfdGltZXMrKyk7IH0sIGZhbHNlKTtcclxuICAgICAgICAgICAgLy8gICAgIGxldCBsZWF2ZV90aW1lcyA9IDA7XHJcbiAgICAgICAgICAgIC8vICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVybGVhdmUnLCAoZSkgPT4geyB0aGlzLnNob3dFdmVudChlLCBcInBvaW50ZXJsZWF2ZVwiLCBsZWF2ZV90aW1lcysrKTsgfSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAvLyAgICAgbGV0IGVudGVyX3RpbWVzID0gMDtcclxuICAgICAgICAgICAgLy8gICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJlbnRlcicsIChlKSA9PiB7IHRoaXMuc2hvd0V2ZW50KGUsIFwicG9pbnRlcmVudGVyXCIsIGVudGVyX3RpbWVzKyspOyB9LCBmYWxzZSk7XHJcbiAgICAgICAgICAgIC8vICAgICBsZXQgb3V0X3RpbWVzID0gMDtcclxuICAgICAgICAgICAgLy8gICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJvdXQnLCAoZSkgPT4geyB0aGlzLnNob3dFdmVudChlLCBcInBvaW50ZXJvdXRcIiwgb3V0X3RpbWVzKyspOyB9LCBmYWxzZSk7XHJcbiAgICAgICAgICAgIC8vICAgICBsZXQgY2FuY2VsX3RpbWVzID0gMDtcclxuICAgICAgICAgICAgLy8gICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJjYW5jZWwnLCAoZSkgPT4geyB0aGlzLnNob3dFdmVudChlLCBcInBvaW50ZXJjYW5jZWxcIiwgY2FuY2VsX3RpbWVzKyspOyB9LCBmYWxzZSk7XHJcbiAgICAgICAgICAgIC8vICAgICBsZXQgY2FwdHVyZV90aW1lcyA9IDA7XHJcbiAgICAgICAgICAgIC8vICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdnb3Rwb2ludGVyY2FwdHVyZScsIChlKSA9PiB7IHRoaXMuc2hvd0V2ZW50KGUsIFwiZ290cG9pbnRlcmNhcHR1cmVcIiwgY2FwdHVyZV90aW1lcysrKTsgfSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAvLyAgICAgbGV0IGxvc3RfY2FwdHVyZV90aW1lcyA9IDA7XHJcbiAgICAgICAgICAgIC8vICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdsb3N0cG9pbnRlcmNhcHR1cmUnLCAoZSkgPT4geyB0aGlzLnNob3dFdmVudChlLCBcImxvc3Rwb2ludGVyY2FwdHVyZVwiLCBsb3N0X2NhcHR1cmVfdGltZXMrKyk7IH0sIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIERlYnVnIGZ1bmN0aW9uIHRvIGRpc3BsYXkgd2hpY2ggZXZlbnQgaXMgdHJpZ2dlcmVkLCBhbmQgaG93IG1hbnkgdGltZXMuXHJcbiAgICAgKiBAcGFyYW0gZSBUaGUgYWN0dWFsIGV2ZW50IGNsYXNzXHJcbiAgICAgKiBAcGFyYW0gbWVzc2FnZSBNZXNzYWdlIHRvIGJlIGRpc3BsYXllZCwgdGhpcyBzaG91bGQgaWRlbnRpZnkgdGhlIGV2ZW50XHJcbiAgICAgKiBAcGFyYW0gdGltZXMgSG93IG1hbnkgdGltZXMgaXQgaGFzIGJlZW4gcmVwZWF0ZWQsIHRoZSBjb3VudGluZyBtdXN0IGJlIGRvbmUgZXh0ZXJuYWxseVxyXG4gICAgICovXHJcbiAgICBzaG93RXZlbnQoZSwgbWVzc2FnZSwgdGltZXMpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlYnVnLXN0YXR1c1wiKS5pbm5lckhUTUwgPSBtZXNzYWdlICsgXCJ0aW1lczogXCIgKyB0aW1lcztcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfVxyXG4gICAgc2V0RE9NUmVzb2x1dGlvbih3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICB9XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y2FudmFzLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYnVpbGQvY2FudmFzLmpzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IERyYXcsIERyYXdTdGF0ZSB9IGZyb20gXCIuLi9kcmF3XCI7XHJcbmltcG9ydCB7IExpbmVMaW1pdGVyIH0gZnJvbSBcIi4uL2xpbmUtbGltaXRlclwiO1xyXG5pbXBvcnQgeyBBY3Rpb25MaW1pdGVyIH0gZnJvbSBcIi4uL2FjdGlvbi1saW1pdGVyXCI7XHJcbmltcG9ydCB7IEdhbWVTdGF0ZSB9IGZyb20gXCIuLi9ldmVudC1jb250cm9sbGVyXCI7XHJcbmltcG9ydCB7IENhcnRlc2lhbkNvb3JkcyB9IGZyb20gXCIuLi9jYXJ0ZXNpYW4tY29vcmRzXCI7XHJcbmltcG9ydCB7IFRhbmsgfSBmcm9tIFwiLi4vZ2FtZS1vYmplY3RzL3RhbmtcIjtcclxuZXhwb3J0IGNsYXNzIE1vdmluZ1N0YXRlIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbnRyb2xsZXIsIGNvbnRleHQsIHBsYXllcikge1xyXG4gICAgICAgIHRoaXMuc3RhcnRNb3ZlbWVudCA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIGxpbWl0IHRoZSBzdGFydCBvZiB0aGUgbGluZSB0byBiZSB0aGUgdGFua1xyXG4gICAgICAgICAgICB0aGlzLmRyYXcubGFzdCA9IG5ldyBDYXJ0ZXNpYW5Db29yZHModGhpcy5hY3RpdmUucG9zaXRpb24uWCwgdGhpcy5hY3RpdmUucG9zaXRpb24uWSk7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhdy5zdGF0ZSA9IERyYXdTdGF0ZS5EUkFXSU5HO1xyXG4gICAgICAgICAgICAvLyBsaW1pdCB0aGUgbGVuZ2h0IG9mIHRoZSBsaW5lIHRvIHRoZSBtYXhpbXVtIGFsbG93ZWQgdGFuayBtb3ZlbWVudFxyXG4gICAgICAgICAgICBpZiAodGhpcy5saW5lLmluKHRoaXMuYWN0aXZlLnBvc2l0aW9uLCB0aGlzLmRyYXcubW91c2UpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbGlkTW92ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmVuZE1vdmVtZW50ID0gKGUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5kcmF3LnN0YXRlID0gRHJhd1N0YXRlLlNUT1BQRUQ7XHJcbiAgICAgICAgICAgIC8vIHJlc2V0IHRoZSBsaW5lIGxpbWl0IGFzIHRoZSB1c2VyIGhhcyBsZXQgZ28gb2YgdGhlIGJ1dHRvblxyXG4gICAgICAgICAgICB0aGlzLmxpbmUucmVzZXQoKTtcclxuICAgICAgICAgICAgLy8gb25seSBkcmF3IGlmIHRoZSBwb3NpdGlvbiBpcyB2YWxpZFxyXG4gICAgICAgICAgICBpZiAodGhpcy5hY3RpdmUudmFsaWRfcG9zaXRpb24pIHtcclxuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgcG9zaXRpb24gb2YgdGhlIHRhbmsgaW4gdGhlIHBsYXllciBhcnJheVxyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXIudGFua3NbdGhpcy5hY3RpdmUuaWRdLnBvc2l0aW9uID0gdGhpcy5kcmF3Lm1vdXNlLmNvcHkoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd1VzZXJXYXJuaW5nKFwiXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIHJlZHJhdyBjYW52YXMgd2l0aCBhbGwgY3VycmVudCB0YW5rc1xyXG4gICAgICAgICAgICB0aGlzLnJlZHJhdyh0aGlzLnBsYXllci50YW5rcyk7XHJcbiAgICAgICAgICAgIC8vIFRvIGFkZDogaWYgb3V0IG9mIGFjdGlvbnMsIHRoZW4gbmV4dCBzdGF0ZSBpcyBUQU5LX1NIT09USU5HXHJcbiAgICAgICAgICAgIC8vIGNvbWUgYmFjayB0byBtb3ZpbmcgYWZ0ZXIgc2VsZWN0aW9uXHJcbiAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5zaGFyZWQubmV4dC5zZXQoR2FtZVN0YXRlLlRBTktfTU9WSU5HKTtcclxuICAgICAgICAgICAgLy8gZ28gdG8gdGFuayBzZWxlY3Rpb24gc3RhdGVcclxuICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLmNoYW5nZUdhbWVTdGF0ZShHYW1lU3RhdGUuVEFOS19TRUxFQ1RJT04pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5kcmF3TW92ZUxpbmUgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmRyYXcudXBkYXRlTW91c2VQb3NpdGlvbihlKTtcclxuICAgICAgICAgICAgLy8gZHJhdyB0aGUgbW92ZW1lbnQgbGluZSBpZiB0aGUgbW91c2UgYnV0dG9uIGlzIGN1cnJlbnRseSBiZWluZyBwcmVzc2VkXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRyYXcuc3RhdGUgPT0gRHJhd1N0YXRlLkRSQVdJTkcpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxpbmUuaW4odGhpcy5hY3RpdmUucG9zaXRpb24sIHRoaXMuZHJhdy5tb3VzZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbGlkTW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hY3RpdmUudmFsaWRfcG9zaXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyID0gY29udHJvbGxlcjtcclxuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xyXG4gICAgICAgIHRoaXMucGxheWVyID0gcGxheWVyO1xyXG4gICAgICAgIHRoaXMuZHJhdyA9IG5ldyBEcmF3KCk7XHJcbiAgICAgICAgdGhpcy5saW5lID0gbmV3IExpbmVMaW1pdGVyKFRhbmsuREVGQVVMVF9NT1ZFTUVOVF9SQU5HRSk7XHJcbiAgICAgICAgdGhpcy50dXJuID0gbmV3IEFjdGlvbkxpbWl0ZXIoKTtcclxuICAgICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMuY29udHJvbGxlci5zaGFyZWQuYWN0aXZlLmdldCgpO1xyXG4gICAgfVxyXG4gICAgYWRkRXZlbnRMaXN0ZW5lcnMoY2FudmFzKSB7XHJcbiAgICAgICAgY2FudmFzLm9ubW91c2Vkb3duID0gdGhpcy5zdGFydE1vdmVtZW50O1xyXG4gICAgICAgIGNhbnZhcy5vbm1vdXNlbW92ZSA9IHRoaXMuZHJhd01vdmVMaW5lO1xyXG4gICAgICAgIC8vIE5PVEU6IG1vdXNldXAgaXMgb24gdGhlIHdob2xlIHdpbmRvdywgc28gdGhhdCBldmVuIGlmIHRoZSBjdXJzb3IgZXhpdHMgdGhlIGNhbnZhcywgdGhlIGV2ZW50IHdpbGwgdHJpZ2dlclxyXG4gICAgICAgIHdpbmRvdy5vbm1vdXNldXAgPSB0aGlzLmVuZE1vdmVtZW50O1xyXG4gICAgICAgIC8vIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy50b3VjaE1vdmUsIGZhbHNlKTtcclxuICAgICAgICAvLyBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLm1vdXNlVXAsIGZhbHNlKTtcclxuICAgICAgICAvLyBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy50b3VjaE1vdmUsIGZhbHNlKTtcclxuICAgIH1cclxuICAgIHNob3dVc2VyV2FybmluZyhtZXNzYWdlKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1c2VyLXdhcm5pbmdcIikuaW5uZXJIVE1MID0gbWVzc2FnZTtcclxuICAgIH1cclxuICAgIHZhbGlkTW92ZSgpIHtcclxuICAgICAgICB0aGlzLmFjdGl2ZS52YWxpZF9wb3NpdGlvbiA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5kcmF3LmxpbmUodGhpcy5jb250ZXh0LCBUYW5rLkRFRkFVTFRfTU9WRU1FTlRfTElORV9XSURUSCk7XHJcbiAgICB9XHJcbiAgICAvLyBDT05TSURFUjogTW92ZSB0aGlzIGludG8gY29udHJvbGxlcj8gV2UnbGwgaGF2ZSB0byByZWRyYXcgYWxsIHBsYXllciBvYmplY3RzLCBhbmQgdGhlIGNvbnRyb2xsZXIgd2lsbCBiZSB0aGUgb25lIHRoYXQga25vd3MgdGhlbSBhbGxcclxuICAgIHJlZHJhdyh0YW5rcykge1xyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5jbGVhckNhbnZhcygpO1xyXG4gICAgICAgIGZvciAoY29uc3QgdGFuayBvZiB0YW5rcykge1xyXG4gICAgICAgICAgICB0YW5rLmRyYXcodGhpcy5jb250ZXh0LCB0aGlzLmRyYXcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD10YW5rLW1vdmluZy5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2J1aWxkL2dhbWUtZXZlbnRzL3RhbmstbW92aW5nLmpzXG4vLyBtb2R1bGUgaWQgPSAxMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBUYW5rc01hdGggfSBmcm9tIFwiLi90YW5rcy1tYXRoXCI7XHJcbmV4cG9ydCBjbGFzcyBMaW5lTGltaXRlciB7XHJcbiAgICAvKipcclxuICAgICAqIENhbGN1YWx0ZXMgYW5kIGtlZXBzIHRyYWNrIG9mIHRoZSB0b3RhbCBsZW5ndGggb2YgYSBsaW5lLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBsaW1pdCBNYXhpbXVtIGxlbmd0aCBvZiBlYWNoIGxpbmUsIGluIGNhbnZhcyBwaXhlbHNcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobGltaXQgPSAyMDApIHtcclxuICAgICAgICB0aGlzLmxpbWl0ID0gbGltaXQ7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gMDtcclxuICAgIH1cclxuICAgIHJlc2V0KCkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudCA9IDA7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIENhbGN1bGF0ZSBkaXN0YW5jZSBvZiBDYXJ0ZXNpYW4gY29vcmRpbmF0ZXMsIGFuZCBpbmNyZW1lbnQgdGhlIHRvdGFsIGxlbmd0aCBvZiB0aGUgbGluZS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gc3RhcnQgU3RhcnQgY29vcmRpbmF0ZXNcclxuICAgICAqIEBwYXJhbSBlbmQgRW5kIGNvb3JkaW5hdGVzXHJcbiAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBsaW5lIGlzIGJlbG93IHRoZSBsaW1pdCwgZmFsc2UgaWYgdGhlIGxpbmUgaXMgbG9uZ2VyIHRoYW4gdGhlIGxpbWl0XHJcbiAgICAgKi9cclxuICAgIGFkZChzdGFydCwgZW5kKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50ICs9IFRhbmtzTWF0aC5wb2ludC5kaXN0MmQoc3RhcnQsIGVuZCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudCA8PSB0aGlzLmxpbWl0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayBpZiB0aGUgZGlzdGFuY2UgYmV0d2VlbiB0aGUgdHdvIHBvaW50cyBpcyBncmVhdGVyIHRoYW4gdGhlIGxpbWl0LlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBzdGFydCBTdGFydCBjb29yZGluYXRlc1xyXG4gICAgICogQHBhcmFtIGVuZCBFbmQgY29vcmRpbmF0ZXNcclxuICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIGxpbmUgaXMgYmVsb3cgdGhlIGxpbWl0LCBmYWxzZSBvdGhlcndpc2VcclxuICAgICAqL1xyXG4gICAgaW4oc3RhcnQsIGVuZCkge1xyXG4gICAgICAgIGNvbnN0IGRpc3RhbmNlID0gVGFua3NNYXRoLnBvaW50LmRpc3QyZChzdGFydCwgZW5kKTtcclxuICAgICAgICByZXR1cm4gZGlzdGFuY2UgPD0gdGhpcy5saW1pdDtcclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1saW5lLWxpbWl0ZXIuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9idWlsZC9saW5lLWxpbWl0ZXIuanNcbi8vIG1vZHVsZSBpZCA9IDExXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IEdhbWVTdGF0ZSB9IGZyb20gXCIuLi9ldmVudC1jb250cm9sbGVyXCI7XHJcbmltcG9ydCB7IFRhbmsgfSBmcm9tIFwiLi4vZ2FtZS1vYmplY3RzL3RhbmtcIjtcclxuaW1wb3J0IHsgRHJhdyB9IGZyb20gXCIuLi9kcmF3XCI7XHJcbmltcG9ydCB7IEFjdGlvbkxpbWl0ZXIgfSBmcm9tIFwiLi4vYWN0aW9uLWxpbWl0ZXJcIjtcclxuZXhwb3J0IGNsYXNzIFBsYWNpbmdTdGF0ZSB7XHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY29udHJvbGxlciBUaGUgZXZlbnRzIGNvbnRyb2xsZXIsIHdoaWNoIGlzIHVzZWQgdG8gY2hhbmdlIHRoZSBnYW1lIHN0YXRlIGFmdGVyIHRoaXMgZXZlbnQgaXMgZmluaXNoZWQuXHJcbiAgICAgKiBAcGFyYW0gY29udGV4dCBDb250ZXh0IG9uIHdoaWNoIHRoZSBvYmplY3RzIGFyZSBkcmF3blxyXG4gICAgICogQHBhcmFtIHBsYXllclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihjb250cm9sbGVyLCBjb250ZXh0LCBwbGF5ZXIpIHtcclxuICAgICAgICB0aGlzLmFkZFRhbmsgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmRyYXcudXBkYXRlTW91c2VQb3NpdGlvbihlKTtcclxuICAgICAgICAgICAgY29uc3QgdGFuayA9IG5ldyBUYW5rKHRoaXMuZHJhdy5tb3VzZS5YLCB0aGlzLmRyYXcubW91c2UuWSk7XHJcbiAgICAgICAgICAgIHRhbmsucGxheWVyID0gdGhpcy5wbGF5ZXI7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyLnRhbmtzLnB1c2godGFuayk7XHJcbiAgICAgICAgICAgIHRhbmsuZHJhdyh0aGlzLmNvbnRleHQsIHRoaXMuZHJhdyk7XHJcbiAgICAgICAgICAgIC8vIGlmIHdlJ3ZlIHBsYWNlZCBhcyBtYW55IG9iamVjdHMgYXMgYWxsb3dlZCwgdGhlbiBnbyB0byBuZXh0IHN0YXRlXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnR1cm4uZW5kKCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5zaGFyZWQubmV4dC5zZXQoR2FtZVN0YXRlLlRBTktfTU9WSU5HKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5jaGFuZ2VHYW1lU3RhdGUoR2FtZVN0YXRlLlRBTktfU0VMRUNUSU9OKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyID0gY29udHJvbGxlcjtcclxuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xyXG4gICAgICAgIHRoaXMuZHJhdyA9IG5ldyBEcmF3KCk7XHJcbiAgICAgICAgdGhpcy50dXJuID0gbmV3IEFjdGlvbkxpbWl0ZXIoKTtcclxuICAgICAgICB0aGlzLnBsYXllciA9IHBsYXllcjtcclxuICAgIH1cclxuICAgIGFkZEV2ZW50TGlzdGVuZXJzKGNhbnZhcykge1xyXG4gICAgICAgIGNhbnZhcy5vbm1vdXNlZG93biA9IHRoaXMuYWRkVGFuaztcclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD10YW5rLXBsYWNpbmcuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9idWlsZC9nYW1lLWV2ZW50cy90YW5rLXBsYWNpbmcuanNcbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IEdhbWVTdGF0ZSB9IGZyb20gXCIuLi9ldmVudC1jb250cm9sbGVyXCI7XHJcbmV4cG9ydCBjbGFzcyBTaG9vdGluZ1N0YXRlIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbnRyb2xsZXIsIGNvbnRleHQpIHtcclxuICAgICAgICB0aGlzLnNvbWVGdW5jID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNoYW5naW5nIHN0YXRlIGZyb20gVEFOSyBTSE9PVElORyB0byBNRU5VXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuY2hhbmdlR2FtZVN0YXRlKEdhbWVTdGF0ZS5NRU5VKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiSW5pdGlhbGlzaW5nIFRBTksgU0hPT1RJTkdcIik7XHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyID0gY29udHJvbGxlcjtcclxuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xyXG4gICAgfVxyXG4gICAgYWRkRXZlbnRMaXN0ZW5lcnMoY2FudmFzKSB7XHJcbiAgICAgICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy5zb21lRnVuYywgZmFsc2UpO1xyXG4gICAgfVxyXG4gICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcnMoY2FudmFzKSB7XHJcbiAgICAgICAgY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy5zb21lRnVuYywgZmFsc2UpO1xyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRhbmstc2hvb3RpbmcuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9idWlsZC9nYW1lLWV2ZW50cy90YW5rLXNob290aW5nLmpzXG4vLyBtb2R1bGUgaWQgPSAxM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBUYW5rc01hdGggfSBmcm9tIFwiLi4vdGFua3MtbWF0aFwiO1xyXG5pbXBvcnQgeyBEcmF3IH0gZnJvbSBcIi4uL2RyYXdcIjtcclxuaW1wb3J0IHsgVGFuayB9IGZyb20gXCIuLi9nYW1lLW9iamVjdHMvdGFua1wiO1xyXG5pbXBvcnQgeyBBY3RpdmVUYW5rIH0gZnJvbSBcIi4vc2hhcmVkLXN0YXRlXCI7XHJcbmV4cG9ydCBjbGFzcyBTZWxlY3Rpb25TdGF0ZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb250cm9sbGVyLCBjb250ZXh0LCBwbGF5ZXIpIHtcclxuICAgICAgICB0aGlzLmhpZ2hsaWdodFRhbmsgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmRyYXcudXBkYXRlTW91c2VQb3NpdGlvbihlKTtcclxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIHVzZXIgaGFzIGNsaWNrZWQgYW55IHRhbmsuXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgW2lkLCB0YW5rXSBvZiB0aGlzLnBsYXllci50YW5rcy5lbnRyaWVzKCkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChUYW5rc01hdGgucG9pbnQuY29sbGlkZV9jaXJjbGUodGhpcy5kcmF3Lm1vdXNlLCB0YW5rLnBvc2l0aW9uLCBUYW5rLkRFRkFVTFRfV0lEVEgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaGlnaGxpZ2h0IHRoZSBzZWxlY3RlZCB0YW5rXHJcbiAgICAgICAgICAgICAgICAgICAgdGFuay5oaWdobGlnaHQodGhpcy5jb250ZXh0LCB0aGlzLmRyYXcpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHN0b3JlIHRoZSBkZXRhaWxzIG9mIHRoZSBhY3RpdmUgdGFua1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5zaGFyZWQuYWN0aXZlLnNldChuZXcgQWN0aXZlVGFuayhpZCwgdGFuay5wb3NpdGlvbikpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIG9ubHkgaGlnaGxpZ2h0IHRoZSBmaXJzdCB0YW5rXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMubW91c2VVcCA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIGlmIHRoZSB1c2VyIGhhcyBjbGlja2VkIG9uIGFueSBvZiB0aGUgb2JqZWN0cywgZ28gaW50byBtb3ZlbWVudCBzdGF0ZVxyXG4gICAgICAgICAgICBpZiAodGhpcy5jb250cm9sbGVyLnNoYXJlZC5hY3RpdmUuYXZhaWxhYmxlKCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5jaGFuZ2VHYW1lU3RhdGUodGhpcy5jb250cm9sbGVyLnNoYXJlZC5uZXh0LmdldCgpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyID0gY29udHJvbGxlcjtcclxuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xyXG4gICAgICAgIHRoaXMucGxheWVyID0gcGxheWVyO1xyXG4gICAgICAgIHRoaXMuZHJhdyA9IG5ldyBEcmF3KCk7XHJcbiAgICB9XHJcbiAgICBhZGRFdmVudExpc3RlbmVycyhjYW52YXMpIHtcclxuICAgICAgICBjYW52YXMub25tb3VzZWRvd24gPSB0aGlzLmhpZ2hsaWdodFRhbms7XHJcbiAgICAgICAgLy8gTk9URTogbW91c2V1cCBpcyBvbiB0aGUgd2hvbGUgd2luZG93LCBzbyB0aGF0IGV2ZW4gaWYgdGhlIGN1cnNvciBleGl0cyB0aGUgY2FudmFzLCB0aGUgZXZlbnQgd2lsbCB0cmlnZ2VyXHJcbiAgICAgICAgd2luZG93Lm9ubW91c2V1cCA9IHRoaXMubW91c2VVcDtcclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD10YW5rLXNlbGVjdGlvbi5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2J1aWxkL2dhbWUtZXZlbnRzL3Rhbmstc2VsZWN0aW9uLmpzXG4vLyBtb2R1bGUgaWQgPSAxNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBHYW1lU3RhdGUgfSBmcm9tIFwiLi4vZXZlbnQtY29udHJvbGxlclwiO1xyXG5pbXBvcnQgeyBEcmF3IH0gZnJvbSBcIi4uL2RyYXdcIjtcclxuY2xhc3MgTWVudSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0aXRsZSwgb3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMuc3RhcnRfaGVpZ2h0ID0gMTUwO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0X2luY3JlbWVudCA9IDEwMDtcclxuICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcclxuICAgIH1cclxuICAgIGRyYXcoY29udGV4dCwgZHJhdykge1xyXG4gICAgICAgIGNvbnN0IHdpZHRoID0gY29udGV4dC5jYW52YXMud2lkdGg7XHJcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gY29udGV4dC5jYW52YXMuaGVpZ2h0O1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gXCJCbGFja1wiO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgY29udGV4dC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gXCJyZ2IoMTM1LDIwNiwyNTApXCI7XHJcbiAgICAgICAgY29udGV4dC5mb250ID0gXCI2MHB4IEdlb3JnaWFcIjtcclxuICAgICAgICBsZXQgdGV4dF9oZWlnaHQgPSB0aGlzLnN0YXJ0X2hlaWdodDtcclxuICAgICAgICBjb250ZXh0LmZpbGxUZXh0KHRoaXMudGl0bGUsIHdpZHRoIC8gMiwgdGV4dF9oZWlnaHQpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gXCJXaGl0ZVwiO1xyXG4gICAgICAgIGNvbnRleHQuZm9udCA9IFwiMzBweCBHZW9yZ2lhXCI7XHJcbiAgICAgICAgdGV4dF9oZWlnaHQgKz0gdGhpcy5oZWlnaHRfaW5jcmVtZW50O1xyXG4gICAgICAgIGZvciAoY29uc3QgW2lkLCBvcHRpb25dIG9mIHRoaXMub3B0aW9ucy5lbnRyaWVzKCkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWQoaWQpKSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IFwiWWVsbG93XCI7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmZvbnQgPSBcIjQwcHggR2VvcmdpYVwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBcIldoaXRlXCI7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmZvbnQgPSBcIjMwcHggR2VvcmdpYVwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFRleHQob3B0aW9uLCB3aWR0aCAvIDIsIHRleHRfaGVpZ2h0KTtcclxuICAgICAgICAgICAgdGV4dF9oZWlnaHQgKz0gdGhpcy5oZWlnaHRfaW5jcmVtZW50O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHNlbGVjdGVkKGlkKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRfaXRlbSA9PT0gaWQ7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIE1lbnVTdGF0ZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb250cm9sbGVyLCBjb250ZXh0KSB7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RNZW51aXRlbSA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhdy51cGRhdGVNb3VzZVBvc2l0aW9uKGUpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5zb21lRnVuYyA9ICgpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDaGFuZ2luZyBzdGF0ZSBmcm9tIE1FTlUgRVZFTlQgdG8gVEFOSyBQTEFDSU5HXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuY2xlYXJDYW52YXMoKTtcclxuICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLmNoYW5nZUdhbWVTdGF0ZShHYW1lU3RhdGUuVEFOS19QTEFDSU5HKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuY29udHJvbGxlciA9IGNvbnRyb2xsZXI7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcclxuICAgICAgICB0aGlzLmRyYXcgPSBuZXcgRHJhdygpO1xyXG4gICAgICAgIHRoaXMubWVudSA9IG5ldyBNZW51KFwiVGFua3NcIiwgW1wiU3RhcnQgZ2FtZVwiXSk7XHJcbiAgICAgICAgdGhpcy5tZW51LmRyYXcodGhpcy5jb250ZXh0LCB0aGlzLmRyYXcpO1xyXG4gICAgfVxyXG4gICAgYWRkRXZlbnRMaXN0ZW5lcnMoY2FudmFzKSB7XHJcbiAgICAgICAgY2FudmFzLm9ubW91c2Vkb3duID0gdGhpcy5zb21lRnVuYztcclxuICAgICAgICBjYW52YXMub25tb3VzZW1vdmUgPSB0aGlzLnNlbGVjdE1lbnVpdGVtO1xyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1lbnUuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9idWlsZC9nYW1lLWV2ZW50cy9tZW51LmpzXG4vLyBtb2R1bGUgaWQgPSAxNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgY2xhc3MgUGxheWVyIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMudGFua3MgPSBuZXcgQXJyYXkoKTtcclxuICAgIH1cclxuICAgIDtcclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1wbGF5ZXIuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9idWlsZC9nYW1lLW9iamVjdHMvcGxheWVyLmpzXG4vLyBtb2R1bGUgaWQgPSAxNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9