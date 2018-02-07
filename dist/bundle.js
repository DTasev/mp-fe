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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return GameState; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__game_events_tank_moving__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__game_events_tank_placing__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__game_events_tank_shooting__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__game_events_tank_selection__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__game_events_menu__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__game_objects_player__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__game_events_shared_state__ = __webpack_require__(15);







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
        this.game_event = new __WEBPACK_IMPORTED_MODULE_4__game_events_menu__["a" /* MenuEvent */](this, this.context);
        this.game_event.addEventListeners(this.canvas);
        this.player = new __WEBPACK_IMPORTED_MODULE_5__game_objects_player__["a" /* Player */]();
        this.shared = new __WEBPACK_IMPORTED_MODULE_6__game_events_shared_state__["b" /* TanksSharedState */]();
    }
    changeGameState(new_state) {
        this.state = new_state;
        // clears the old event
        // this.game_event.removeEventListeners(this.canvas);
        this.canvas.onmousedown = null;
        window.onmouseup = null;
        this.canvas.onmousemove = null;
        switch (new_state) {
            case GameState.MENU:
                // save the function that can clear the events for this state
                this.game_event = new __WEBPACK_IMPORTED_MODULE_4__game_events_menu__["a" /* MenuEvent */](this, this.context);
                console.log("Initialising MENU EVENT");
                break;
            case GameState.TANK_PLACING:
                this.game_event = new __WEBPACK_IMPORTED_MODULE_1__game_events_tank_placing__["a" /* PlacingEvent */](this, this.context, this.player);
                console.log("Initialising TANK PLACING");
                break;
            case GameState.TANK_SELECTION:
                console.log("Initialising TANK SELECTION");
                this.game_event = new __WEBPACK_IMPORTED_MODULE_3__game_events_tank_selection__["a" /* SelectionEvent */](this, this.context, this.player);
                break;
            case GameState.TANK_MOVING:
                console.log("Initialising TANK MOVEMENT");
                this.game_event = new __WEBPACK_IMPORTED_MODULE_0__game_events_tank_moving__["a" /* MovingEvent */](this, this.context, this.player);
                break;
            case GameState.TANK_SHOOTING:
                throw new Error("Not implemented yet");
                this.game_event = new __WEBPACK_IMPORTED_MODULE_2__game_events_tank_shooting__["a" /* ShootingEvent */](this, this.context);
                break;
            default:
                throw new Error("The game should never be stateless, something has gone terribly wrong");
        }
        // add the mouse events for the new state
        this.game_event.addEventListeners(this.canvas);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = EventController;

//# sourceMappingURL=event-controller.js.map

/***/ }),
/* 1 */
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
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return DrawState; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__cartesian_coords__ = __webpack_require__(1);

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
/* 3 */
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
/* 4 */
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
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__cartesian_coords__ = __webpack_require__(1);

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
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__build_site_controls__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__build_canvas__ = __webpack_require__(8);
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
/* 7 */
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
/* 8 */
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
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__draw__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__line_limiter__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__action_limiter__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__event_controller__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__cartesian_coords__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__game_objects_tank__ = __webpack_require__(5);






