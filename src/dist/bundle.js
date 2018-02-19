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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GameState; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__gameStates_moving__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__gameStates_placing__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__gameStates_shooting__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__gameStates_selection__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__gameStates_menu__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__gameObjects_player__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__gameStates_sharedState__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__drawing_color__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__lineCache__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__tanksMath__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__gameObjects_tank__ = __webpack_require__(1);











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
class GameStateController {
    constructor() {
        this.NUM_PLAYERS = 2;
        /** All the players in the game */
        this.players = [];
        /** Stores the all of the shot lines */
        this.line_cache = new __WEBPACK_IMPORTED_MODULE_8__lineCache__["a" /* LineCache */]();
        /** Flag to specify if the current player's turn is over */
        this.next_player = false;
        /** Shared state among game states */
        this.shared = new __WEBPACK_IMPORTED_MODULE_6__gameStates_sharedState__["b" /* TanksSharedState */]();
    }
    initialise(canvas, context, ui) {
        this.canvas = canvas;
        this.context = context;
        this.ui = ui;
        this.current_player = 0;
        for (let i = 0; i < this.NUM_PLAYERS; i++) {
            this.players.push(new __WEBPACK_IMPORTED_MODULE_5__gameObjects_player__["a" /* Player */](i, "Player " + (i + 1), __WEBPACK_IMPORTED_MODULE_7__drawing_color__["a" /* Color */].next()));
        }
    }
    /**
     * The game events should be in this order:
     * Menu
     * Placing for each player
     * Repeat until game over
     *  Moving, Shooting for P1
     *  Moving, Shooting for P2
     * @param new_state
     */
    changeGameState(new_state) {
        this.state = new_state;
        // clears any old events that were added
        this.canvas.onmousedown = null;
        window.onmouseup = null;
        this.canvas.onmousemove = null;
        // if the state has marked the end of the player's turn, then we go to the next player
        if (this.next_player) {
            if (this.isEveryone()) {
                console.log("Switching player");
                // this is used to escape from placing forever, when all players have placed their tanks
                // then the next state will be taken, which will be movement, afterwards this is used to 
                // keep switching between movement and shooting until the end of the game
                this.state = this.shared.next.get();
            }
            this.next_player = false;
        }
        const player = this.players[this.current_player];
        console.log("This is ", player.name, " playing.");
        switch (this.state) {
            case GameState.MENU:
                this.action = new __WEBPACK_IMPORTED_MODULE_4__gameStates_menu__["a" /* MenuState */](this, this.context);
                console.log("Initialising MENU");
                break;
            case GameState.TANK_PLACING:
                this.action = new __WEBPACK_IMPORTED_MODULE_1__gameStates_placing__["a" /* PlacingState */](this, this.context, player);
                this.next_player = true;
                console.log("Initialising TANK PLACING");
                break;
            case GameState.TANK_SELECTION:
                console.log("Initialising TANK SELECTION");
                this.action = new __WEBPACK_IMPORTED_MODULE_3__gameStates_selection__["a" /* SelectionState */](this, this.context, player);
                break;
            case GameState.TANK_MOVING:
                console.log("Initialising TANK MOVEMENT");
                this.action = new __WEBPACK_IMPORTED_MODULE_0__gameStates_moving__["a" /* MovingState */](this, this.context, player);
                break;
            case GameState.TANK_SHOOTING:
                console.log("Initialising TANK SHOOTING");
                this.action = new __WEBPACK_IMPORTED_MODULE_2__gameStates_shooting__["a" /* ShootingState */](this, this.context, player);
                break;
            default:
                throw new Error("The game should never be in an unknown state, something has gone terribly wrong!");
        }
        // add the mouse events for the new state
        this.action.addEventListeners(this.canvas);
    }
    /** Clears everything from the canvas on the screen. To show anything afterwards it needs to be redrawn. */
    clearCanvas() {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    }
    redrawCanvas(draw) {
        this.clearCanvas();
        // draw every player for every tank
        for (const player of this.players) {
            for (const tank of player.tanks) {
                tank.draw(this.context, draw);
            }
        }
        const old_lines_color = __WEBPACK_IMPORTED_MODULE_7__drawing_color__["a" /* Color */].gray(0.5).toRGBA();
        // draw the last N lines
        for (const line_path of this.line_cache.lines()) {
            for (let i = 1; i < line_path.points.length; i++) {
                // old lines are currently half-transparent
                draw.line(this.context, line_path.points[i - 1], line_path.points[i], 1, old_lines_color);
            }
        }
    }
    debugShot(line_path, start, end, tank, distance) {
        console.log("Starting collision debug...");
        for (const line of line_path.points) {
            console.log("(", line.X, ",", -line.Y, ")");
        }
        console.log("Collided with line: (" + start.X + "," + -start.Y + ") (" + end.X + "," + -end.Y + ")");
        console.log("Tank ID: ", tank.id, " (", tank.position.X, ",", -tank.position.Y, ")");
        console.log("Distance: ", distance);
    }
    collide(line_path) {
        console.log("-------------------- Starting Collision -------------------");
        const num_points_in_line = line_path.points.length;
        // for every player who isnt the current player
        for (const player of this.players.filter((p) => p.id !== this.current_player)) {
            // loop over all their tanks
            for (const tank of player.tanks) {
                // only do collision detection versus tanks that have not been already killed
                if (tank.health_state !== __WEBPACK_IMPORTED_MODULE_10__gameObjects_tank__["b" /* TankHealthState */].DEAD) {
                    // check each line for collision with the tank
                    for (let p = 1; p < num_points_in_line; p++) {
                        const dist = __WEBPACK_IMPORTED_MODULE_9__tanksMath__["a" /* TanksMath */].line.circle_center_dist(line_path.points[p - 1], line_path.points[p], tank.position);
                        this.debugShot(line_path, line_path.points[p - 1], line_path.points[p], tank, dist);
                        if (!dist) {
                            continue;
                        }
                        // TODO move out from the controller
                        // if the line glances the tank, mark as disabled 
                        if (__WEBPACK_IMPORTED_MODULE_10__gameObjects_tank__["a" /* Tank */].WIDTH - __WEBPACK_IMPORTED_MODULE_10__gameObjects_tank__["a" /* Tank */].DISABLED_ZONE <= dist && dist <= __WEBPACK_IMPORTED_MODULE_10__gameObjects_tank__["a" /* Tank */].WIDTH + __WEBPACK_IMPORTED_MODULE_10__gameObjects_tank__["a" /* Tank */].DISABLED_ZONE) {
                            tank.health_state = __WEBPACK_IMPORTED_MODULE_10__gameObjects_tank__["b" /* TankHealthState */].DISABLED;
                            console.log("Tank ", tank.id, " disabled!");
                            break;
                        } // if the line passes through the tank, mark dead
                        else if (dist < __WEBPACK_IMPORTED_MODULE_10__gameObjects_tank__["a" /* Tank */].WIDTH) {
                            tank.health_state = __WEBPACK_IMPORTED_MODULE_10__gameObjects_tank__["b" /* TankHealthState */].DEAD;
                            console.log("Tank ", tank.id, " dead!");
                            break;
                            // the tank has already been processed, we can go to the next one
                        }
                    }
                }
            }
        }
    }
    cacheLine(path) {
        this.line_cache.points.push(path);
    }
    showUserWarning(message) {
        document.getElementById("user-warning").innerHTML = message;
    }
    /**
     * @returns false if there are still players to take their turn, true if all players have completed their turns for the state
    */
    isEveryone() {
        if (this.current_player === this.NUM_PLAYERS - 1) {
            this.current_player = 0;
            return true;
        }
        this.current_player += 1;
        return false;
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = GameStateController;

//# sourceMappingURL=gameStateController.js.map

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export TankActState */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return TankHealthState; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__cartesianCoords__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__drawing_color__ = __webpack_require__(6);


var TankActState;
(function (TankActState) {
    /** The tank has performed an action this turn, e.g. moved or shot */
    TankActState[TankActState["ACTED"] = 0] = "ACTED";
    /** The tank hasn't performed an action this turn */
    TankActState[TankActState["NOT_ACTED"] = 1] = "NOT_ACTED";
})(TankActState || (TankActState = {}));
var TankHealthState;
(function (TankHealthState) {
    /** Tank can do everything */
    TankHealthState[TankHealthState["ALIVE"] = 0] = "ALIVE";
    /** Tank can't move */
    TankHealthState[TankHealthState["DISABLED"] = 1] = "DISABLED";
    /** Tank can't do anything */
    TankHealthState[TankHealthState["DEAD"] = 2] = "DEAD";
})(TankHealthState || (TankHealthState = {}));
/** Provides grouping for all the Tank's colors */
class TankColor {
    constructor(active, active_outline, label, alive, disabled, dead) {
        this.active = active;
        this.active_outline = active_outline;
        this.label = label;
        this.alive = alive;
        this.disabled = disabled;
        this.dead = dead;
    }
}
class Tank {
    constructor(id, player, x, y) {
        /** Opacity for the tank's label */
        this.LABEL_OPACITY = 0.7;
        /** Opacity for the player color when the tank is disabled */
        this.DISABLED_OPACITY = 0.7;
        this.id = id;
        this.player = player;
        this.position = new __WEBPACK_IMPORTED_MODULE_0__cartesianCoords__["a" /* CartesianCoords */](x, y);
        this.health_state = TankHealthState.ALIVE;
        this.label = this.id + ""; // + "" converts to string
        // initialise colors for each of the tank's states
        this.color = new TankColor(__WEBPACK_IMPORTED_MODULE_1__drawing_color__["a" /* Color */].red().toRGBA(), __WEBPACK_IMPORTED_MODULE_1__drawing_color__["a" /* Color */].green().toRGBA(), __WEBPACK_IMPORTED_MODULE_1__drawing_color__["a" /* Color */].black().toRGBA(this.LABEL_OPACITY), this.player.color.toRGBA(), this.player.color.toRGBA(this.DISABLED_OPACITY), __WEBPACK_IMPORTED_MODULE_1__drawing_color__["a" /* Color */].gray().toRGBA());
    }
    draw(context, draw) {
        let color;
        let label = this.label;
        switch (this.health_state) {
            case TankHealthState.ALIVE:
                color = this.color.alive;
                break;
            case TankHealthState.DISABLED:
                color = this.color.disabled;
                label += "D";
                break;
            case TankHealthState.DEAD:
                color = this.color.dead;
                label += "X";
                break;
        }
        draw.circle(context, this.position, Tank.WIDTH, Tank.LINE_WIDTH, color);
        context.fillStyle = this.color.label;
        context.font = "18px Calibri";
        context.fillText(label, this.position.X, this.position.Y + 5);
    }
    highlight(context, draw) {
        draw.dot(context, this.position, Tank.WIDTH, this.color.active);
        draw.circle(context, this.position, Tank.MOVEMENT_RANGE, Tank.LINE_WIDTH, this.color.active_outline);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Tank;

/** The width of the dot when drawing the tank */
Tank.WIDTH = 12;
/** The zone around the tank that will cause it to be disabled instead of killed */
Tank.DISABLED_ZONE = 0.5;
/** The width of the line when drawing the tank */
Tank.LINE_WIDTH = 1;
/** How far can the tank move */
Tank.MOVEMENT_RANGE = 100;
/** The width of the movement line */
Tank.MOVEMENT_LINE_WIDTH = 3;
/** The color of the movement line */
Tank.MOVEMENT_LINE_COLOR = __WEBPACK_IMPORTED_MODULE_1__drawing_color__["a" /* Color */].black().toRGBA();
/** How far can the shot line reach */
Tank.SHOOTING_RANGE = 250;
/** How fast must the player move for a valid shot */
Tank.SHOOTING_SPEED = 30;
/** The deadzone allowed for free mouse movement before the player shoots.
 * This means that the player can wiggle the cursor around in the tank's space
 * to prepare for the shot.
 */
Tank.SHOOTING_DEADZONE = Tank.WIDTH + 2;
//# sourceMappingURL=tank.js.map

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return DrawState; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__cartesianCoords__ = __webpack_require__(3);

class Draw {
    constructor() {
        this.mouse = new __WEBPACK_IMPORTED_MODULE_0__cartesianCoords__["a" /* CartesianCoords */]();
        this.last = new __WEBPACK_IMPORTED_MODULE_0__cartesianCoords__["a" /* CartesianCoords */]();
    }
    /** Draw a dot (a filled circle) around the point.
     *
     * @param context Context on which the circle will be drawn
     * @param coords Coordinates for the origin point of the circle
     * @param radius Radius of the dot
     * @param fill_color Color of the fill
     * @param outline Specify whether an outline will be drawn around the circle
     * @param stroke_color Specify color for the outline, if not specified the colour will be the same as the fill color
     */
    dot(context, coords, radius, fill_color, outline = false, stroke_color = null) {
        // Let's use black by setting RGB values to 0, and 255 alpha (completely opaque)
        // Select a fill style
        context.fillStyle = fill_color;
        context.lineWidth = radius;
        // Draw a filled circle
        context.beginPath();
        context.arc(coords.X, coords.Y, radius, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();
        if (outline) {
            context.strokeStyle = stroke_color || fill_color;
            context.stroke();
        }
    }
    /** Draw a circle around a point.
     *
     * @param context Context on which the circle will be drawn
     * @param coords Coordinates for the origin point of the circle
     * @param radius The radius of the circle
     * @param line_width The line width of the circle
     * @param color The color of the line
     */
    circle(context, coords, radius, line_width, color) {
        // Let's use black by setting RGB values to 0, and 255 alpha (completely opaque)
        // Select a fill style
        context.strokeStyle = color;
        context.lineWidth = line_width;
        // Draw a filled circle
        context.beginPath();
        context.arc(coords.X, coords.Y, radius, 0, Math.PI * 2, true);
        context.closePath();
        context.stroke();
    }
    /**
     * Draw a line between the last known position of the mouse, and the current position.
     * @param context The canvas context that we're drawing on
     * @param update_last Whether to update the last position of the mouse
     */
    mouseLine(context, width, color, update_last = true) {
        // If lastX is not set, set lastX and lastY to the current position 
        if (this.last.X == -1) {
            this.last.X = this.mouse.X;
            this.last.Y = this.mouse.Y;
        }
        // Select a fill style
        context.strokeStyle = color;
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
    /**
     * Draw a line between the start and end points.
     * @param context The canvas context that we're drawing on
     * @param start Start point
     * @param end End point
     * @param width Width of the line
     * @param color Color of the line
     */
    line(context, start, end, width, color) {
        // Select a fill style
        context.strokeStyle = color;
        // Set the line "cap" style to round, so lines at different angles can join into each other
        context.lineCap = "round";
        context.lineJoin = "round";
        // Draw a filled line
        context.beginPath();
        // First, move to the old (previous) position
        context.moveTo(start.X, start.Y);
        // Now draw a line to the current touch/pointer position
        context.lineTo(end.X, end.Y);
        // Set the line thickness and draw the line
        context.lineWidth = width;
        context.stroke();
        context.closePath();
    }
    updateMousePosition(e) {
        // if the browser hasn't passed a parameter, but has set the global event variable
        if (!e) {
            var e = event;
        }
        if (e.offsetX) {
            this.mouse.X = e.offsetX;
            this.mouse.Y = e.offsetY;
        }
    }
    updateTouchPosition(e) {
        // if the browser hasn't passed a parameter, but has set the global event variable
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
class CartesianCoords {
    constructor(x = -1, y = -1) {
        this.X = x;
        this.Y = y;
    }
    copy() {
        return new CartesianCoords(this.X, this.Y);
    }
    toString() {
        return this.X + "," + this.Y;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CartesianCoords;

//# sourceMappingURL=cartesianCoords.js.map

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__cartesianCoords__ = __webpack_require__(3);

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
     * @param center The centre of the circle
     * @param radius The radius of the circle
     * @returns true if there is collision, false otherwise
     */
    collide_circle(point, center, radius) {
        const distance = this.dist2d(point, center);
        if (distance > radius) {
            return false;
        }
        return true;
    }
    /**
     * Check if the point is within the start and end of the line
     * @param point Cooridnates of a point
     * @param start Start coordinates of a line
     * @param end End coordinates of a line
     */
    within(point, start, end) {
        // Initial implementation: https://stackoverflow.com/a/328122/2823526
        // Optimisation and correction: https://stackoverflow.com/a/328110/2823526
        // as the point is guaranteed to be on the line by Line::closest_point, we just check if the point is within the line
        const within = (start, point, end) => (start <= point && point <= end) || (end <= point && point <= start);
        return start.X !== end.X ? within(start.X, point.X, end.X) : within(start.Y, point.Y, end.Y);
    }
}
class Line {
    /** Find the closest point on a line. The closest point to
     *
     * @param start Start point of the line
     * @param end End point of the line
     * @param point Point for which the closest point on the line will be found.
     */
    closest_point(start, end, point) {
        const A1 = end.Y - start.Y, B1 = start.X - end.X;
        // turn the line ito equation of the form Ax + By = C
        const C1 = A1 * start.X + B1 * start.Y;
        // find the perpendicular line that passes through the line and the outside point
        const C2 = -B1 * point.X + A1 * point.Y;
        // find the determinant of the two equations algebraically
        const det = A1 * A1 + B1 * B1;
        const closest_point = new __WEBPACK_IMPORTED_MODULE_0__cartesianCoords__["a" /* CartesianCoords */]();
        // use Cramer's Rule to solve for the point of intersection
        if (det != 0) {
            closest_point.X = (A1 * C1 - B1 * C2) / det;
            closest_point.Y = (A1 * C2 + B1 * C1) / det;
        }
        else {
            closest_point.X = point.X;
            closest_point.Y = point.Y;
        }
        return closest_point;
    }
    /**
     * Return the distance from the line to the center of the circle.
     * This is done by finding the length of the perpendicular line that passes through the line and circle's center
     *
     * @param start Start coordinates of the line
     * @param end End coordinates of the line
     * @param center Center of the circle
     * @returns If the circle's center is within the line, then the distance between them will be returned,
     *          if the circle's center is not within the line, -1 will be returned
     */
    circle_center_dist(start, end, center) {
        // find the closest point to the circle, on the line
        const closest_point = this.closest_point(start, end, center);
        // check if the closest point is within the start and end of the line, 
        // and not somewhere along its infinite extension
        if (TanksMath.point.within(closest_point, start, end)) {
            return TanksMath.point.dist2d(closest_point, center);
        }
    }
    /**
     * Check if the circle is colliding with the line
     * @param start Start coordinates of the line
     * @param end End coordinates of the line
     * @param center Center point of the circle
     * @param radius Radius of the circle
     */
    collide_circle(start, end, center, radius) {
        const dist = this.circle_center_dist(start, end, center);
        // if distance is undefined, or is further than the radius, return false
        return !dist || dist > radius ? false : true;
    }
}
class TanksMath {
}
/* harmony export (immutable) */ __webpack_exports__["a"] = TanksMath;

TanksMath.point = new Point();
TanksMath.line = new Line();
//# sourceMappingURL=tanksMath.js.map

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__action__ = __webpack_require__(12);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__action__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__speed__ = __webpack_require__(13);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_1__speed__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__length__ = __webpack_require__(14);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_2__length__["a"]; });



//# sourceMappingURL=index.js.map

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Color {
    constructor(red, green, blue, alpha = 1.0) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
    toRGBA(alpha) {
        if (alpha) {
            return "rgba(" + this.red + "," + this.green + "," + this.blue + "," + alpha + ")";
        }
        else {
            return "rgba(" + this.red + "," + this.green + "," + this.blue + "," + this.alpha + ")";
        }
    }
    static next() {
        if (Color.color == 0) {
            Color.color++;
            return Color.red();
        }
        else if (Color.color == 1) {
            Color.color++;
            return Color.blue();
        }
        else if (Color.color == 2) {
            Color.color++;
            return Color.green();
        }
        else if (Color.color == 3) {
            Color.color++;
            return Color.yellow();
        }
        throw new Error("You've used all the available colours!");
    }
    static red(alpha = 1.0) {
        return new Color(255, 0, 0, alpha);
    }
    static green(alpha = 1.0) {
        return new Color(0, 255, 0, alpha);
    }
    static blue(alpha = 1.0) {
        return new Color(0, 0, 255, alpha);
    }
    static black(alpha = 1.0) {
        return new Color(0, 0, 0, alpha);
    }
    static white(alpha = 1.0) {
        return new Color(255, 255, 255, alpha);
    }
    static yellow(alpha = 1.0) {
        return new Color(255, 255, 0, alpha);
    }
    static gray(alpha = 1.0) {
        return new Color(128, 128, 128, alpha);
    }
    static pink(alpha = 1.0) {
        return new Color(255, 102, 203, alpha);
    }
    static c(red, green, blue, alpha = 1.0) {
        return new Color(red, green, blue, alpha);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Color;

Color.color = 0;
//# sourceMappingURL=color.js.map

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class ActiveTank {
    constructor(id, position, tank) {
        this.valid_position = false;
        this.id = id;
        this.position = position;
        this.tank = tank;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ActiveTank;

class TanksSharedState {
    constructor() {
        this.active = new SingleAccess();
        this.next = new SingleAccess();
        this.turn = new SingleAccess();
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
        if (this.available()) {
            const x = this.resource;
            this.resource = null;
            return x;
        }
        else if (this.accessed) {
            throw new Error("This object has already been accessed.");
        }
        else if (this.resource === null) {
            throw new Error("The resource object has not been set.");
        }
        else {
            throw new Error("Unknown error with single access object");
        }
    }
}
//# sourceMappingURL=sharedState.js.map

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__siteControls__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ui__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__gameStateController__ = __webpack_require__(0);
// Classes added to the `window` object are global, and visible inside the HTML code.
// Any classes not added to the `window` are invisible (not accessible) from the HTML.
// Global classes

window["Controls"] = __WEBPACK_IMPORTED_MODULE_0__siteControls__["a" /* default */];
// Internal classes


const ID_GAME_CANVAS = "tanks-canvas";
const ID_GAME_UI = "tanks-ui";
// Set-up the canvas and add our event handlers after the page has loaded
function init() {
    const controller = new __WEBPACK_IMPORTED_MODULE_2__gameStateController__["b" /* GameStateController */]();
    const width = window.innerWidth - 32;
    // take 90% of the window, leave a bit of gap on the right
    const height = window.innerHeight * 0.9;
    const ui = new __WEBPACK_IMPORTED_MODULE_1__ui__["a" /* Ui */](ID_GAME_UI, width);
    const canvas = document.getElementById(ID_GAME_CANVAS);
    canvas.width = width;
    canvas.height = height;
    controller.initialise(canvas, canvas.getContext("2d"), ui);
    // start the game in Menu state
    controller.changeGameState(__WEBPACK_IMPORTED_MODULE_2__gameStateController__["a" /* GameState */].MENU);
}
init();
//# sourceMappingURL=main.js.map

/***/ }),
/* 9 */
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

//# sourceMappingURL=siteControls.js.map

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Ui {
    constructor(id, width) {
        this.div = document.getElementById(id);
        if (!this.div) {
            throw new Error("The UI DOM element was not found!");
        }
        this.setWidth(width);
    }
    setWidth(width) {
        // as any ignores the read-only "style" warning, as we need to write the width of the canvas to the width of the UI element
        // the width + 2 removes the small gap left on the right, which is there for an unknown reason
        this.div.style = "width:" + (width + 2) + "px";
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Ui;

//# sourceMappingURL=ui.js.map

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__drawing_draw__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__limiters_index__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__gameStateController__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__cartesianCoords__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__gameObjects_tank__ = __webpack_require__(1);





class MovingState {
    constructor(controller, context, player) {
        this.startMovement = (e) => {
            // limit the start of the line to be the tank
            this.draw.last = new __WEBPACK_IMPORTED_MODULE_3__cartesianCoords__["a" /* CartesianCoords */](this.active.position.X, this.active.position.Y);
            // limit the length of the line to the maximum allowed tank movement, and disabled tanks can't be moved
            if (this.line.in(this.active.position, this.draw.mouse) && this.active.tank.health_state !== __WEBPACK_IMPORTED_MODULE_4__gameObjects_tank__["b" /* TankHealthState */].DISABLED) {
                this.draw.state = __WEBPACK_IMPORTED_MODULE_0__drawing_draw__["b" /* DrawState */].DRAWING;
                this.validMove();
            }
        };
        this.endMovement = (e) => {
            // reset the line limit as the user has let go of the button
            this.line.reset();
            // only act if the position is valid
            if (this.active.valid_position) {
                // update the position of the tank in the player array
                this.player.tanks[this.active.id].position = this.draw.mouse.copy();
                this.controller.showUserWarning("");
                this.turn.take();
            }
            if (this.turn.over()) {
                // this was the last turn, go to shooting afterwards
                this.controller.shared.next.set(__WEBPACK_IMPORTED_MODULE_2__gameStateController__["a" /* GameState */].TANK_SHOOTING);
            }
            else {
                // come back to moving after selection
                this.controller.shared.next.set(__WEBPACK_IMPORTED_MODULE_2__gameStateController__["a" /* GameState */].TANK_MOVING);
                // continue the turn the next time this state is accessed
                this.controller.shared.turn.set(this.turn);
            }
            this.draw.state = __WEBPACK_IMPORTED_MODULE_0__drawing_draw__["b" /* DrawState */].STOPPED;
            // redraw canvas with all current tanks
            this.controller.redrawCanvas(this.draw);
            // go to tank selection state
            this.controller.changeGameState(__WEBPACK_IMPORTED_MODULE_2__gameStateController__["a" /* GameState */].TANK_SELECTION);
        };
        this.drawMoveLine = (e) => {
            this.draw.updateMousePosition(e);
            // draw the movement line if the mouse button is currently being pressed
            if (this.draw.state == __WEBPACK_IMPORTED_MODULE_0__drawing_draw__["b" /* DrawState */].DRAWING) {
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
        this.draw = new __WEBPACK_IMPORTED_MODULE_0__drawing_draw__["a" /* Draw */]();
        this.line = new __WEBPACK_IMPORTED_MODULE_1__limiters_index__["b" /* Length */](__WEBPACK_IMPORTED_MODULE_4__gameObjects_tank__["a" /* Tank */].MOVEMENT_RANGE);
        // if this is the first turn
        if (!this.controller.shared.turn.available()) {
            // limit the number of actions to how many tanks the player has
            this.turn = new __WEBPACK_IMPORTED_MODULE_1__limiters_index__["a" /* Actions */](this.player.activeTanks());
        }
        else {
            this.turn = this.controller.shared.turn.get();
        }
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
    validMove() {
        this.active.valid_position = true;
        this.draw.mouseLine(this.context, __WEBPACK_IMPORTED_MODULE_4__gameObjects_tank__["a" /* Tank */].MOVEMENT_LINE_WIDTH, __WEBPACK_IMPORTED_MODULE_4__gameObjects_tank__["a" /* Tank */].MOVEMENT_LINE_COLOR);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MovingState;

//# sourceMappingURL=moving.js.map

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Actions {
    constructor(limit = 5) {
        this.limit = limit;
        this.num_actions = 0;
    }
    take() {
        this.num_actions += 1;
    }
    end() {
        this.num_actions += 1;
        console.log("Turn ", this.num_actions, " out of ", this.limit);
        return this.num_actions >= this.limit;
    }
    over() {
        return this.num_actions >= this.limit;
    }
    next() {
        this.num_actions = 0;
        this.turns += 1;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Actions;

//# sourceMappingURL=action.js.map

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tanksMath__ = __webpack_require__(4);

class Speed {
    /**
     * Calcualtes and keeps track of the total length of a line.
     *
     * @param limit Maximum length of each line, in canvas pixels
     */
    constructor(limit = 20) {
        this.limit = limit;
    }
    /**
     * Check if the distance between the two points is greater than the limit.
     *
     * @param start Start coordinates
     * @param end End coordinates
     * @returns true if the distance is greater than the limit, false otherwise
     */
    enough(start, end) {
        const distance = __WEBPACK_IMPORTED_MODULE_0__tanksMath__["a" /* TanksMath */].point.dist2d(start, end);
        return distance >= this.limit;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Speed;

//# sourceMappingURL=speed.js.map

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tanksMath__ = __webpack_require__(4);

class Length {
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
        this.current += __WEBPACK_IMPORTED_MODULE_0__tanksMath__["a" /* TanksMath */].point.dist2d(start, end);
        console.log("Shot total distance: ", this.current);
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
        const distance = __WEBPACK_IMPORTED_MODULE_0__tanksMath__["a" /* TanksMath */].point.dist2d(start, end);
        return distance <= this.limit;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Length;

//# sourceMappingURL=length.js.map

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__gameStateController__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__gameObjects_tank__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__drawing_draw__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__limiters_index__ = __webpack_require__(5);




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
            const tank = new __WEBPACK_IMPORTED_MODULE_1__gameObjects_tank__["a" /* Tank */](this.player.tanks.length + 1, this.player, this.draw.mouse.X, this.draw.mouse.Y);
            this.player.tanks.push(tank);
            tank.draw(this.context, this.draw);
            // if we've placed as many objects as allowed, then go to next state
            if (this.turn.end()) {
                this.controller.shared.next.set(__WEBPACK_IMPORTED_MODULE_0__gameStateController__["a" /* GameState */].TANK_SELECTION);
                this.controller.changeGameState(__WEBPACK_IMPORTED_MODULE_0__gameStateController__["a" /* GameState */].TANK_PLACING);
            }
        };
        this.controller = controller;
        this.context = context;
        this.draw = new __WEBPACK_IMPORTED_MODULE_2__drawing_draw__["a" /* Draw */]();
        this.turn = new __WEBPACK_IMPORTED_MODULE_3__limiters_index__["a" /* Actions */](5);
        this.player = player;
    }
    addEventListeners(canvas) {
        canvas.onmousedown = this.addTank;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PlacingState;

//# sourceMappingURL=placing.js.map

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__gameStateController__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__drawing_draw__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__limiters_index__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__gameObjects_tank__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__cartesianCoords__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__tanksMath__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__linePath__ = __webpack_require__(17);







class ShootingState {
    constructor(controller, context, player) {
        /** Whether the shot was successfully fired, will be set to true if the shot is fast enough */
        this.successful_shot = false;
        this.startShooting = (e) => {
            this.draw.updateMousePosition(e);
            this.draw.last = new __WEBPACK_IMPORTED_MODULE_4__cartesianCoords__["a" /* CartesianCoords */](this.active.position.X, this.active.position.Y);
            // resets the successful shot flag
            this.successful_shot = false;
            // the player must start shooting from the tank
            const tank = this.player.tanks[this.active.id];
            if (__WEBPACK_IMPORTED_MODULE_5__tanksMath__["a" /* TanksMath */].point.collide_circle(this.draw.mouse, tank.position, __WEBPACK_IMPORTED_MODULE_3__gameObjects_tank__["a" /* Tank */].WIDTH)) {
                // if the mouse is within the tank
                if (this.tank_roaming_length.in(this.active.position, this.draw.mouse)) {
                    // shot collision starts from the centre of the tank
                    this.shot_path.points.push(this.active.position.copy());
                    this.draw.state = __WEBPACK_IMPORTED_MODULE_1__drawing_draw__["b" /* DrawState */].DRAWING;
                    this.validRange();
                }
            }
            else {
                console.log("Click did not collide with the active tank");
            }
        };
        this.continueShooting = (e) => {
            this.draw.updateMousePosition(e);
            // draw the movement line if the mouse button is currently being pressed
            if (this.draw.state == __WEBPACK_IMPORTED_MODULE_1__drawing_draw__["b" /* DrawState */].DRAWING) {
                // if the player is just moving about on the tank's space
                if (this.tank_roaming_length.in(this.active.position, this.draw.mouse)) {
                    console.log("Roaming in tank space");
                    this.controller.showUserWarning("");
                    this.validRange();
                } // if the player has shot far away start drawing the line
                else if (this.shot_speed.enough(this.active.position, this.draw.mouse)) {
                    console.log("Shooting!");
                    this.controller.showUserWarning("");
                    this.validRange();
                    // only add to the shot path if the shot was successful
                    this.shot_path.points.push(this.draw.mouse.copy());
                    // if the shot has reached the max allowed limit we stop the drawing, this is an artificial
                    // limitation to stop a shot that goes along the whole screen
                    if (!this.shot_length.add(this.active.position, this.draw.mouse)) {
                        console.log("Successful shot!");
                        this.successful_shot = true;
                        this.draw.state = __WEBPACK_IMPORTED_MODULE_1__drawing_draw__["b" /* DrawState */].STOPPED;
                    }
                }
                else {
                    this.controller.showUserWarning("Shooting too slow!");
                    console.log("Shooting too slow!");
                    this.draw.state = __WEBPACK_IMPORTED_MODULE_1__drawing_draw__["b" /* DrawState */].STOPPED;
                }
            }
        };
        this.stopShooting = (e) => {
            if (this.successful_shot) {
                this.shot_path.list();
                this.controller.collide(this.shot_path);
                this.controller.cacheLine(this.shot_path);
                //
                // here we will do collision detection along the line
                //
                this.turn.take();
            }
            if (this.turn.over()) {
                this.controller.next_player = true;
                this.controller.shared.next.set(__WEBPACK_IMPORTED_MODULE_0__gameStateController__["a" /* GameState */].TANK_SELECTION);
            }
            else {
                this.controller.shared.turn.set(this.turn);
                this.controller.shared.next.set(__WEBPACK_IMPORTED_MODULE_0__gameStateController__["a" /* GameState */].TANK_SHOOTING);
            }
            this.draw.state = __WEBPACK_IMPORTED_MODULE_1__drawing_draw__["b" /* DrawState */].STOPPED;
            // redraw canvas with all current tanks
            this.controller.redrawCanvas(this.draw);
            this.controller.changeGameState(__WEBPACK_IMPORTED_MODULE_0__gameStateController__["a" /* GameState */].TANK_SELECTION);
        };
        this.controller = controller;
        this.context = context;
        this.player = player;
        this.shot_path = new __WEBPACK_IMPORTED_MODULE_6__linePath__["a" /* LinePath */]();
        this.draw = new __WEBPACK_IMPORTED_MODULE_1__drawing_draw__["a" /* Draw */]();
        this.tank_roaming_length = new __WEBPACK_IMPORTED_MODULE_2__limiters_index__["b" /* Length */](__WEBPACK_IMPORTED_MODULE_3__gameObjects_tank__["a" /* Tank */].SHOOTING_DEADZONE);
        this.shot_length = new __WEBPACK_IMPORTED_MODULE_2__limiters_index__["b" /* Length */](__WEBPACK_IMPORTED_MODULE_3__gameObjects_tank__["a" /* Tank */].SHOOTING_RANGE);
        this.shot_speed = new __WEBPACK_IMPORTED_MODULE_2__limiters_index__["c" /* Speed */](__WEBPACK_IMPORTED_MODULE_3__gameObjects_tank__["a" /* Tank */].SHOOTING_SPEED);
        if (!this.controller.shared.turn.available()) {
            // limit the number of actions to how many tanks the player has
            this.turn = new __WEBPACK_IMPORTED_MODULE_2__limiters_index__["a" /* Actions */](this.player.activeTanks());
        }
        else {
            this.turn = this.controller.shared.turn.get();
        }
        this.active = this.controller.shared.active.get();
    }
    addEventListeners(canvas) {
        canvas.onmousedown = this.startShooting;
        canvas.onmousemove = this.continueShooting;
        window.onmouseup = this.stopShooting;
    }
    validRange() {
        this.draw.mouseLine(this.context, __WEBPACK_IMPORTED_MODULE_3__gameObjects_tank__["a" /* Tank */].MOVEMENT_LINE_WIDTH, __WEBPACK_IMPORTED_MODULE_3__gameObjects_tank__["a" /* Tank */].MOVEMENT_LINE_COLOR);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ShootingState;

//# sourceMappingURL=shooting.js.map

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class LinePath {
    constructor() {
        this.points = [];
    }
    list() {
        console.log("Points for the shot: ", this.points.join(", "));
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = LinePath;

//# sourceMappingURL=linePath.js.map

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__gameStateController__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__tanksMath__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__drawing_draw__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__gameObjects_tank__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__sharedState__ = __webpack_require__(7);





class SelectionState {
    constructor(controller, context, player) {
        this.highlightTank = (e) => {
            this.draw.updateMousePosition(e);
            // Check if the user has clicked any tank.
            for (const [id, tank] of this.player.tanks.entries()) {
                // dead tanks can't be selected
                if (__WEBPACK_IMPORTED_MODULE_1__tanksMath__["a" /* TanksMath */].point.collide_circle(this.draw.mouse, tank.position, __WEBPACK_IMPORTED_MODULE_3__gameObjects_tank__["a" /* Tank */].WIDTH) && tank.health_state !== __WEBPACK_IMPORTED_MODULE_3__gameObjects_tank__["b" /* TankHealthState */].DEAD) {
                    // highlight the selected tank
                    tank.highlight(this.context, this.draw);
                    // store the details of the active tank
                    this.controller.shared.active.set(new __WEBPACK_IMPORTED_MODULE_4__sharedState__["a" /* ActiveTank */](id, tank.position, tank));
                    // only highlight the first tank
                    break;
                }
            }
        };
        this.mouseUp = (e) => {
            // if the user has clicked on any of the objects, go into movement state
            if (this.controller.shared.active.available()) {
                if (this.controller.shared.next.available()) {
                    this.controller.changeGameState(this.controller.shared.next.get());
                }
                else {
                    this.controller.changeGameState(__WEBPACK_IMPORTED_MODULE_0__gameStateController__["a" /* GameState */].TANK_MOVING);
                }
            }
        };
        this.controller = controller;
        this.context = context;
        this.player = player;
        this.draw = new __WEBPACK_IMPORTED_MODULE_2__drawing_draw__["a" /* Draw */]();
    }
    addEventListeners(canvas) {
        canvas.onmousedown = this.highlightTank;
        // NOTE: mouseup is on the whole window, so that even if the cursor exits the canvas, the event will trigger
        window.onmouseup = this.mouseUp;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SelectionState;

//# sourceMappingURL=selection.js.map

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__gameStateController__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__drawing_draw__ = __webpack_require__(2);


class Menu {
    constructor(title, options) {
        this.final_height = -1;
        this.start_height = 150;
        this.height_increment = 70;
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
        const centre = width / 2;
        context.fillText(this.title, centre, text_height);
        context.fillStyle = "White";
        context.font = "30px Georgia";
        for (const [id, option] of this.options.entries()) {
            text_height += this.height_increment;
            if (this.selected(id)) {
                context.fillStyle = "Yellow";
                context.font = "40px Georgia";
            }
            else {
                context.fillStyle = "White";
                context.font = "30px Georgia";
            }
            context.fillText(option, centre, text_height);
        }
        this.final_height = text_height;
    }
    selected(id) {
        return this.selected_item === id;
    }
    select(mouse) {
        if (this.final_height === -1) {
            throw new Error("The menu hasn't been drawn.");
        }
        // adds some buffer space around each option, this makes it easier to select each option
        const buffer_space = this.height_increment / 2;
        let current_height = this.final_height;
        let id = this.options.length - 1;
        // check up to the height of the title, there's not going to be anything above it
        while (current_height > this.start_height) {
            if (mouse.Y > current_height - buffer_space) {
                this.selected_item = id;
                return;
            }
            // lower the height that we are checking on, this has the effect of moving the
            // menu item's hitbox higher on the screen
            current_height -= this.height_increment;
            id -= 1;
        }
    }
}
class MenuState {
    constructor(controller, context) {
        this.selectMenuitem = (e) => {
            this.draw.updateMousePosition(e);
            this.menu.select(this.draw.mouse);
            this.menu.draw(this.context, this.draw);
        };
        /**
         * Activates the selected menu option
         */
        this.activateMenuOption = (e) => {
            console.log("Changing state from MENU EVENT to TANK PLACING");
            this.controller.clearCanvas();
            if (this.menu.selected_item >= 0) {
                this.controller.changeGameState(__WEBPACK_IMPORTED_MODULE_0__gameStateController__["a" /* GameState */].TANK_PLACING);
            }
            // handle other events, probably better with a switch statement
        };
        this.controller = controller;
        this.context = context;
        this.draw = new __WEBPACK_IMPORTED_MODULE_1__drawing_draw__["a" /* Draw */]();
        this.menu = new Menu("Tanks", ["Start game", "Potatoes", "Apples", "I", "Choose", "You", "Pikachu"]);
        this.menu.draw(this.context, this.draw);
    }
    addEventListeners(canvas) {
        canvas.onmousedown = this.activateMenuOption;
        canvas.onmousemove = this.selectMenuitem;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MenuState;

//# sourceMappingURL=menu.js.map

/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tank__ = __webpack_require__(1);

class Player {
    constructor(id, name, color) {
        this.id = id;
        this.name = name;
        this.tanks = new Array();
        this.color = color;
    }
    activeTanks() {
        return this.tanks.filter((tank) => tank.health_state !== __WEBPACK_IMPORTED_MODULE_0__tank__["b" /* TankHealthState */].DEAD).length;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Player;

//# sourceMappingURL=player.js.map

/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__drawing_color__ = __webpack_require__(6);

class LineCache {
    constructor() {
        this.color = __WEBPACK_IMPORTED_MODULE_0__drawing_color__["a" /* Color */].gray().toRGBA();
        /** How many lines should be redrawn */
        this.size = 10;
        this.points = [];
    }
    /** Remove lines that are outside of the cache size */
    lines() {
        const size = this.points.length;
        if (size > this.size) {
            return this.points.slice(size - this.size, size);
        }
        return this.points;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = LineCache;

//# sourceMappingURL=lineCache.js.map

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNzY1MGQ0ZDhkZWEyN2NkODVhYzQiLCJ3ZWJwYWNrOi8vLy4vc3JjL2J1aWxkL2dhbWVTdGF0ZUNvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2J1aWxkL2dhbWVPYmplY3RzL3RhbmsuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2J1aWxkL2RyYXdpbmcvZHJhdy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYnVpbGQvY2FydGVzaWFuQ29vcmRzLmpzIiwid2VicGFjazovLy8uL3NyYy9idWlsZC90YW5rc01hdGguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2J1aWxkL2xpbWl0ZXJzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9idWlsZC9kcmF3aW5nL2NvbG9yLmpzIiwid2VicGFjazovLy8uL3NyYy9idWlsZC9nYW1lU3RhdGVzL3NoYXJlZFN0YXRlLmpzIiwid2VicGFjazovLy8uL3NyYy9idWlsZC9tYWluLmpzIiwid2VicGFjazovLy8uL3NyYy9idWlsZC9zaXRlQ29udHJvbHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2J1aWxkL3VpLmpzIiwid2VicGFjazovLy8uL3NyYy9idWlsZC9nYW1lU3RhdGVzL21vdmluZy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYnVpbGQvbGltaXRlcnMvYWN0aW9uLmpzIiwid2VicGFjazovLy8uL3NyYy9idWlsZC9saW1pdGVycy9zcGVlZC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYnVpbGQvbGltaXRlcnMvbGVuZ3RoLmpzIiwid2VicGFjazovLy8uL3NyYy9idWlsZC9nYW1lU3RhdGVzL3BsYWNpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2J1aWxkL2dhbWVTdGF0ZXMvc2hvb3RpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2J1aWxkL2xpbmVQYXRoLmpzIiwid2VicGFjazovLy8uL3NyYy9idWlsZC9nYW1lU3RhdGVzL3NlbGVjdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYnVpbGQvZ2FtZVN0YXRlcy9tZW51LmpzIiwid2VicGFjazovLy8uL3NyYy9idWlsZC9nYW1lT2JqZWN0cy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2J1aWxkL2xpbmVDYWNoZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN0RzQjtBQUNDO0FBQ0M7QUFDQztBQUNMO0FBQ0g7QUFDVTtBQUNYO0FBQ0k7QUFDQTtBQUNZO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyw4QkFBOEI7QUFDL0I7QUFDQTtBQUNBO0FBQ0EsZ0ZBQWdGLElBQUk7QUFDcEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixzQkFBc0I7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQiw2QkFBNkI7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLHdCQUF3QjtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0EsK0M7Ozs7Ozs7Ozs7O0FDNUwwQjtBQUNWO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsb0NBQW9DO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLDBDQUEwQztBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQzs7Ozs7Ozs7O0FDMUYwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLDhCQUE4QjtBQUMvQixnQzs7Ozs7OztBQzFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0EsMkM7Ozs7Ozs7O0FDWjBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQSxxQzs7Ozs7Ozs7Ozs7OztBQ3ZHa0I7QUFDRjtBQUNDO0FBQ2pCLGlDOzs7Ozs7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBLGlDOzs7Ozs7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDOzs7Ozs7Ozs7O0FDNUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ2E7QUFDNEI7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDOzs7Ozs7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQSx3Qzs7Ozs7OztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBLDhCOzs7Ozs7Ozs7Ozs7QUNkMEI7QUFDMUI7QUFDb0I7QUFDTTtBQUNNO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQSxrQzs7Ozs7OztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0Esa0M7Ozs7Ozs7O0FDckJvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0EsaUM7Ozs7Ozs7O0FDdEJvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQSxrQzs7Ozs7Ozs7Ozs7QUN0Q29CO0FBQ0w7QUFDQTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQSxtQzs7Ozs7Ozs7Ozs7Ozs7QUNqQ29CO0FBQ007QUFDMUI7QUFDZTtBQUNXO0FBQ047QUFDRDtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0Esb0M7Ozs7Ozs7QUMvR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQSxvQzs7Ozs7Ozs7Ozs7O0FDUm9CO0FBQ0E7QUFDTDtBQUNpQjtBQUNYO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQSxxQzs7Ozs7Ozs7O0FDNUNvQjtBQUNMO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0EsZ0M7Ozs7Ozs7O0FDMUYwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBLGtDOzs7Ozs7OztBQ1pnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQSxxQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA4KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA3NjUwZDRkOGRlYTI3Y2Q4NWFjNCIsImltcG9ydCB7IE1vdmluZ1N0YXRlIH0gZnJvbSBcIi4vZ2FtZVN0YXRlcy9tb3ZpbmdcIjtcclxuaW1wb3J0IHsgUGxhY2luZ1N0YXRlIH0gZnJvbSBcIi4vZ2FtZVN0YXRlcy9wbGFjaW5nXCI7XHJcbmltcG9ydCB7IFNob290aW5nU3RhdGUgfSBmcm9tIFwiLi9nYW1lU3RhdGVzL3Nob290aW5nXCI7XHJcbmltcG9ydCB7IFNlbGVjdGlvblN0YXRlIH0gZnJvbSBcIi4vZ2FtZVN0YXRlcy9zZWxlY3Rpb25cIjtcclxuaW1wb3J0IHsgTWVudVN0YXRlIH0gZnJvbSBcIi4vZ2FtZVN0YXRlcy9tZW51XCI7XHJcbmltcG9ydCB7IFBsYXllciB9IGZyb20gJy4vZ2FtZU9iamVjdHMvcGxheWVyJztcclxuaW1wb3J0IHsgVGFua3NTaGFyZWRTdGF0ZSB9IGZyb20gXCIuL2dhbWVTdGF0ZXMvc2hhcmVkU3RhdGVcIjtcclxuaW1wb3J0IHsgQ29sb3IgfSBmcm9tICcuL2RyYXdpbmcvY29sb3InO1xyXG5pbXBvcnQgeyBMaW5lQ2FjaGUgfSBmcm9tICcuL2xpbmVDYWNoZSc7XHJcbmltcG9ydCB7IFRhbmtzTWF0aCB9IGZyb20gJy4vdGFua3NNYXRoJztcclxuaW1wb3J0IHsgVGFuaywgVGFua0hlYWx0aFN0YXRlIH0gZnJvbSAnLi9nYW1lT2JqZWN0cy90YW5rJztcclxuZXhwb3J0IHZhciBHYW1lU3RhdGU7XHJcbihmdW5jdGlvbiAoR2FtZVN0YXRlKSB7XHJcbiAgICBHYW1lU3RhdGVbR2FtZVN0YXRlW1wiTUVOVVwiXSA9IDBdID0gXCJNRU5VXCI7XHJcbiAgICBHYW1lU3RhdGVbR2FtZVN0YXRlW1wiVEFOS19QTEFDSU5HXCJdID0gMV0gPSBcIlRBTktfUExBQ0lOR1wiO1xyXG4gICAgR2FtZVN0YXRlW0dhbWVTdGF0ZVtcIlRBTktfTU9WSU5HXCJdID0gMl0gPSBcIlRBTktfTU9WSU5HXCI7XHJcbiAgICBHYW1lU3RhdGVbR2FtZVN0YXRlW1wiVEFOS19TRUxFQ1RJT05cIl0gPSAzXSA9IFwiVEFOS19TRUxFQ1RJT05cIjtcclxuICAgIEdhbWVTdGF0ZVtHYW1lU3RhdGVbXCJUQU5LX1NIT09USU5HXCJdID0gNF0gPSBcIlRBTktfU0hPT1RJTkdcIjtcclxufSkoR2FtZVN0YXRlIHx8IChHYW1lU3RhdGUgPSB7fSkpO1xyXG4vKipcclxuICogSW1wbGVtZW50YXRpb24gZm9yIHRoZSBhY3Rpb25zIHRoYXQgd2lsbCBiZSBleGVjdXRlZCBhY2NvcmRpbmcgdG8gcGxheWVyIGFjdGlvbnMuXHJcbiAqXHJcbiAqIEZ1bmN0aW9ucyBhcmUgd3JhcHBlZCB0byBrZWVwIGB0aGlzYCBjb250ZXh0LiBUaGlzIGlzIHRoZSAoZTpNb3VzZUV2ZW50KSA9PiB7Li4ufSBzeW50YXguXHJcbiAqXHJcbiAqIEluIHNob3J0LCBiZWNhdXNlIHRoZSBtZXRob2RzIGFyZSBhZGRlZCBhcyBldmVudCBsaXN0ZW5lcnMgKGFuZCBhcmUgbm90IGNhbGxlZCBkaXJlY3RseSksIHRoZSBgdGhpc2AgcmVmZXJlbmNlIHN0YXJ0cyBwb2ludGluZ1xyXG4gKiB0b3dhcmRzIHRoZSBgd2luZG93YCBvYmplY3QuIFRoZSBjbG9zdXJlIGtlZXBzIHRoZSBgdGhpc2AgdG8gcG9pbnQgdG93YXJkcyB0aGUgcHJvcGVyIGluc3RhbmNlIG9mIHRoZSBvYmplY3QuXHJcbiAqXHJcbiAqIEZvciBtb3JlIGRldGFpbHM6IGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC93aWtpLyd0aGlzJy1pbi1UeXBlU2NyaXB0I3JlZC1mbGFncy1mb3ItdGhpc1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEdhbWVTdGF0ZUNvbnRyb2xsZXIge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5OVU1fUExBWUVSUyA9IDI7XHJcbiAgICAgICAgLyoqIEFsbCB0aGUgcGxheWVycyBpbiB0aGUgZ2FtZSAqL1xyXG4gICAgICAgIHRoaXMucGxheWVycyA9IFtdO1xyXG4gICAgICAgIC8qKiBTdG9yZXMgdGhlIGFsbCBvZiB0aGUgc2hvdCBsaW5lcyAqL1xyXG4gICAgICAgIHRoaXMubGluZV9jYWNoZSA9IG5ldyBMaW5lQ2FjaGUoKTtcclxuICAgICAgICAvKiogRmxhZyB0byBzcGVjaWZ5IGlmIHRoZSBjdXJyZW50IHBsYXllcidzIHR1cm4gaXMgb3ZlciAqL1xyXG4gICAgICAgIHRoaXMubmV4dF9wbGF5ZXIgPSBmYWxzZTtcclxuICAgICAgICAvKiogU2hhcmVkIHN0YXRlIGFtb25nIGdhbWUgc3RhdGVzICovXHJcbiAgICAgICAgdGhpcy5zaGFyZWQgPSBuZXcgVGFua3NTaGFyZWRTdGF0ZSgpO1xyXG4gICAgfVxyXG4gICAgaW5pdGlhbGlzZShjYW52YXMsIGNvbnRleHQsIHVpKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcclxuICAgICAgICB0aGlzLnVpID0gdWk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3BsYXllciA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLk5VTV9QTEFZRVJTOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXJzLnB1c2gobmV3IFBsYXllcihpLCBcIlBsYXllciBcIiArIChpICsgMSksIENvbG9yLm5leHQoKSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogVGhlIGdhbWUgZXZlbnRzIHNob3VsZCBiZSBpbiB0aGlzIG9yZGVyOlxyXG4gICAgICogTWVudVxyXG4gICAgICogUGxhY2luZyBmb3IgZWFjaCBwbGF5ZXJcclxuICAgICAqIFJlcGVhdCB1bnRpbCBnYW1lIG92ZXJcclxuICAgICAqICBNb3ZpbmcsIFNob290aW5nIGZvciBQMVxyXG4gICAgICogIE1vdmluZywgU2hvb3RpbmcgZm9yIFAyXHJcbiAgICAgKiBAcGFyYW0gbmV3X3N0YXRlXHJcbiAgICAgKi9cclxuICAgIGNoYW5nZUdhbWVTdGF0ZShuZXdfc3RhdGUpIHtcclxuICAgICAgICB0aGlzLnN0YXRlID0gbmV3X3N0YXRlO1xyXG4gICAgICAgIC8vIGNsZWFycyBhbnkgb2xkIGV2ZW50cyB0aGF0IHdlcmUgYWRkZWRcclxuICAgICAgICB0aGlzLmNhbnZhcy5vbm1vdXNlZG93biA9IG51bGw7XHJcbiAgICAgICAgd2luZG93Lm9ubW91c2V1cCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jYW52YXMub25tb3VzZW1vdmUgPSBudWxsO1xyXG4gICAgICAgIC8vIGlmIHRoZSBzdGF0ZSBoYXMgbWFya2VkIHRoZSBlbmQgb2YgdGhlIHBsYXllcidzIHR1cm4sIHRoZW4gd2UgZ28gdG8gdGhlIG5leHQgcGxheWVyXHJcbiAgICAgICAgaWYgKHRoaXMubmV4dF9wbGF5ZXIpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNFdmVyeW9uZSgpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlN3aXRjaGluZyBwbGF5ZXJcIik7XHJcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGlzIHVzZWQgdG8gZXNjYXBlIGZyb20gcGxhY2luZyBmb3JldmVyLCB3aGVuIGFsbCBwbGF5ZXJzIGhhdmUgcGxhY2VkIHRoZWlyIHRhbmtzXHJcbiAgICAgICAgICAgICAgICAvLyB0aGVuIHRoZSBuZXh0IHN0YXRlIHdpbGwgYmUgdGFrZW4sIHdoaWNoIHdpbGwgYmUgbW92ZW1lbnQsIGFmdGVyd2FyZHMgdGhpcyBpcyB1c2VkIHRvIFxyXG4gICAgICAgICAgICAgICAgLy8ga2VlcCBzd2l0Y2hpbmcgYmV0d2VlbiBtb3ZlbWVudCBhbmQgc2hvb3RpbmcgdW50aWwgdGhlIGVuZCBvZiB0aGUgZ2FtZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMuc2hhcmVkLm5leHQuZ2V0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5uZXh0X3BsYXllciA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLnBsYXllcnNbdGhpcy5jdXJyZW50X3BsYXllcl07XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJUaGlzIGlzIFwiLCBwbGF5ZXIubmFtZSwgXCIgcGxheWluZy5cIik7XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLnN0YXRlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgR2FtZVN0YXRlLk1FTlU6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGlvbiA9IG5ldyBNZW51U3RhdGUodGhpcywgdGhpcy5jb250ZXh0KTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSW5pdGlhbGlzaW5nIE1FTlVcIik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBHYW1lU3RhdGUuVEFOS19QTEFDSU5HOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5hY3Rpb24gPSBuZXcgUGxhY2luZ1N0YXRlKHRoaXMsIHRoaXMuY29udGV4dCwgcGxheWVyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubmV4dF9wbGF5ZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJbml0aWFsaXNpbmcgVEFOSyBQTEFDSU5HXCIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgR2FtZVN0YXRlLlRBTktfU0VMRUNUSU9OOlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJbml0aWFsaXNpbmcgVEFOSyBTRUxFQ1RJT05cIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGlvbiA9IG5ldyBTZWxlY3Rpb25TdGF0ZSh0aGlzLCB0aGlzLmNvbnRleHQsIHBsYXllcik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBHYW1lU3RhdGUuVEFOS19NT1ZJTkc6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkluaXRpYWxpc2luZyBUQU5LIE1PVkVNRU5UXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hY3Rpb24gPSBuZXcgTW92aW5nU3RhdGUodGhpcywgdGhpcy5jb250ZXh0LCBwbGF5ZXIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgR2FtZVN0YXRlLlRBTktfU0hPT1RJTkc6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkluaXRpYWxpc2luZyBUQU5LIFNIT09USU5HXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hY3Rpb24gPSBuZXcgU2hvb3RpbmdTdGF0ZSh0aGlzLCB0aGlzLmNvbnRleHQsIHBsYXllcik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBnYW1lIHNob3VsZCBuZXZlciBiZSBpbiBhbiB1bmtub3duIHN0YXRlLCBzb21ldGhpbmcgaGFzIGdvbmUgdGVycmlibHkgd3JvbmchXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBhZGQgdGhlIG1vdXNlIGV2ZW50cyBmb3IgdGhlIG5ldyBzdGF0ZVxyXG4gICAgICAgIHRoaXMuYWN0aW9uLmFkZEV2ZW50TGlzdGVuZXJzKHRoaXMuY2FudmFzKTtcclxuICAgIH1cclxuICAgIC8qKiBDbGVhcnMgZXZlcnl0aGluZyBmcm9tIHRoZSBjYW52YXMgb24gdGhlIHNjcmVlbi4gVG8gc2hvdyBhbnl0aGluZyBhZnRlcndhcmRzIGl0IG5lZWRzIHRvIGJlIHJlZHJhd24uICovXHJcbiAgICBjbGVhckNhbnZhcygpIHtcclxuICAgICAgICB0aGlzLmNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMuY29udGV4dC5jYW52YXMud2lkdGgsIHRoaXMuY29udGV4dC5jYW52YXMuaGVpZ2h0KTtcclxuICAgIH1cclxuICAgIHJlZHJhd0NhbnZhcyhkcmF3KSB7XHJcbiAgICAgICAgdGhpcy5jbGVhckNhbnZhcygpO1xyXG4gICAgICAgIC8vIGRyYXcgZXZlcnkgcGxheWVyIGZvciBldmVyeSB0YW5rXHJcbiAgICAgICAgZm9yIChjb25zdCBwbGF5ZXIgb2YgdGhpcy5wbGF5ZXJzKSB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgdGFuayBvZiBwbGF5ZXIudGFua3MpIHtcclxuICAgICAgICAgICAgICAgIHRhbmsuZHJhdyh0aGlzLmNvbnRleHQsIGRyYXcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IG9sZF9saW5lc19jb2xvciA9IENvbG9yLmdyYXkoMC41KS50b1JHQkEoKTtcclxuICAgICAgICAvLyBkcmF3IHRoZSBsYXN0IE4gbGluZXNcclxuICAgICAgICBmb3IgKGNvbnN0IGxpbmVfcGF0aCBvZiB0aGlzLmxpbmVfY2FjaGUubGluZXMoKSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGxpbmVfcGF0aC5wb2ludHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIC8vIG9sZCBsaW5lcyBhcmUgY3VycmVudGx5IGhhbGYtdHJhbnNwYXJlbnRcclxuICAgICAgICAgICAgICAgIGRyYXcubGluZSh0aGlzLmNvbnRleHQsIGxpbmVfcGF0aC5wb2ludHNbaSAtIDFdLCBsaW5lX3BhdGgucG9pbnRzW2ldLCAxLCBvbGRfbGluZXNfY29sb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZGVidWdTaG90KGxpbmVfcGF0aCwgc3RhcnQsIGVuZCwgdGFuaywgZGlzdGFuY2UpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlN0YXJ0aW5nIGNvbGxpc2lvbiBkZWJ1Zy4uLlwiKTtcclxuICAgICAgICBmb3IgKGNvbnN0IGxpbmUgb2YgbGluZV9wYXRoLnBvaW50cykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIihcIiwgbGluZS5YLCBcIixcIiwgLWxpbmUuWSwgXCIpXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZyhcIkNvbGxpZGVkIHdpdGggbGluZTogKFwiICsgc3RhcnQuWCArIFwiLFwiICsgLXN0YXJ0LlkgKyBcIikgKFwiICsgZW5kLlggKyBcIixcIiArIC1lbmQuWSArIFwiKVwiKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlRhbmsgSUQ6IFwiLCB0YW5rLmlkLCBcIiAoXCIsIHRhbmsucG9zaXRpb24uWCwgXCIsXCIsIC10YW5rLnBvc2l0aW9uLlksIFwiKVwiKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkRpc3RhbmNlOiBcIiwgZGlzdGFuY2UpO1xyXG4gICAgfVxyXG4gICAgY29sbGlkZShsaW5lX3BhdGgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tLS0tLS0tIFN0YXJ0aW5nIENvbGxpc2lvbiAtLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xyXG4gICAgICAgIGNvbnN0IG51bV9wb2ludHNfaW5fbGluZSA9IGxpbmVfcGF0aC5wb2ludHMubGVuZ3RoO1xyXG4gICAgICAgIC8vIGZvciBldmVyeSBwbGF5ZXIgd2hvIGlzbnQgdGhlIGN1cnJlbnQgcGxheWVyXHJcbiAgICAgICAgZm9yIChjb25zdCBwbGF5ZXIgb2YgdGhpcy5wbGF5ZXJzLmZpbHRlcigocCkgPT4gcC5pZCAhPT0gdGhpcy5jdXJyZW50X3BsYXllcikpIHtcclxuICAgICAgICAgICAgLy8gbG9vcCBvdmVyIGFsbCB0aGVpciB0YW5rc1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHRhbmsgb2YgcGxheWVyLnRhbmtzKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBvbmx5IGRvIGNvbGxpc2lvbiBkZXRlY3Rpb24gdmVyc3VzIHRhbmtzIHRoYXQgaGF2ZSBub3QgYmVlbiBhbHJlYWR5IGtpbGxlZFxyXG4gICAgICAgICAgICAgICAgaWYgKHRhbmsuaGVhbHRoX3N0YXRlICE9PSBUYW5rSGVhbHRoU3RhdGUuREVBRCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIGVhY2ggbGluZSBmb3IgY29sbGlzaW9uIHdpdGggdGhlIHRhbmtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBwID0gMTsgcCA8IG51bV9wb2ludHNfaW5fbGluZTsgcCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpc3QgPSBUYW5rc01hdGgubGluZS5jaXJjbGVfY2VudGVyX2Rpc3QobGluZV9wYXRoLnBvaW50c1twIC0gMV0sIGxpbmVfcGF0aC5wb2ludHNbcF0sIHRhbmsucG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlYnVnU2hvdChsaW5lX3BhdGgsIGxpbmVfcGF0aC5wb2ludHNbcCAtIDFdLCBsaW5lX3BhdGgucG9pbnRzW3BdLCB0YW5rLCBkaXN0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFkaXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUT0RPIG1vdmUgb3V0IGZyb20gdGhlIGNvbnRyb2xsZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIGxpbmUgZ2xhbmNlcyB0aGUgdGFuaywgbWFyayBhcyBkaXNhYmxlZCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFRhbmsuV0lEVEggLSBUYW5rLkRJU0FCTEVEX1pPTkUgPD0gZGlzdCAmJiBkaXN0IDw9IFRhbmsuV0lEVEggKyBUYW5rLkRJU0FCTEVEX1pPTkUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhbmsuaGVhbHRoX3N0YXRlID0gVGFua0hlYWx0aFN0YXRlLkRJU0FCTEVEO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUYW5rIFwiLCB0YW5rLmlkLCBcIiBkaXNhYmxlZCFcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSAvLyBpZiB0aGUgbGluZSBwYXNzZXMgdGhyb3VnaCB0aGUgdGFuaywgbWFyayBkZWFkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGRpc3QgPCBUYW5rLldJRFRIKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YW5rLmhlYWx0aF9zdGF0ZSA9IFRhbmtIZWFsdGhTdGF0ZS5ERUFEO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUYW5rIFwiLCB0YW5rLmlkLCBcIiBkZWFkIVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIHRhbmsgaGFzIGFscmVhZHkgYmVlbiBwcm9jZXNzZWQsIHdlIGNhbiBnbyB0byB0aGUgbmV4dCBvbmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNhY2hlTGluZShwYXRoKSB7XHJcbiAgICAgICAgdGhpcy5saW5lX2NhY2hlLnBvaW50cy5wdXNoKHBhdGgpO1xyXG4gICAgfVxyXG4gICAgc2hvd1VzZXJXYXJuaW5nKG1lc3NhZ2UpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVzZXItd2FybmluZ1wiKS5pbm5lckhUTUwgPSBtZXNzYWdlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBAcmV0dXJucyBmYWxzZSBpZiB0aGVyZSBhcmUgc3RpbGwgcGxheWVycyB0byB0YWtlIHRoZWlyIHR1cm4sIHRydWUgaWYgYWxsIHBsYXllcnMgaGF2ZSBjb21wbGV0ZWQgdGhlaXIgdHVybnMgZm9yIHRoZSBzdGF0ZVxyXG4gICAgKi9cclxuICAgIGlzRXZlcnlvbmUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudF9wbGF5ZXIgPT09IHRoaXMuTlVNX1BMQVlFUlMgLSAxKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudF9wbGF5ZXIgPSAwO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jdXJyZW50X3BsYXllciArPSAxO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1nYW1lU3RhdGVDb250cm9sbGVyLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2J1aWxkL2dhbWVTdGF0ZUNvbnRyb2xsZXIuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgQ2FydGVzaWFuQ29vcmRzIH0gZnJvbSBcIi4uL2NhcnRlc2lhbkNvb3Jkc1wiO1xyXG5pbXBvcnQgeyBDb2xvciB9IGZyb20gXCIuLi9kcmF3aW5nL2NvbG9yXCI7XHJcbmV4cG9ydCB2YXIgVGFua0FjdFN0YXRlO1xyXG4oZnVuY3Rpb24gKFRhbmtBY3RTdGF0ZSkge1xyXG4gICAgLyoqIFRoZSB0YW5rIGhhcyBwZXJmb3JtZWQgYW4gYWN0aW9uIHRoaXMgdHVybiwgZS5nLiBtb3ZlZCBvciBzaG90ICovXHJcbiAgICBUYW5rQWN0U3RhdGVbVGFua0FjdFN0YXRlW1wiQUNURURcIl0gPSAwXSA9IFwiQUNURURcIjtcclxuICAgIC8qKiBUaGUgdGFuayBoYXNuJ3QgcGVyZm9ybWVkIGFuIGFjdGlvbiB0aGlzIHR1cm4gKi9cclxuICAgIFRhbmtBY3RTdGF0ZVtUYW5rQWN0U3RhdGVbXCJOT1RfQUNURURcIl0gPSAxXSA9IFwiTk9UX0FDVEVEXCI7XHJcbn0pKFRhbmtBY3RTdGF0ZSB8fCAoVGFua0FjdFN0YXRlID0ge30pKTtcclxuZXhwb3J0IHZhciBUYW5rSGVhbHRoU3RhdGU7XHJcbihmdW5jdGlvbiAoVGFua0hlYWx0aFN0YXRlKSB7XHJcbiAgICAvKiogVGFuayBjYW4gZG8gZXZlcnl0aGluZyAqL1xyXG4gICAgVGFua0hlYWx0aFN0YXRlW1RhbmtIZWFsdGhTdGF0ZVtcIkFMSVZFXCJdID0gMF0gPSBcIkFMSVZFXCI7XHJcbiAgICAvKiogVGFuayBjYW4ndCBtb3ZlICovXHJcbiAgICBUYW5rSGVhbHRoU3RhdGVbVGFua0hlYWx0aFN0YXRlW1wiRElTQUJMRURcIl0gPSAxXSA9IFwiRElTQUJMRURcIjtcclxuICAgIC8qKiBUYW5rIGNhbid0IGRvIGFueXRoaW5nICovXHJcbiAgICBUYW5rSGVhbHRoU3RhdGVbVGFua0hlYWx0aFN0YXRlW1wiREVBRFwiXSA9IDJdID0gXCJERUFEXCI7XHJcbn0pKFRhbmtIZWFsdGhTdGF0ZSB8fCAoVGFua0hlYWx0aFN0YXRlID0ge30pKTtcclxuLyoqIFByb3ZpZGVzIGdyb3VwaW5nIGZvciBhbGwgdGhlIFRhbmsncyBjb2xvcnMgKi9cclxuY2xhc3MgVGFua0NvbG9yIHtcclxuICAgIGNvbnN0cnVjdG9yKGFjdGl2ZSwgYWN0aXZlX291dGxpbmUsIGxhYmVsLCBhbGl2ZSwgZGlzYWJsZWQsIGRlYWQpIHtcclxuICAgICAgICB0aGlzLmFjdGl2ZSA9IGFjdGl2ZTtcclxuICAgICAgICB0aGlzLmFjdGl2ZV9vdXRsaW5lID0gYWN0aXZlX291dGxpbmU7XHJcbiAgICAgICAgdGhpcy5sYWJlbCA9IGxhYmVsO1xyXG4gICAgICAgIHRoaXMuYWxpdmUgPSBhbGl2ZTtcclxuICAgICAgICB0aGlzLmRpc2FibGVkID0gZGlzYWJsZWQ7XHJcbiAgICAgICAgdGhpcy5kZWFkID0gZGVhZDtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgVGFuayB7XHJcbiAgICBjb25zdHJ1Y3RvcihpZCwgcGxheWVyLCB4LCB5KSB7XHJcbiAgICAgICAgLyoqIE9wYWNpdHkgZm9yIHRoZSB0YW5rJ3MgbGFiZWwgKi9cclxuICAgICAgICB0aGlzLkxBQkVMX09QQUNJVFkgPSAwLjc7XHJcbiAgICAgICAgLyoqIE9wYWNpdHkgZm9yIHRoZSBwbGF5ZXIgY29sb3Igd2hlbiB0aGUgdGFuayBpcyBkaXNhYmxlZCAqL1xyXG4gICAgICAgIHRoaXMuRElTQUJMRURfT1BBQ0lUWSA9IDAuNztcclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBwbGF5ZXI7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBDYXJ0ZXNpYW5Db29yZHMoeCwgeSk7XHJcbiAgICAgICAgdGhpcy5oZWFsdGhfc3RhdGUgPSBUYW5rSGVhbHRoU3RhdGUuQUxJVkU7XHJcbiAgICAgICAgdGhpcy5sYWJlbCA9IHRoaXMuaWQgKyBcIlwiOyAvLyArIFwiXCIgY29udmVydHMgdG8gc3RyaW5nXHJcbiAgICAgICAgLy8gaW5pdGlhbGlzZSBjb2xvcnMgZm9yIGVhY2ggb2YgdGhlIHRhbmsncyBzdGF0ZXNcclxuICAgICAgICB0aGlzLmNvbG9yID0gbmV3IFRhbmtDb2xvcihDb2xvci5yZWQoKS50b1JHQkEoKSwgQ29sb3IuZ3JlZW4oKS50b1JHQkEoKSwgQ29sb3IuYmxhY2soKS50b1JHQkEodGhpcy5MQUJFTF9PUEFDSVRZKSwgdGhpcy5wbGF5ZXIuY29sb3IudG9SR0JBKCksIHRoaXMucGxheWVyLmNvbG9yLnRvUkdCQSh0aGlzLkRJU0FCTEVEX09QQUNJVFkpLCBDb2xvci5ncmF5KCkudG9SR0JBKCkpO1xyXG4gICAgfVxyXG4gICAgZHJhdyhjb250ZXh0LCBkcmF3KSB7XHJcbiAgICAgICAgbGV0IGNvbG9yO1xyXG4gICAgICAgIGxldCBsYWJlbCA9IHRoaXMubGFiZWw7XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLmhlYWx0aF9zdGF0ZSkge1xyXG4gICAgICAgICAgICBjYXNlIFRhbmtIZWFsdGhTdGF0ZS5BTElWRTpcclxuICAgICAgICAgICAgICAgIGNvbG9yID0gdGhpcy5jb2xvci5hbGl2ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFRhbmtIZWFsdGhTdGF0ZS5ESVNBQkxFRDpcclxuICAgICAgICAgICAgICAgIGNvbG9yID0gdGhpcy5jb2xvci5kaXNhYmxlZDtcclxuICAgICAgICAgICAgICAgIGxhYmVsICs9IFwiRFwiO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgVGFua0hlYWx0aFN0YXRlLkRFQUQ6XHJcbiAgICAgICAgICAgICAgICBjb2xvciA9IHRoaXMuY29sb3IuZGVhZDtcclxuICAgICAgICAgICAgICAgIGxhYmVsICs9IFwiWFwiO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRyYXcuY2lyY2xlKGNvbnRleHQsIHRoaXMucG9zaXRpb24sIFRhbmsuV0lEVEgsIFRhbmsuTElORV9XSURUSCwgY29sb3IpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy5jb2xvci5sYWJlbDtcclxuICAgICAgICBjb250ZXh0LmZvbnQgPSBcIjE4cHggQ2FsaWJyaVwiO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFRleHQobGFiZWwsIHRoaXMucG9zaXRpb24uWCwgdGhpcy5wb3NpdGlvbi5ZICsgNSk7XHJcbiAgICB9XHJcbiAgICBoaWdobGlnaHQoY29udGV4dCwgZHJhdykge1xyXG4gICAgICAgIGRyYXcuZG90KGNvbnRleHQsIHRoaXMucG9zaXRpb24sIFRhbmsuV0lEVEgsIHRoaXMuY29sb3IuYWN0aXZlKTtcclxuICAgICAgICBkcmF3LmNpcmNsZShjb250ZXh0LCB0aGlzLnBvc2l0aW9uLCBUYW5rLk1PVkVNRU5UX1JBTkdFLCBUYW5rLkxJTkVfV0lEVEgsIHRoaXMuY29sb3IuYWN0aXZlX291dGxpbmUpO1xyXG4gICAgfVxyXG59XHJcbi8qKiBUaGUgd2lkdGggb2YgdGhlIGRvdCB3aGVuIGRyYXdpbmcgdGhlIHRhbmsgKi9cclxuVGFuay5XSURUSCA9IDEyO1xyXG4vKiogVGhlIHpvbmUgYXJvdW5kIHRoZSB0YW5rIHRoYXQgd2lsbCBjYXVzZSBpdCB0byBiZSBkaXNhYmxlZCBpbnN0ZWFkIG9mIGtpbGxlZCAqL1xyXG5UYW5rLkRJU0FCTEVEX1pPTkUgPSAwLjU7XHJcbi8qKiBUaGUgd2lkdGggb2YgdGhlIGxpbmUgd2hlbiBkcmF3aW5nIHRoZSB0YW5rICovXHJcblRhbmsuTElORV9XSURUSCA9IDE7XHJcbi8qKiBIb3cgZmFyIGNhbiB0aGUgdGFuayBtb3ZlICovXHJcblRhbmsuTU9WRU1FTlRfUkFOR0UgPSAxMDA7XHJcbi8qKiBUaGUgd2lkdGggb2YgdGhlIG1vdmVtZW50IGxpbmUgKi9cclxuVGFuay5NT1ZFTUVOVF9MSU5FX1dJRFRIID0gMztcclxuLyoqIFRoZSBjb2xvciBvZiB0aGUgbW92ZW1lbnQgbGluZSAqL1xyXG5UYW5rLk1PVkVNRU5UX0xJTkVfQ09MT1IgPSBDb2xvci5ibGFjaygpLnRvUkdCQSgpO1xyXG4vKiogSG93IGZhciBjYW4gdGhlIHNob3QgbGluZSByZWFjaCAqL1xyXG5UYW5rLlNIT09USU5HX1JBTkdFID0gMjUwO1xyXG4vKiogSG93IGZhc3QgbXVzdCB0aGUgcGxheWVyIG1vdmUgZm9yIGEgdmFsaWQgc2hvdCAqL1xyXG5UYW5rLlNIT09USU5HX1NQRUVEID0gMzA7XHJcbi8qKiBUaGUgZGVhZHpvbmUgYWxsb3dlZCBmb3IgZnJlZSBtb3VzZSBtb3ZlbWVudCBiZWZvcmUgdGhlIHBsYXllciBzaG9vdHMuXHJcbiAqIFRoaXMgbWVhbnMgdGhhdCB0aGUgcGxheWVyIGNhbiB3aWdnbGUgdGhlIGN1cnNvciBhcm91bmQgaW4gdGhlIHRhbmsncyBzcGFjZVxyXG4gKiB0byBwcmVwYXJlIGZvciB0aGUgc2hvdC5cclxuICovXHJcblRhbmsuU0hPT1RJTkdfREVBRFpPTkUgPSBUYW5rLldJRFRIICsgMjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGFuay5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9idWlsZC9nYW1lT2JqZWN0cy90YW5rLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IENhcnRlc2lhbkNvb3JkcyB9IGZyb20gXCIuLi9jYXJ0ZXNpYW5Db29yZHNcIjtcclxuZXhwb3J0IGNsYXNzIERyYXcge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5tb3VzZSA9IG5ldyBDYXJ0ZXNpYW5Db29yZHMoKTtcclxuICAgICAgICB0aGlzLmxhc3QgPSBuZXcgQ2FydGVzaWFuQ29vcmRzKCk7XHJcbiAgICB9XHJcbiAgICAvKiogRHJhdyBhIGRvdCAoYSBmaWxsZWQgY2lyY2xlKSBhcm91bmQgdGhlIHBvaW50LlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBjb250ZXh0IENvbnRleHQgb24gd2hpY2ggdGhlIGNpcmNsZSB3aWxsIGJlIGRyYXduXHJcbiAgICAgKiBAcGFyYW0gY29vcmRzIENvb3JkaW5hdGVzIGZvciB0aGUgb3JpZ2luIHBvaW50IG9mIHRoZSBjaXJjbGVcclxuICAgICAqIEBwYXJhbSByYWRpdXMgUmFkaXVzIG9mIHRoZSBkb3RcclxuICAgICAqIEBwYXJhbSBmaWxsX2NvbG9yIENvbG9yIG9mIHRoZSBmaWxsXHJcbiAgICAgKiBAcGFyYW0gb3V0bGluZSBTcGVjaWZ5IHdoZXRoZXIgYW4gb3V0bGluZSB3aWxsIGJlIGRyYXduIGFyb3VuZCB0aGUgY2lyY2xlXHJcbiAgICAgKiBAcGFyYW0gc3Ryb2tlX2NvbG9yIFNwZWNpZnkgY29sb3IgZm9yIHRoZSBvdXRsaW5lLCBpZiBub3Qgc3BlY2lmaWVkIHRoZSBjb2xvdXIgd2lsbCBiZSB0aGUgc2FtZSBhcyB0aGUgZmlsbCBjb2xvclxyXG4gICAgICovXHJcbiAgICBkb3QoY29udGV4dCwgY29vcmRzLCByYWRpdXMsIGZpbGxfY29sb3IsIG91dGxpbmUgPSBmYWxzZSwgc3Ryb2tlX2NvbG9yID0gbnVsbCkge1xyXG4gICAgICAgIC8vIExldCdzIHVzZSBibGFjayBieSBzZXR0aW5nIFJHQiB2YWx1ZXMgdG8gMCwgYW5kIDI1NSBhbHBoYSAoY29tcGxldGVseSBvcGFxdWUpXHJcbiAgICAgICAgLy8gU2VsZWN0IGEgZmlsbCBzdHlsZVxyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gZmlsbF9jb2xvcjtcclxuICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IHJhZGl1cztcclxuICAgICAgICAvLyBEcmF3IGEgZmlsbGVkIGNpcmNsZVxyXG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY29udGV4dC5hcmMoY29vcmRzLlgsIGNvb3Jkcy5ZLCByYWRpdXMsIDAsIE1hdGguUEkgKiAyLCB0cnVlKTtcclxuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG4gICAgICAgIGlmIChvdXRsaW5lKSB7XHJcbiAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBzdHJva2VfY29sb3IgfHwgZmlsbF9jb2xvcjtcclxuICAgICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKiogRHJhdyBhIGNpcmNsZSBhcm91bmQgYSBwb2ludC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY29udGV4dCBDb250ZXh0IG9uIHdoaWNoIHRoZSBjaXJjbGUgd2lsbCBiZSBkcmF3blxyXG4gICAgICogQHBhcmFtIGNvb3JkcyBDb29yZGluYXRlcyBmb3IgdGhlIG9yaWdpbiBwb2ludCBvZiB0aGUgY2lyY2xlXHJcbiAgICAgKiBAcGFyYW0gcmFkaXVzIFRoZSByYWRpdXMgb2YgdGhlIGNpcmNsZVxyXG4gICAgICogQHBhcmFtIGxpbmVfd2lkdGggVGhlIGxpbmUgd2lkdGggb2YgdGhlIGNpcmNsZVxyXG4gICAgICogQHBhcmFtIGNvbG9yIFRoZSBjb2xvciBvZiB0aGUgbGluZVxyXG4gICAgICovXHJcbiAgICBjaXJjbGUoY29udGV4dCwgY29vcmRzLCByYWRpdXMsIGxpbmVfd2lkdGgsIGNvbG9yKSB7XHJcbiAgICAgICAgLy8gTGV0J3MgdXNlIGJsYWNrIGJ5IHNldHRpbmcgUkdCIHZhbHVlcyB0byAwLCBhbmQgMjU1IGFscGhhIChjb21wbGV0ZWx5IG9wYXF1ZSlcclxuICAgICAgICAvLyBTZWxlY3QgYSBmaWxsIHN0eWxlXHJcbiAgICAgICAgY29udGV4dC5zdHJva2VTdHlsZSA9IGNvbG9yO1xyXG4gICAgICAgIGNvbnRleHQubGluZVdpZHRoID0gbGluZV93aWR0aDtcclxuICAgICAgICAvLyBEcmF3IGEgZmlsbGVkIGNpcmNsZVxyXG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY29udGV4dC5hcmMoY29vcmRzLlgsIGNvb3Jkcy5ZLCByYWRpdXMsIDAsIE1hdGguUEkgKiAyLCB0cnVlKTtcclxuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIERyYXcgYSBsaW5lIGJldHdlZW4gdGhlIGxhc3Qga25vd24gcG9zaXRpb24gb2YgdGhlIG1vdXNlLCBhbmQgdGhlIGN1cnJlbnQgcG9zaXRpb24uXHJcbiAgICAgKiBAcGFyYW0gY29udGV4dCBUaGUgY2FudmFzIGNvbnRleHQgdGhhdCB3ZSdyZSBkcmF3aW5nIG9uXHJcbiAgICAgKiBAcGFyYW0gdXBkYXRlX2xhc3QgV2hldGhlciB0byB1cGRhdGUgdGhlIGxhc3QgcG9zaXRpb24gb2YgdGhlIG1vdXNlXHJcbiAgICAgKi9cclxuICAgIG1vdXNlTGluZShjb250ZXh0LCB3aWR0aCwgY29sb3IsIHVwZGF0ZV9sYXN0ID0gdHJ1ZSkge1xyXG4gICAgICAgIC8vIElmIGxhc3RYIGlzIG5vdCBzZXQsIHNldCBsYXN0WCBhbmQgbGFzdFkgdG8gdGhlIGN1cnJlbnQgcG9zaXRpb24gXHJcbiAgICAgICAgaWYgKHRoaXMubGFzdC5YID09IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMubGFzdC5YID0gdGhpcy5tb3VzZS5YO1xyXG4gICAgICAgICAgICB0aGlzLmxhc3QuWSA9IHRoaXMubW91c2UuWTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gU2VsZWN0IGEgZmlsbCBzdHlsZVxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBjb2xvcjtcclxuICAgICAgICAvLyBTZXQgdGhlIGxpbmUgXCJjYXBcIiBzdHlsZSB0byByb3VuZCwgc28gbGluZXMgYXQgZGlmZmVyZW50IGFuZ2xlcyBjYW4gam9pbiBpbnRvIGVhY2ggb3RoZXJcclxuICAgICAgICBjb250ZXh0LmxpbmVDYXAgPSBcInJvdW5kXCI7XHJcbiAgICAgICAgY29udGV4dC5saW5lSm9pbiA9IFwicm91bmRcIjtcclxuICAgICAgICAvLyBEcmF3IGEgZmlsbGVkIGxpbmVcclxuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIC8vIEZpcnN0LCBtb3ZlIHRvIHRoZSBvbGQgKHByZXZpb3VzKSBwb3NpdGlvblxyXG4gICAgICAgIGNvbnRleHQubW92ZVRvKHRoaXMubGFzdC5YLCB0aGlzLmxhc3QuWSk7XHJcbiAgICAgICAgLy8gTm93IGRyYXcgYSBsaW5lIHRvIHRoZSBjdXJyZW50IHRvdWNoL3BvaW50ZXIgcG9zaXRpb25cclxuICAgICAgICBjb250ZXh0LmxpbmVUbyh0aGlzLm1vdXNlLlgsIHRoaXMubW91c2UuWSk7XHJcbiAgICAgICAgLy8gU2V0IHRoZSBsaW5lIHRoaWNrbmVzcyBhbmQgZHJhdyB0aGUgbGluZVxyXG4gICAgICAgIGNvbnRleHQubGluZVdpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGlmICh1cGRhdGVfbGFzdCkge1xyXG4gICAgICAgICAgICAvLyBVcGRhdGUgdGhlIGxhc3QgcG9zaXRpb24gdG8gcmVmZXJlbmNlIHRoZSBjdXJyZW50IHBvc2l0aW9uXHJcbiAgICAgICAgICAgIHRoaXMubGFzdC5YID0gdGhpcy5tb3VzZS5YO1xyXG4gICAgICAgICAgICB0aGlzLmxhc3QuWSA9IHRoaXMubW91c2UuWTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIERyYXcgYSBsaW5lIGJldHdlZW4gdGhlIHN0YXJ0IGFuZCBlbmQgcG9pbnRzLlxyXG4gICAgICogQHBhcmFtIGNvbnRleHQgVGhlIGNhbnZhcyBjb250ZXh0IHRoYXQgd2UncmUgZHJhd2luZyBvblxyXG4gICAgICogQHBhcmFtIHN0YXJ0IFN0YXJ0IHBvaW50XHJcbiAgICAgKiBAcGFyYW0gZW5kIEVuZCBwb2ludFxyXG4gICAgICogQHBhcmFtIHdpZHRoIFdpZHRoIG9mIHRoZSBsaW5lXHJcbiAgICAgKiBAcGFyYW0gY29sb3IgQ29sb3Igb2YgdGhlIGxpbmVcclxuICAgICAqL1xyXG4gICAgbGluZShjb250ZXh0LCBzdGFydCwgZW5kLCB3aWR0aCwgY29sb3IpIHtcclxuICAgICAgICAvLyBTZWxlY3QgYSBmaWxsIHN0eWxlXHJcbiAgICAgICAgY29udGV4dC5zdHJva2VTdHlsZSA9IGNvbG9yO1xyXG4gICAgICAgIC8vIFNldCB0aGUgbGluZSBcImNhcFwiIHN0eWxlIHRvIHJvdW5kLCBzbyBsaW5lcyBhdCBkaWZmZXJlbnQgYW5nbGVzIGNhbiBqb2luIGludG8gZWFjaCBvdGhlclxyXG4gICAgICAgIGNvbnRleHQubGluZUNhcCA9IFwicm91bmRcIjtcclxuICAgICAgICBjb250ZXh0LmxpbmVKb2luID0gXCJyb3VuZFwiO1xyXG4gICAgICAgIC8vIERyYXcgYSBmaWxsZWQgbGluZVxyXG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgLy8gRmlyc3QsIG1vdmUgdG8gdGhlIG9sZCAocHJldmlvdXMpIHBvc2l0aW9uXHJcbiAgICAgICAgY29udGV4dC5tb3ZlVG8oc3RhcnQuWCwgc3RhcnQuWSk7XHJcbiAgICAgICAgLy8gTm93IGRyYXcgYSBsaW5lIHRvIHRoZSBjdXJyZW50IHRvdWNoL3BvaW50ZXIgcG9zaXRpb25cclxuICAgICAgICBjb250ZXh0LmxpbmVUbyhlbmQuWCwgZW5kLlkpO1xyXG4gICAgICAgIC8vIFNldCB0aGUgbGluZSB0aGlja25lc3MgYW5kIGRyYXcgdGhlIGxpbmVcclxuICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuICAgIH1cclxuICAgIHVwZGF0ZU1vdXNlUG9zaXRpb24oZSkge1xyXG4gICAgICAgIC8vIGlmIHRoZSBicm93c2VyIGhhc24ndCBwYXNzZWQgYSBwYXJhbWV0ZXIsIGJ1dCBoYXMgc2V0IHRoZSBnbG9iYWwgZXZlbnQgdmFyaWFibGVcclxuICAgICAgICBpZiAoIWUpIHtcclxuICAgICAgICAgICAgdmFyIGUgPSBldmVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGUub2Zmc2V0WCkge1xyXG4gICAgICAgICAgICB0aGlzLm1vdXNlLlggPSBlLm9mZnNldFg7XHJcbiAgICAgICAgICAgIHRoaXMubW91c2UuWSA9IGUub2Zmc2V0WTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB1cGRhdGVUb3VjaFBvc2l0aW9uKGUpIHtcclxuICAgICAgICAvLyBpZiB0aGUgYnJvd3NlciBoYXNuJ3QgcGFzc2VkIGEgcGFyYW1ldGVyLCBidXQgaGFzIHNldCB0aGUgZ2xvYmFsIGV2ZW50IHZhcmlhYmxlXHJcbiAgICAgICAgaWYgKCFlKSB7XHJcbiAgICAgICAgICAgIHZhciBlID0gZXZlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChlLnRvdWNoZXMpIHtcclxuICAgICAgICAgICAgLy8gT25seSBkZWFsIHdpdGggb25lIGZpbmdlclxyXG4gICAgICAgICAgICBpZiAoZS50b3VjaGVzLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIGluZm9ybWF0aW9uIGZvciBmaW5nZXIgIzFcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRvdWNoID0gZS50b3VjaGVzWzBdO1xyXG4gICAgICAgICAgICAgICAgLy8gdGhlICd0YXJnZXQnIHdpbGwgYmUgdGhlIGNhbnZhcyBlbGVtZW50XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vdXNlLlggPSB0b3VjaC5wYWdlWCAtIHRvdWNoLnRhcmdldC5vZmZzZXRMZWZ0O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3VzZS5ZID0gdG91Y2gucGFnZVkgLSB0b3VjaC50YXJnZXQub2Zmc2V0VG9wO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydCB2YXIgRHJhd1N0YXRlO1xyXG4oZnVuY3Rpb24gKERyYXdTdGF0ZSkge1xyXG4gICAgRHJhd1N0YXRlW0RyYXdTdGF0ZVtcIkRSQVdJTkdcIl0gPSAwXSA9IFwiRFJBV0lOR1wiO1xyXG4gICAgRHJhd1N0YXRlW0RyYXdTdGF0ZVtcIlNUT1BQRURcIl0gPSAxXSA9IFwiU1RPUFBFRFwiO1xyXG59KShEcmF3U3RhdGUgfHwgKERyYXdTdGF0ZSA9IHt9KSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRyYXcuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYnVpbGQvZHJhd2luZy9kcmF3LmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydCBjbGFzcyBDYXJ0ZXNpYW5Db29yZHMge1xyXG4gICAgY29uc3RydWN0b3IoeCA9IC0xLCB5ID0gLTEpIHtcclxuICAgICAgICB0aGlzLlggPSB4O1xyXG4gICAgICAgIHRoaXMuWSA9IHk7XHJcbiAgICB9XHJcbiAgICBjb3B5KCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgQ2FydGVzaWFuQ29vcmRzKHRoaXMuWCwgdGhpcy5ZKTtcclxuICAgIH1cclxuICAgIHRvU3RyaW5nKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLlggKyBcIixcIiArIHRoaXMuWTtcclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1jYXJ0ZXNpYW5Db29yZHMuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYnVpbGQvY2FydGVzaWFuQ29vcmRzLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IENhcnRlc2lhbkNvb3JkcyB9IGZyb20gXCIuL2NhcnRlc2lhbkNvb3Jkc1wiO1xyXG5jbGFzcyBQb2ludCB7XHJcbiAgICAvKipcclxuICAgICAqIENhbGN1bGF0ZSB0aGUgZGlzdGFuY2UgYmV0d2VlbiB0d28gcG9pbnRzLCBvbiBhIDJEIHBsYW5lIHVzaW5nIFB5dGhvZ29yZWFuIFRoZW9yZW1cclxuICAgICAqIEBwYXJhbSBzdGFydCBGaXJzdCBwb2ludCB3aXRoIDJEIGNvb3JkaW5hdGVzXHJcbiAgICAgKiBAcGFyYW0gZW5kIFNlY29uZCBwb2ludCB3aXRoIDJEIGNvb3JkaW5hdGVzXHJcbiAgICAgKi9cclxuICAgIGRpc3QyZChzdGFydCwgZW5kKSB7XHJcbiAgICAgICAgY29uc3QgZGVsdGFfeCA9IGVuZC5YIC0gc3RhcnQuWDtcclxuICAgICAgICBjb25zdCBkZWx0YV95ID0gZW5kLlkgLSBzdGFydC5ZO1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoTWF0aC5hYnMoZGVsdGFfeCAqIGRlbHRhX3ggKyBkZWx0YV95ICogZGVsdGFfeSkpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGUgaWYgdGhlIHBvaW50IGNvbGxpZGVzIHdpdGggdGhlIGNpcmNsZS5cclxuICAgICAqIEBwYXJhbSBwb2ludCBUaGUgY29vcmRpbmF0ZXMgb2YgdGhlIHBvaW50ICh1c2VyJ3MgY2xpY2spXHJcbiAgICAgKiBAcGFyYW0gY2VudGVyIFRoZSBjZW50cmUgb2YgdGhlIGNpcmNsZVxyXG4gICAgICogQHBhcmFtIHJhZGl1cyBUaGUgcmFkaXVzIG9mIHRoZSBjaXJjbGVcclxuICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlcmUgaXMgY29sbGlzaW9uLCBmYWxzZSBvdGhlcndpc2VcclxuICAgICAqL1xyXG4gICAgY29sbGlkZV9jaXJjbGUocG9pbnQsIGNlbnRlciwgcmFkaXVzKSB7XHJcbiAgICAgICAgY29uc3QgZGlzdGFuY2UgPSB0aGlzLmRpc3QyZChwb2ludCwgY2VudGVyKTtcclxuICAgICAgICBpZiAoZGlzdGFuY2UgPiByYWRpdXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2sgaWYgdGhlIHBvaW50IGlzIHdpdGhpbiB0aGUgc3RhcnQgYW5kIGVuZCBvZiB0aGUgbGluZVxyXG4gICAgICogQHBhcmFtIHBvaW50IENvb3JpZG5hdGVzIG9mIGEgcG9pbnRcclxuICAgICAqIEBwYXJhbSBzdGFydCBTdGFydCBjb29yZGluYXRlcyBvZiBhIGxpbmVcclxuICAgICAqIEBwYXJhbSBlbmQgRW5kIGNvb3JkaW5hdGVzIG9mIGEgbGluZVxyXG4gICAgICovXHJcbiAgICB3aXRoaW4ocG9pbnQsIHN0YXJ0LCBlbmQpIHtcclxuICAgICAgICAvLyBJbml0aWFsIGltcGxlbWVudGF0aW9uOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzI4MTIyLzI4MjM1MjZcclxuICAgICAgICAvLyBPcHRpbWlzYXRpb24gYW5kIGNvcnJlY3Rpb246IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zMjgxMTAvMjgyMzUyNlxyXG4gICAgICAgIC8vIGFzIHRoZSBwb2ludCBpcyBndWFyYW50ZWVkIHRvIGJlIG9uIHRoZSBsaW5lIGJ5IExpbmU6OmNsb3Nlc3RfcG9pbnQsIHdlIGp1c3QgY2hlY2sgaWYgdGhlIHBvaW50IGlzIHdpdGhpbiB0aGUgbGluZVxyXG4gICAgICAgIGNvbnN0IHdpdGhpbiA9IChzdGFydCwgcG9pbnQsIGVuZCkgPT4gKHN0YXJ0IDw9IHBvaW50ICYmIHBvaW50IDw9IGVuZCkgfHwgKGVuZCA8PSBwb2ludCAmJiBwb2ludCA8PSBzdGFydCk7XHJcbiAgICAgICAgcmV0dXJuIHN0YXJ0LlggIT09IGVuZC5YID8gd2l0aGluKHN0YXJ0LlgsIHBvaW50LlgsIGVuZC5YKSA6IHdpdGhpbihzdGFydC5ZLCBwb2ludC5ZLCBlbmQuWSk7XHJcbiAgICB9XHJcbn1cclxuY2xhc3MgTGluZSB7XHJcbiAgICAvKiogRmluZCB0aGUgY2xvc2VzdCBwb2ludCBvbiBhIGxpbmUuIFRoZSBjbG9zZXN0IHBvaW50IHRvXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHN0YXJ0IFN0YXJ0IHBvaW50IG9mIHRoZSBsaW5lXHJcbiAgICAgKiBAcGFyYW0gZW5kIEVuZCBwb2ludCBvZiB0aGUgbGluZVxyXG4gICAgICogQHBhcmFtIHBvaW50IFBvaW50IGZvciB3aGljaCB0aGUgY2xvc2VzdCBwb2ludCBvbiB0aGUgbGluZSB3aWxsIGJlIGZvdW5kLlxyXG4gICAgICovXHJcbiAgICBjbG9zZXN0X3BvaW50KHN0YXJ0LCBlbmQsIHBvaW50KSB7XHJcbiAgICAgICAgY29uc3QgQTEgPSBlbmQuWSAtIHN0YXJ0LlksIEIxID0gc3RhcnQuWCAtIGVuZC5YO1xyXG4gICAgICAgIC8vIHR1cm4gdGhlIGxpbmUgaXRvIGVxdWF0aW9uIG9mIHRoZSBmb3JtIEF4ICsgQnkgPSBDXHJcbiAgICAgICAgY29uc3QgQzEgPSBBMSAqIHN0YXJ0LlggKyBCMSAqIHN0YXJ0Llk7XHJcbiAgICAgICAgLy8gZmluZCB0aGUgcGVycGVuZGljdWxhciBsaW5lIHRoYXQgcGFzc2VzIHRocm91Z2ggdGhlIGxpbmUgYW5kIHRoZSBvdXRzaWRlIHBvaW50XHJcbiAgICAgICAgY29uc3QgQzIgPSAtQjEgKiBwb2ludC5YICsgQTEgKiBwb2ludC5ZO1xyXG4gICAgICAgIC8vIGZpbmQgdGhlIGRldGVybWluYW50IG9mIHRoZSB0d28gZXF1YXRpb25zIGFsZ2VicmFpY2FsbHlcclxuICAgICAgICBjb25zdCBkZXQgPSBBMSAqIEExICsgQjEgKiBCMTtcclxuICAgICAgICBjb25zdCBjbG9zZXN0X3BvaW50ID0gbmV3IENhcnRlc2lhbkNvb3JkcygpO1xyXG4gICAgICAgIC8vIHVzZSBDcmFtZXIncyBSdWxlIHRvIHNvbHZlIGZvciB0aGUgcG9pbnQgb2YgaW50ZXJzZWN0aW9uXHJcbiAgICAgICAgaWYgKGRldCAhPSAwKSB7XHJcbiAgICAgICAgICAgIGNsb3Nlc3RfcG9pbnQuWCA9IChBMSAqIEMxIC0gQjEgKiBDMikgLyBkZXQ7XHJcbiAgICAgICAgICAgIGNsb3Nlc3RfcG9pbnQuWSA9IChBMSAqIEMyICsgQjEgKiBDMSkgLyBkZXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjbG9zZXN0X3BvaW50LlggPSBwb2ludC5YO1xyXG4gICAgICAgICAgICBjbG9zZXN0X3BvaW50LlkgPSBwb2ludC5ZO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY2xvc2VzdF9wb2ludDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJuIHRoZSBkaXN0YW5jZSBmcm9tIHRoZSBsaW5lIHRvIHRoZSBjZW50ZXIgb2YgdGhlIGNpcmNsZS5cclxuICAgICAqIFRoaXMgaXMgZG9uZSBieSBmaW5kaW5nIHRoZSBsZW5ndGggb2YgdGhlIHBlcnBlbmRpY3VsYXIgbGluZSB0aGF0IHBhc3NlcyB0aHJvdWdoIHRoZSBsaW5lIGFuZCBjaXJjbGUncyBjZW50ZXJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gc3RhcnQgU3RhcnQgY29vcmRpbmF0ZXMgb2YgdGhlIGxpbmVcclxuICAgICAqIEBwYXJhbSBlbmQgRW5kIGNvb3JkaW5hdGVzIG9mIHRoZSBsaW5lXHJcbiAgICAgKiBAcGFyYW0gY2VudGVyIENlbnRlciBvZiB0aGUgY2lyY2xlXHJcbiAgICAgKiBAcmV0dXJucyBJZiB0aGUgY2lyY2xlJ3MgY2VudGVyIGlzIHdpdGhpbiB0aGUgbGluZSwgdGhlbiB0aGUgZGlzdGFuY2UgYmV0d2VlbiB0aGVtIHdpbGwgYmUgcmV0dXJuZWQsXHJcbiAgICAgKiAgICAgICAgICBpZiB0aGUgY2lyY2xlJ3MgY2VudGVyIGlzIG5vdCB3aXRoaW4gdGhlIGxpbmUsIC0xIHdpbGwgYmUgcmV0dXJuZWRcclxuICAgICAqL1xyXG4gICAgY2lyY2xlX2NlbnRlcl9kaXN0KHN0YXJ0LCBlbmQsIGNlbnRlcikge1xyXG4gICAgICAgIC8vIGZpbmQgdGhlIGNsb3Nlc3QgcG9pbnQgdG8gdGhlIGNpcmNsZSwgb24gdGhlIGxpbmVcclxuICAgICAgICBjb25zdCBjbG9zZXN0X3BvaW50ID0gdGhpcy5jbG9zZXN0X3BvaW50KHN0YXJ0LCBlbmQsIGNlbnRlcik7XHJcbiAgICAgICAgLy8gY2hlY2sgaWYgdGhlIGNsb3Nlc3QgcG9pbnQgaXMgd2l0aGluIHRoZSBzdGFydCBhbmQgZW5kIG9mIHRoZSBsaW5lLCBcclxuICAgICAgICAvLyBhbmQgbm90IHNvbWV3aGVyZSBhbG9uZyBpdHMgaW5maW5pdGUgZXh0ZW5zaW9uXHJcbiAgICAgICAgaWYgKFRhbmtzTWF0aC5wb2ludC53aXRoaW4oY2xvc2VzdF9wb2ludCwgc3RhcnQsIGVuZCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFRhbmtzTWF0aC5wb2ludC5kaXN0MmQoY2xvc2VzdF9wb2ludCwgY2VudGVyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIGlmIHRoZSBjaXJjbGUgaXMgY29sbGlkaW5nIHdpdGggdGhlIGxpbmVcclxuICAgICAqIEBwYXJhbSBzdGFydCBTdGFydCBjb29yZGluYXRlcyBvZiB0aGUgbGluZVxyXG4gICAgICogQHBhcmFtIGVuZCBFbmQgY29vcmRpbmF0ZXMgb2YgdGhlIGxpbmVcclxuICAgICAqIEBwYXJhbSBjZW50ZXIgQ2VudGVyIHBvaW50IG9mIHRoZSBjaXJjbGVcclxuICAgICAqIEBwYXJhbSByYWRpdXMgUmFkaXVzIG9mIHRoZSBjaXJjbGVcclxuICAgICAqL1xyXG4gICAgY29sbGlkZV9jaXJjbGUoc3RhcnQsIGVuZCwgY2VudGVyLCByYWRpdXMpIHtcclxuICAgICAgICBjb25zdCBkaXN0ID0gdGhpcy5jaXJjbGVfY2VudGVyX2Rpc3Qoc3RhcnQsIGVuZCwgY2VudGVyKTtcclxuICAgICAgICAvLyBpZiBkaXN0YW5jZSBpcyB1bmRlZmluZWQsIG9yIGlzIGZ1cnRoZXIgdGhhbiB0aGUgcmFkaXVzLCByZXR1cm4gZmFsc2VcclxuICAgICAgICByZXR1cm4gIWRpc3QgfHwgZGlzdCA+IHJhZGl1cyA/IGZhbHNlIDogdHJ1ZTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgVGFua3NNYXRoIHtcclxufVxyXG5UYW5rc01hdGgucG9pbnQgPSBuZXcgUG9pbnQoKTtcclxuVGFua3NNYXRoLmxpbmUgPSBuZXcgTGluZSgpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD10YW5rc01hdGguanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYnVpbGQvdGFua3NNYXRoLmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydCB7IEFjdGlvbnMgfSBmcm9tICcuL2FjdGlvbic7XHJcbmV4cG9ydCB7IFNwZWVkIH0gZnJvbSAnLi9zcGVlZCc7XHJcbmV4cG9ydCB7IExlbmd0aCB9IGZyb20gJy4vbGVuZ3RoJztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYnVpbGQvbGltaXRlcnMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGNsYXNzIENvbG9yIHtcclxuICAgIGNvbnN0cnVjdG9yKHJlZCwgZ3JlZW4sIGJsdWUsIGFscGhhID0gMS4wKSB7XHJcbiAgICAgICAgdGhpcy5yZWQgPSByZWQ7XHJcbiAgICAgICAgdGhpcy5ncmVlbiA9IGdyZWVuO1xyXG4gICAgICAgIHRoaXMuYmx1ZSA9IGJsdWU7XHJcbiAgICAgICAgdGhpcy5hbHBoYSA9IGFscGhhO1xyXG4gICAgfVxyXG4gICAgdG9SR0JBKGFscGhhKSB7XHJcbiAgICAgICAgaWYgKGFscGhhKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcInJnYmEoXCIgKyB0aGlzLnJlZCArIFwiLFwiICsgdGhpcy5ncmVlbiArIFwiLFwiICsgdGhpcy5ibHVlICsgXCIsXCIgKyBhbHBoYSArIFwiKVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwicmdiYShcIiArIHRoaXMucmVkICsgXCIsXCIgKyB0aGlzLmdyZWVuICsgXCIsXCIgKyB0aGlzLmJsdWUgKyBcIixcIiArIHRoaXMuYWxwaGEgKyBcIilcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgbmV4dCgpIHtcclxuICAgICAgICBpZiAoQ29sb3IuY29sb3IgPT0gMCkge1xyXG4gICAgICAgICAgICBDb2xvci5jb2xvcisrO1xyXG4gICAgICAgICAgICByZXR1cm4gQ29sb3IucmVkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKENvbG9yLmNvbG9yID09IDEpIHtcclxuICAgICAgICAgICAgQ29sb3IuY29sb3IrKztcclxuICAgICAgICAgICAgcmV0dXJuIENvbG9yLmJsdWUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoQ29sb3IuY29sb3IgPT0gMikge1xyXG4gICAgICAgICAgICBDb2xvci5jb2xvcisrO1xyXG4gICAgICAgICAgICByZXR1cm4gQ29sb3IuZ3JlZW4oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoQ29sb3IuY29sb3IgPT0gMykge1xyXG4gICAgICAgICAgICBDb2xvci5jb2xvcisrO1xyXG4gICAgICAgICAgICByZXR1cm4gQ29sb3IueWVsbG93KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIllvdSd2ZSB1c2VkIGFsbCB0aGUgYXZhaWxhYmxlIGNvbG91cnMhXCIpO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHJlZChhbHBoYSA9IDEuMCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgQ29sb3IoMjU1LCAwLCAwLCBhbHBoYSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ3JlZW4oYWxwaGEgPSAxLjApIHtcclxuICAgICAgICByZXR1cm4gbmV3IENvbG9yKDAsIDI1NSwgMCwgYWxwaGEpO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGJsdWUoYWxwaGEgPSAxLjApIHtcclxuICAgICAgICByZXR1cm4gbmV3IENvbG9yKDAsIDAsIDI1NSwgYWxwaGEpO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGJsYWNrKGFscGhhID0gMS4wKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDb2xvcigwLCAwLCAwLCBhbHBoYSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgd2hpdGUoYWxwaGEgPSAxLjApIHtcclxuICAgICAgICByZXR1cm4gbmV3IENvbG9yKDI1NSwgMjU1LCAyNTUsIGFscGhhKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyB5ZWxsb3coYWxwaGEgPSAxLjApIHtcclxuICAgICAgICByZXR1cm4gbmV3IENvbG9yKDI1NSwgMjU1LCAwLCBhbHBoYSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ3JheShhbHBoYSA9IDEuMCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgQ29sb3IoMTI4LCAxMjgsIDEyOCwgYWxwaGEpO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHBpbmsoYWxwaGEgPSAxLjApIHtcclxuICAgICAgICByZXR1cm4gbmV3IENvbG9yKDI1NSwgMTAyLCAyMDMsIGFscGhhKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBjKHJlZCwgZ3JlZW4sIGJsdWUsIGFscGhhID0gMS4wKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDb2xvcihyZWQsIGdyZWVuLCBibHVlLCBhbHBoYSk7XHJcbiAgICB9XHJcbn1cclxuQ29sb3IuY29sb3IgPSAwO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb2xvci5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9idWlsZC9kcmF3aW5nL2NvbG9yLmpzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydCBjbGFzcyBBY3RpdmVUYW5rIHtcclxuICAgIGNvbnN0cnVjdG9yKGlkLCBwb3NpdGlvbiwgdGFuaykge1xyXG4gICAgICAgIHRoaXMudmFsaWRfcG9zaXRpb24gPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG4gICAgICAgIHRoaXMudGFuayA9IHRhbms7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIFRhbmtzU2hhcmVkU3RhdGUge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5hY3RpdmUgPSBuZXcgU2luZ2xlQWNjZXNzKCk7XHJcbiAgICAgICAgdGhpcy5uZXh0ID0gbmV3IFNpbmdsZUFjY2VzcygpO1xyXG4gICAgICAgIHRoaXMudHVybiA9IG5ldyBTaW5nbGVBY2Nlc3MoKTtcclxuICAgIH1cclxufVxyXG5jbGFzcyBTaW5nbGVBY2Nlc3Mge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5yZXNvdXJjZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5hY2Nlc3NlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgc2V0KHJlc291cmNlKSB7XHJcbiAgICAgICAgdGhpcy5yZXNvdXJjZSA9IHJlc291cmNlO1xyXG4gICAgICAgIHRoaXMuYWNjZXNzZWQgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIGF2YWlsYWJsZSgpIHtcclxuICAgICAgICByZXR1cm4gIXRoaXMuYWNjZXNzZWQgJiYgdGhpcy5yZXNvdXJjZSAhPT0gbnVsbDtcclxuICAgIH1cclxuICAgIGdldCgpIHtcclxuICAgICAgICBpZiAodGhpcy5hdmFpbGFibGUoKSkge1xyXG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5yZXNvdXJjZTtcclxuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZSA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiB4O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLmFjY2Vzc2VkKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoaXMgb2JqZWN0IGhhcyBhbHJlYWR5IGJlZW4gYWNjZXNzZWQuXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLnJlc291cmNlID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSByZXNvdXJjZSBvYmplY3QgaGFzIG5vdCBiZWVuIHNldC5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIGVycm9yIHdpdGggc2luZ2xlIGFjY2VzcyBvYmplY3RcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNoYXJlZFN0YXRlLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2J1aWxkL2dhbWVTdGF0ZXMvc2hhcmVkU3RhdGUuanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gQ2xhc3NlcyBhZGRlZCB0byB0aGUgYHdpbmRvd2Agb2JqZWN0IGFyZSBnbG9iYWwsIGFuZCB2aXNpYmxlIGluc2lkZSB0aGUgSFRNTCBjb2RlLlxyXG4vLyBBbnkgY2xhc3NlcyBub3QgYWRkZWQgdG8gdGhlIGB3aW5kb3dgIGFyZSBpbnZpc2libGUgKG5vdCBhY2Nlc3NpYmxlKSBmcm9tIHRoZSBIVE1MLlxyXG4vLyBHbG9iYWwgY2xhc3Nlc1xyXG5pbXBvcnQgQ29udHJvbHMgZnJvbSAnLi9zaXRlQ29udHJvbHMnO1xyXG53aW5kb3dbXCJDb250cm9sc1wiXSA9IENvbnRyb2xzO1xyXG4vLyBJbnRlcm5hbCBjbGFzc2VzXHJcbmltcG9ydCB7IFVpIH0gZnJvbSBcIi4vdWlcIjtcclxuaW1wb3J0IHsgR2FtZVN0YXRlQ29udHJvbGxlciwgR2FtZVN0YXRlIH0gZnJvbSAnLi9nYW1lU3RhdGVDb250cm9sbGVyJztcclxuY29uc3QgSURfR0FNRV9DQU5WQVMgPSBcInRhbmtzLWNhbnZhc1wiO1xyXG5jb25zdCBJRF9HQU1FX1VJID0gXCJ0YW5rcy11aVwiO1xyXG4vLyBTZXQtdXAgdGhlIGNhbnZhcyBhbmQgYWRkIG91ciBldmVudCBoYW5kbGVycyBhZnRlciB0aGUgcGFnZSBoYXMgbG9hZGVkXHJcbmZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICBjb25zdCBjb250cm9sbGVyID0gbmV3IEdhbWVTdGF0ZUNvbnRyb2xsZXIoKTtcclxuICAgIGNvbnN0IHdpZHRoID0gd2luZG93LmlubmVyV2lkdGggLSAzMjtcclxuICAgIC8vIHRha2UgOTAlIG9mIHRoZSB3aW5kb3csIGxlYXZlIGEgYml0IG9mIGdhcCBvbiB0aGUgcmlnaHRcclxuICAgIGNvbnN0IGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCAqIDAuOTtcclxuICAgIGNvbnN0IHVpID0gbmV3IFVpKElEX0dBTUVfVUksIHdpZHRoKTtcclxuICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKElEX0dBTUVfQ0FOVkFTKTtcclxuICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgY2FudmFzLmhlaWdodCA9IGhlaWdodDtcclxuICAgIGNvbnRyb2xsZXIuaW5pdGlhbGlzZShjYW52YXMsIGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIiksIHVpKTtcclxuICAgIC8vIHN0YXJ0IHRoZSBnYW1lIGluIE1lbnUgc3RhdGVcclxuICAgIGNvbnRyb2xsZXIuY2hhbmdlR2FtZVN0YXRlKEdhbWVTdGF0ZS5NRU5VKTtcclxufVxyXG5pbml0KCk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1haW4uanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYnVpbGQvbWFpbi5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDb250cm9scyB7XHJcbiAgICBzdGF0aWMgdG9nZ2xlX3czX3Nob3coaHRtbF9lbGVtKSB7XHJcbiAgICAgICAgaWYgKGh0bWxfZWxlbS5jbGFzc05hbWUuaW5kZXhPZihcInczLXNob3dcIikgPT0gLTEpIHtcclxuICAgICAgICAgICAgaHRtbF9lbGVtLmNsYXNzTmFtZSArPSBcIiB3My1zaG93XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBodG1sX2VsZW0uY2xhc3NOYW1lID0gaHRtbF9lbGVtLmNsYXNzTmFtZS5yZXBsYWNlKFwiIHczLXNob3dcIiwgXCJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc3RhdGljIHczX29wZW4oKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteVNpZGViYXJcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15T3ZlcmxheVwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHczX2Nsb3NlKCkge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlTaWRlYmFyXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15T3ZlcmxheVwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICB9XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2l0ZUNvbnRyb2xzLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2J1aWxkL3NpdGVDb250cm9scy5qc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgY2xhc3MgVWkge1xyXG4gICAgY29uc3RydWN0b3IoaWQsIHdpZHRoKSB7XHJcbiAgICAgICAgdGhpcy5kaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLmRpdikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgVUkgRE9NIGVsZW1lbnQgd2FzIG5vdCBmb3VuZCFcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2V0V2lkdGgod2lkdGgpO1xyXG4gICAgfVxyXG4gICAgc2V0V2lkdGgod2lkdGgpIHtcclxuICAgICAgICAvLyBhcyBhbnkgaWdub3JlcyB0aGUgcmVhZC1vbmx5IFwic3R5bGVcIiB3YXJuaW5nLCBhcyB3ZSBuZWVkIHRvIHdyaXRlIHRoZSB3aWR0aCBvZiB0aGUgY2FudmFzIHRvIHRoZSB3aWR0aCBvZiB0aGUgVUkgZWxlbWVudFxyXG4gICAgICAgIC8vIHRoZSB3aWR0aCArIDIgcmVtb3ZlcyB0aGUgc21hbGwgZ2FwIGxlZnQgb24gdGhlIHJpZ2h0LCB3aGljaCBpcyB0aGVyZSBmb3IgYW4gdW5rbm93biByZWFzb25cclxuICAgICAgICB0aGlzLmRpdi5zdHlsZSA9IFwid2lkdGg6XCIgKyAod2lkdGggKyAyKSArIFwicHhcIjtcclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD11aS5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9idWlsZC91aS5qc1xuLy8gbW9kdWxlIGlkID0gMTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgRHJhdywgRHJhd1N0YXRlIH0gZnJvbSBcIi4uL2RyYXdpbmcvZHJhd1wiO1xyXG5pbXBvcnQgKiBhcyBMaW1pdCBmcm9tIFwiLi4vbGltaXRlcnMvaW5kZXhcIjtcclxuaW1wb3J0IHsgR2FtZVN0YXRlIH0gZnJvbSBcIi4uL2dhbWVTdGF0ZUNvbnRyb2xsZXJcIjtcclxuaW1wb3J0IHsgQ2FydGVzaWFuQ29vcmRzIH0gZnJvbSBcIi4uL2NhcnRlc2lhbkNvb3Jkc1wiO1xyXG5pbXBvcnQgeyBUYW5rLCBUYW5rSGVhbHRoU3RhdGUgfSBmcm9tIFwiLi4vZ2FtZU9iamVjdHMvdGFua1wiO1xyXG5leHBvcnQgY2xhc3MgTW92aW5nU3RhdGUge1xyXG4gICAgY29uc3RydWN0b3IoY29udHJvbGxlciwgY29udGV4dCwgcGxheWVyKSB7XHJcbiAgICAgICAgdGhpcy5zdGFydE1vdmVtZW50ID0gKGUpID0+IHtcclxuICAgICAgICAgICAgLy8gbGltaXQgdGhlIHN0YXJ0IG9mIHRoZSBsaW5lIHRvIGJlIHRoZSB0YW5rXHJcbiAgICAgICAgICAgIHRoaXMuZHJhdy5sYXN0ID0gbmV3IENhcnRlc2lhbkNvb3Jkcyh0aGlzLmFjdGl2ZS5wb3NpdGlvbi5YLCB0aGlzLmFjdGl2ZS5wb3NpdGlvbi5ZKTtcclxuICAgICAgICAgICAgLy8gbGltaXQgdGhlIGxlbmd0aCBvZiB0aGUgbGluZSB0byB0aGUgbWF4aW11bSBhbGxvd2VkIHRhbmsgbW92ZW1lbnQsIGFuZCBkaXNhYmxlZCB0YW5rcyBjYW4ndCBiZSBtb3ZlZFxyXG4gICAgICAgICAgICBpZiAodGhpcy5saW5lLmluKHRoaXMuYWN0aXZlLnBvc2l0aW9uLCB0aGlzLmRyYXcubW91c2UpICYmIHRoaXMuYWN0aXZlLnRhbmsuaGVhbHRoX3N0YXRlICE9PSBUYW5rSGVhbHRoU3RhdGUuRElTQUJMRUQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhdy5zdGF0ZSA9IERyYXdTdGF0ZS5EUkFXSU5HO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52YWxpZE1vdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5lbmRNb3ZlbWVudCA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIHJlc2V0IHRoZSBsaW5lIGxpbWl0IGFzIHRoZSB1c2VyIGhhcyBsZXQgZ28gb2YgdGhlIGJ1dHRvblxyXG4gICAgICAgICAgICB0aGlzLmxpbmUucmVzZXQoKTtcclxuICAgICAgICAgICAgLy8gb25seSBhY3QgaWYgdGhlIHBvc2l0aW9uIGlzIHZhbGlkXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmFjdGl2ZS52YWxpZF9wb3NpdGlvbikge1xyXG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIHRoZSBwb3NpdGlvbiBvZiB0aGUgdGFuayBpbiB0aGUgcGxheWVyIGFycmF5XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllci50YW5rc1t0aGlzLmFjdGl2ZS5pZF0ucG9zaXRpb24gPSB0aGlzLmRyYXcubW91c2UuY29weSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLnNob3dVc2VyV2FybmluZyhcIlwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudHVybi50YWtlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMudHVybi5vdmVyKCkpIHtcclxuICAgICAgICAgICAgICAgIC8vIHRoaXMgd2FzIHRoZSBsYXN0IHR1cm4sIGdvIHRvIHNob290aW5nIGFmdGVyd2FyZHNcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5zaGFyZWQubmV4dC5zZXQoR2FtZVN0YXRlLlRBTktfU0hPT1RJTkcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gY29tZSBiYWNrIHRvIG1vdmluZyBhZnRlciBzZWxlY3Rpb25cclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5zaGFyZWQubmV4dC5zZXQoR2FtZVN0YXRlLlRBTktfTU9WSU5HKTtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnRpbnVlIHRoZSB0dXJuIHRoZSBuZXh0IHRpbWUgdGhpcyBzdGF0ZSBpcyBhY2Nlc3NlZFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLnNoYXJlZC50dXJuLnNldCh0aGlzLnR1cm4pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZHJhdy5zdGF0ZSA9IERyYXdTdGF0ZS5TVE9QUEVEO1xyXG4gICAgICAgICAgICAvLyByZWRyYXcgY2FudmFzIHdpdGggYWxsIGN1cnJlbnQgdGFua3NcclxuICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLnJlZHJhd0NhbnZhcyh0aGlzLmRyYXcpO1xyXG4gICAgICAgICAgICAvLyBnbyB0byB0YW5rIHNlbGVjdGlvbiBzdGF0ZVxyXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuY2hhbmdlR2FtZVN0YXRlKEdhbWVTdGF0ZS5UQU5LX1NFTEVDVElPTik7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmRyYXdNb3ZlTGluZSA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhdy51cGRhdGVNb3VzZVBvc2l0aW9uKGUpO1xyXG4gICAgICAgICAgICAvLyBkcmF3IHRoZSBtb3ZlbWVudCBsaW5lIGlmIHRoZSBtb3VzZSBidXR0b24gaXMgY3VycmVudGx5IGJlaW5nIHByZXNzZWRcclxuICAgICAgICAgICAgaWYgKHRoaXMuZHJhdy5zdGF0ZSA9PSBEcmF3U3RhdGUuRFJBV0lORykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGluZS5pbih0aGlzLmFjdGl2ZS5wb3NpdGlvbiwgdGhpcy5kcmF3Lm1vdXNlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFsaWRNb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZS52YWxpZF9wb3NpdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIgPSBjb250cm9sbGVyO1xyXG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBwbGF5ZXI7XHJcbiAgICAgICAgdGhpcy5kcmF3ID0gbmV3IERyYXcoKTtcclxuICAgICAgICB0aGlzLmxpbmUgPSBuZXcgTGltaXQuTGVuZ3RoKFRhbmsuTU9WRU1FTlRfUkFOR0UpO1xyXG4gICAgICAgIC8vIGlmIHRoaXMgaXMgdGhlIGZpcnN0IHR1cm5cclxuICAgICAgICBpZiAoIXRoaXMuY29udHJvbGxlci5zaGFyZWQudHVybi5hdmFpbGFibGUoKSkge1xyXG4gICAgICAgICAgICAvLyBsaW1pdCB0aGUgbnVtYmVyIG9mIGFjdGlvbnMgdG8gaG93IG1hbnkgdGFua3MgdGhlIHBsYXllciBoYXNcclxuICAgICAgICAgICAgdGhpcy50dXJuID0gbmV3IExpbWl0LkFjdGlvbnModGhpcy5wbGF5ZXIuYWN0aXZlVGFua3MoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnR1cm4gPSB0aGlzLmNvbnRyb2xsZXIuc2hhcmVkLnR1cm4uZ2V0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5jb250cm9sbGVyLnNoYXJlZC5hY3RpdmUuZ2V0KCk7XHJcbiAgICB9XHJcbiAgICBhZGRFdmVudExpc3RlbmVycyhjYW52YXMpIHtcclxuICAgICAgICBjYW52YXMub25tb3VzZWRvd24gPSB0aGlzLnN0YXJ0TW92ZW1lbnQ7XHJcbiAgICAgICAgY2FudmFzLm9ubW91c2Vtb3ZlID0gdGhpcy5kcmF3TW92ZUxpbmU7XHJcbiAgICAgICAgLy8gTk9URTogbW91c2V1cCBpcyBvbiB0aGUgd2hvbGUgd2luZG93LCBzbyB0aGF0IGV2ZW4gaWYgdGhlIGN1cnNvciBleGl0cyB0aGUgY2FudmFzLCB0aGUgZXZlbnQgd2lsbCB0cmlnZ2VyXHJcbiAgICAgICAgd2luZG93Lm9ubW91c2V1cCA9IHRoaXMuZW5kTW92ZW1lbnQ7XHJcbiAgICAgICAgLy8gY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLnRvdWNoTW92ZSwgZmFsc2UpO1xyXG4gICAgICAgIC8vIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMubW91c2VVcCwgZmFsc2UpO1xyXG4gICAgICAgIC8vIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLnRvdWNoTW92ZSwgZmFsc2UpO1xyXG4gICAgfVxyXG4gICAgdmFsaWRNb3ZlKCkge1xyXG4gICAgICAgIHRoaXMuYWN0aXZlLnZhbGlkX3Bvc2l0aW9uID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmRyYXcubW91c2VMaW5lKHRoaXMuY29udGV4dCwgVGFuay5NT1ZFTUVOVF9MSU5FX1dJRFRILCBUYW5rLk1PVkVNRU5UX0xJTkVfQ09MT1IpO1xyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1vdmluZy5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9idWlsZC9nYW1lU3RhdGVzL21vdmluZy5qc1xuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGNsYXNzIEFjdGlvbnMge1xyXG4gICAgY29uc3RydWN0b3IobGltaXQgPSA1KSB7XHJcbiAgICAgICAgdGhpcy5saW1pdCA9IGxpbWl0O1xyXG4gICAgICAgIHRoaXMubnVtX2FjdGlvbnMgPSAwO1xyXG4gICAgfVxyXG4gICAgdGFrZSgpIHtcclxuICAgICAgICB0aGlzLm51bV9hY3Rpb25zICs9IDE7XHJcbiAgICB9XHJcbiAgICBlbmQoKSB7XHJcbiAgICAgICAgdGhpcy5udW1fYWN0aW9ucyArPSAxO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiVHVybiBcIiwgdGhpcy5udW1fYWN0aW9ucywgXCIgb3V0IG9mIFwiLCB0aGlzLmxpbWl0KTtcclxuICAgICAgICByZXR1cm4gdGhpcy5udW1fYWN0aW9ucyA+PSB0aGlzLmxpbWl0O1xyXG4gICAgfVxyXG4gICAgb3ZlcigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5udW1fYWN0aW9ucyA+PSB0aGlzLmxpbWl0O1xyXG4gICAgfVxyXG4gICAgbmV4dCgpIHtcclxuICAgICAgICB0aGlzLm51bV9hY3Rpb25zID0gMDtcclxuICAgICAgICB0aGlzLnR1cm5zICs9IDE7XHJcbiAgICB9XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YWN0aW9uLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2J1aWxkL2xpbWl0ZXJzL2FjdGlvbi5qc1xuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgVGFua3NNYXRoIH0gZnJvbSBcIi4uL3RhbmtzTWF0aFwiO1xyXG5leHBvcnQgY2xhc3MgU3BlZWQge1xyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWFsdGVzIGFuZCBrZWVwcyB0cmFjayBvZiB0aGUgdG90YWwgbGVuZ3RoIG9mIGEgbGluZS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gbGltaXQgTWF4aW11bSBsZW5ndGggb2YgZWFjaCBsaW5lLCBpbiBjYW52YXMgcGl4ZWxzXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGxpbWl0ID0gMjApIHtcclxuICAgICAgICB0aGlzLmxpbWl0ID0gbGltaXQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIGlmIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIHRoZSB0d28gcG9pbnRzIGlzIGdyZWF0ZXIgdGhhbiB0aGUgbGltaXQuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHN0YXJ0IFN0YXJ0IGNvb3JkaW5hdGVzXHJcbiAgICAgKiBAcGFyYW0gZW5kIEVuZCBjb29yZGluYXRlc1xyXG4gICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgZGlzdGFuY2UgaXMgZ3JlYXRlciB0aGFuIHRoZSBsaW1pdCwgZmFsc2Ugb3RoZXJ3aXNlXHJcbiAgICAgKi9cclxuICAgIGVub3VnaChzdGFydCwgZW5kKSB7XHJcbiAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBUYW5rc01hdGgucG9pbnQuZGlzdDJkKHN0YXJ0LCBlbmQpO1xyXG4gICAgICAgIHJldHVybiBkaXN0YW5jZSA+PSB0aGlzLmxpbWl0O1xyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNwZWVkLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2J1aWxkL2xpbWl0ZXJzL3NwZWVkLmpzXG4vLyBtb2R1bGUgaWQgPSAxM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBUYW5rc01hdGggfSBmcm9tIFwiLi4vdGFua3NNYXRoXCI7XHJcbmV4cG9ydCBjbGFzcyBMZW5ndGgge1xyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWFsdGVzIGFuZCBrZWVwcyB0cmFjayBvZiB0aGUgdG90YWwgbGVuZ3RoIG9mIGEgbGluZS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gbGltaXQgTWF4aW11bSBsZW5ndGggb2YgZWFjaCBsaW5lLCBpbiBjYW52YXMgcGl4ZWxzXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGxpbWl0ID0gMjAwKSB7XHJcbiAgICAgICAgdGhpcy5saW1pdCA9IGxpbWl0O1xyXG4gICAgICAgIHRoaXMuY3VycmVudCA9IDA7XHJcbiAgICB9XHJcbiAgICByZXNldCgpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnQgPSAwO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGUgZGlzdGFuY2Ugb2YgQ2FydGVzaWFuIGNvb3JkaW5hdGVzLCBhbmQgaW5jcmVtZW50IHRoZSB0b3RhbCBsZW5ndGggb2YgdGhlIGxpbmUuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHN0YXJ0IFN0YXJ0IGNvb3JkaW5hdGVzXHJcbiAgICAgKiBAcGFyYW0gZW5kIEVuZCBjb29yZGluYXRlc1xyXG4gICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgbGluZSBpcyBiZWxvdyB0aGUgbGltaXQsIGZhbHNlIGlmIHRoZSBsaW5lIGlzIGxvbmdlciB0aGFuIHRoZSBsaW1pdFxyXG4gICAgICovXHJcbiAgICBhZGQoc3RhcnQsIGVuZCkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudCArPSBUYW5rc01hdGgucG9pbnQuZGlzdDJkKHN0YXJ0LCBlbmQpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiU2hvdCB0b3RhbCBkaXN0YW5jZTogXCIsIHRoaXMuY3VycmVudCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudCA8PSB0aGlzLmxpbWl0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayBpZiB0aGUgZGlzdGFuY2UgYmV0d2VlbiB0aGUgdHdvIHBvaW50cyBpcyBncmVhdGVyIHRoYW4gdGhlIGxpbWl0LlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBzdGFydCBTdGFydCBjb29yZGluYXRlc1xyXG4gICAgICogQHBhcmFtIGVuZCBFbmQgY29vcmRpbmF0ZXNcclxuICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIGxpbmUgaXMgYmVsb3cgdGhlIGxpbWl0LCBmYWxzZSBvdGhlcndpc2VcclxuICAgICAqL1xyXG4gICAgaW4oc3RhcnQsIGVuZCkge1xyXG4gICAgICAgIGNvbnN0IGRpc3RhbmNlID0gVGFua3NNYXRoLnBvaW50LmRpc3QyZChzdGFydCwgZW5kKTtcclxuICAgICAgICByZXR1cm4gZGlzdGFuY2UgPD0gdGhpcy5saW1pdDtcclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1sZW5ndGguanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYnVpbGQvbGltaXRlcnMvbGVuZ3RoLmpzXG4vLyBtb2R1bGUgaWQgPSAxNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBHYW1lU3RhdGUgfSBmcm9tIFwiLi4vZ2FtZVN0YXRlQ29udHJvbGxlclwiO1xyXG5pbXBvcnQgeyBUYW5rIH0gZnJvbSBcIi4uL2dhbWVPYmplY3RzL3RhbmtcIjtcclxuaW1wb3J0IHsgRHJhdyB9IGZyb20gXCIuLi9kcmF3aW5nL2RyYXdcIjtcclxuaW1wb3J0ICogYXMgTGltaXQgZnJvbSBcIi4uL2xpbWl0ZXJzL2luZGV4XCI7XHJcbmV4cG9ydCBjbGFzcyBQbGFjaW5nU3RhdGUge1xyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGNvbnRyb2xsZXIgVGhlIGV2ZW50cyBjb250cm9sbGVyLCB3aGljaCBpcyB1c2VkIHRvIGNoYW5nZSB0aGUgZ2FtZSBzdGF0ZSBhZnRlciB0aGlzIGV2ZW50IGlzIGZpbmlzaGVkLlxyXG4gICAgICogQHBhcmFtIGNvbnRleHQgQ29udGV4dCBvbiB3aGljaCB0aGUgb2JqZWN0cyBhcmUgZHJhd25cclxuICAgICAqIEBwYXJhbSBwbGF5ZXJcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoY29udHJvbGxlciwgY29udGV4dCwgcGxheWVyKSB7XHJcbiAgICAgICAgdGhpcy5hZGRUYW5rID0gKGUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5kcmF3LnVwZGF0ZU1vdXNlUG9zaXRpb24oZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHRhbmsgPSBuZXcgVGFuayh0aGlzLnBsYXllci50YW5rcy5sZW5ndGggKyAxLCB0aGlzLnBsYXllciwgdGhpcy5kcmF3Lm1vdXNlLlgsIHRoaXMuZHJhdy5tb3VzZS5ZKTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIudGFua3MucHVzaCh0YW5rKTtcclxuICAgICAgICAgICAgdGFuay5kcmF3KHRoaXMuY29udGV4dCwgdGhpcy5kcmF3KTtcclxuICAgICAgICAgICAgLy8gaWYgd2UndmUgcGxhY2VkIGFzIG1hbnkgb2JqZWN0cyBhcyBhbGxvd2VkLCB0aGVuIGdvIHRvIG5leHQgc3RhdGVcclxuICAgICAgICAgICAgaWYgKHRoaXMudHVybi5lbmQoKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLnNoYXJlZC5uZXh0LnNldChHYW1lU3RhdGUuVEFOS19TRUxFQ1RJT04pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLmNoYW5nZUdhbWVTdGF0ZShHYW1lU3RhdGUuVEFOS19QTEFDSU5HKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyID0gY29udHJvbGxlcjtcclxuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xyXG4gICAgICAgIHRoaXMuZHJhdyA9IG5ldyBEcmF3KCk7XHJcbiAgICAgICAgdGhpcy50dXJuID0gbmV3IExpbWl0LkFjdGlvbnMoNSk7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBwbGF5ZXI7XHJcbiAgICB9XHJcbiAgICBhZGRFdmVudExpc3RlbmVycyhjYW52YXMpIHtcclxuICAgICAgICBjYW52YXMub25tb3VzZWRvd24gPSB0aGlzLmFkZFRhbms7XHJcbiAgICB9XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGxhY2luZy5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9idWlsZC9nYW1lU3RhdGVzL3BsYWNpbmcuanNcbi8vIG1vZHVsZSBpZCA9IDE1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IEdhbWVTdGF0ZSB9IGZyb20gXCIuLi9nYW1lU3RhdGVDb250cm9sbGVyXCI7XHJcbmltcG9ydCB7IERyYXcsIERyYXdTdGF0ZSB9IGZyb20gXCIuLi9kcmF3aW5nL2RyYXdcIjtcclxuaW1wb3J0ICogYXMgTGltaXQgZnJvbSBcIi4uL2xpbWl0ZXJzL2luZGV4XCI7XHJcbmltcG9ydCB7IFRhbmsgfSBmcm9tIFwiLi4vZ2FtZU9iamVjdHMvdGFua1wiO1xyXG5pbXBvcnQgeyBDYXJ0ZXNpYW5Db29yZHMgfSBmcm9tIFwiLi4vY2FydGVzaWFuQ29vcmRzXCI7XHJcbmltcG9ydCB7IFRhbmtzTWF0aCB9IGZyb20gXCIuLi90YW5rc01hdGhcIjtcclxuaW1wb3J0IHsgTGluZVBhdGggfSBmcm9tIFwiLi4vbGluZVBhdGhcIjtcclxuZXhwb3J0IGNsYXNzIFNob290aW5nU3RhdGUge1xyXG4gICAgY29uc3RydWN0b3IoY29udHJvbGxlciwgY29udGV4dCwgcGxheWVyKSB7XHJcbiAgICAgICAgLyoqIFdoZXRoZXIgdGhlIHNob3Qgd2FzIHN1Y2Nlc3NmdWxseSBmaXJlZCwgd2lsbCBiZSBzZXQgdG8gdHJ1ZSBpZiB0aGUgc2hvdCBpcyBmYXN0IGVub3VnaCAqL1xyXG4gICAgICAgIHRoaXMuc3VjY2Vzc2Z1bF9zaG90ID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5zdGFydFNob290aW5nID0gKGUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5kcmF3LnVwZGF0ZU1vdXNlUG9zaXRpb24oZSk7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhdy5sYXN0ID0gbmV3IENhcnRlc2lhbkNvb3Jkcyh0aGlzLmFjdGl2ZS5wb3NpdGlvbi5YLCB0aGlzLmFjdGl2ZS5wb3NpdGlvbi5ZKTtcclxuICAgICAgICAgICAgLy8gcmVzZXRzIHRoZSBzdWNjZXNzZnVsIHNob3QgZmxhZ1xyXG4gICAgICAgICAgICB0aGlzLnN1Y2Nlc3NmdWxfc2hvdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAvLyB0aGUgcGxheWVyIG11c3Qgc3RhcnQgc2hvb3RpbmcgZnJvbSB0aGUgdGFua1xyXG4gICAgICAgICAgICBjb25zdCB0YW5rID0gdGhpcy5wbGF5ZXIudGFua3NbdGhpcy5hY3RpdmUuaWRdO1xyXG4gICAgICAgICAgICBpZiAoVGFua3NNYXRoLnBvaW50LmNvbGxpZGVfY2lyY2xlKHRoaXMuZHJhdy5tb3VzZSwgdGFuay5wb3NpdGlvbiwgVGFuay5XSURUSCkpIHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBtb3VzZSBpcyB3aXRoaW4gdGhlIHRhbmtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRhbmtfcm9hbWluZ19sZW5ndGguaW4odGhpcy5hY3RpdmUucG9zaXRpb24sIHRoaXMuZHJhdy5tb3VzZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBzaG90IGNvbGxpc2lvbiBzdGFydHMgZnJvbSB0aGUgY2VudHJlIG9mIHRoZSB0YW5rXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG90X3BhdGgucG9pbnRzLnB1c2godGhpcy5hY3RpdmUucG9zaXRpb24uY29weSgpKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXcuc3RhdGUgPSBEcmF3U3RhdGUuRFJBV0lORztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbGlkUmFuZ2UoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ2xpY2sgZGlkIG5vdCBjb2xsaWRlIHdpdGggdGhlIGFjdGl2ZSB0YW5rXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmNvbnRpbnVlU2hvb3RpbmcgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmRyYXcudXBkYXRlTW91c2VQb3NpdGlvbihlKTtcclxuICAgICAgICAgICAgLy8gZHJhdyB0aGUgbW92ZW1lbnQgbGluZSBpZiB0aGUgbW91c2UgYnV0dG9uIGlzIGN1cnJlbnRseSBiZWluZyBwcmVzc2VkXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRyYXcuc3RhdGUgPT0gRHJhd1N0YXRlLkRSQVdJTkcpIHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBwbGF5ZXIgaXMganVzdCBtb3ZpbmcgYWJvdXQgb24gdGhlIHRhbmsncyBzcGFjZVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudGFua19yb2FtaW5nX2xlbmd0aC5pbih0aGlzLmFjdGl2ZS5wb3NpdGlvbiwgdGhpcy5kcmF3Lm1vdXNlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUm9hbWluZyBpbiB0YW5rIHNwYWNlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5zaG93VXNlcldhcm5pbmcoXCJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52YWxpZFJhbmdlKCk7XHJcbiAgICAgICAgICAgICAgICB9IC8vIGlmIHRoZSBwbGF5ZXIgaGFzIHNob3QgZmFyIGF3YXkgc3RhcnQgZHJhd2luZyB0aGUgbGluZVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5zaG90X3NwZWVkLmVub3VnaCh0aGlzLmFjdGl2ZS5wb3NpdGlvbiwgdGhpcy5kcmF3Lm1vdXNlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2hvb3RpbmchXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5zaG93VXNlcldhcm5pbmcoXCJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52YWxpZFJhbmdlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gb25seSBhZGQgdG8gdGhlIHNob3QgcGF0aCBpZiB0aGUgc2hvdCB3YXMgc3VjY2Vzc2Z1bFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvdF9wYXRoLnBvaW50cy5wdXNoKHRoaXMuZHJhdy5tb3VzZS5jb3B5KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBzaG90IGhhcyByZWFjaGVkIHRoZSBtYXggYWxsb3dlZCBsaW1pdCB3ZSBzdG9wIHRoZSBkcmF3aW5nLCB0aGlzIGlzIGFuIGFydGlmaWNpYWxcclxuICAgICAgICAgICAgICAgICAgICAvLyBsaW1pdGF0aW9uIHRvIHN0b3AgYSBzaG90IHRoYXQgZ29lcyBhbG9uZyB0aGUgd2hvbGUgc2NyZWVuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnNob3RfbGVuZ3RoLmFkZCh0aGlzLmFjdGl2ZS5wb3NpdGlvbiwgdGhpcy5kcmF3Lm1vdXNlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlN1Y2Nlc3NmdWwgc2hvdCFcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3VjY2Vzc2Z1bF9zaG90ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmF3LnN0YXRlID0gRHJhd1N0YXRlLlNUT1BQRUQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLnNob3dVc2VyV2FybmluZyhcIlNob290aW5nIHRvbyBzbG93IVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNob290aW5nIHRvbyBzbG93IVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXcuc3RhdGUgPSBEcmF3U3RhdGUuU1RPUFBFRDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5zdG9wU2hvb3RpbmcgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zdWNjZXNzZnVsX3Nob3QpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvdF9wYXRoLmxpc3QoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5jb2xsaWRlKHRoaXMuc2hvdF9wYXRoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5jYWNoZUxpbmUodGhpcy5zaG90X3BhdGgpO1xyXG4gICAgICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgICAgIC8vIGhlcmUgd2Ugd2lsbCBkbyBjb2xsaXNpb24gZGV0ZWN0aW9uIGFsb25nIHRoZSBsaW5lXHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgdGhpcy50dXJuLnRha2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy50dXJuLm92ZXIoKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLm5leHRfcGxheWVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5zaGFyZWQubmV4dC5zZXQoR2FtZVN0YXRlLlRBTktfU0VMRUNUSU9OKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5zaGFyZWQudHVybi5zZXQodGhpcy50dXJuKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5zaGFyZWQubmV4dC5zZXQoR2FtZVN0YXRlLlRBTktfU0hPT1RJTkcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZHJhdy5zdGF0ZSA9IERyYXdTdGF0ZS5TVE9QUEVEO1xyXG4gICAgICAgICAgICAvLyByZWRyYXcgY2FudmFzIHdpdGggYWxsIGN1cnJlbnQgdGFua3NcclxuICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLnJlZHJhd0NhbnZhcyh0aGlzLmRyYXcpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuY2hhbmdlR2FtZVN0YXRlKEdhbWVTdGF0ZS5UQU5LX1NFTEVDVElPTik7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIgPSBjb250cm9sbGVyO1xyXG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBwbGF5ZXI7XHJcbiAgICAgICAgdGhpcy5zaG90X3BhdGggPSBuZXcgTGluZVBhdGgoKTtcclxuICAgICAgICB0aGlzLmRyYXcgPSBuZXcgRHJhdygpO1xyXG4gICAgICAgIHRoaXMudGFua19yb2FtaW5nX2xlbmd0aCA9IG5ldyBMaW1pdC5MZW5ndGgoVGFuay5TSE9PVElOR19ERUFEWk9ORSk7XHJcbiAgICAgICAgdGhpcy5zaG90X2xlbmd0aCA9IG5ldyBMaW1pdC5MZW5ndGgoVGFuay5TSE9PVElOR19SQU5HRSk7XHJcbiAgICAgICAgdGhpcy5zaG90X3NwZWVkID0gbmV3IExpbWl0LlNwZWVkKFRhbmsuU0hPT1RJTkdfU1BFRUQpO1xyXG4gICAgICAgIGlmICghdGhpcy5jb250cm9sbGVyLnNoYXJlZC50dXJuLmF2YWlsYWJsZSgpKSB7XHJcbiAgICAgICAgICAgIC8vIGxpbWl0IHRoZSBudW1iZXIgb2YgYWN0aW9ucyB0byBob3cgbWFueSB0YW5rcyB0aGUgcGxheWVyIGhhc1xyXG4gICAgICAgICAgICB0aGlzLnR1cm4gPSBuZXcgTGltaXQuQWN0aW9ucyh0aGlzLnBsYXllci5hY3RpdmVUYW5rcygpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudHVybiA9IHRoaXMuY29udHJvbGxlci5zaGFyZWQudHVybi5nZXQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmNvbnRyb2xsZXIuc2hhcmVkLmFjdGl2ZS5nZXQoKTtcclxuICAgIH1cclxuICAgIGFkZEV2ZW50TGlzdGVuZXJzKGNhbnZhcykge1xyXG4gICAgICAgIGNhbnZhcy5vbm1vdXNlZG93biA9IHRoaXMuc3RhcnRTaG9vdGluZztcclxuICAgICAgICBjYW52YXMub25tb3VzZW1vdmUgPSB0aGlzLmNvbnRpbnVlU2hvb3Rpbmc7XHJcbiAgICAgICAgd2luZG93Lm9ubW91c2V1cCA9IHRoaXMuc3RvcFNob290aW5nO1xyXG4gICAgfVxyXG4gICAgdmFsaWRSYW5nZSgpIHtcclxuICAgICAgICB0aGlzLmRyYXcubW91c2VMaW5lKHRoaXMuY29udGV4dCwgVGFuay5NT1ZFTUVOVF9MSU5FX1dJRFRILCBUYW5rLk1PVkVNRU5UX0xJTkVfQ09MT1IpO1xyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNob290aW5nLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2J1aWxkL2dhbWVTdGF0ZXMvc2hvb3RpbmcuanNcbi8vIG1vZHVsZSBpZCA9IDE2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydCBjbGFzcyBMaW5lUGF0aCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnBvaW50cyA9IFtdO1xyXG4gICAgfVxyXG4gICAgbGlzdCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlBvaW50cyBmb3IgdGhlIHNob3Q6IFwiLCB0aGlzLnBvaW50cy5qb2luKFwiLCBcIikpO1xyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxpbmVQYXRoLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2J1aWxkL2xpbmVQYXRoLmpzXG4vLyBtb2R1bGUgaWQgPSAxN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBHYW1lU3RhdGUgfSBmcm9tIFwiLi4vZ2FtZVN0YXRlQ29udHJvbGxlclwiO1xyXG5pbXBvcnQgeyBUYW5rc01hdGggfSBmcm9tIFwiLi4vdGFua3NNYXRoXCI7XHJcbmltcG9ydCB7IERyYXcgfSBmcm9tIFwiLi4vZHJhd2luZy9kcmF3XCI7XHJcbmltcG9ydCB7IFRhbmssIFRhbmtIZWFsdGhTdGF0ZSB9IGZyb20gXCIuLi9nYW1lT2JqZWN0cy90YW5rXCI7XHJcbmltcG9ydCB7IEFjdGl2ZVRhbmsgfSBmcm9tIFwiLi9zaGFyZWRTdGF0ZVwiO1xyXG5leHBvcnQgY2xhc3MgU2VsZWN0aW9uU3RhdGUge1xyXG4gICAgY29uc3RydWN0b3IoY29udHJvbGxlciwgY29udGV4dCwgcGxheWVyKSB7XHJcbiAgICAgICAgdGhpcy5oaWdobGlnaHRUYW5rID0gKGUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5kcmF3LnVwZGF0ZU1vdXNlUG9zaXRpb24oZSk7XHJcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSB1c2VyIGhhcyBjbGlja2VkIGFueSB0YW5rLlxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IFtpZCwgdGFua10gb2YgdGhpcy5wbGF5ZXIudGFua3MuZW50cmllcygpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBkZWFkIHRhbmtzIGNhbid0IGJlIHNlbGVjdGVkXHJcbiAgICAgICAgICAgICAgICBpZiAoVGFua3NNYXRoLnBvaW50LmNvbGxpZGVfY2lyY2xlKHRoaXMuZHJhdy5tb3VzZSwgdGFuay5wb3NpdGlvbiwgVGFuay5XSURUSCkgJiYgdGFuay5oZWFsdGhfc3RhdGUgIT09IFRhbmtIZWFsdGhTdGF0ZS5ERUFEKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaGlnaGxpZ2h0IHRoZSBzZWxlY3RlZCB0YW5rXHJcbiAgICAgICAgICAgICAgICAgICAgdGFuay5oaWdobGlnaHQodGhpcy5jb250ZXh0LCB0aGlzLmRyYXcpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHN0b3JlIHRoZSBkZXRhaWxzIG9mIHRoZSBhY3RpdmUgdGFua1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5zaGFyZWQuYWN0aXZlLnNldChuZXcgQWN0aXZlVGFuayhpZCwgdGFuay5wb3NpdGlvbiwgdGFuaykpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIG9ubHkgaGlnaGxpZ2h0IHRoZSBmaXJzdCB0YW5rXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMubW91c2VVcCA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIGlmIHRoZSB1c2VyIGhhcyBjbGlja2VkIG9uIGFueSBvZiB0aGUgb2JqZWN0cywgZ28gaW50byBtb3ZlbWVudCBzdGF0ZVxyXG4gICAgICAgICAgICBpZiAodGhpcy5jb250cm9sbGVyLnNoYXJlZC5hY3RpdmUuYXZhaWxhYmxlKCkpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRyb2xsZXIuc2hhcmVkLm5leHQuYXZhaWxhYmxlKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuY2hhbmdlR2FtZVN0YXRlKHRoaXMuY29udHJvbGxlci5zaGFyZWQubmV4dC5nZXQoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuY2hhbmdlR2FtZVN0YXRlKEdhbWVTdGF0ZS5UQU5LX01PVklORyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuY29udHJvbGxlciA9IGNvbnRyb2xsZXI7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcclxuICAgICAgICB0aGlzLnBsYXllciA9IHBsYXllcjtcclxuICAgICAgICB0aGlzLmRyYXcgPSBuZXcgRHJhdygpO1xyXG4gICAgfVxyXG4gICAgYWRkRXZlbnRMaXN0ZW5lcnMoY2FudmFzKSB7XHJcbiAgICAgICAgY2FudmFzLm9ubW91c2Vkb3duID0gdGhpcy5oaWdobGlnaHRUYW5rO1xyXG4gICAgICAgIC8vIE5PVEU6IG1vdXNldXAgaXMgb24gdGhlIHdob2xlIHdpbmRvdywgc28gdGhhdCBldmVuIGlmIHRoZSBjdXJzb3IgZXhpdHMgdGhlIGNhbnZhcywgdGhlIGV2ZW50IHdpbGwgdHJpZ2dlclxyXG4gICAgICAgIHdpbmRvdy5vbm1vdXNldXAgPSB0aGlzLm1vdXNlVXA7XHJcbiAgICB9XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2VsZWN0aW9uLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2J1aWxkL2dhbWVTdGF0ZXMvc2VsZWN0aW9uLmpzXG4vLyBtb2R1bGUgaWQgPSAxOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBHYW1lU3RhdGUgfSBmcm9tIFwiLi4vZ2FtZVN0YXRlQ29udHJvbGxlclwiO1xyXG5pbXBvcnQgeyBEcmF3IH0gZnJvbSBcIi4uL2RyYXdpbmcvZHJhd1wiO1xyXG5jbGFzcyBNZW51IHtcclxuICAgIGNvbnN0cnVjdG9yKHRpdGxlLCBvcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5maW5hbF9oZWlnaHQgPSAtMTtcclxuICAgICAgICB0aGlzLnN0YXJ0X2hlaWdodCA9IDE1MDtcclxuICAgICAgICB0aGlzLmhlaWdodF9pbmNyZW1lbnQgPSA3MDtcclxuICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcclxuICAgIH1cclxuICAgIGRyYXcoY29udGV4dCwgZHJhdykge1xyXG4gICAgICAgIGNvbnN0IHdpZHRoID0gY29udGV4dC5jYW52YXMud2lkdGg7XHJcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gY29udGV4dC5jYW52YXMuaGVpZ2h0O1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gXCJCbGFja1wiO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgY29udGV4dC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gXCJyZ2IoMTM1LDIwNiwyNTApXCI7XHJcbiAgICAgICAgY29udGV4dC5mb250ID0gXCI2MHB4IEdlb3JnaWFcIjtcclxuICAgICAgICBsZXQgdGV4dF9oZWlnaHQgPSB0aGlzLnN0YXJ0X2hlaWdodDtcclxuICAgICAgICBjb25zdCBjZW50cmUgPSB3aWR0aCAvIDI7XHJcbiAgICAgICAgY29udGV4dC5maWxsVGV4dCh0aGlzLnRpdGxlLCBjZW50cmUsIHRleHRfaGVpZ2h0KTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IFwiV2hpdGVcIjtcclxuICAgICAgICBjb250ZXh0LmZvbnQgPSBcIjMwcHggR2VvcmdpYVwiO1xyXG4gICAgICAgIGZvciAoY29uc3QgW2lkLCBvcHRpb25dIG9mIHRoaXMub3B0aW9ucy5lbnRyaWVzKCkpIHtcclxuICAgICAgICAgICAgdGV4dF9oZWlnaHQgKz0gdGhpcy5oZWlnaHRfaW5jcmVtZW50O1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZChpZCkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gXCJZZWxsb3dcIjtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuZm9udCA9IFwiNDBweCBHZW9yZ2lhXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IFwiV2hpdGVcIjtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuZm9udCA9IFwiMzBweCBHZW9yZ2lhXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29udGV4dC5maWxsVGV4dChvcHRpb24sIGNlbnRyZSwgdGV4dF9oZWlnaHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmZpbmFsX2hlaWdodCA9IHRleHRfaGVpZ2h0O1xyXG4gICAgfVxyXG4gICAgc2VsZWN0ZWQoaWQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZF9pdGVtID09PSBpZDtcclxuICAgIH1cclxuICAgIHNlbGVjdChtb3VzZSkge1xyXG4gICAgICAgIGlmICh0aGlzLmZpbmFsX2hlaWdodCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIG1lbnUgaGFzbid0IGJlZW4gZHJhd24uXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBhZGRzIHNvbWUgYnVmZmVyIHNwYWNlIGFyb3VuZCBlYWNoIG9wdGlvbiwgdGhpcyBtYWtlcyBpdCBlYXNpZXIgdG8gc2VsZWN0IGVhY2ggb3B0aW9uXHJcbiAgICAgICAgY29uc3QgYnVmZmVyX3NwYWNlID0gdGhpcy5oZWlnaHRfaW5jcmVtZW50IC8gMjtcclxuICAgICAgICBsZXQgY3VycmVudF9oZWlnaHQgPSB0aGlzLmZpbmFsX2hlaWdodDtcclxuICAgICAgICBsZXQgaWQgPSB0aGlzLm9wdGlvbnMubGVuZ3RoIC0gMTtcclxuICAgICAgICAvLyBjaGVjayB1cCB0byB0aGUgaGVpZ2h0IG9mIHRoZSB0aXRsZSwgdGhlcmUncyBub3QgZ29pbmcgdG8gYmUgYW55dGhpbmcgYWJvdmUgaXRcclxuICAgICAgICB3aGlsZSAoY3VycmVudF9oZWlnaHQgPiB0aGlzLnN0YXJ0X2hlaWdodCkge1xyXG4gICAgICAgICAgICBpZiAobW91c2UuWSA+IGN1cnJlbnRfaGVpZ2h0IC0gYnVmZmVyX3NwYWNlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkX2l0ZW0gPSBpZDtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBsb3dlciB0aGUgaGVpZ2h0IHRoYXQgd2UgYXJlIGNoZWNraW5nIG9uLCB0aGlzIGhhcyB0aGUgZWZmZWN0IG9mIG1vdmluZyB0aGVcclxuICAgICAgICAgICAgLy8gbWVudSBpdGVtJ3MgaGl0Ym94IGhpZ2hlciBvbiB0aGUgc2NyZWVuXHJcbiAgICAgICAgICAgIGN1cnJlbnRfaGVpZ2h0IC09IHRoaXMuaGVpZ2h0X2luY3JlbWVudDtcclxuICAgICAgICAgICAgaWQgLT0gMTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIE1lbnVTdGF0ZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb250cm9sbGVyLCBjb250ZXh0KSB7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RNZW51aXRlbSA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhdy51cGRhdGVNb3VzZVBvc2l0aW9uKGUpO1xyXG4gICAgICAgICAgICB0aGlzLm1lbnUuc2VsZWN0KHRoaXMuZHJhdy5tb3VzZSk7XHJcbiAgICAgICAgICAgIHRoaXMubWVudS5kcmF3KHRoaXMuY29udGV4dCwgdGhpcy5kcmF3KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFjdGl2YXRlcyB0aGUgc2VsZWN0ZWQgbWVudSBvcHRpb25cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmFjdGl2YXRlTWVudU9wdGlvbiA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ2hhbmdpbmcgc3RhdGUgZnJvbSBNRU5VIEVWRU5UIHRvIFRBTksgUExBQ0lOR1wiKTtcclxuICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLmNsZWFyQ2FudmFzKCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1lbnUuc2VsZWN0ZWRfaXRlbSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuY2hhbmdlR2FtZVN0YXRlKEdhbWVTdGF0ZS5UQU5LX1BMQUNJTkcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGhhbmRsZSBvdGhlciBldmVudHMsIHByb2JhYmx5IGJldHRlciB3aXRoIGEgc3dpdGNoIHN0YXRlbWVudFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyID0gY29udHJvbGxlcjtcclxuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xyXG4gICAgICAgIHRoaXMuZHJhdyA9IG5ldyBEcmF3KCk7XHJcbiAgICAgICAgdGhpcy5tZW51ID0gbmV3IE1lbnUoXCJUYW5rc1wiLCBbXCJTdGFydCBnYW1lXCIsIFwiUG90YXRvZXNcIiwgXCJBcHBsZXNcIiwgXCJJXCIsIFwiQ2hvb3NlXCIsIFwiWW91XCIsIFwiUGlrYWNodVwiXSk7XHJcbiAgICAgICAgdGhpcy5tZW51LmRyYXcodGhpcy5jb250ZXh0LCB0aGlzLmRyYXcpO1xyXG4gICAgfVxyXG4gICAgYWRkRXZlbnRMaXN0ZW5lcnMoY2FudmFzKSB7XHJcbiAgICAgICAgY2FudmFzLm9ubW91c2Vkb3duID0gdGhpcy5hY3RpdmF0ZU1lbnVPcHRpb247XHJcbiAgICAgICAgY2FudmFzLm9ubW91c2Vtb3ZlID0gdGhpcy5zZWxlY3RNZW51aXRlbTtcclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1tZW51LmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2J1aWxkL2dhbWVTdGF0ZXMvbWVudS5qc1xuLy8gbW9kdWxlIGlkID0gMTlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgVGFua0hlYWx0aFN0YXRlIH0gZnJvbSBcIi4vdGFua1wiO1xyXG5leHBvcnQgY2xhc3MgUGxheWVyIHtcclxuICAgIGNvbnN0cnVjdG9yKGlkLCBuYW1lLCBjb2xvcikge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMudGFua3MgPSBuZXcgQXJyYXkoKTtcclxuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XHJcbiAgICB9XHJcbiAgICBhY3RpdmVUYW5rcygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50YW5rcy5maWx0ZXIoKHRhbmspID0+IHRhbmsuaGVhbHRoX3N0YXRlICE9PSBUYW5rSGVhbHRoU3RhdGUuREVBRCkubGVuZ3RoO1xyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBsYXllci5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9idWlsZC9nYW1lT2JqZWN0cy9wbGF5ZXIuanNcbi8vIG1vZHVsZSBpZCA9IDIwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IENvbG9yIH0gZnJvbSBcIi4vZHJhd2luZy9jb2xvclwiO1xyXG5leHBvcnQgY2xhc3MgTGluZUNhY2hlIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBDb2xvci5ncmF5KCkudG9SR0JBKCk7XHJcbiAgICAgICAgLyoqIEhvdyBtYW55IGxpbmVzIHNob3VsZCBiZSByZWRyYXduICovXHJcbiAgICAgICAgdGhpcy5zaXplID0gMTA7XHJcbiAgICAgICAgdGhpcy5wb2ludHMgPSBbXTtcclxuICAgIH1cclxuICAgIC8qKiBSZW1vdmUgbGluZXMgdGhhdCBhcmUgb3V0c2lkZSBvZiB0aGUgY2FjaGUgc2l6ZSAqL1xyXG4gICAgbGluZXMoKSB7XHJcbiAgICAgICAgY29uc3Qgc2l6ZSA9IHRoaXMucG9pbnRzLmxlbmd0aDtcclxuICAgICAgICBpZiAoc2l6ZSA+IHRoaXMuc2l6ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wb2ludHMuc2xpY2Uoc2l6ZSAtIHRoaXMuc2l6ZSwgc2l6ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLnBvaW50cztcclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1saW5lQ2FjaGUuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYnVpbGQvbGluZUNhY2hlLmpzXG4vLyBtb2R1bGUgaWQgPSAyMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9