class MovingEvent {
    constructor(controller, context, player) {
        this.startMovement = (e) => {
            // limit the start of the line to be the tank
            this.draw.last = new __WEBPACK_IMPORTED_MODULE_4__cartesian_coords__["a" /* CartesianCoords */](this.active.position.X, this.active.position.Y);
            this.draw.state = __WEBPACK_IMPORTED_MODULE_0__draw__["b" /* DrawState */].DRAWING;
            // limit the lenght of the line to the maximum allowed tank movement
            if (this.line.in(this.active.position, this.draw.mouse)) {
                this.draw.line(this.context, __WEBPACK_IMPORTED_MODULE_5__game_objects_tank__["a" /* Tank */].DEFAULT_MOVEMENT_LINE_WIDTH);
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
            // delete the reference to the active tank
            // this.active = null;
            this.controller.shared.active = null;
            // redraw canvas with all current tanks
            this.redraw(this.player.tanks);
            // To add: if out of actions, then next state is TANK_SHOOTING
            // come back to moving after selection
            this.controller.shared.next = __WEBPACK_IMPORTED_MODULE_3__event_controller__["b" /* GameState */].TANK_MOVING;
            // go to tank selection state
            this.controller.changeGameState(__WEBPACK_IMPORTED_MODULE_3__event_controller__["b" /* GameState */].TANK_SELECTION);
        };
        this.drawMoveLine = (e) => {
            this.draw.updateMousePosition(e);
            // draw the movement line if the mouse button is currently being pressed
            if (this.draw.state == __WEBPACK_IMPORTED_MODULE_0__draw__["b" /* DrawState */].DRAWING) {
                if (this.line.in(this.active.position, this.draw.mouse)) {
                    this.active.valid_position = true;
                    this.draw.line(this.context, __WEBPACK_IMPORTED_MODULE_5__game_objects_tank__["a" /* Tank */].DEFAULT_MOVEMENT_LINE_WIDTH);
                }
                else {
                    this.active.valid_position = false;
                }
            }
        };
        this.touchMove = (e) => {
            // Update the touch co-ordinates
            this.draw.updateTouchPosition(e);
            // During a touchmove event, unlike a mousemove event, we don't need to check if the touch is engaged, since there will always be contact with the screen by definition.
            this.draw.line(this.context, __WEBPACK_IMPORTED_MODULE_5__game_objects_tank__["a" /* Tank */].DEFAULT_WIDTH);
            // Prevent a scrolling action as a result of this touchmove triggering.
            event.preventDefault();
        };
        this.penMove = (e) => {
            this.draw.updateMousePosition(e);
            if (this.draw.state == __WEBPACK_IMPORTED_MODULE_0__draw__["b" /* DrawState */].DRAWING) {
                this.draw.line(this.context, __WEBPACK_IMPORTED_MODULE_5__game_objects_tank__["a" /* Tank */].DEFAULT_WIDTH);
            }
            event.preventDefault();
        };
        this.controller = controller;
        this.context = context;
        this.player = player;
        this.draw = new __WEBPACK_IMPORTED_MODULE_0__draw__["a" /* Draw */]();
        this.line = new __WEBPACK_IMPORTED_MODULE_1__line_limiter__["a" /* LineLimiter */](__WEBPACK_IMPORTED_MODULE_5__game_objects_tank__["a" /* Tank */].DEFAULT_MOVEMENT_RANGE);
        this.turn = new __WEBPACK_IMPORTED_MODULE_2__action_limiter__["a" /* ActionLimiter */]();
        this.active = this.controller.shared.active;
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
    redraw(tanks) {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        for (const tank of tanks) {
            tank.draw(this.context, this.draw);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MovingEvent;

//# sourceMappingURL=tank-moving.js.map

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tanks_math__ = __webpack_require__(3);

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
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__event_controller__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__game_objects_tank__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__draw__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__action_limiter__ = __webpack_require__(4);




class PlacingEvent {
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
                this.controller.shared.next = __WEBPACK_IMPORTED_MODULE_0__event_controller__["b" /* GameState */].TANK_MOVING;
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
/* harmony export (immutable) */ __webpack_exports__["a"] = PlacingEvent;

//# sourceMappingURL=tank-placing.js.map

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__event_controller__ = __webpack_require__(0);

class ShootingEvent {
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
/* harmony export (immutable) */ __webpack_exports__["a"] = ShootingEvent;

//# sourceMappingURL=tank-shooting.js.map

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__event_controller__ = __webpack_require__(0);

class MenuEvent {
    constructor(controller, context) {
        this.someFunc = () => {
            console.log("Changing state from MENU EVENT to TANK PLACING");
            this.controller.changeGameState(__WEBPACK_IMPORTED_MODULE_0__event_controller__["b" /* GameState */].TANK_PLACING);
        };
        this.controller = controller;
        this.context = context;
    }
    addEventListeners(canvas) {
        canvas.onmousedown = this.someFunc;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MenuEvent;

//# sourceMappingURL=menu.js.map

/***/ }),
/* 14 */
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

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class ActiveTank {
    constructor(id, position) {
        this.valid_position = true;
        this.id = id;
        this.position = position;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ActiveTank;

class TanksSharedState {
}
/* harmony export (immutable) */ __webpack_exports__["b"] = TanksSharedState;

//# sourceMappingURL=shared-state.js.map

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tanks_math__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__draw__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__game_objects_tank__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shared_state__ = __webpack_require__(15);




class SelectionEvent {
    constructor(controller, context, player) {
        this.highlightTank = (e) => {
            this.draw.updateMousePosition(e);
            // Check if the user has clicked any tank.
            for (const [id, tank] of this.player.tanks.entries()) {
                if (__WEBPACK_IMPORTED_MODULE_0__tanks_math__["a" /* TanksMath */].point.collide_circle(this.draw.mouse, tank.position, __WEBPACK_IMPORTED_MODULE_2__game_objects_tank__["a" /* Tank */].DEFAULT_WIDTH)) {
                    // highlight the selected tank
                    tank.highlight(this.context, this.draw);
                    // store the details of the active tank
                    this.controller.shared.active = new __WEBPACK_IMPORTED_MODULE_3__shared_state__["a" /* ActiveTank */](id, tank.position);
                    // only highlight the first tank
                    break;
                }
            }
        };
        this.mouseUp = (e) => {
            // if the user has clicked on any of the objects, go into movement state
            if (this.controller.shared.active) {
                this.controller.changeGameState(this.controller.shared.next);
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
/* harmony export (immutable) */ __webpack_exports__["a"] = SelectionEvent;

//# sourceMappingURL=tank-selection.js.map

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNDA3NzA3MmI4ZmEwYTI5MTI2ZDgiLCJ3ZWJwYWNrOi8vLy4vYnVpbGQvZXZlbnQtY29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly8vLi9idWlsZC9jYXJ0ZXNpYW4tY29vcmRzLmpzIiwid2VicGFjazovLy8uL2J1aWxkL2RyYXcuanMiLCJ3ZWJwYWNrOi8vLy4vYnVpbGQvdGFua3MtbWF0aC5qcyIsIndlYnBhY2s6Ly8vLi9idWlsZC9hY3Rpb24tbGltaXRlci5qcyIsIndlYnBhY2s6Ly8vLi9idWlsZC9nYW1lLW9iamVjdHMvdGFuay5qcyIsIndlYnBhY2s6Ly8vLi9tYWluLmpzIiwid2VicGFjazovLy8uL2J1aWxkL3NpdGUtY29udHJvbHMuanMiLCJ3ZWJwYWNrOi8vLy4vYnVpbGQvY2FudmFzLmpzIiwid2VicGFjazovLy8uL2J1aWxkL2dhbWUtZXZlbnRzL3RhbmstbW92aW5nLmpzIiwid2VicGFjazovLy8uL2J1aWxkL2xpbmUtbGltaXRlci5qcyIsIndlYnBhY2s6Ly8vLi9idWlsZC9nYW1lLWV2ZW50cy90YW5rLXBsYWNpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vYnVpbGQvZ2FtZS1ldmVudHMvdGFuay1zaG9vdGluZy5qcyIsIndlYnBhY2s6Ly8vLi9idWlsZC9nYW1lLWV2ZW50cy9tZW51LmpzIiwid2VicGFjazovLy8uL2J1aWxkL2dhbWUtb2JqZWN0cy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vYnVpbGQvZ2FtZS1ldmVudHMvc2hhcmVkLXN0YXRlLmpzIiwid2VicGFjazovLy8uL2J1aWxkL2dhbWUtZXZlbnRzL3Rhbmstc2VsZWN0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQzdEc0I7QUFDQztBQUNDO0FBQ0M7QUFDTDtBQUNIO0FBQ1U7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLDhCQUE4QjtBQUMvQjtBQUNBO0FBQ0E7QUFDQSxnRkFBZ0YsSUFBSTtBQUNwRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0EsNEM7Ozs7Ozs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBLDRDOzs7Ozs7Ozs7QUNUMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyw4QkFBOEI7QUFDL0IsZ0M7Ozs7Ozs7QUN0SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQSxzQzs7Ozs7OztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0EsMEM7Ozs7Ozs7O0FDZjBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDOzs7Ozs7Ozs7QUNwQkE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ2lCOztBQUVqQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE87Ozs7Ozs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBLHlDOzs7Ozs7OztBQ2xCMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVFQUF1RSxnREFBZ0QsRUFBRTtBQUN6SCxxRUFBcUUsNENBQTRDLEVBQUU7QUFDbkgsdUVBQXVFLGdEQUFnRCxFQUFFO0FBQ3pIO0FBQ0EsdUVBQXVFLGdEQUFnRCxFQUFFO0FBQ3pIO0FBQ0Esd0VBQXdFLGtEQUFrRCxFQUFFO0FBQzVIO0FBQ0Esd0VBQXdFLGtEQUFrRCxFQUFFO0FBQzVIO0FBQ0Esc0VBQXNFLDhDQUE4QyxFQUFFO0FBQ3RIO0FBQ0EseUVBQXlFLG9EQUFvRCxFQUFFO0FBQy9IO0FBQ0EsNkVBQTZFLHlEQUF5RCxFQUFFO0FBQ3hJO0FBQ0EsOEVBQThFLCtEQUErRCxFQUFFO0FBQy9JO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0Esa0M7Ozs7Ozs7Ozs7Ozs7QUM5QzBCO0FBQ0o7QUFDRTtBQUNKO0FBQ007QUFDWDtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQSx1Qzs7Ozs7Ozs7QUM3Rm9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQSx3Qzs7Ozs7Ozs7Ozs7QUNyQ29CO0FBQ0w7QUFDQTtBQUNTO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQSx3Qzs7Ozs7Ozs7QUNsQ29CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0EseUM7Ozs7Ozs7O0FDbEJvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQSxnQzs7Ozs7OztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQSxrQzs7Ozs7OztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0Esd0M7Ozs7Ozs7Ozs7O0FDVG9CO0FBQ0w7QUFDQTtBQUNNO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQSwwQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA2KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA0MDc3MDcyYjhmYTBhMjkxMjZkOCIsImltcG9ydCB7IE1vdmluZ0V2ZW50IH0gZnJvbSBcIi4vZ2FtZS1ldmVudHMvdGFuay1tb3ZpbmdcIjtcclxuaW1wb3J0IHsgUGxhY2luZ0V2ZW50IH0gZnJvbSBcIi4vZ2FtZS1ldmVudHMvdGFuay1wbGFjaW5nXCI7XHJcbmltcG9ydCB7IFNob290aW5nRXZlbnQgfSBmcm9tIFwiLi9nYW1lLWV2ZW50cy90YW5rLXNob290aW5nXCI7XHJcbmltcG9ydCB7IFNlbGVjdGlvbkV2ZW50IH0gZnJvbSBcIi4vZ2FtZS1ldmVudHMvdGFuay1zZWxlY3Rpb25cIjtcclxuaW1wb3J0IHsgTWVudUV2ZW50IH0gZnJvbSBcIi4vZ2FtZS1ldmVudHMvbWVudVwiO1xyXG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tICcuL2dhbWUtb2JqZWN0cy9wbGF5ZXInO1xyXG5pbXBvcnQgeyBUYW5rc1NoYXJlZFN0YXRlIH0gZnJvbSBcIi4vZ2FtZS1ldmVudHMvc2hhcmVkLXN0YXRlXCI7XHJcbmV4cG9ydCB2YXIgR2FtZVN0YXRlO1xyXG4oZnVuY3Rpb24gKEdhbWVTdGF0ZSkge1xyXG4gICAgR2FtZVN0YXRlW0dhbWVTdGF0ZVtcIk1FTlVcIl0gPSAwXSA9IFwiTUVOVVwiO1xyXG4gICAgR2FtZVN0YXRlW0dhbWVTdGF0ZVtcIlRBTktfUExBQ0lOR1wiXSA9IDFdID0gXCJUQU5LX1BMQUNJTkdcIjtcclxuICAgIEdhbWVTdGF0ZVtHYW1lU3RhdGVbXCJUQU5LX01PVklOR1wiXSA9IDJdID0gXCJUQU5LX01PVklOR1wiO1xyXG4gICAgR2FtZVN0YXRlW0dhbWVTdGF0ZVtcIlRBTktfU0VMRUNUSU9OXCJdID0gM10gPSBcIlRBTktfU0VMRUNUSU9OXCI7XHJcbiAgICBHYW1lU3RhdGVbR2FtZVN0YXRlW1wiVEFOS19TSE9PVElOR1wiXSA9IDRdID0gXCJUQU5LX1NIT09USU5HXCI7XHJcbn0pKEdhbWVTdGF0ZSB8fCAoR2FtZVN0YXRlID0ge30pKTtcclxuLyoqXHJcbiAqIEltcGxlbWVudGF0aW9uIGZvciB0aGUgYWN0aW9ucyB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgYWNjb3JkaW5nIHRvIHBsYXllciBhY3Rpb25zLlxyXG4gKlxyXG4gKiBGdW5jdGlvbnMgYXJlIHdyYXBwZWQgdG8ga2VlcCBgdGhpc2AgY29udGV4dC4gVGhpcyBpcyB0aGUgKGU6TW91c2VFdmVudCkgPT4gey4uLn0gc3ludGF4LlxyXG4gKlxyXG4gKiBJbiBzaG9ydCwgYmVjYXVzZSB0aGUgbWV0aG9kcyBhcmUgYWRkZWQgYXMgZXZlbnQgbGlzdGVuZXJzIChhbmQgYXJlIG5vdCBjYWxsZWQgZGlyZWN0bHkpLCB0aGUgYHRoaXNgIHJlZmVyZW5jZSBzdGFydHMgcG9pbnRpbmdcclxuICogdG93YXJkcyB0aGUgYHdpbmRvd2Agb2JqZWN0LiBUaGUgY2xvc3VyZSBrZWVwcyB0aGUgYHRoaXNgIHRvIHBvaW50IHRvd2FyZHMgdGhlIHByb3BlciBpbnN0YW5jZSBvZiB0aGUgb2JqZWN0LlxyXG4gKlxyXG4gKiBGb3IgbW9yZSBkZXRhaWxzOiBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L1R5cGVTY3JpcHQvd2lraS8ndGhpcyctaW4tVHlwZVNjcmlwdCNyZWQtZmxhZ3MtZm9yLXRoaXNcclxuICovXHJcbmV4cG9ydCBjbGFzcyBFdmVudENvbnRyb2xsZXIge1xyXG4gICAgY29uc3RydWN0b3IoY2FudmFzLCBjb250ZXh0KSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcclxuICAgICAgICB0aGlzLmdhbWVfZXZlbnQgPSBuZXcgTWVudUV2ZW50KHRoaXMsIHRoaXMuY29udGV4dCk7XHJcbiAgICAgICAgdGhpcy5nYW1lX2V2ZW50LmFkZEV2ZW50TGlzdGVuZXJzKHRoaXMuY2FudmFzKTtcclxuICAgICAgICB0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXIoKTtcclxuICAgICAgICB0aGlzLnNoYXJlZCA9IG5ldyBUYW5rc1NoYXJlZFN0YXRlKCk7XHJcbiAgICB9XHJcbiAgICBjaGFuZ2VHYW1lU3RhdGUobmV3X3N0YXRlKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IG5ld19zdGF0ZTtcclxuICAgICAgICAvLyBjbGVhcnMgdGhlIG9sZCBldmVudFxyXG4gICAgICAgIC8vIHRoaXMuZ2FtZV9ldmVudC5yZW1vdmVFdmVudExpc3RlbmVycyh0aGlzLmNhbnZhcyk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMub25tb3VzZWRvd24gPSBudWxsO1xyXG4gICAgICAgIHdpbmRvdy5vbm1vdXNldXAgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLm9ubW91c2Vtb3ZlID0gbnVsbDtcclxuICAgICAgICBzd2l0Y2ggKG5ld19zdGF0ZSkge1xyXG4gICAgICAgICAgICBjYXNlIEdhbWVTdGF0ZS5NRU5VOlxyXG4gICAgICAgICAgICAgICAgLy8gc2F2ZSB0aGUgZnVuY3Rpb24gdGhhdCBjYW4gY2xlYXIgdGhlIGV2ZW50cyBmb3IgdGhpcyBzdGF0ZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lX2V2ZW50ID0gbmV3IE1lbnVFdmVudCh0aGlzLCB0aGlzLmNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJbml0aWFsaXNpbmcgTUVOVSBFVkVOVFwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIEdhbWVTdGF0ZS5UQU5LX1BMQUNJTkc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWVfZXZlbnQgPSBuZXcgUGxhY2luZ0V2ZW50KHRoaXMsIHRoaXMuY29udGV4dCwgdGhpcy5wbGF5ZXIpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJbml0aWFsaXNpbmcgVEFOSyBQTEFDSU5HXCIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgR2FtZVN0YXRlLlRBTktfU0VMRUNUSU9OOlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJbml0aWFsaXNpbmcgVEFOSyBTRUxFQ1RJT05cIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWVfZXZlbnQgPSBuZXcgU2VsZWN0aW9uRXZlbnQodGhpcywgdGhpcy5jb250ZXh0LCB0aGlzLnBsYXllcik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBHYW1lU3RhdGUuVEFOS19NT1ZJTkc6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkluaXRpYWxpc2luZyBUQU5LIE1PVkVNRU5UXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lX2V2ZW50ID0gbmV3IE1vdmluZ0V2ZW50KHRoaXMsIHRoaXMuY29udGV4dCwgdGhpcy5wbGF5ZXIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgR2FtZVN0YXRlLlRBTktfU0hPT1RJTkc6XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQgeWV0XCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lX2V2ZW50ID0gbmV3IFNob290aW5nRXZlbnQodGhpcywgdGhpcy5jb250ZXh0KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIGdhbWUgc2hvdWxkIG5ldmVyIGJlIHN0YXRlbGVzcywgc29tZXRoaW5nIGhhcyBnb25lIHRlcnJpYmx5IHdyb25nXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBhZGQgdGhlIG1vdXNlIGV2ZW50cyBmb3IgdGhlIG5ldyBzdGF0ZVxyXG4gICAgICAgIHRoaXMuZ2FtZV9ldmVudC5hZGRFdmVudExpc3RlbmVycyh0aGlzLmNhbnZhcyk7XHJcbiAgICB9XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZXZlbnQtY29udHJvbGxlci5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2J1aWxkL2V2ZW50LWNvbnRyb2xsZXIuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGNsYXNzIENhcnRlc2lhbkNvb3JkcyB7XHJcbiAgICBjb25zdHJ1Y3Rvcih4ID0gLTEsIHkgPSAtMSkge1xyXG4gICAgICAgIHRoaXMuWCA9IHg7XHJcbiAgICAgICAgdGhpcy5ZID0geTtcclxuICAgIH1cclxuICAgIGNvcHkoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDYXJ0ZXNpYW5Db29yZHModGhpcy5YLCB0aGlzLlkpO1xyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNhcnRlc2lhbi1jb29yZHMuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9idWlsZC9jYXJ0ZXNpYW4tY29vcmRzLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IENhcnRlc2lhbkNvb3JkcyB9IGZyb20gXCIuL2NhcnRlc2lhbi1jb29yZHNcIjtcclxuY2xhc3MgQ29sb3Ige1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5yZWQgPSAwO1xyXG4gICAgICAgIHRoaXMuZ3JlZW4gPSAwO1xyXG4gICAgICAgIHRoaXMuYmx1ZSA9IDA7XHJcbiAgICAgICAgdGhpcy5hbHBoYSA9IDEuMDtcclxuICAgIH1cclxuICAgIHRvUkdCKCkge1xyXG4gICAgICAgIHJldHVybiBcInJnYihcIiArIHRoaXMucmVkICsgXCIsXCIgKyB0aGlzLmdyZWVuICsgXCIsXCIgKyB0aGlzLmJsdWUgKyBcIilcIjtcclxuICAgIH1cclxuICAgIHRvUkdCQSgpIHtcclxuICAgICAgICByZXR1cm4gXCJyZ2JhKFwiICsgdGhpcy5yZWQgKyBcIixcIiArIHRoaXMuZ3JlZW4gKyBcIixcIiArIHRoaXMuYmx1ZSArIFwiLFwiICsgdGhpcy5hbHBoYSArIFwiKVwiO1xyXG4gICAgfVxyXG4gICAgc2V0KHJlZCwgZ3JlZW4sIGJsdWUpIHtcclxuICAgICAgICB0aGlzLnJlZCA9IHJlZDtcclxuICAgICAgICB0aGlzLmdyZWVuID0gZ3JlZW47XHJcbiAgICAgICAgdGhpcy5ibHVlID0gYmx1ZTtcclxuICAgIH1cclxuICAgIGdvWWVsbG93KCkge1xyXG4gICAgICAgIHRoaXMuc2V0KDI1NSwgMjU1LCAwKTtcclxuICAgIH1cclxuICAgIGdvUmVkKCkge1xyXG4gICAgICAgIHRoaXMuc2V0KDI1NSwgMCwgMCk7XHJcbiAgICB9XHJcbiAgICBnb0dyZWVuKCkge1xyXG4gICAgICAgIHRoaXMuc2V0KDAsIDI1NSwgMCk7XHJcbiAgICB9XHJcbiAgICBnb0JsdWUoKSB7XHJcbiAgICAgICAgdGhpcy5zZXQoMCwgMCwgMjU1KTtcclxuICAgIH1cclxuICAgIGdvV2hpdGUoKSB7XHJcbiAgICAgICAgdGhpcy5zZXQoMjU1LCAyNTUsIDI1NSk7XHJcbiAgICB9XHJcbiAgICBnb0JsYWNrKCkge1xyXG4gICAgICAgIHRoaXMuc2V0KDAsIDAsIDApO1xyXG4gICAgfVxyXG4gICAgbmV4dCgpIHtcclxuICAgICAgICBpZiAodGhpcy5yZWQgIT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmdvR3JlZW4oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5ncmVlbiAhPSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ29CbHVlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMuYmx1ZSAhPSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ29SZWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ29SZWQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIERyYXcge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5tb3VzZSA9IG5ldyBDYXJ0ZXNpYW5Db29yZHMoKTtcclxuICAgICAgICB0aGlzLmxhc3QgPSBuZXcgQ2FydGVzaWFuQ29vcmRzKCk7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IG5ldyBDb2xvcigpO1xyXG4gICAgfVxyXG4gICAgZG90KGNvbnRleHQsIGNvb3Jkcywgd2lkdGgsIG91dGxpbmUgPSBmYWxzZSwgb3V0bGluZV93aWR0aCA9IDEpIHtcclxuICAgICAgICAvLyBMZXQncyB1c2UgYmxhY2sgYnkgc2V0dGluZyBSR0IgdmFsdWVzIHRvIDAsIGFuZCAyNTUgYWxwaGEgKGNvbXBsZXRlbHkgb3BhcXVlKVxyXG4gICAgICAgIC8vIFNlbGVjdCBhIGZpbGwgc3R5bGVcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMuY29sb3IudG9SR0JBKCk7XHJcbiAgICAgICAgY29udGV4dC5saW5lV2lkdGggPSBvdXRsaW5lX3dpZHRoO1xyXG4gICAgICAgIC8vIERyYXcgYSBmaWxsZWQgY2lyY2xlXHJcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjb250ZXh0LmFyYyhjb29yZHMuWCwgY29vcmRzLlksIHdpZHRoLCAwLCBNYXRoLlBJICogMiwgdHJ1ZSk7XHJcbiAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgICAgICBpZiAob3V0bGluZSkge1xyXG4gICAgICAgICAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gdGhpcy5jb2xvci50b1JHQkEoKTtcclxuICAgICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjaXJjbGUoY29udGV4dCwgY29vcmRzLCB3aWR0aCwgb3V0bGluZSA9IGZhbHNlLCBvdXRsaW5lX3dpZHRoID0gMSkge1xyXG4gICAgICAgIC8vIExldCdzIHVzZSBibGFjayBieSBzZXR0aW5nIFJHQiB2YWx1ZXMgdG8gMCwgYW5kIDI1NSBhbHBoYSAoY29tcGxldGVseSBvcGFxdWUpXHJcbiAgICAgICAgLy8gU2VsZWN0IGEgZmlsbCBzdHlsZVxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSB0aGlzLmNvbG9yLnRvUkdCQSgpO1xyXG4gICAgICAgIGNvbnRleHQubGluZVdpZHRoID0gb3V0bGluZV93aWR0aDtcclxuICAgICAgICAvLyBEcmF3IGEgZmlsbGVkIGNpcmNsZVxyXG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY29udGV4dC5hcmMoY29vcmRzLlgsIGNvb3Jkcy5ZLCB3aWR0aCwgMCwgTWF0aC5QSSAqIDIsIHRydWUpO1xyXG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICBpZiAob3V0bGluZSkge1xyXG4gICAgICAgICAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gdGhpcy5jb2xvci50b1JHQkEoKTtcclxuICAgICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIERyYXcgYSBsaW5lIGJldHdlZW4gdGhlIGxhc3Qga25vd24gcG9zaXRpb24gb2YgdGhlIG1vdXNlLCBhbmQgdGhlIGN1cnJlbnQgcG9zaXRpb24uXHJcbiAgICAgKiBAcGFyYW0gY29udGV4dCBUaGUgY2FudmFzIGNvbnRleHQgdGhhdCB3ZSdyZSBkcmF3aW5nIG9uXHJcbiAgICAgKiBAcGFyYW0gdXBkYXRlX2xhc3QgV2hldGhlciB0byB1cGRhdGUgdGhlIGxhc3QgcG9zaXRpb24gb2YgdGhlIG1vdXNlXHJcbiAgICAgKi9cclxuICAgIGxpbmUoY29udGV4dCwgd2lkdGgsIHVwZGF0ZV9sYXN0ID0gdHJ1ZSkge1xyXG4gICAgICAgIC8vIElmIGxhc3RYIGlzIG5vdCBzZXQsIHNldCBsYXN0WCBhbmQgbGFzdFkgdG8gdGhlIGN1cnJlbnQgcG9zaXRpb24gXHJcbiAgICAgICAgaWYgKHRoaXMubGFzdC5YID09IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMubGFzdC5YID0gdGhpcy5tb3VzZS5YO1xyXG4gICAgICAgICAgICB0aGlzLmxhc3QuWSA9IHRoaXMubW91c2UuWTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gU2VsZWN0IGEgZmlsbCBzdHlsZVxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSB0aGlzLmNvbG9yLnRvUkdCQSgpO1xyXG4gICAgICAgIC8vIFNldCB0aGUgbGluZSBcImNhcFwiIHN0eWxlIHRvIHJvdW5kLCBzbyBsaW5lcyBhdCBkaWZmZXJlbnQgYW5nbGVzIGNhbiBqb2luIGludG8gZWFjaCBvdGhlclxyXG4gICAgICAgIGNvbnRleHQubGluZUNhcCA9IFwicm91bmRcIjtcclxuICAgICAgICBjb250ZXh0LmxpbmVKb2luID0gXCJyb3VuZFwiO1xyXG4gICAgICAgIC8vIERyYXcgYSBmaWxsZWQgbGluZVxyXG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgLy8gRmlyc3QsIG1vdmUgdG8gdGhlIG9sZCAocHJldmlvdXMpIHBvc2l0aW9uXHJcbiAgICAgICAgY29udGV4dC5tb3ZlVG8odGhpcy5sYXN0LlgsIHRoaXMubGFzdC5ZKTtcclxuICAgICAgICAvLyBOb3cgZHJhdyBhIGxpbmUgdG8gdGhlIGN1cnJlbnQgdG91Y2gvcG9pbnRlciBwb3NpdGlvblxyXG4gICAgICAgIGNvbnRleHQubGluZVRvKHRoaXMubW91c2UuWCwgdGhpcy5tb3VzZS5ZKTtcclxuICAgICAgICAvLyBTZXQgdGhlIGxpbmUgdGhpY2tuZXNzIGFuZCBkcmF3IHRoZSBsaW5lXHJcbiAgICAgICAgY29udGV4dC5saW5lV2lkdGggPSB3aWR0aDtcclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgaWYgKHVwZGF0ZV9sYXN0KSB7XHJcbiAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgbGFzdCBwb3NpdGlvbiB0byByZWZlcmVuY2UgdGhlIGN1cnJlbnQgcG9zaXRpb25cclxuICAgICAgICAgICAgdGhpcy5sYXN0LlggPSB0aGlzLm1vdXNlLlg7XHJcbiAgICAgICAgICAgIHRoaXMubGFzdC5ZID0gdGhpcy5tb3VzZS5ZO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHVwZGF0ZU1vdXNlUG9zaXRpb24oZSkge1xyXG4gICAgICAgIGlmICghZSkge1xyXG4gICAgICAgICAgICB2YXIgZSA9IGV2ZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZS5vZmZzZXRYKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW91c2UuWCA9IGUub2Zmc2V0WDtcclxuICAgICAgICAgICAgdGhpcy5tb3VzZS5ZID0gZS5vZmZzZXRZO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHVwZGF0ZVRvdWNoUG9zaXRpb24oZSkge1xyXG4gICAgICAgIGlmICghZSkge1xyXG4gICAgICAgICAgICB2YXIgZSA9IGV2ZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZS50b3VjaGVzKSB7XHJcbiAgICAgICAgICAgIC8vIE9ubHkgZGVhbCB3aXRoIG9uZSBmaW5nZXJcclxuICAgICAgICAgICAgaWYgKGUudG91Y2hlcy5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBpbmZvcm1hdGlvbiBmb3IgZmluZ2VyICMxXHJcbiAgICAgICAgICAgICAgICBjb25zdCB0b3VjaCA9IGUudG91Y2hlc1swXTtcclxuICAgICAgICAgICAgICAgIC8vIHRoZSAndGFyZ2V0JyB3aWxsIGJlIHRoZSBjYW52YXMgZWxlbWVudFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3VzZS5YID0gdG91Y2gucGFnZVggLSB0b3VjaC50YXJnZXQub2Zmc2V0TGVmdDtcclxuICAgICAgICAgICAgICAgIHRoaXMubW91c2UuWSA9IHRvdWNoLnBhZ2VZIC0gdG91Y2gudGFyZ2V0Lm9mZnNldFRvcDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5leHBvcnQgdmFyIERyYXdTdGF0ZTtcclxuKGZ1bmN0aW9uIChEcmF3U3RhdGUpIHtcclxuICAgIERyYXdTdGF0ZVtEcmF3U3RhdGVbXCJEUkFXSU5HXCJdID0gMF0gPSBcIkRSQVdJTkdcIjtcclxuICAgIERyYXdTdGF0ZVtEcmF3U3RhdGVbXCJTVE9QUEVEXCJdID0gMV0gPSBcIlNUT1BQRURcIjtcclxufSkoRHJhd1N0YXRlIHx8IChEcmF3U3RhdGUgPSB7fSkpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kcmF3LmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYnVpbGQvZHJhdy5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjbGFzcyBQb2ludCB7XHJcbiAgICAvKipcclxuICAgICAqIENhbGN1bGF0ZSB0aGUgZGlzdGFuY2UgYmV0d2VlbiB0d28gcG9pbnRzLCBvbiBhIDJEIHBsYW5lIHVzaW5nIFB5dGhvZ29yZWFuIFRoZW9yZW1cclxuICAgICAqIEBwYXJhbSBzdGFydCBGaXJzdCBwb2ludCB3aXRoIDJEIGNvb3JkaW5hdGVzXHJcbiAgICAgKiBAcGFyYW0gZW5kIFNlY29uZCBwb2ludCB3aXRoIDJEIGNvb3JkaW5hdGVzXHJcbiAgICAgKi9cclxuICAgIGRpc3QyZChzdGFydCwgZW5kKSB7XHJcbiAgICAgICAgY29uc3QgZGVsdGFfeCA9IGVuZC5YIC0gc3RhcnQuWDtcclxuICAgICAgICBjb25zdCBkZWx0YV95ID0gZW5kLlkgLSBzdGFydC5ZO1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoTWF0aC5hYnMoZGVsdGFfeCAqIGRlbHRhX3ggKyBkZWx0YV95ICogZGVsdGFfeSkpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGUgaWYgdGhlIHBvaW50IGNvbGxpZGVzIHdpdGggdGhlIGNpcmNsZS5cclxuICAgICAqIEBwYXJhbSBwb2ludCBUaGUgY29vcmRpbmF0ZXMgb2YgdGhlIHBvaW50ICh1c2VyJ3MgY2xpY2spXHJcbiAgICAgKiBAcGFyYW0gb2JqZWN0IFRoZSBjb29yZGluYXRlcyBvZiB0aGUgb2JqZWN0XHJcbiAgICAgKiBAcGFyYW0gcmFkaXVzIFRoZSByYWRpdXMgb2YgdGhlIG9iamVjdFxyXG4gICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGVyZSBpcyBjb2xsaXNpb24sIGZhbHNlIG90aGVyd2lzZVxyXG4gICAgICovXHJcbiAgICBjb2xsaWRlX2NpcmNsZShwb2ludCwgb2JqZWN0LCByYWRpdXMpIHtcclxuICAgICAgICBjb25zdCBkaXN0YW5jZSA9IHRoaXMuZGlzdDJkKHBvaW50LCBvYmplY3QpO1xyXG4gICAgICAgIGlmIChkaXN0YW5jZSA+IHJhZGl1cykge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBUYW5rc01hdGgge1xyXG59XHJcblRhbmtzTWF0aC5wb2ludCA9IG5ldyBQb2ludCgpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD10YW5rcy1tYXRoLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYnVpbGQvdGFua3MtbWF0aC5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgY2xhc3MgQWN0aW9uTGltaXRlciB7XHJcbiAgICBjb25zdHJ1Y3RvcihsaW1pdCA9IDUpIHtcclxuICAgICAgICB0aGlzLmxpbWl0ID0gbGltaXQ7XHJcbiAgICAgICAgdGhpcy5udW1fYWN0aW9ucyA9IDA7XHJcbiAgICAgICAgdGhpcy5udW1fYWN0aW9ucyA9IDA7XHJcbiAgICB9XHJcbiAgICBlbmQoKSB7XHJcbiAgICAgICAgdGhpcy5udW1fYWN0aW9ucyArPSAxO1xyXG4gICAgICAgIHJldHVybiB0aGlzLm51bV9hY3Rpb25zID49IHRoaXMubGltaXQ7XHJcbiAgICB9XHJcbiAgICBuZXh0KCkge1xyXG4gICAgICAgIHRoaXMubnVtX2FjdGlvbnMgPSAwO1xyXG4gICAgICAgIHRoaXMudHVybnMgKz0gMTtcclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hY3Rpb24tbGltaXRlci5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2J1aWxkL2FjdGlvbi1saW1pdGVyLmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IENhcnRlc2lhbkNvb3JkcyB9IGZyb20gXCIuLi9jYXJ0ZXNpYW4tY29vcmRzXCI7XHJcbmV4cG9ydCBjbGFzcyBUYW5rIHtcclxuICAgIGNvbnN0cnVjdG9yKHgsIHkpIHtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3IENhcnRlc2lhbkNvb3Jkcyh4LCB5KTtcclxuICAgIH1cclxuICAgIGRyYXcoY29udGV4dCwgZHJhdykge1xyXG4gICAgICAgIGRyYXcuY29sb3IuZ29CbGFjaygpO1xyXG4gICAgICAgIGRyYXcuY2lyY2xlKGNvbnRleHQsIHRoaXMucG9zaXRpb24sIFRhbmsuREVGQVVMVF9XSURUSCk7XHJcbiAgICB9XHJcbiAgICBoaWdobGlnaHQoY29udGV4dCwgZHJhdykge1xyXG4gICAgICAgIGRyYXcuY29sb3IuZ29SZWQoKTtcclxuICAgICAgICBkcmF3LmRvdChjb250ZXh0LCB0aGlzLnBvc2l0aW9uLCBUYW5rLkRFRkFVTFRfV0lEVEggKyA1LCB0cnVlLCA1KTtcclxuICAgICAgICBkcmF3LmNvbG9yLmdvR3JlZW4oKTtcclxuICAgICAgICBkcmF3LmNpcmNsZShjb250ZXh0LCB0aGlzLnBvc2l0aW9uLCBUYW5rLkRFRkFVTFRfTU9WRU1FTlRfUkFOR0UpO1xyXG4gICAgICAgIGRyYXcuY29sb3IuZ29CbGFjaygpO1xyXG4gICAgfVxyXG59XHJcblRhbmsuREVGQVVMVF9XSURUSCA9IDEyO1xyXG5UYW5rLkRFRkFVTFRfTU9WRU1FTlRfUkFOR0UgPSAxMDA7XHJcblRhbmsuREVGQVVMVF9NT1ZFTUVOVF9MSU5FX1dJRFRIID0gMztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGFuay5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2J1aWxkL2dhbWUtb2JqZWN0cy90YW5rLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIENsYXNzZXMgYWRkZWQgdG8gdGhlIGB3aW5kb3dgIG9iamVjdCBhcmUgZ2xvYmFsLCBhbmQgdmlzaWJsZSBpbnNpZGUgdGhlIEhUTUwgY29kZS5cclxuLy8gQW55IGNsYXNzZXMgbm90IGFkZGVkIHRvIHRoZSBgd2luZG93YCBhcmUgaW52aXNpYmxlIChub3QgYWNjZXNzaWJsZSkgZnJvbSB0aGUgSFRNTC5cclxuLy8gR2xvYmFsIGNsYXNzZXNcclxuaW1wb3J0IENvbnRyb2xzIGZyb20gJy4vYnVpbGQvc2l0ZS1jb250cm9scyc7XHJcbndpbmRvdy5Db250cm9scyA9IENvbnRyb2xzO1xyXG5cclxuLy8gSW50ZXJuYWwgY2xhc3Nlc1xyXG5pbXBvcnQgeyBDYW52YXMgfSBmcm9tIFwiLi9idWlsZC9jYW52YXNcIlxyXG5cclxudmFyIElEX0dBTUVfQ0FOVkFTID0gXCJ0YW5rcy1jYW52YXNcIjtcclxuXHJcbi8vIFNldC11cCB0aGUgY2FudmFzIGFuZCBhZGQgb3VyIGV2ZW50IGhhbmRsZXJzIGFmdGVyIHRoZSBwYWdlIGhhcyBsb2FkZWRcclxuZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIGxldCBjYW52YXMgPSBuZXcgQ2FudmFzKElEX0dBTUVfQ0FOVkFTKTtcclxuICAgIGNhbnZhcy5zZXRET01SZXNvbHV0aW9uKHdpbmRvdy5pbm5lcldpZHRoIC0gMzIsIHdpbmRvdy5pbm5lckhlaWdodCAqIDAuOSk7XHJcbn1cclxuXHJcbmluaXQoKTsgXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9tYWluLmpzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRyb2xzIHtcclxuICAgIHN0YXRpYyB0b2dnbGVfdzNfc2hvdyhodG1sX2VsZW0pIHtcclxuICAgICAgICBpZiAoaHRtbF9lbGVtLmNsYXNzTmFtZS5pbmRleE9mKFwidzMtc2hvd1wiKSA9PSAtMSkge1xyXG4gICAgICAgICAgICBodG1sX2VsZW0uY2xhc3NOYW1lICs9IFwiIHczLXNob3dcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGh0bWxfZWxlbS5jbGFzc05hbWUgPSBodG1sX2VsZW0uY2xhc3NOYW1lLnJlcGxhY2UoXCIgdzMtc2hvd1wiLCBcIlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgdzNfb3BlbigpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15U2lkZWJhclwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlPdmVybGF5XCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgdzNfY2xvc2UoKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteVNpZGViYXJcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlPdmVybGF5XCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zaXRlLWNvbnRyb2xzLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYnVpbGQvc2l0ZS1jb250cm9scy5qc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBFdmVudENvbnRyb2xsZXIgfSBmcm9tIFwiLi9ldmVudC1jb250cm9sbGVyXCI7XHJcbmV4cG9ydCBjbGFzcyBDYW52YXMge1xyXG4gICAgY29uc3RydWN0b3IoaWQpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICB0aGlzLmV2ZW50cyA9IG5ldyBFdmVudENvbnRyb2xsZXIodGhpcy5jYW52YXMsIHRoaXMuY2FudmFzLmdldENvbnRleHQoXCIyZFwiKSk7XHJcbiAgICAgICAgLy8gaW5pdGlhbGlzZSBhcyBlbXB0eSByZW1vdmFsIGZ1bmN0aW9uIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy8gQnJvd3NlcnMgcmVhbGx5IGRvbid0IGxpa2Ugc3R5bHVzZXMgeWV0LiBPbmx5IHBvaW50ZXJtb3ZlIGlzIGNhbGxlZCB3aGVuIHN0eWx1cyBob3ZlcnNcclxuICAgICAgICAgICAgLy8gYW5kIHBvaW50ZXJsZWF2ZSBpcyBjYWxsZWQgd2hlbiB0aGUgc3R5bHVzIGlzIHByZXNzZWQgZG93blxyXG4gICAgICAgICAgICAvLyAgICAgbGV0IGRvd25fdGltZXM6IG51bWJlciA9IDA7XHJcbiAgICAgICAgICAgIC8vICAgICBsZXQgdXBfdGltZXM6IG51bWJlciA9IDA7XHJcbiAgICAgICAgICAgIC8vICAgICBsZXQgbW92ZV90aW1lczogbnVtYmVyID0gMDtcclxuICAgICAgICAgICAgLy8gICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgKGUpID0+IHsgdGhpcy5zaG93RXZlbnQoZSwgXCJwb2ludGVyZG93blwiLCBkb3duX3RpbWVzKyspOyB9LCBmYWxzZSk7XHJcbiAgICAgICAgICAgIC8vICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCAoZSkgPT4geyB0aGlzLnNob3dFdmVudChlLCBcInBvaW50ZXJ1cFwiLCB1cF90aW1lcysrKTsgfSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAvLyAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcm1vdmUnLCAoZSkgPT4geyB0aGlzLnNob3dFdmVudChlLCBcInBvaW50ZXJtb3ZlXCIsIG1vdmVfdGltZXMrKyk7IH0sIGZhbHNlKTtcclxuICAgICAgICAgICAgLy8gICAgIGxldCBvdmVyX3RpbWVzID0gMDtcclxuICAgICAgICAgICAgLy8gICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJvdmVyJywgKGUpID0+IHsgdGhpcy5zaG93RXZlbnQoZSwgXCJwb2ludGVyb3ZlclwiLCBvdmVyX3RpbWVzKyspOyB9LCBmYWxzZSk7XHJcbiAgICAgICAgICAgIC8vICAgICBsZXQgbGVhdmVfdGltZXMgPSAwO1xyXG4gICAgICAgICAgICAvLyAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcmxlYXZlJywgKGUpID0+IHsgdGhpcy5zaG93RXZlbnQoZSwgXCJwb2ludGVybGVhdmVcIiwgbGVhdmVfdGltZXMrKyk7IH0sIGZhbHNlKTtcclxuICAgICAgICAgICAgLy8gICAgIGxldCBlbnRlcl90aW1lcyA9IDA7XHJcbiAgICAgICAgICAgIC8vICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVyZW50ZXInLCAoZSkgPT4geyB0aGlzLnNob3dFdmVudChlLCBcInBvaW50ZXJlbnRlclwiLCBlbnRlcl90aW1lcysrKTsgfSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAvLyAgICAgbGV0IG91dF90aW1lcyA9IDA7XHJcbiAgICAgICAgICAgIC8vICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVyb3V0JywgKGUpID0+IHsgdGhpcy5zaG93RXZlbnQoZSwgXCJwb2ludGVyb3V0XCIsIG91dF90aW1lcysrKTsgfSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAvLyAgICAgbGV0IGNhbmNlbF90aW1lcyA9IDA7XHJcbiAgICAgICAgICAgIC8vICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVyY2FuY2VsJywgKGUpID0+IHsgdGhpcy5zaG93RXZlbnQoZSwgXCJwb2ludGVyY2FuY2VsXCIsIGNhbmNlbF90aW1lcysrKTsgfSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAvLyAgICAgbGV0IGNhcHR1cmVfdGltZXMgPSAwO1xyXG4gICAgICAgICAgICAvLyAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignZ290cG9pbnRlcmNhcHR1cmUnLCAoZSkgPT4geyB0aGlzLnNob3dFdmVudChlLCBcImdvdHBvaW50ZXJjYXB0dXJlXCIsIGNhcHR1cmVfdGltZXMrKyk7IH0sIGZhbHNlKTtcclxuICAgICAgICAgICAgLy8gICAgIGxldCBsb3N0X2NhcHR1cmVfdGltZXMgPSAwO1xyXG4gICAgICAgICAgICAvLyAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbG9zdHBvaW50ZXJjYXB0dXJlJywgKGUpID0+IHsgdGhpcy5zaG93RXZlbnQoZSwgXCJsb3N0cG9pbnRlcmNhcHR1cmVcIiwgbG9zdF9jYXB0dXJlX3RpbWVzKyspOyB9LCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBEZWJ1ZyBmdW5jdGlvbiB0byBkaXNwbGF5IHdoaWNoIGV2ZW50IGlzIHRyaWdnZXJlZCwgYW5kIGhvdyBtYW55IHRpbWVzLlxyXG4gICAgICogQHBhcmFtIGUgVGhlIGFjdHVhbCBldmVudCBjbGFzc1xyXG4gICAgICogQHBhcmFtIG1lc3NhZ2UgTWVzc2FnZSB0byBiZSBkaXNwbGF5ZWQsIHRoaXMgc2hvdWxkIGlkZW50aWZ5IHRoZSBldmVudFxyXG4gICAgICogQHBhcmFtIHRpbWVzIEhvdyBtYW55IHRpbWVzIGl0IGhhcyBiZWVuIHJlcGVhdGVkLCB0aGUgY291bnRpbmcgbXVzdCBiZSBkb25lIGV4dGVybmFsbHlcclxuICAgICAqL1xyXG4gICAgc2hvd0V2ZW50KGUsIG1lc3NhZ2UsIHRpbWVzKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWJ1Zy1zdGF0dXNcIikuaW5uZXJIVE1MID0gbWVzc2FnZSArIFwidGltZXM6IFwiICsgdGltZXM7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuICAgIHNldERPTVJlc29sdXRpb24od2lkdGgsIGhlaWdodCkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNhbnZhcy5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2J1aWxkL2NhbnZhcy5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBEcmF3LCBEcmF3U3RhdGUgfSBmcm9tIFwiLi4vZHJhd1wiO1xyXG5pbXBvcnQgeyBMaW5lTGltaXRlciB9IGZyb20gXCIuLi9saW5lLWxpbWl0ZXJcIjtcclxuaW1wb3J0IHsgQWN0aW9uTGltaXRlciB9IGZyb20gXCIuLi9hY3Rpb24tbGltaXRlclwiO1xyXG5pbXBvcnQgeyBHYW1lU3RhdGUgfSBmcm9tIFwiLi4vZXZlbnQtY29udHJvbGxlclwiO1xyXG5pbXBvcnQgeyBDYXJ0ZXNpYW5Db29yZHMgfSBmcm9tIFwiLi4vY2FydGVzaWFuLWNvb3Jkc1wiO1xyXG5pbXBvcnQgeyBUYW5rIH0gZnJvbSBcIi4uL2dhbWUtb2JqZWN0cy90YW5rXCI7XHJcbmV4cG9ydCBjbGFzcyBNb3ZpbmdFdmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb250cm9sbGVyLCBjb250ZXh0LCBwbGF5ZXIpIHtcclxuICAgICAgICB0aGlzLnN0YXJ0TW92ZW1lbnQgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICAvLyBsaW1pdCB0aGUgc3RhcnQgb2YgdGhlIGxpbmUgdG8gYmUgdGhlIHRhbmtcclxuICAgICAgICAgICAgdGhpcy5kcmF3Lmxhc3QgPSBuZXcgQ2FydGVzaWFuQ29vcmRzKHRoaXMuYWN0aXZlLnBvc2l0aW9uLlgsIHRoaXMuYWN0aXZlLnBvc2l0aW9uLlkpO1xyXG4gICAgICAgICAgICB0aGlzLmRyYXcuc3RhdGUgPSBEcmF3U3RhdGUuRFJBV0lORztcclxuICAgICAgICAgICAgLy8gbGltaXQgdGhlIGxlbmdodCBvZiB0aGUgbGluZSB0byB0aGUgbWF4aW11bSBhbGxvd2VkIHRhbmsgbW92ZW1lbnRcclxuICAgICAgICAgICAgaWYgKHRoaXMubGluZS5pbih0aGlzLmFjdGl2ZS5wb3NpdGlvbiwgdGhpcy5kcmF3Lm1vdXNlKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3LmxpbmUodGhpcy5jb250ZXh0LCBUYW5rLkRFRkFVTFRfTU9WRU1FTlRfTElORV9XSURUSCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZW5kTW92ZW1lbnQgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmRyYXcuc3RhdGUgPSBEcmF3U3RhdGUuU1RPUFBFRDtcclxuICAgICAgICAgICAgLy8gcmVzZXQgdGhlIGxpbmUgbGltaXQgYXMgdGhlIHVzZXIgaGFzIGxldCBnbyBvZiB0aGUgYnV0dG9uXHJcbiAgICAgICAgICAgIHRoaXMubGluZS5yZXNldCgpO1xyXG4gICAgICAgICAgICAvLyBvbmx5IGRyYXcgaWYgdGhlIHBvc2l0aW9uIGlzIHZhbGlkXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmFjdGl2ZS52YWxpZF9wb3NpdGlvbikge1xyXG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIHRoZSBwb3NpdGlvbiBvZiB0aGUgdGFuayBpbiB0aGUgcGxheWVyIGFycmF5XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllci50YW5rc1t0aGlzLmFjdGl2ZS5pZF0ucG9zaXRpb24gPSB0aGlzLmRyYXcubW91c2UuY29weSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG93VXNlcldhcm5pbmcoXCJcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gZGVsZXRlIHRoZSByZWZlcmVuY2UgdG8gdGhlIGFjdGl2ZSB0YW5rXHJcbiAgICAgICAgICAgIC8vIHRoaXMuYWN0aXZlID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLnNoYXJlZC5hY3RpdmUgPSBudWxsO1xyXG4gICAgICAgICAgICAvLyByZWRyYXcgY2FudmFzIHdpdGggYWxsIGN1cnJlbnQgdGFua3NcclxuICAgICAgICAgICAgdGhpcy5yZWRyYXcodGhpcy5wbGF5ZXIudGFua3MpO1xyXG4gICAgICAgICAgICAvLyBUbyBhZGQ6IGlmIG91dCBvZiBhY3Rpb25zLCB0aGVuIG5leHQgc3RhdGUgaXMgVEFOS19TSE9PVElOR1xyXG4gICAgICAgICAgICAvLyBjb21lIGJhY2sgdG8gbW92aW5nIGFmdGVyIHNlbGVjdGlvblxyXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuc2hhcmVkLm5leHQgPSBHYW1lU3RhdGUuVEFOS19NT1ZJTkc7XHJcbiAgICAgICAgICAgIC8vIGdvIHRvIHRhbmsgc2VsZWN0aW9uIHN0YXRlXHJcbiAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5jaGFuZ2VHYW1lU3RhdGUoR2FtZVN0YXRlLlRBTktfU0VMRUNUSU9OKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZHJhd01vdmVMaW5lID0gKGUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5kcmF3LnVwZGF0ZU1vdXNlUG9zaXRpb24oZSk7XHJcbiAgICAgICAgICAgIC8vIGRyYXcgdGhlIG1vdmVtZW50IGxpbmUgaWYgdGhlIG1vdXNlIGJ1dHRvbiBpcyBjdXJyZW50bHkgYmVpbmcgcHJlc3NlZFxyXG4gICAgICAgICAgICBpZiAodGhpcy5kcmF3LnN0YXRlID09IERyYXdTdGF0ZS5EUkFXSU5HKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5saW5lLmluKHRoaXMuYWN0aXZlLnBvc2l0aW9uLCB0aGlzLmRyYXcubW91c2UpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hY3RpdmUudmFsaWRfcG9zaXRpb24gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhdy5saW5lKHRoaXMuY29udGV4dCwgVGFuay5ERUZBVUxUX01PVkVNRU5UX0xJTkVfV0lEVEgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hY3RpdmUudmFsaWRfcG9zaXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy50b3VjaE1vdmUgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICAvLyBVcGRhdGUgdGhlIHRvdWNoIGNvLW9yZGluYXRlc1xyXG4gICAgICAgICAgICB0aGlzLmRyYXcudXBkYXRlVG91Y2hQb3NpdGlvbihlKTtcclxuICAgICAgICAgICAgLy8gRHVyaW5nIGEgdG91Y2htb3ZlIGV2ZW50LCB1bmxpa2UgYSBtb3VzZW1vdmUgZXZlbnQsIHdlIGRvbid0IG5lZWQgdG8gY2hlY2sgaWYgdGhlIHRvdWNoIGlzIGVuZ2FnZWQsIHNpbmNlIHRoZXJlIHdpbGwgYWx3YXlzIGJlIGNvbnRhY3Qgd2l0aCB0aGUgc2NyZWVuIGJ5IGRlZmluaXRpb24uXHJcbiAgICAgICAgICAgIHRoaXMuZHJhdy5saW5lKHRoaXMuY29udGV4dCwgVGFuay5ERUZBVUxUX1dJRFRIKTtcclxuICAgICAgICAgICAgLy8gUHJldmVudCBhIHNjcm9sbGluZyBhY3Rpb24gYXMgYSByZXN1bHQgb2YgdGhpcyB0b3VjaG1vdmUgdHJpZ2dlcmluZy5cclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMucGVuTW92ZSA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhdy51cGRhdGVNb3VzZVBvc2l0aW9uKGUpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kcmF3LnN0YXRlID09IERyYXdTdGF0ZS5EUkFXSU5HKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXcubGluZSh0aGlzLmNvbnRleHQsIFRhbmsuREVGQVVMVF9XSURUSCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuY29udHJvbGxlciA9IGNvbnRyb2xsZXI7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcclxuICAgICAgICB0aGlzLnBsYXllciA9IHBsYXllcjtcclxuICAgICAgICB0aGlzLmRyYXcgPSBuZXcgRHJhdygpO1xyXG4gICAgICAgIHRoaXMubGluZSA9IG5ldyBMaW5lTGltaXRlcihUYW5rLkRFRkFVTFRfTU9WRU1FTlRfUkFOR0UpO1xyXG4gICAgICAgIHRoaXMudHVybiA9IG5ldyBBY3Rpb25MaW1pdGVyKCk7XHJcbiAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmNvbnRyb2xsZXIuc2hhcmVkLmFjdGl2ZTtcclxuICAgIH1cclxuICAgIGFkZEV2ZW50TGlzdGVuZXJzKGNhbnZhcykge1xyXG4gICAgICAgIGNhbnZhcy5vbm1vdXNlZG93biA9IHRoaXMuc3RhcnRNb3ZlbWVudDtcclxuICAgICAgICBjYW52YXMub25tb3VzZW1vdmUgPSB0aGlzLmRyYXdNb3ZlTGluZTtcclxuICAgICAgICAvLyBOT1RFOiBtb3VzZXVwIGlzIG9uIHRoZSB3aG9sZSB3aW5kb3csIHNvIHRoYXQgZXZlbiBpZiB0aGUgY3Vyc29yIGV4aXRzIHRoZSBjYW52YXMsIHRoZSBldmVudCB3aWxsIHRyaWdnZXJcclxuICAgICAgICB3aW5kb3cub25tb3VzZXVwID0gdGhpcy5lbmRNb3ZlbWVudDtcclxuICAgICAgICAvLyBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMudG91Y2hNb3ZlLCBmYWxzZSk7XHJcbiAgICAgICAgLy8gY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5tb3VzZVVwLCBmYWxzZSk7XHJcbiAgICAgICAgLy8gY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMudG91Y2hNb3ZlLCBmYWxzZSk7XHJcbiAgICB9XHJcbiAgICBzaG93VXNlcldhcm5pbmcobWVzc2FnZSkge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidXNlci13YXJuaW5nXCIpLmlubmVySFRNTCA9IG1lc3NhZ2U7XHJcbiAgICB9XHJcbiAgICByZWRyYXcodGFua3MpIHtcclxuICAgICAgICB0aGlzLmNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMuY29udGV4dC5jYW52YXMud2lkdGgsIHRoaXMuY29udGV4dC5jYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICBmb3IgKGNvbnN0IHRhbmsgb2YgdGFua3MpIHtcclxuICAgICAgICAgICAgdGFuay5kcmF3KHRoaXMuY29udGV4dCwgdGhpcy5kcmF3KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGFuay1tb3ZpbmcuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9idWlsZC9nYW1lLWV2ZW50cy90YW5rLW1vdmluZy5qc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBUYW5rc01hdGggfSBmcm9tIFwiLi90YW5rcy1tYXRoXCI7XHJcbmV4cG9ydCBjbGFzcyBMaW5lTGltaXRlciB7XHJcbiAgICAvKipcclxuICAgICAqIENhbGN1YWx0ZXMgYW5kIGtlZXBzIHRyYWNrIG9mIHRoZSB0b3RhbCBsZW5ndGggb2YgYSBsaW5lLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBsaW1pdCBNYXhpbXVtIGxlbmd0aCBvZiBlYWNoIGxpbmUsIGluIGNhbnZhcyBwaXhlbHNcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobGltaXQgPSAyMDApIHtcclxuICAgICAgICB0aGlzLmxpbWl0ID0gbGltaXQ7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gMDtcclxuICAgIH1cclxuICAgIHJlc2V0KCkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudCA9IDA7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIENhbGN1bGF0ZSBkaXN0YW5jZSBvZiBDYXJ0ZXNpYW4gY29vcmRpbmF0ZXMsIGFuZCBpbmNyZW1lbnQgdGhlIHRvdGFsIGxlbmd0aCBvZiB0aGUgbGluZS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gc3RhcnQgU3RhcnQgY29vcmRpbmF0ZXNcclxuICAgICAqIEBwYXJhbSBlbmQgRW5kIGNvb3JkaW5hdGVzXHJcbiAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBsaW5lIGlzIGJlbG93IHRoZSBsaW1pdCwgZmFsc2UgaWYgdGhlIGxpbmUgaXMgbG9uZ2VyIHRoYW4gdGhlIGxpbWl0XHJcbiAgICAgKi9cclxuICAgIGFkZChzdGFydCwgZW5kKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50ICs9IFRhbmtzTWF0aC5wb2ludC5kaXN0MmQoc3RhcnQsIGVuZCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudCA8PSB0aGlzLmxpbWl0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayBpZiB0aGUgZGlzdGFuY2UgYmV0d2VlbiB0aGUgdHdvIHBvaW50cyBpcyBncmVhdGVyIHRoYW4gdGhlIGxpbWl0LlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBzdGFydCBTdGFydCBjb29yZGluYXRlc1xyXG4gICAgICogQHBhcmFtIGVuZCBFbmQgY29vcmRpbmF0ZXNcclxuICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIGxpbmUgaXMgYmVsb3cgdGhlIGxpbWl0LCBmYWxzZSBvdGhlcndpc2VcclxuICAgICAqL1xyXG4gICAgaW4oc3RhcnQsIGVuZCkge1xyXG4gICAgICAgIGNvbnN0IGRpc3RhbmNlID0gVGFua3NNYXRoLnBvaW50LmRpc3QyZChzdGFydCwgZW5kKTtcclxuICAgICAgICByZXR1cm4gZGlzdGFuY2UgPD0gdGhpcy5saW1pdDtcclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1saW5lLWxpbWl0ZXIuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9idWlsZC9saW5lLWxpbWl0ZXIuanNcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IEdhbWVTdGF0ZSB9IGZyb20gXCIuLi9ldmVudC1jb250cm9sbGVyXCI7XHJcbmltcG9ydCB7IFRhbmsgfSBmcm9tIFwiLi4vZ2FtZS1vYmplY3RzL3RhbmtcIjtcclxuaW1wb3J0IHsgRHJhdyB9IGZyb20gXCIuLi9kcmF3XCI7XHJcbmltcG9ydCB7IEFjdGlvbkxpbWl0ZXIgfSBmcm9tIFwiLi4vYWN0aW9uLWxpbWl0ZXJcIjtcclxuZXhwb3J0IGNsYXNzIFBsYWNpbmdFdmVudCB7XHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY29udHJvbGxlciBUaGUgZXZlbnRzIGNvbnRyb2xsZXIsIHdoaWNoIGlzIHVzZWQgdG8gY2hhbmdlIHRoZSBnYW1lIHN0YXRlIGFmdGVyIHRoaXMgZXZlbnQgaXMgZmluaXNoZWQuXHJcbiAgICAgKiBAcGFyYW0gY29udGV4dCBDb250ZXh0IG9uIHdoaWNoIHRoZSBvYmplY3RzIGFyZSBkcmF3blxyXG4gICAgICogQHBhcmFtIHBsYXllclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihjb250cm9sbGVyLCBjb250ZXh0LCBwbGF5ZXIpIHtcclxuICAgICAgICB0aGlzLmFkZFRhbmsgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmRyYXcudXBkYXRlTW91c2VQb3NpdGlvbihlKTtcclxuICAgICAgICAgICAgY29uc3QgdGFuayA9IG5ldyBUYW5rKHRoaXMuZHJhdy5tb3VzZS5YLCB0aGlzLmRyYXcubW91c2UuWSk7XHJcbiAgICAgICAgICAgIHRhbmsucGxheWVyID0gdGhpcy5wbGF5ZXI7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyLnRhbmtzLnB1c2godGFuayk7XHJcbiAgICAgICAgICAgIHRhbmsuZHJhdyh0aGlzLmNvbnRleHQsIHRoaXMuZHJhdyk7XHJcbiAgICAgICAgICAgIC8vIGlmIHdlJ3ZlIHBsYWNlZCBhcyBtYW55IG9iamVjdHMgYXMgYWxsb3dlZCwgdGhlbiBnbyB0byBuZXh0IHN0YXRlXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnR1cm4uZW5kKCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5zaGFyZWQubmV4dCA9IEdhbWVTdGF0ZS5UQU5LX01PVklORztcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5jaGFuZ2VHYW1lU3RhdGUoR2FtZVN0YXRlLlRBTktfU0VMRUNUSU9OKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyID0gY29udHJvbGxlcjtcclxuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xyXG4gICAgICAgIHRoaXMuZHJhdyA9IG5ldyBEcmF3KCk7XHJcbiAgICAgICAgdGhpcy50dXJuID0gbmV3IEFjdGlvbkxpbWl0ZXIoKTtcclxuICAgICAgICB0aGlzLnBsYXllciA9IHBsYXllcjtcclxuICAgIH1cclxuICAgIGFkZEV2ZW50TGlzdGVuZXJzKGNhbnZhcykge1xyXG4gICAgICAgIGNhbnZhcy5vbm1vdXNlZG93biA9IHRoaXMuYWRkVGFuaztcclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD10YW5rLXBsYWNpbmcuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9idWlsZC9nYW1lLWV2ZW50cy90YW5rLXBsYWNpbmcuanNcbi8vIG1vZHVsZSBpZCA9IDExXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IEdhbWVTdGF0ZSB9IGZyb20gXCIuLi9ldmVudC1jb250cm9sbGVyXCI7XHJcbmV4cG9ydCBjbGFzcyBTaG9vdGluZ0V2ZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbnRyb2xsZXIsIGNvbnRleHQpIHtcclxuICAgICAgICB0aGlzLnNvbWVGdW5jID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNoYW5naW5nIHN0YXRlIGZyb20gVEFOSyBTSE9PVElORyB0byBNRU5VXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuY2hhbmdlR2FtZVN0YXRlKEdhbWVTdGF0ZS5NRU5VKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiSW5pdGlhbGlzaW5nIFRBTksgU0hPT1RJTkdcIik7XHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyID0gY29udHJvbGxlcjtcclxuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xyXG4gICAgfVxyXG4gICAgYWRkRXZlbnRMaXN0ZW5lcnMoY2FudmFzKSB7XHJcbiAgICAgICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy5zb21lRnVuYywgZmFsc2UpO1xyXG4gICAgfVxyXG4gICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcnMoY2FudmFzKSB7XHJcbiAgICAgICAgY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy5zb21lRnVuYywgZmFsc2UpO1xyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRhbmstc2hvb3RpbmcuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9idWlsZC9nYW1lLWV2ZW50cy90YW5rLXNob290aW5nLmpzXG4vLyBtb2R1bGUgaWQgPSAxMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBHYW1lU3RhdGUgfSBmcm9tIFwiLi4vZXZlbnQtY29udHJvbGxlclwiO1xyXG5leHBvcnQgY2xhc3MgTWVudUV2ZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbnRyb2xsZXIsIGNvbnRleHQpIHtcclxuICAgICAgICB0aGlzLnNvbWVGdW5jID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNoYW5naW5nIHN0YXRlIGZyb20gTUVOVSBFVkVOVCB0byBUQU5LIFBMQUNJTkdcIik7XHJcbiAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5jaGFuZ2VHYW1lU3RhdGUoR2FtZVN0YXRlLlRBTktfUExBQ0lORyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIgPSBjb250cm9sbGVyO1xyXG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XHJcbiAgICB9XHJcbiAgICBhZGRFdmVudExpc3RlbmVycyhjYW52YXMpIHtcclxuICAgICAgICBjYW52YXMub25tb3VzZWRvd24gPSB0aGlzLnNvbWVGdW5jO1xyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1lbnUuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9idWlsZC9nYW1lLWV2ZW50cy9tZW51LmpzXG4vLyBtb2R1bGUgaWQgPSAxM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgY2xhc3MgUGxheWVyIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMudGFua3MgPSBuZXcgQXJyYXkoKTtcclxuICAgIH1cclxuICAgIDtcclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1wbGF5ZXIuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9idWlsZC9nYW1lLW9iamVjdHMvcGxheWVyLmpzXG4vLyBtb2R1bGUgaWQgPSAxNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgY2xhc3MgQWN0aXZlVGFuayB7XHJcbiAgICBjb25zdHJ1Y3RvcihpZCwgcG9zaXRpb24pIHtcclxuICAgICAgICB0aGlzLnZhbGlkX3Bvc2l0aW9uID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBUYW5rc1NoYXJlZFN0YXRlIHtcclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zaGFyZWQtc3RhdGUuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9idWlsZC9nYW1lLWV2ZW50cy9zaGFyZWQtc3RhdGUuanNcbi8vIG1vZHVsZSBpZCA9IDE1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IFRhbmtzTWF0aCB9IGZyb20gXCIuLi90YW5rcy1tYXRoXCI7XHJcbmltcG9ydCB7IERyYXcgfSBmcm9tIFwiLi4vZHJhd1wiO1xyXG5pbXBvcnQgeyBUYW5rIH0gZnJvbSBcIi4uL2dhbWUtb2JqZWN0cy90YW5rXCI7XHJcbmltcG9ydCB7IEFjdGl2ZVRhbmsgfSBmcm9tIFwiLi9zaGFyZWQtc3RhdGVcIjtcclxuZXhwb3J0IGNsYXNzIFNlbGVjdGlvbkV2ZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbnRyb2xsZXIsIGNvbnRleHQsIHBsYXllcikge1xyXG4gICAgICAgIHRoaXMuaGlnaGxpZ2h0VGFuayA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhdy51cGRhdGVNb3VzZVBvc2l0aW9uKGUpO1xyXG4gICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgdXNlciBoYXMgY2xpY2tlZCBhbnkgdGFuay5cclxuICAgICAgICAgICAgZm9yIChjb25zdCBbaWQsIHRhbmtdIG9mIHRoaXMucGxheWVyLnRhbmtzLmVudHJpZXMoKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKFRhbmtzTWF0aC5wb2ludC5jb2xsaWRlX2NpcmNsZSh0aGlzLmRyYXcubW91c2UsIHRhbmsucG9zaXRpb24sIFRhbmsuREVGQVVMVF9XSURUSCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBoaWdobGlnaHQgdGhlIHNlbGVjdGVkIHRhbmtcclxuICAgICAgICAgICAgICAgICAgICB0YW5rLmhpZ2hsaWdodCh0aGlzLmNvbnRleHQsIHRoaXMuZHJhdyk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc3RvcmUgdGhlIGRldGFpbHMgb2YgdGhlIGFjdGl2ZSB0YW5rXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLnNoYXJlZC5hY3RpdmUgPSBuZXcgQWN0aXZlVGFuayhpZCwgdGFuay5wb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gb25seSBoaWdobGlnaHQgdGhlIGZpcnN0IHRhbmtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5tb3VzZVVwID0gKGUpID0+IHtcclxuICAgICAgICAgICAgLy8gaWYgdGhlIHVzZXIgaGFzIGNsaWNrZWQgb24gYW55IG9mIHRoZSBvYmplY3RzLCBnbyBpbnRvIG1vdmVtZW50IHN0YXRlXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRyb2xsZXIuc2hhcmVkLmFjdGl2ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLmNoYW5nZUdhbWVTdGF0ZSh0aGlzLmNvbnRyb2xsZXIuc2hhcmVkLm5leHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIgPSBjb250cm9sbGVyO1xyXG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBwbGF5ZXI7XHJcbiAgICAgICAgdGhpcy5kcmF3ID0gbmV3IERyYXcoKTtcclxuICAgIH1cclxuICAgIGFkZEV2ZW50TGlzdGVuZXJzKGNhbnZhcykge1xyXG4gICAgICAgIGNhbnZhcy5vbm1vdXNlZG93biA9IHRoaXMuaGlnaGxpZ2h0VGFuaztcclxuICAgICAgICAvLyBOT1RFOiBtb3VzZXVwIGlzIG9uIHRoZSB3aG9sZSB3aW5kb3csIHNvIHRoYXQgZXZlbiBpZiB0aGUgY3Vyc29yIGV4aXRzIHRoZSBjYW52YXMsIHRoZSBldmVudCB3aWxsIHRyaWdnZXJcclxuICAgICAgICB3aW5kb3cub25tb3VzZXVwID0gdGhpcy5tb3VzZVVwO1xyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRhbmstc2VsZWN0aW9uLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYnVpbGQvZ2FtZS1ldmVudHMvdGFuay1zZWxlY3Rpb24uanNcbi8vIG1vZHVsZSBpZCA9IDE2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=