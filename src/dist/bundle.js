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
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return GameState; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__gameStates_movement__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__gameStates_placement__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__gameStates_shooting__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__gameStates_selection__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__gameStates_gameEnd__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__gameStates_menu__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__gameObjects_player__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__drawing_color__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__utility_lineCache__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__utility_point__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__gameCollision__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__gameSettings__ = __webpack_require__(9);












var GameState;
(function (GameState) {
    GameState[GameState["MENU"] = 0] = "MENU";
    GameState[GameState["TANK_PLACEMENT"] = 1] = "TANK_PLACEMENT";
    GameState[GameState["TANK_MOVEMENT"] = 2] = "TANK_MOVEMENT";
    GameState[GameState["TANK_SELECTION"] = 3] = "TANK_SELECTION";
    GameState[GameState["TANK_SHOOTING"] = 4] = "TANK_SHOOTING";
    GameState[GameState["GAME_END"] = 5] = "GAME_END";
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
class GameController {
    constructor(canvas, context, ui, viewport) {
        /** All the players in the game */
        this.players = [];
        /** Flag to specify if the current player's turn is over */
        this.nextPlayer = false;
        this.canvas = canvas;
        this.context = context;
        this.ui = ui;
        this.viewport = viewport;
        this.lineCache = new __WEBPACK_IMPORTED_MODULE_8__utility_lineCache__["a" /* LineCache */]();
        let playerPositions = [
            new __WEBPACK_IMPORTED_MODULE_9__utility_point__["a" /* Point */](0, 0),
            new __WEBPACK_IMPORTED_MODULE_9__utility_point__["a" /* Point */](4096, 4096)
        ];
        this.currentPlayer = 0;
        for (let i = 0; i < __WEBPACK_IMPORTED_MODULE_11__gameSettings__["a" /* NUM_PLAYERS */]; i++) {
            this.players.push(new __WEBPACK_IMPORTED_MODULE_6__gameObjects_player__["a" /* Player */](i, "Player " + (i + 1), __WEBPACK_IMPORTED_MODULE_7__drawing_color__["a" /* Color */].next(), playerPositions[i]));
        }
    }
    /**
     * The game events should be in this order:
     * Menu
     * Placing for each player
     * Repeat until game over
     *  Moving, Shooting for P1
     *  Moving, Shooting for P2
     * @param newState
     */
    changeGameState(newState) {
        this.ui.clear();
        this.state = newState;
        // clears any old events that were added
        this.canvas.onmousedown = null;
        this.canvas.onmouseup = null;
        window.onmouseup = null;
        this.canvas.onmousemove = null;
        // if the state has marked the end of the player's turn, then we go to the next player
        if (this.nextPlayer) {
            this.changePlayer();
            this.nextPlayer = false;
        }
        const player = this.players[this.currentPlayer];
        if (this.state !== GameState.MENU && this.state !== GameState.TANK_PLACEMENT && player.activeTanks().length === 0) {
            this.state = GameState.GAME_END;
        }
        console.log("This is", player.name, "playing.");
        this.ui.setPlayer(player.name);
        switch (this.state) {
            case GameState.MENU:
                this.action = new __WEBPACK_IMPORTED_MODULE_5__gameStates_menu__["a" /* MenuState */](this, this.context, this.viewport);
                console.log("Initialising MENU");
                break;
            case GameState.TANK_PLACEMENT:
                console.log("Initialising TANK PLACING");
                this.action = new __WEBPACK_IMPORTED_MODULE_1__gameStates_placement__["a" /* PlacingState */](this, this.context, this.ui, player, this.viewport);
                // force the next player after placing tanks
                this.nextPlayer = true;
                break;
            case GameState.TANK_SELECTION:
                console.log("Initialising TANK SELECTION");
                this.action = new __WEBPACK_IMPORTED_MODULE_3__gameStates_selection__["a" /* SelectionState */](this, this.context, this.ui, player, this.viewport);
                break;
            case GameState.TANK_MOVEMENT:
                console.log("Initialising TANK MOVEMENT");
                this.action = new __WEBPACK_IMPORTED_MODULE_0__gameStates_movement__["a" /* MovingState */](this, this.context, this.ui, player, this.viewport);
                break;
            case GameState.TANK_SHOOTING:
                console.log("Initialising TANK SHOOTING");
                this.action = new __WEBPACK_IMPORTED_MODULE_2__gameStates_shooting__["a" /* ShootingState */](this, this.context, this.ui, player, this.viewport);
                break;
            case GameState.GAME_END:
                console.log("Initialising GAME END");
                this.action = new __WEBPACK_IMPORTED_MODULE_4__gameStates_gameEnd__["a" /* GameEndState */](this, this.context, player, this.viewport);
                break;
            default:
                throw new Error("The game should never be in an unknown state, something has gone terribly wrong!");
        }
        // add the mouse events for the new state
        this.action.addEventListeners(this.canvas);
    }
    /** Clears everything from the canvas on the screen. To show anything afterwards it needs to be redrawn. */
    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
        for (const line_path of this.lineCache.lines()) {
            for (let i = 1; i < line_path.points.length; i++) {
                // old lines are currently half-transparent
                draw.line(this.context, line_path.points[i - 1], line_path.points[i], 1, old_lines_color);
            }
        }
    }
    collide(line) {
        console.log("-------------------- Starting Collision -------------------");
        const numPoints = line.points.length;
        // for every player who isnt the current player
        for (const player of this.players.filter((p) => p.id !== this.currentPlayer)) {
            __WEBPACK_IMPORTED_MODULE_10__gameCollision__["a" /* Collision */].collide(line, numPoints, player.tanks);
        }
    }
    cacheLine(path) {
        this.lineCache.points.push(path);
    }
    showUserWarning(message) {
        document.getElementById("user-warning").innerHTML = message;
    }
    /**
     * @returns false if there are still players to take their turn, true if all players have completed their turns for the state
    */
    changePlayer() {
        if (this.currentPlayer === __WEBPACK_IMPORTED_MODULE_11__gameSettings__["a" /* NUM_PLAYERS */] - 1) {
            this.currentPlayer = 0;
            return true;
        }
        this.currentPlayer += 1;
        return false;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = GameController;

//# sourceMappingURL=gameController.js.map

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return DrawState; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utility_point__ = __webpack_require__(3);

class Draw {
    constructor() {
        this.mouse = new __WEBPACK_IMPORTED_MODULE_0__utility_point__["a" /* Point */]();
        this.last = new __WEBPACK_IMPORTED_MODULE_0__utility_point__["a" /* Point */]();
    }
    /** Draw a dot (a filled circle) around the point.
     *
     * @param context Context on which the circle will be drawn
     * @param coords Coordinates for the origin point of the circle
     * @param radius Radius of the dot
     * @param fillColor Color of the fill
     * @param outline Specify whether an outline will be drawn around the circle
     * @param strokeColor Specify color for the outline, if not specified the colour will be the same as the fill color
     */
    dot(context, coords, radius, fillColor, outline = false, strokeColor = null) {
        // Let's use black by setting RGB values to 0, and 255 alpha (completely opaque)
        // Select a fill style
        context.fillStyle = fillColor;
        context.lineWidth = radius;
        // Draw a filled circle
        context.beginPath();
        context.arc(coords.x, coords.y, radius, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();
        if (outline) {
            context.strokeStyle = strokeColor || fillColor;
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
        context.arc(coords.x, coords.y, radius, 0, Math.PI * 2, true);
        context.closePath();
        context.stroke();
    }
    /**
     * Draw a line between the last known position of the mouse, and the current position.
     * @param context The canvas context that we're drawing on
     * @param updateLast Whether to update the last position of the mouse
     */
    mouseLine(context, width, color, updateLast = true) {
        // If lastX is not set, set lastX and lastY to the current position 
        if (this.last.x == -1) {
            this.last.x = this.mouse.x;
            this.last.y = this.mouse.y;
        }
        // Select a fill style
        context.strokeStyle = color;
        // Set the line "cap" style to round, so lines at different angles can join into each other
        context.lineCap = "round";
        context.lineJoin = "round";
        // Draw a filled line
        context.beginPath();
        // First, move to the old (previous) position
        context.moveTo(this.last.x, this.last.y);
        // Now draw a line to the current touch/pointer position
        context.lineTo(this.mouse.x, this.mouse.y);
        // Set the line thickness and draw the line
        context.lineWidth = width;
        context.stroke();
        context.closePath();
        if (updateLast) {
            // Update the last position to reference the current position
            this.last.x = this.mouse.x;
            this.last.y = this.mouse.y;
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
        context.moveTo(start.x, start.y);
        // Now draw a line to the current touch/pointer position
        context.lineTo(end.x, end.y);
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
            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
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
                this.mouse.x = touch.pageX - touch.target.offsetLeft;
                this.mouse.y = touch.pageY - touch.target.offsetTop;
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
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return TankTurnState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return TankHealthState; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utility_point__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__drawing_color__ = __webpack_require__(7);


var TankTurnState;
(function (TankTurnState) {
    /** The tank has performed an action this turn, e.g. moved or shot */
    TankTurnState[TankTurnState["SHOT"] = 0] = "SHOT";
    TankTurnState[TankTurnState["MOVED"] = 1] = "MOVED";
    /** The tank hasn't performed an action this turn */
    TankTurnState[TankTurnState["NOT_ACTED"] = 2] = "NOT_ACTED";
})(TankTurnState || (TankTurnState = {}));
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
        this.activeOutline = active_outline;
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
        this.position = new __WEBPACK_IMPORTED_MODULE_0__utility_point__["a" /* Point */](x, y);
        this.healthState = TankHealthState.ALIVE;
        this.actionState = TankTurnState.NOT_ACTED;
        this.label = ""; // + "" converts to string
        // this.label = this.id + ""; // + "" converts to string
        // initialise colors for each of the tank's states
        this.color = new TankColor(__WEBPACK_IMPORTED_MODULE_1__drawing_color__["a" /* Color */].red().toRGBA(), __WEBPACK_IMPORTED_MODULE_1__drawing_color__["a" /* Color */].green().toRGBA(), __WEBPACK_IMPORTED_MODULE_1__drawing_color__["a" /* Color */].black().toRGBA(this.LABEL_OPACITY), this.player.color.toRGBA(), this.player.color.toRGBA(this.DISABLED_OPACITY), __WEBPACK_IMPORTED_MODULE_1__drawing_color__["a" /* Color */].gray().toRGBA());
    }
    draw(context, draw) {
        let [label, color] = this.uiElements();
        draw.circle(context, this.position, Tank.WIDTH, Tank.LINE_WIDTH, color);
        context.fillStyle = this.color.label;
        context.font = "16px Calibri";
        // put the text in the middle of the tank
        context.fillText(label, this.position.x, this.position.y + 5);
    }
    uiElements() {
        let color;
        let label = this.label;
        switch (this.actionState) {
            case TankTurnState.SHOT:
                label += "🚀";
                break;
            case TankTurnState.MOVED:
                label += "⚓";
                break;
        }
        switch (this.healthState) {
            case TankHealthState.ALIVE:
                color = this.color.alive;
                break;
            case TankHealthState.DISABLED:
                color = this.color.disabled;
                label += "♿";
                break;
            case TankHealthState.DEAD:
                color = this.color.dead;
                label += "💀";
                break;
        }
        return [label, color];
    }
    highlight(context, draw) {
        draw.dot(context, this.position, Tank.WIDTH, this.color.active);
        draw.circle(context, this.position, Tank.MOVEMENT_RANGE, Tank.LINE_WIDTH, this.color.activeOutline);
    }
    active() {
        return this.actionState !== TankTurnState.SHOT;
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
Tank.SHOOTING_RANGE = 409;
/** How fast must the player move for a valid shot */
Tank.SHOOTING_SPEED = 30;
/** The deadzone allowed for free mouse movement before the player shoots.
 * This means that the player can wiggle the cursor around in the tank's space
 * to prepare for the shot.
 */
Tank.SHOOTING_DEADZONE = Tank.WIDTH + 2;
//# sourceMappingURL=tank.js.map

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Point {
    constructor(x = -1, y = -1) {
        this.x = x;
        this.y = y;
    }
    copy() {
        return new Point(this.x, this.y);
    }
    toString() {
        return this.x + "," + this.y;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Point;

//# sourceMappingURL=point.js.map

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__point__ = __webpack_require__(3);

class PointMath {
    /**
     * Calculate the distance between two points, on a 2D plane using Pythogorean Theorem
     * @param start First point with 2D coordinates
     * @param end Second point with 2D coordinates
     */
    dist2d(start, end) {
        const deltaX = end.x - start.x;
        const deltaY = end.y - start.y;
        return Math.sqrt(Math.abs(deltaX * deltaX + deltaY * deltaY));
    }
    /**
     * Calculate if the point collides with the circle.
     * @param point The coordinates of the point (user's click)
     * @param center The centre of the circle
     * @param radius The radius of the circle
     * @returns true if there is collision, false otherwise
     */
    collideCircle(point, center, radius) {
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
        // as the point is guaranteed to be on the line by Line::closestPoint, we just check if the point is within the line
        const within = (start, point, end) => (start <= point && point <= end) || (end <= point && point <= start);
        return start.x !== end.x ? within(start.x, point.x, end.x) : within(start.y, point.y, end.y);
    }
}
class Line {
    /** Find the closest point on a line. The closest point to
     *
     * @param start Start point of the line
     * @param end End point of the line
     * @param point Point for which the closest point on the line will be found.
     */
    closestPoint(start, end, point) {
        const A1 = end.y - start.y, B1 = start.x - end.x;
        // turn the line ito equation of the form Ax + By = C
        const C1 = A1 * start.x + B1 * start.y;
        // find the perpendicular line that passes through the line and the outside point
        const C2 = -B1 * point.x + A1 * point.y;
        // find the determinant of the two equations algebraically
        const det = A1 * A1 + B1 * B1;
        const closestPoint = new __WEBPACK_IMPORTED_MODULE_0__point__["a" /* Point */]();
        // use Cramer's Rule to solve for the point of intersection
        if (det != 0) {
            closestPoint.x = (A1 * C1 - B1 * C2) / det;
            closestPoint.y = (A1 * C2 + B1 * C1) / det;
        }
        else {
            closestPoint.x = point.x;
            closestPoint.y = point.y;
        }
        return closestPoint;
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
    distCircleCenter(start, end, center) {
        // find the closest point to the circle, on the line
        const closestPoint = this.closestPoint(start, end, center);
        // check if the closest point is within the start and end of the line, 
        // and not somewhere along its infinite extension
        if (TanksMath.point.within(closestPoint, start, end)) {
            return TanksMath.point.dist2d(closestPoint, center);
        }
        else {
            return -1;
        }
    }
    /**
     * Check if the circle is colliding with the line
     * @param start Start coordinates of the line
     * @param end End coordinates of the line
     * @param center Center point of the circle
     * @param radius Radius of the circle
     */
    collideCircle(start, end, center, radius) {
        const dist = this.distCircleCenter(start, end, center);
        // if distance is undefined, or is further than the radius, return false
        return dist === -1 || dist > radius ? false : true;
    }
}
class TanksMath {
}
/* harmony export (immutable) */ __webpack_exports__["a"] = TanksMath;

TanksMath.point = new PointMath();
TanksMath.line = new Line();
//# sourceMappingURL=tanksMath.js.map

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * JSON to HTML parser.
 *
 * Copyright 2018 Dimitar Tasev
 *
 * Permission to use, copy, modify, and/or distribute this software for any purpose
 * with or without fee is hereby granted, provided that the above copyright notice
 * and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT,
 * OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA
 * OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION,
 * ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * @author Dimitar Tasev 2018
*/
class J2H {
    /**
    * Convert the JSON to HTML.
    * - Usage:
    * ```
    * const description = {
    *   "div":{
    *       "className":"style1",
    *       "children":[{
    *          "input":{
    *               "id": "username-input-id",
    *               "type": "text",
    *               "onclick": "my-func-name()", //or just my-func-name, without quotation marks
    *           }
    *       },{
    *           "input":{
    *               "id": "password-input-id",
    *               "type": "password"
    *           }
    *       }]
    *   }
    * }
    * ```
    * Notable syntax is:
    * - Top level element:
    * ```
    * {
    * "div":
    *      // NOTE: properties here MUST match the properties available to the HTML element
    *      "className": "...",
    *       // will do nothing, as div doesn't support title
    *      "title":"..."
    *      "..."
    * }
    * ```
    * - Child elements
    * ```
    * {
    * "div":
    *   "className": "my-div-style",
    *   // the list is used to preserve the order of the children
    *   "children":[{
    *       "a":{
    *           "text":"Apples",
    *           "className": "my-styles"
    *       }
    *   },{
    *       "input":{
    *           "className": "my-input-style"
    *       }
    *   }]
    * }
    * ```
    * @param dict Dictionary containing the description of the HTML
    */
    static parse(dict) {
        const [parent, props] = J2H.getParent(dict);
        for (const key in props) {
            if (key === "children") {
                const children = props["children"];
                if (children instanceof Array) {
                    for (const p of children) {
                        parent.appendChild(J2H.parse(p));
                    }
                }
                else {
                    parent.appendChild(J2H.parse(children));
                }
            }
            else if (key === "onclick") {
                // there's no need to do this for buttons, the onclick attribute is present for them
                parent.setAttribute("onclick", props[key]);
            }
            else {
                parent[key] = props[key];
            }
        }
        return parent;
    }
    /**
     * Create an HTML element from the key in the dictionary, return the values
     * @param dict Dictionary with 1 key, and some values
     * @returns HTMLElement of the key in the dictionary, and all of its values
     */
    static getParent(dict) {
        let parent, props;
        // get the first key in the dictionary
        for (const key in dict) {
            parent = document.createElement(key);
            props = dict[key];
        }
        return [parent, props];
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = J2H;

//# sourceMappingURL=json2html.js.map

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__action__ = __webpack_require__(14);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__action__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__speed__ = __webpack_require__(15);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_1__speed__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__length__ = __webpack_require__(16);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_2__length__["a"]; });



//# sourceMappingURL=index.js.map

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utility_stringFormat__ = __webpack_require__(8);

class Color {
    constructor(red, green, blue, alpha = 1.0) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
    toRGBA(alpha) {
        alpha = alpha !== undefined ? alpha : this.alpha;
        return __WEBPACK_IMPORTED_MODULE_0__utility_stringFormat__["a" /* S */].format("rgba(%s,%s,%s,%s)", this.red, this.green, this.blue, alpha);
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
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class S {
    static format(...a) {
        return a.reduce((p, c) => p.replace(/%s/, c));
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = S;

//# sourceMappingURL=stringFormat.js.map

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const NUM_PLAYERS = 2;
/* harmony export (immutable) */ __webpack_exports__["a"] = NUM_PLAYERS;

const NUM_TANKS = 1;
/* harmony export (immutable) */ __webpack_exports__["b"] = NUM_TANKS;

//# sourceMappingURL=gameSettings.js.map

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__siteControls__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ui__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__gameController__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__gameMap_viewport__ = __webpack_require__(27);
// Classes added to the `window` object are global, and visible inside the HTML code.
// Any classes not added to the `window` are invisible (not accessible) from the HTML.
// Global classes

window["Controls"] = __WEBPACK_IMPORTED_MODULE_0__siteControls__["a" /* default */];
// Internal classes



const ID_GAME_CANVAS = "tanks-canvas";
const ID_GAME_UI = "tanks-ui";
// Set-up the canvas and add our event handlers after the page has loaded
function init() {
    // const width = window.innerWidth - 32;
    const width = 4096;
    // take 90% of the window, leave a bit of gap on the right
    // const height = window.innerHeight * 0.9;
    const height = 4096;
    const ui = new __WEBPACK_IMPORTED_MODULE_1__ui__["a" /* Ui */](ID_GAME_UI, width);
    const canvas = document.getElementById(ID_GAME_CANVAS);
    canvas.width = width;
    canvas.height = height;
    window.onscroll = (e) => {
        ui.update(e);
    };
    const viewport = new __WEBPACK_IMPORTED_MODULE_3__gameMap_viewport__["a" /* Viewport */](canvas.width, canvas.height);
    viewport.middle();
    const controller = new __WEBPACK_IMPORTED_MODULE_2__gameController__["a" /* GameController */](canvas, canvas.getContext("2d"), ui, viewport);
    // start the game in Menu state
    controller.changeGameState(__WEBPACK_IMPORTED_MODULE_2__gameController__["b" /* GameState */].MENU);
    canvas.scrollIntoView();
}
init();
//# sourceMappingURL=main.js.map

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Controls {
    static toggle_w3_show(elem) {
        if (elem.className.indexOf("w3-show") == -1) {
            elem.className += " w3-show";
        }
        else {
            elem.className = elem.className.replace(" w3-show", "");
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
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__json2html__ = __webpack_require__(5);

class UiSection {
    constructor(elem) {
        this.parent = elem;
    }
    add(elem) {
        if (this.parent.innerHTML === "&nbsp;") {
            this.parent.innerHTML = "";
        }
        this.parent.appendChild(elem);
    }
    clear() {
        this.parent.innerHTML = "&nbsp;";
    }
    html() {
        return this.parent;
    }
}
class Ui {
    constructor(id, width) {
        this.container = document.getElementById(id);
        if (!this.container) {
            throw new Error("The UI DOM element was not found!");
        }
        this.setWidth(width);
        const left = {
            "div": {
                "className": "w3-col s1 m1 l1"
            }
        };
        this.left = new UiSection(__WEBPACK_IMPORTED_MODULE_0__json2html__["a" /* J2H */].parse(left));
        const middle = {
            "div": {
                "className": "w3-col s10 m10 l10",
                "style": "text-align:center;"
            }
        };
        this.middle = new UiSection(__WEBPACK_IMPORTED_MODULE_0__json2html__["a" /* J2H */].parse(middle));
        const right = {
            "div": {
                "className": "w3-col s1 m1 l1"
            }
        };
        this.right = new UiSection(__WEBPACK_IMPORTED_MODULE_0__json2html__["a" /* J2H */].parse(right));
        this.container.appendChild(this.left.html());
        this.container.appendChild(this.middle.html());
        this.container.appendChild(this.right.html());
    }
    setWidth(width) {
        // as any ignores the read-only "style" warning, as we need to write the width of the canvas to the width of the UI element
        // the width + 2 removes the small gap left on the right, which is there for an unknown reason
        this.container.style = "width:" + (width + 2) + "px";
    }
    clear() {
        this.left.clear();
        this.middle.clear();
        this.right.clear();
    }
    setPlayer(name) {
        this.middle.add(__WEBPACK_IMPORTED_MODULE_0__json2html__["a" /* J2H */].parse({
            "b": {
                "textContent": name + "'s turn.",
                "className": "fa-2x"
            }
        }));
    }
    update(e) {
        this.container.left = window.visualViewport.pageLeft;
        this.container.top = window.visualViewport.pageTop;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Ui;

Ui.ID_BUTTON_SKIP_TURN = "tanks-ui-button-skipturn";
//# sourceMappingURL=ui.js.map

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__drawing_draw__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__limiters_index__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__gameController__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utility_point__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__gameObjects_tank__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__json2html__ = __webpack_require__(5);






class MovingUi {
    static button_skipTurn() {
        return __WEBPACK_IMPORTED_MODULE_5__json2html__["a" /* J2H */].parse({
            "button": {
                "style": "width:100%",
                "textContent": "Skip Turn"
            }
        });
    }
    static button_goToShooting() {
        return __WEBPACK_IMPORTED_MODULE_5__json2html__["a" /* J2H */].parse({
            "button": {
                "style": "width:100%",
                "children": {
                    "i": {
                        "className": "fas fa-rocket"
                    }
                }
            }
        });
    }
}
class MovingState {
    constructor(controller, context, ui, player, viewport) {
        this.startMovement = (e) => {
            // limit the start of the line to be the tank
            this.draw.last = new __WEBPACK_IMPORTED_MODULE_3__utility_point__["a" /* Point */](this.active.position.x, this.active.position.y);
            // limit the length of the line to the maximum allowed tank movement, and disabled tanks can't be moved
            if (this.line.in(this.active.position, this.draw.mouse) && this.active.healthState !== __WEBPACK_IMPORTED_MODULE_4__gameObjects_tank__["b" /* TankHealthState */].DISABLED) {
                this.draw.state = __WEBPACK_IMPORTED_MODULE_0__drawing_draw__["b" /* DrawState */].DRAWING;
                this.validMove();
            }
        };
        this.endMovement = (e) => {
            // reset the line limit as the user has let go of the button
            this.line.reset();
            // only act if the position is valid
            if (this.tankValidPosition) {
                // update the position of the tank in the player array
                const tank = this.player.tanks[this.active.id];
                tank.position = this.draw.mouse.copy();
                tank.actionState = __WEBPACK_IMPORTED_MODULE_4__gameObjects_tank__["c" /* TankTurnState */].MOVED;
                this.controller.showUserWarning("");
            }
            this.endTurn();
        };
        this.endTurnEarly = () => {
            console.log("Ending turn early");
            // set the active tank to be the one that was originally selected
            // this will tell the selection state to go to shooting without a new selection
            this.player.activeTank.set(this.active);
            // run the end of turn action
            this.endTurn();
        };
        this.goToShooting = () => {
            this.player.tanks[this.active.id].actionState = __WEBPACK_IMPORTED_MODULE_4__gameObjects_tank__["c" /* TankTurnState */].MOVED;
            this.player.activeTank.set(this.player.tanks[this.active.id]);
            this.draw.state = __WEBPACK_IMPORTED_MODULE_0__drawing_draw__["b" /* DrawState */].STOPPED;
            // redraw canvas with all current tanks
            this.controller.redrawCanvas(this.draw);
            // go to tank selection state
            this.controller.changeGameState(__WEBPACK_IMPORTED_MODULE_2__gameController__["b" /* GameState */].TANK_SELECTION);
        };
        this.drawMoveLine = (e) => {
            this.draw.updateMousePosition(e);
            // draw the movement line if the mouse button is currently being pressed
            if (this.draw.state == __WEBPACK_IMPORTED_MODULE_0__drawing_draw__["b" /* DrawState */].DRAWING) {
                if (this.line.in(this.active.position, this.draw.mouse)) {
                    this.validMove();
                }
                else {
                    this.tankValidPosition = false;
                }
            }
        };
        this.controller = controller;
        this.context = context;
        this.player = player;
        this.ui = ui;
        this.draw = new __WEBPACK_IMPORTED_MODULE_0__drawing_draw__["a" /* Draw */]();
        this.line = new __WEBPACK_IMPORTED_MODULE_1__limiters_index__["b" /* Length */](__WEBPACK_IMPORTED_MODULE_4__gameObjects_tank__["a" /* Tank */].MOVEMENT_RANGE);
        this.active = this.player.activeTank.get();
        viewport.goTo(player.viewportPosition);
        const button_goToShooting = MovingUi.button_goToShooting();
        button_goToShooting.onclick = this.goToShooting;
        this.ui.left.add(button_goToShooting);
    }
    addEventListeners(canvas) {
        canvas.onmousedown = this.startMovement;
        canvas.onmousemove = this.drawMoveLine;
        // the mouseup is only on the canvas, otherwise none of the UI buttons can be clicked
        canvas.onmouseup = this.endMovement;
        // canvas.addEventListener('touchstart', this.touchMove, false);
        // canvas.addEventListener('touchend', this.mouseUp, false);
        // canvas.addEventListener('touchmove', this.touchMove, false);
    }
    validMove() {
        this.tankValidPosition = true;
        this.draw.mouseLine(this.context, __WEBPACK_IMPORTED_MODULE_4__gameObjects_tank__["a" /* Tank */].MOVEMENT_LINE_WIDTH, __WEBPACK_IMPORTED_MODULE_4__gameObjects_tank__["a" /* Tank */].MOVEMENT_LINE_COLOR);
    }
    /** The action to be taken at the end of the turn */
    endTurn() {
        this.draw.state = __WEBPACK_IMPORTED_MODULE_0__drawing_draw__["b" /* DrawState */].STOPPED;
        // redraw canvas with all current tanks
        this.controller.redrawCanvas(this.draw);
        // go to tank selection state
        this.controller.changeGameState(__WEBPACK_IMPORTED_MODULE_2__gameController__["b" /* GameState */].TANK_SELECTION);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MovingState;

//# sourceMappingURL=movement.js.map

/***/ }),
/* 14 */
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
    /** End the turn early */
    end() {
        this.num_actions = this.limit;
    }
    over() {
        return this.num_actions >= this.limit;
    }
    reset() {
        this.num_actions = 0;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Actions;

//# sourceMappingURL=action.js.map

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utility_tanksMath__ = __webpack_require__(4);

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
        const distance = __WEBPACK_IMPORTED_MODULE_0__utility_tanksMath__["a" /* TanksMath */].point.dist2d(start, end);
        return distance >= this.limit;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Speed;

//# sourceMappingURL=speed.js.map

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utility_tanksMath__ = __webpack_require__(4);

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
        this.current += __WEBPACK_IMPORTED_MODULE_0__utility_tanksMath__["a" /* TanksMath */].point.dist2d(start, end);
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
        const distance = __WEBPACK_IMPORTED_MODULE_0__utility_tanksMath__["a" /* TanksMath */].point.dist2d(start, end);
        return distance <= this.limit;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Length;

//# sourceMappingURL=length.js.map

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__gameController__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__gameObjects_tank__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__drawing_draw__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__gameSettings__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__limiters_index__ = __webpack_require__(6);





class PlacingState {
    /**
     *
     * @param controller The events controller, which is used to change the game state after this event is finished.
     * @param context Context on which the objects are drawn
     * @param player
     */
    constructor(controller, context, ui, player, viewport) {
        this.addTank = (e) => {
            this.draw.updateMousePosition(e);
            // if the future will check if it collides with another tank or terrain
            const tank = new __WEBPACK_IMPORTED_MODULE_1__gameObjects_tank__["a" /* Tank */](this.player.tanks.length, this.player, this.draw.mouse.x, this.draw.mouse.y);
            this.player.tanks.push(tank);
            tank.draw(this.context, this.draw);
            // player has placed a tank
            this.tanksPlaced.take();
            // if we've placed as many objects as allowed, then go to next state
            // next_player is not changed here, as it's set in the controller
            if (this.tanksPlaced.over()) {
                PlacingState.playersTankPlacement.take();
                // all of the players have placed their tanks, go to moving state
                if (PlacingState.playersTankPlacement.over()) {
                    this.controller.changeGameState(__WEBPACK_IMPORTED_MODULE_0__gameController__["b" /* GameState */].TANK_SELECTION);
                }
                else {
                    this.controller.changeGameState(__WEBPACK_IMPORTED_MODULE_0__gameController__["b" /* GameState */].TANK_PLACEMENT);
                }
            }
        };
        this.controller = controller;
        this.context = context;
        this.draw = new __WEBPACK_IMPORTED_MODULE_2__drawing_draw__["a" /* Draw */]();
        this.tanksPlaced = new __WEBPACK_IMPORTED_MODULE_4__limiters_index__["a" /* Actions */](__WEBPACK_IMPORTED_MODULE_3__gameSettings__["b" /* NUM_TANKS */]);
        this.player = player;
        this.ui = ui;
        viewport.goTo(player.viewportPosition);
    }
    addEventListeners(canvas) {
        canvas.onmousedown = this.addTank;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PlacingState;

// keeps track of how many players have placed their tanks IN TOTAL
PlacingState.playersTankPlacement = new __WEBPACK_IMPORTED_MODULE_4__limiters_index__["a" /* Actions */](__WEBPACK_IMPORTED_MODULE_3__gameSettings__["a" /* NUM_PLAYERS */]);
//# sourceMappingURL=placement.js.map

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__json2html__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__gameController__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__drawing_draw__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__gameObjects_tank__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__utility_point__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utility_tanksMath__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utility_line__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__limiters_index__ = __webpack_require__(6);








class ShootingUi {
    static button_skipTurn() {
        return __WEBPACK_IMPORTED_MODULE_0__json2html__["a" /* J2H */].parse({
            "button": {
                "style": "width:100%",
                "textContent": "Skip"
            }
        });
    }
}
class ShootingState {
    constructor(controller, context, ui, player, viewport) {
        /** Whether the shot was successfully fired, will be set to true if the shot is fast enough */
        this.successfulShot = false;
        this.startShooting = (e) => {
            this.draw.updateMousePosition(e);
            this.draw.last = new __WEBPACK_IMPORTED_MODULE_4__utility_point__["a" /* Point */](this.active.position.x, this.active.position.y);
            // resets the successful shot flag
            this.successfulShot = false;
            // the player must start shooting from the tank
            const tank = this.player.tanks[this.active.id];
            if (__WEBPACK_IMPORTED_MODULE_5__utility_tanksMath__["a" /* TanksMath */].point.collideCircle(this.draw.mouse, tank.position, __WEBPACK_IMPORTED_MODULE_3__gameObjects_tank__["a" /* Tank */].WIDTH)) {
                // if the mouse is within the tank
                if (this.tankRoamingLength.in(this.active.position, this.draw.mouse)) {
                    // shot collision starts from the centre of the tank
                    this.shotPath.points.push(this.active.position.copy());
                    this.draw.state = __WEBPACK_IMPORTED_MODULE_2__drawing_draw__["b" /* DrawState */].DRAWING;
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
            if (this.draw.state == __WEBPACK_IMPORTED_MODULE_2__drawing_draw__["b" /* DrawState */].DRAWING) {
                // if the player is just moving about on the tank's space
                if (this.tankRoamingLength.in(this.active.position, this.draw.mouse)) {
                    console.log("Roaming in tank space");
                    this.controller.showUserWarning("");
                    this.validRange();
                } // if the player has shot far away start drawing the line
                else if (this.shotSpeed.enough(this.active.position, this.draw.mouse)) {
                    console.log("Shooting!");
                    this.controller.showUserWarning("");
                    this.validRange();
                    // only add to the shot path if the shot was successful
                    this.shotPath.points.push(this.draw.mouse.copy());
                    // if the shot has reached the max allowed limit we stop the drawing, this is an artificial
                    // limitation to stop a shot that goes along the whole screen
                    if (!this.shotLength.add(this.active.position, this.draw.mouse)) {
                        console.log("Successful shot!");
                        this.successfulShot = true;
                        this.draw.state = __WEBPACK_IMPORTED_MODULE_2__drawing_draw__["b" /* DrawState */].STOPPED;
                    }
                }
                else {
                    this.controller.showUserWarning("Shooting too slow!");
                    console.log("Shooting too slow!");
                    this.draw.state = __WEBPACK_IMPORTED_MODULE_2__drawing_draw__["b" /* DrawState */].STOPPED;
                }
            }
        };
        this.stopShooting = (e) => {
            const playerTanksShot = this.player.tanksShot.get();
            if (this.successfulShot) {
                this.controller.collide(this.shotPath);
                this.controller.cacheLine(this.shotPath);
                playerTanksShot.take();
                this.active.actionState = __WEBPACK_IMPORTED_MODULE_3__gameObjects_tank__["c" /* TankTurnState */].SHOT;
            }
            // if all the player's tank have shot
            if (playerTanksShot.over()) {
                // reset the current player's tank act states
                this.player.resetTanksActStates();
                // change to the next player when the state is next changed
                this.controller.nextPlayer = true;
            }
            else {
                // if not all tanks have shot, then keep the state for the next shooting
                this.player.tanksShot.set(playerTanksShot);
            }
            this.draw.state = __WEBPACK_IMPORTED_MODULE_2__drawing_draw__["b" /* DrawState */].STOPPED;
            // redraw canvas with all current tanks
            this.controller.redrawCanvas(this.draw);
            this.controller.changeGameState(__WEBPACK_IMPORTED_MODULE_1__gameController__["b" /* GameState */].TANK_SELECTION);
        };
        this.skipTurn = () => {
            // reset the current player's tank act states
            this.player.resetTanksActStates();
            // change to the next player when the state is next changed
            this.controller.nextPlayer = true;
            this.draw.state = __WEBPACK_IMPORTED_MODULE_2__drawing_draw__["b" /* DrawState */].STOPPED;
            // redraw canvas with all current tanks
            this.controller.redrawCanvas(this.draw);
            this.controller.changeGameState(__WEBPACK_IMPORTED_MODULE_1__gameController__["b" /* GameState */].TANK_SELECTION);
        };
        this.controller = controller;
        this.context = context;
        this.player = player;
        this.ui = ui;
        this.shotPath = new __WEBPACK_IMPORTED_MODULE_6__utility_line__["a" /* Line */]();
        this.draw = new __WEBPACK_IMPORTED_MODULE_2__drawing_draw__["a" /* Draw */]();
        this.tankRoamingLength = new __WEBPACK_IMPORTED_MODULE_7__limiters_index__["b" /* Length */](__WEBPACK_IMPORTED_MODULE_3__gameObjects_tank__["a" /* Tank */].SHOOTING_DEADZONE);
        this.shotLength = new __WEBPACK_IMPORTED_MODULE_7__limiters_index__["b" /* Length */](__WEBPACK_IMPORTED_MODULE_3__gameObjects_tank__["a" /* Tank */].SHOOTING_RANGE);
        this.shotSpeed = new __WEBPACK_IMPORTED_MODULE_7__limiters_index__["c" /* Speed */](__WEBPACK_IMPORTED_MODULE_3__gameObjects_tank__["a" /* Tank */].SHOOTING_SPEED);
        if (!player.tanksShot.available()) {
            player.tanksShot.set(new __WEBPACK_IMPORTED_MODULE_7__limiters_index__["a" /* Actions */](player.activeTanks().length));
        }
        this.active = this.player.activeTank.get();
        viewport.goTo(player.viewportPosition);
        const button_skipTurn = ShootingUi.button_skipTurn();
        button_skipTurn.onmousedown = this.skipTurn;
        ui.left.add(button_skipTurn);
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
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Line {
    constructor() {
        this.points = [];
    }
    list() {
        console.log("Points for the shot: ", this.points.join(", "));
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Line;

//# sourceMappingURL=line.js.map

/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__gameController__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utility_tanksMath__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__drawing_draw__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__gameObjects_tank__ = __webpack_require__(2);




class SelectionState {
    constructor(controller, context, ui, player, viewport) {
        this.highlightTank = (e) => {
            this.draw.updateMousePosition(e);
            // Check if the user has clicked any tank.
            for (const tank of this.player.tanks) {
                // tanks that must not be selected:
                // - dead tanks
                // - tanks that have acted
                // - tanks that the mouse click does not collide with
                if (tank.healthState !== __WEBPACK_IMPORTED_MODULE_3__gameObjects_tank__["b" /* TankHealthState */].DEAD &&
                    tank.active() &&
                    __WEBPACK_IMPORTED_MODULE_1__utility_tanksMath__["a" /* TanksMath */].point.collideCircle(this.draw.mouse, tank.position, __WEBPACK_IMPORTED_MODULE_3__gameObjects_tank__["a" /* Tank */].WIDTH)) {
                    // highlight the selected tank
                    this.successfulSelection(tank);
                    // only highlight the first tank, if there are multiple on top of each other
                    break;
                }
            }
        };
        this.mouseUp = () => {
            // if the user has clicked on any of the objects, go into movement state
            if (this.player.activeTank.available()) {
                let nextState;
                switch (this.active.actionState) {
                    case __WEBPACK_IMPORTED_MODULE_3__gameObjects_tank__["c" /* TankTurnState */].NOT_ACTED:
                        nextState = __WEBPACK_IMPORTED_MODULE_0__gameController__["b" /* GameState */].TANK_MOVEMENT;
                        break;
                    case __WEBPACK_IMPORTED_MODULE_3__gameObjects_tank__["c" /* TankTurnState */].MOVED:
                        nextState = __WEBPACK_IMPORTED_MODULE_0__gameController__["b" /* GameState */].TANK_SHOOTING;
                        break;
                    case __WEBPACK_IMPORTED_MODULE_3__gameObjects_tank__["c" /* TankTurnState */].SHOT:
                        nextState = __WEBPACK_IMPORTED_MODULE_0__gameController__["b" /* GameState */].TANK_SELECTION;
                        break;
                }
                this.controller.changeGameState(nextState);
            }
        };
        this.controller = controller;
        this.context = context;
        this.player = player;
        this.draw = new __WEBPACK_IMPORTED_MODULE_2__drawing_draw__["a" /* Draw */]();
        this.ui = ui;
        viewport.goTo(player.viewportPosition);
    }
    addEventListeners(canvas) {
        // cheat and keep the current active tank, while switching to the next state
        if (this.player.activeTank.available()) {
            this.active = this.player.activeTank.get();
            this.successfulSelection(this.active);
            this.mouseUp();
        }
        else {
            canvas.onmousedown = this.highlightTank;
            // NOTE: mouseup is on the whole window, so that even if the cursor exits the canvas, the event will trigger
            window.onmouseup = this.mouseUp;
        }
    }
    successfulSelection(tank) {
        tank.highlight(this.context, this.draw);
        // store the details of the active tank
        this.player.activeTank.set(tank);
        this.active = tank;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SelectionState;

//# sourceMappingURL=selection.js.map

/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__drawing_draw__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utility_stringFormat__ = __webpack_require__(8);


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
                context.font = "40px";
            }
            else {
                context.fillStyle = "Black";
                context.font = "30px";
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
            if (mouse.y > current_height - buffer_space) {
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
class GameEndState {
    constructor(controller, context, player, viewport) {
        this.controller = controller;
        this.context = context;
        this.draw = new __WEBPACK_IMPORTED_MODULE_0__drawing_draw__["a" /* Draw */]();
        const numTanks = player.activeTanks().length + 1;
        const tanksStr = numTanks === 1 ? " tank" : " tanks";
        viewport.middle();
        this.menu = new Menu("End of Game", [__WEBPACK_IMPORTED_MODULE_1__utility_stringFormat__["a" /* S */].format("Player %s Wins!", player.id), __WEBPACK_IMPORTED_MODULE_1__utility_stringFormat__["a" /* S */].format("With %s %s", numTanks, tanksStr)]);
        this.menu.draw(this.context, this.draw);
    }
    addEventListeners(canvas) {
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = GameEndState;

//# sourceMappingURL=gameEnd.js.map

/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__gameController__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__drawing_draw__ = __webpack_require__(1);


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
            if (mouse.y > current_height - buffer_space) {
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
    constructor(controller, context, viewport) {
        this.selectMenuitem = (e) => {
            this.draw.updateMousePosition(e);
            this.menu.select(this.draw.mouse);
            this.menu.draw(this.context, this.draw);
        };
        /**
         * Activates the selected menu option
         */
        this.activateMenuOption = (e) => {
            if (this.menu.selected_item >= 0) {
                this.controller.clearCanvas();
                this.controller.changeGameState(__WEBPACK_IMPORTED_MODULE_0__gameController__["b" /* GameState */].TANK_PLACEMENT);
            }
            // handle other events, probably better with a switch statement
        };
        this.controller = controller;
        this.context = context;
        this.draw = new __WEBPACK_IMPORTED_MODULE_1__drawing_draw__["a" /* Draw */]();
        this.menu = new Menu("Tanks", ["Start game", "Potatoes", "Apples", "I", "Choose", "You", "Pikachu"]);
        this.menu.draw(this.context, this.draw);
        viewport.middle();
    }
    addEventListeners(canvas) {
        canvas.onmousedown = this.activateMenuOption;
        canvas.onmousemove = this.selectMenuitem;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MenuState;

//# sourceMappingURL=menu.js.map

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tank__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utility_singleAccess__ = __webpack_require__(24);


class Player {
    constructor(id, name, color, viewportPosition) {
        this.id = id;
        this.name = name;
        this.tanks = new Array();
        this.color = color;
        this.tanksShot = new __WEBPACK_IMPORTED_MODULE_1__utility_singleAccess__["a" /* SingleAccess */]();
        this.activeTank = new __WEBPACK_IMPORTED_MODULE_1__utility_singleAccess__["a" /* SingleAccess */]();
        this.viewportPosition = viewportPosition;
    }
    activeTanks() {
        return this.tanks.filter((tank) => tank.healthState !== __WEBPACK_IMPORTED_MODULE_0__tank__["b" /* TankHealthState */].DEAD);
    }
    resetTanksActStates() {
        for (const tank of this.tanks) {
            tank.actionState = __WEBPACK_IMPORTED_MODULE_0__tank__["c" /* TankTurnState */].NOT_ACTED;
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Player;

//# sourceMappingURL=player.js.map

/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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
/* harmony export (immutable) */ __webpack_exports__["a"] = SingleAccess;

//# sourceMappingURL=singleAccess.js.map

/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__drawing_color__ = __webpack_require__(7);

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

/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__gameObjects_tank__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utility_tanksMath__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utility_stringFormat__ = __webpack_require__(8);



class Collision {
    static debugShot(line, start, end, tank, distance) {
        for (const segment of line.points) {
            console.log(__WEBPACK_IMPORTED_MODULE_2__utility_stringFormat__["a" /* S */].format("%s,%s", segment.x, -segment.y));
        }
        console.log(__WEBPACK_IMPORTED_MODULE_2__utility_stringFormat__["a" /* S */].format("Collision versus line:\n%s,%s\n%s,%s", start.x, -start.y, end.x, -end.y));
        console.log(__WEBPACK_IMPORTED_MODULE_2__utility_stringFormat__["a" /* S */].format("Tank ID: %s\nPosition: (%s,%s)", tank.id, tank.position.x, -tank.position.y));
        console.log("Distance: ", distance);
    }
    static collide(line, numPoints, tanks) {
        // loop over all their tanks
        for (const tank of tanks) {
            // only do collision detection versus tanks that have not been already killed
            if (tank.healthState !== __WEBPACK_IMPORTED_MODULE_0__gameObjects_tank__["b" /* TankHealthState */].DEAD) {
                // check each segment of the line for collision with the tank
                for (let i = 1; i < numPoints; i++) {
                    const start = line.points[i - 1];
                    const end = line.points[i];
                    const dist = __WEBPACK_IMPORTED_MODULE_1__utility_tanksMath__["a" /* TanksMath */].line.distCircleCenter(start, end, tank.position);
                    this.debugShot(line, start, end, tank, dist);
                    if (dist === -1) {
                        continue;
                    }
                    console.log("Shot hit the tank.");
                    // if the line glances the tank, mark as disabled
                    if (__WEBPACK_IMPORTED_MODULE_0__gameObjects_tank__["a" /* Tank */].WIDTH - __WEBPACK_IMPORTED_MODULE_0__gameObjects_tank__["a" /* Tank */].DISABLED_ZONE <= dist && dist <= __WEBPACK_IMPORTED_MODULE_0__gameObjects_tank__["a" /* Tank */].WIDTH + __WEBPACK_IMPORTED_MODULE_0__gameObjects_tank__["a" /* Tank */].DISABLED_ZONE) {
                        tank.healthState = __WEBPACK_IMPORTED_MODULE_0__gameObjects_tank__["b" /* TankHealthState */].DISABLED;
                        console.log("Tank", tank.id, "disabled!");
                        // stop checking collision for this tank, and go on the next one
                        break;
                    } // if the line passes through the tank, mark dead
                    else if (dist < __WEBPACK_IMPORTED_MODULE_0__gameObjects_tank__["a" /* Tank */].WIDTH) {
                        tank.healthState = __WEBPACK_IMPORTED_MODULE_0__gameObjects_tank__["b" /* TankHealthState */].DEAD;
                        console.log("Tank", tank.id, "dead!");
                        // stop checking collision for this tank, and go on the next one
                        break;
                    }
                }
            }
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Collision;

//# sourceMappingURL=gameCollision.js.map

/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Viewport {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }
    middle(y = 0) {
        this.go(this.canvasWidth / 4, y);
    }
    go(x, y) {
        console.log("Trying to scroll to", x, y);
        window.scroll(x, y);
    }
    goTo(point) {
        this.go(point.x, point.y);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Viewport;

//# sourceMappingURL=viewport.js.map

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgY2UxMThiNDhiMWMxMGEwNjViZDkiLCJ3ZWJwYWNrOi8vLy4vc3JjL2J1aWxkL2dhbWVDb250cm9sbGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9idWlsZC9kcmF3aW5nL2RyYXcuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2J1aWxkL2dhbWVPYmplY3RzL3RhbmsuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2J1aWxkL3V0aWxpdHkvcG9pbnQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2J1aWxkL3V0aWxpdHkvdGFua3NNYXRoLmpzIiwid2VicGFjazovLy8uL3NyYy9idWlsZC9qc29uMmh0bWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2J1aWxkL2xpbWl0ZXJzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9idWlsZC9kcmF3aW5nL2NvbG9yLmpzIiwid2VicGFjazovLy8uL3NyYy9idWlsZC91dGlsaXR5L3N0cmluZ0Zvcm1hdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYnVpbGQvZ2FtZVNldHRpbmdzLmpzIiwid2VicGFjazovLy8uL3NyYy9idWlsZC9tYWluLmpzIiwid2VicGFjazovLy8uL3NyYy9idWlsZC9zaXRlQ29udHJvbHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2J1aWxkL3VpLmpzIiwid2VicGFjazovLy8uL3NyYy9idWlsZC9nYW1lU3RhdGVzL21vdmVtZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9idWlsZC9saW1pdGVycy9hY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2J1aWxkL2xpbWl0ZXJzL3NwZWVkLmpzIiwid2VicGFjazovLy8uL3NyYy9idWlsZC9saW1pdGVycy9sZW5ndGguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2J1aWxkL2dhbWVTdGF0ZXMvcGxhY2VtZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9idWlsZC9nYW1lU3RhdGVzL3Nob290aW5nLmpzIiwid2VicGFjazovLy8uL3NyYy9idWlsZC91dGlsaXR5L2xpbmUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2J1aWxkL2dhbWVTdGF0ZXMvc2VsZWN0aW9uLmpzIiwid2VicGFjazovLy8uL3NyYy9idWlsZC9nYW1lU3RhdGVzL2dhbWVFbmQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2J1aWxkL2dhbWVTdGF0ZXMvbWVudS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYnVpbGQvZ2FtZU9iamVjdHMvcGxheWVyLmpzIiwid2VicGFjazovLy8uL3NyYy9idWlsZC91dGlsaXR5L3NpbmdsZUFjY2Vzcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYnVpbGQvdXRpbGl0eS9saW5lQ2FjaGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2J1aWxkL2dhbWVDb2xsaXNpb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2J1aWxkL2dhbWVNYXAvdmlld3BvcnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3RHNCO0FBQ0M7QUFDQztBQUNDO0FBQ0Y7QUFDSDtBQUNIO0FBQ0Q7QUFDSTtBQUNKO0FBQ0k7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyw4QkFBOEI7QUFDL0I7QUFDQTtBQUNBO0FBQ0EsZ0ZBQWdGLElBQUk7QUFDcEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIseUVBQTBCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLDZCQUE2QjtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQSwwQzs7Ozs7Ozs7O0FDL0pnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLDhCQUE4QjtBQUMvQixnQzs7Ozs7Ozs7Ozs7QUMxSWdCO0FBQ0E7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLHNDQUFzQztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQywwQ0FBMEM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEIscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQzs7Ozs7OztBQzdHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0EsaUM7Ozs7Ozs7O0FDWmdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQSxxQzs7Ozs7OztBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBLHFDOzs7Ozs7Ozs7Ozs7O0FDaEhrQjtBQUNGO0FBQ0M7QUFDakIsaUM7Ozs7Ozs7O0FDSFk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBLGlDOzs7Ozs7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0Esd0M7Ozs7Ozs7QUNMQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFDQSx3Qzs7Ozs7Ozs7Ozs7QUNGQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNhO0FBQ3VCO0FBQ2pCO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDOzs7Ozs7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQSx3Qzs7Ozs7Ozs7QUNsQmM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0EsOEI7Ozs7Ozs7Ozs7Ozs7QUN4RTBCO0FBQzFCO0FBQ29CO0FBQ0o7QUFDK0I7QUFDakM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0Esb0M7Ozs7Ozs7QUNuSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0Esa0M7Ozs7Ozs7O0FDbkJvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0EsaUM7Ozs7Ozs7O0FDdEJvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQSxrQzs7Ozs7Ozs7Ozs7O0FDdENvQjtBQUNMO0FBQ0E7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0EscUM7Ozs7Ozs7Ozs7Ozs7OztBQ2hEYztBQUNNO0FBQ007QUFDSTtBQUNkO0FBQ0k7QUFDTDtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQSxvQzs7Ozs7OztBQ3RJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBLGdDOzs7Ozs7Ozs7OztBQ1JvQjtBQUNBO0FBQ0w7QUFDZ0M7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQSxxQzs7Ozs7Ozs7O0FDckVlO0FBQ0g7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBLG1DOzs7Ozs7Ozs7QUN6RW9CO0FBQ0w7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQSxnQzs7Ozs7Ozs7O0FDMUZ5QztBQUNsQjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQSxrQzs7Ozs7OztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBLHdDOzs7Ozs7OztBQzdCZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0EscUM7Ozs7Ozs7Ozs7QUNqQmdDO0FBQ1o7QUFDUjtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixlQUFlO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQSx5Qzs7Ozs7OztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQSxvQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgY2UxMThiNDhiMWMxMGEwNjViZDkiLCJpbXBvcnQgeyBNb3ZpbmdTdGF0ZSB9IGZyb20gXCIuL2dhbWVTdGF0ZXMvbW92ZW1lbnRcIjtcclxuaW1wb3J0IHsgUGxhY2luZ1N0YXRlIH0gZnJvbSBcIi4vZ2FtZVN0YXRlcy9wbGFjZW1lbnRcIjtcclxuaW1wb3J0IHsgU2hvb3RpbmdTdGF0ZSB9IGZyb20gXCIuL2dhbWVTdGF0ZXMvc2hvb3RpbmdcIjtcclxuaW1wb3J0IHsgU2VsZWN0aW9uU3RhdGUgfSBmcm9tIFwiLi9nYW1lU3RhdGVzL3NlbGVjdGlvblwiO1xyXG5pbXBvcnQgeyBHYW1lRW5kU3RhdGUgfSBmcm9tIFwiLi9nYW1lU3RhdGVzL2dhbWVFbmRcIjtcclxuaW1wb3J0IHsgTWVudVN0YXRlIH0gZnJvbSBcIi4vZ2FtZVN0YXRlcy9tZW51XCI7XHJcbmltcG9ydCB7IFBsYXllciB9IGZyb20gJy4vZ2FtZU9iamVjdHMvcGxheWVyJztcclxuaW1wb3J0IHsgQ29sb3IgfSBmcm9tICcuL2RyYXdpbmcvY29sb3InO1xyXG5pbXBvcnQgeyBMaW5lQ2FjaGUgfSBmcm9tICcuL3V0aWxpdHkvbGluZUNhY2hlJztcclxuaW1wb3J0IHsgUG9pbnQgfSBmcm9tICcuL3V0aWxpdHkvcG9pbnQnO1xyXG5pbXBvcnQgeyBDb2xsaXNpb24gfSBmcm9tIFwiLi9nYW1lQ29sbGlzaW9uXCI7XHJcbmltcG9ydCAqIGFzIFNldHRpbmdzIGZyb20gJy4vZ2FtZVNldHRpbmdzJztcclxuZXhwb3J0IHZhciBHYW1lU3RhdGU7XHJcbihmdW5jdGlvbiAoR2FtZVN0YXRlKSB7XHJcbiAgICBHYW1lU3RhdGVbR2FtZVN0YXRlW1wiTUVOVVwiXSA9IDBdID0gXCJNRU5VXCI7XHJcbiAgICBHYW1lU3RhdGVbR2FtZVN0YXRlW1wiVEFOS19QTEFDRU1FTlRcIl0gPSAxXSA9IFwiVEFOS19QTEFDRU1FTlRcIjtcclxuICAgIEdhbWVTdGF0ZVtHYW1lU3RhdGVbXCJUQU5LX01PVkVNRU5UXCJdID0gMl0gPSBcIlRBTktfTU9WRU1FTlRcIjtcclxuICAgIEdhbWVTdGF0ZVtHYW1lU3RhdGVbXCJUQU5LX1NFTEVDVElPTlwiXSA9IDNdID0gXCJUQU5LX1NFTEVDVElPTlwiO1xyXG4gICAgR2FtZVN0YXRlW0dhbWVTdGF0ZVtcIlRBTktfU0hPT1RJTkdcIl0gPSA0XSA9IFwiVEFOS19TSE9PVElOR1wiO1xyXG4gICAgR2FtZVN0YXRlW0dhbWVTdGF0ZVtcIkdBTUVfRU5EXCJdID0gNV0gPSBcIkdBTUVfRU5EXCI7XHJcbn0pKEdhbWVTdGF0ZSB8fCAoR2FtZVN0YXRlID0ge30pKTtcclxuLyoqXHJcbiAqIEltcGxlbWVudGF0aW9uIGZvciB0aGUgYWN0aW9ucyB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgYWNjb3JkaW5nIHRvIHBsYXllciBhY3Rpb25zLlxyXG4gKlxyXG4gKiBGdW5jdGlvbnMgYXJlIHdyYXBwZWQgdG8ga2VlcCBgdGhpc2AgY29udGV4dC4gVGhpcyBpcyB0aGUgKGU6TW91c2VFdmVudCkgPT4gey4uLn0gc3ludGF4LlxyXG4gKlxyXG4gKiBJbiBzaG9ydCwgYmVjYXVzZSB0aGUgbWV0aG9kcyBhcmUgYWRkZWQgYXMgZXZlbnQgbGlzdGVuZXJzIChhbmQgYXJlIG5vdCBjYWxsZWQgZGlyZWN0bHkpLCB0aGUgYHRoaXNgIHJlZmVyZW5jZSBzdGFydHMgcG9pbnRpbmdcclxuICogdG93YXJkcyB0aGUgYHdpbmRvd2Agb2JqZWN0LiBUaGUgY2xvc3VyZSBrZWVwcyB0aGUgYHRoaXNgIHRvIHBvaW50IHRvd2FyZHMgdGhlIHByb3BlciBpbnN0YW5jZSBvZiB0aGUgb2JqZWN0LlxyXG4gKlxyXG4gKiBGb3IgbW9yZSBkZXRhaWxzOiBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L1R5cGVTY3JpcHQvd2lraS8ndGhpcyctaW4tVHlwZVNjcmlwdCNyZWQtZmxhZ3MtZm9yLXRoaXNcclxuICovXHJcbmV4cG9ydCBjbGFzcyBHYW1lQ29udHJvbGxlciB7XHJcbiAgICBjb25zdHJ1Y3RvcihjYW52YXMsIGNvbnRleHQsIHVpLCB2aWV3cG9ydCkge1xyXG4gICAgICAgIC8qKiBBbGwgdGhlIHBsYXllcnMgaW4gdGhlIGdhbWUgKi9cclxuICAgICAgICB0aGlzLnBsYXllcnMgPSBbXTtcclxuICAgICAgICAvKiogRmxhZyB0byBzcGVjaWZ5IGlmIHRoZSBjdXJyZW50IHBsYXllcidzIHR1cm4gaXMgb3ZlciAqL1xyXG4gICAgICAgIHRoaXMubmV4dFBsYXllciA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xyXG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XHJcbiAgICAgICAgdGhpcy51aSA9IHVpO1xyXG4gICAgICAgIHRoaXMudmlld3BvcnQgPSB2aWV3cG9ydDtcclxuICAgICAgICB0aGlzLmxpbmVDYWNoZSA9IG5ldyBMaW5lQ2FjaGUoKTtcclxuICAgICAgICBsZXQgcGxheWVyUG9zaXRpb25zID0gW1xyXG4gICAgICAgICAgICBuZXcgUG9pbnQoMCwgMCksXHJcbiAgICAgICAgICAgIG5ldyBQb2ludCg0MDk2LCA0MDk2KVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGxheWVyID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IFNldHRpbmdzLk5VTV9QTEFZRVJTOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXJzLnB1c2gobmV3IFBsYXllcihpLCBcIlBsYXllciBcIiArIChpICsgMSksIENvbG9yLm5leHQoKSwgcGxheWVyUG9zaXRpb25zW2ldKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZ2FtZSBldmVudHMgc2hvdWxkIGJlIGluIHRoaXMgb3JkZXI6XHJcbiAgICAgKiBNZW51XHJcbiAgICAgKiBQbGFjaW5nIGZvciBlYWNoIHBsYXllclxyXG4gICAgICogUmVwZWF0IHVudGlsIGdhbWUgb3ZlclxyXG4gICAgICogIE1vdmluZywgU2hvb3RpbmcgZm9yIFAxXHJcbiAgICAgKiAgTW92aW5nLCBTaG9vdGluZyBmb3IgUDJcclxuICAgICAqIEBwYXJhbSBuZXdTdGF0ZVxyXG4gICAgICovXHJcbiAgICBjaGFuZ2VHYW1lU3RhdGUobmV3U3RhdGUpIHtcclxuICAgICAgICB0aGlzLnVpLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IG5ld1N0YXRlO1xyXG4gICAgICAgIC8vIGNsZWFycyBhbnkgb2xkIGV2ZW50cyB0aGF0IHdlcmUgYWRkZWRcclxuICAgICAgICB0aGlzLmNhbnZhcy5vbm1vdXNlZG93biA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jYW52YXMub25tb3VzZXVwID0gbnVsbDtcclxuICAgICAgICB3aW5kb3cub25tb3VzZXVwID0gbnVsbDtcclxuICAgICAgICB0aGlzLmNhbnZhcy5vbm1vdXNlbW92ZSA9IG51bGw7XHJcbiAgICAgICAgLy8gaWYgdGhlIHN0YXRlIGhhcyBtYXJrZWQgdGhlIGVuZCBvZiB0aGUgcGxheWVyJ3MgdHVybiwgdGhlbiB3ZSBnbyB0byB0aGUgbmV4dCBwbGF5ZXJcclxuICAgICAgICBpZiAodGhpcy5uZXh0UGxheWVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlUGxheWVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMubmV4dFBsYXllciA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLnBsYXllcnNbdGhpcy5jdXJyZW50UGxheWVyXTtcclxuICAgICAgICBpZiAodGhpcy5zdGF0ZSAhPT0gR2FtZVN0YXRlLk1FTlUgJiYgdGhpcy5zdGF0ZSAhPT0gR2FtZVN0YXRlLlRBTktfUExBQ0VNRU5UICYmIHBsYXllci5hY3RpdmVUYW5rcygpLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gR2FtZVN0YXRlLkdBTUVfRU5EO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZyhcIlRoaXMgaXNcIiwgcGxheWVyLm5hbWUsIFwicGxheWluZy5cIik7XHJcbiAgICAgICAgdGhpcy51aS5zZXRQbGF5ZXIocGxheWVyLm5hbWUpO1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy5zdGF0ZSkge1xyXG4gICAgICAgICAgICBjYXNlIEdhbWVTdGF0ZS5NRU5VOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5hY3Rpb24gPSBuZXcgTWVudVN0YXRlKHRoaXMsIHRoaXMuY29udGV4dCwgdGhpcy52aWV3cG9ydCk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkluaXRpYWxpc2luZyBNRU5VXCIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgR2FtZVN0YXRlLlRBTktfUExBQ0VNRU5UOlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJbml0aWFsaXNpbmcgVEFOSyBQTEFDSU5HXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hY3Rpb24gPSBuZXcgUGxhY2luZ1N0YXRlKHRoaXMsIHRoaXMuY29udGV4dCwgdGhpcy51aSwgcGxheWVyLCB0aGlzLnZpZXdwb3J0KTtcclxuICAgICAgICAgICAgICAgIC8vIGZvcmNlIHRoZSBuZXh0IHBsYXllciBhZnRlciBwbGFjaW5nIHRhbmtzXHJcbiAgICAgICAgICAgICAgICB0aGlzLm5leHRQbGF5ZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgR2FtZVN0YXRlLlRBTktfU0VMRUNUSU9OOlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJbml0aWFsaXNpbmcgVEFOSyBTRUxFQ1RJT05cIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGlvbiA9IG5ldyBTZWxlY3Rpb25TdGF0ZSh0aGlzLCB0aGlzLmNvbnRleHQsIHRoaXMudWksIHBsYXllciwgdGhpcy52aWV3cG9ydCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBHYW1lU3RhdGUuVEFOS19NT1ZFTUVOVDpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSW5pdGlhbGlzaW5nIFRBTksgTU9WRU1FTlRcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGlvbiA9IG5ldyBNb3ZpbmdTdGF0ZSh0aGlzLCB0aGlzLmNvbnRleHQsIHRoaXMudWksIHBsYXllciwgdGhpcy52aWV3cG9ydCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBHYW1lU3RhdGUuVEFOS19TSE9PVElORzpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSW5pdGlhbGlzaW5nIFRBTksgU0hPT1RJTkdcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGlvbiA9IG5ldyBTaG9vdGluZ1N0YXRlKHRoaXMsIHRoaXMuY29udGV4dCwgdGhpcy51aSwgcGxheWVyLCB0aGlzLnZpZXdwb3J0KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIEdhbWVTdGF0ZS5HQU1FX0VORDpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSW5pdGlhbGlzaW5nIEdBTUUgRU5EXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hY3Rpb24gPSBuZXcgR2FtZUVuZFN0YXRlKHRoaXMsIHRoaXMuY29udGV4dCwgcGxheWVyLCB0aGlzLnZpZXdwb3J0KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIGdhbWUgc2hvdWxkIG5ldmVyIGJlIGluIGFuIHVua25vd24gc3RhdGUsIHNvbWV0aGluZyBoYXMgZ29uZSB0ZXJyaWJseSB3cm9uZyFcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGFkZCB0aGUgbW91c2UgZXZlbnRzIGZvciB0aGUgbmV3IHN0YXRlXHJcbiAgICAgICAgdGhpcy5hY3Rpb24uYWRkRXZlbnRMaXN0ZW5lcnModGhpcy5jYW52YXMpO1xyXG4gICAgfVxyXG4gICAgLyoqIENsZWFycyBldmVyeXRoaW5nIGZyb20gdGhlIGNhbnZhcyBvbiB0aGUgc2NyZWVuLiBUbyBzaG93IGFueXRoaW5nIGFmdGVyd2FyZHMgaXQgbmVlZHMgdG8gYmUgcmVkcmF3bi4gKi9cclxuICAgIGNsZWFyQ2FudmFzKCkge1xyXG4gICAgICAgIHRoaXMuY29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XHJcbiAgICB9XHJcbiAgICByZWRyYXdDYW52YXMoZHJhdykge1xyXG4gICAgICAgIHRoaXMuY2xlYXJDYW52YXMoKTtcclxuICAgICAgICAvLyBkcmF3IGV2ZXJ5IHBsYXllciBmb3IgZXZlcnkgdGFua1xyXG4gICAgICAgIGZvciAoY29uc3QgcGxheWVyIG9mIHRoaXMucGxheWVycykge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHRhbmsgb2YgcGxheWVyLnRhbmtzKSB7XHJcbiAgICAgICAgICAgICAgICB0YW5rLmRyYXcodGhpcy5jb250ZXh0LCBkcmF3KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBvbGRfbGluZXNfY29sb3IgPSBDb2xvci5ncmF5KDAuNSkudG9SR0JBKCk7XHJcbiAgICAgICAgLy8gZHJhdyB0aGUgbGFzdCBOIGxpbmVzXHJcbiAgICAgICAgZm9yIChjb25zdCBsaW5lX3BhdGggb2YgdGhpcy5saW5lQ2FjaGUubGluZXMoKSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGxpbmVfcGF0aC5wb2ludHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIC8vIG9sZCBsaW5lcyBhcmUgY3VycmVudGx5IGhhbGYtdHJhbnNwYXJlbnRcclxuICAgICAgICAgICAgICAgIGRyYXcubGluZSh0aGlzLmNvbnRleHQsIGxpbmVfcGF0aC5wb2ludHNbaSAtIDFdLCBsaW5lX3BhdGgucG9pbnRzW2ldLCAxLCBvbGRfbGluZXNfY29sb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29sbGlkZShsaW5lKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLS0tLS0tLSBTdGFydGluZyBDb2xsaXNpb24gLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcclxuICAgICAgICBjb25zdCBudW1Qb2ludHMgPSBsaW5lLnBvaW50cy5sZW5ndGg7XHJcbiAgICAgICAgLy8gZm9yIGV2ZXJ5IHBsYXllciB3aG8gaXNudCB0aGUgY3VycmVudCBwbGF5ZXJcclxuICAgICAgICBmb3IgKGNvbnN0IHBsYXllciBvZiB0aGlzLnBsYXllcnMuZmlsdGVyKChwKSA9PiBwLmlkICE9PSB0aGlzLmN1cnJlbnRQbGF5ZXIpKSB7XHJcbiAgICAgICAgICAgIENvbGxpc2lvbi5jb2xsaWRlKGxpbmUsIG51bVBvaW50cywgcGxheWVyLnRhbmtzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjYWNoZUxpbmUocGF0aCkge1xyXG4gICAgICAgIHRoaXMubGluZUNhY2hlLnBvaW50cy5wdXNoKHBhdGgpO1xyXG4gICAgfVxyXG4gICAgc2hvd1VzZXJXYXJuaW5nKG1lc3NhZ2UpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVzZXItd2FybmluZ1wiKS5pbm5lckhUTUwgPSBtZXNzYWdlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBAcmV0dXJucyBmYWxzZSBpZiB0aGVyZSBhcmUgc3RpbGwgcGxheWVycyB0byB0YWtlIHRoZWlyIHR1cm4sIHRydWUgaWYgYWxsIHBsYXllcnMgaGF2ZSBjb21wbGV0ZWQgdGhlaXIgdHVybnMgZm9yIHRoZSBzdGF0ZVxyXG4gICAgKi9cclxuICAgIGNoYW5nZVBsYXllcigpIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGxheWVyID09PSBTZXR0aW5ncy5OVU1fUExBWUVSUyAtIDEpIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGxheWVyID0gMDtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY3VycmVudFBsYXllciArPSAxO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1nYW1lQ29udHJvbGxlci5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9idWlsZC9nYW1lQ29udHJvbGxlci5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuLi91dGlsaXR5L3BvaW50XCI7XHJcbmV4cG9ydCBjbGFzcyBEcmF3IHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMubW91c2UgPSBuZXcgUG9pbnQoKTtcclxuICAgICAgICB0aGlzLmxhc3QgPSBuZXcgUG9pbnQoKTtcclxuICAgIH1cclxuICAgIC8qKiBEcmF3IGEgZG90IChhIGZpbGxlZCBjaXJjbGUpIGFyb3VuZCB0aGUgcG9pbnQuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGNvbnRleHQgQ29udGV4dCBvbiB3aGljaCB0aGUgY2lyY2xlIHdpbGwgYmUgZHJhd25cclxuICAgICAqIEBwYXJhbSBjb29yZHMgQ29vcmRpbmF0ZXMgZm9yIHRoZSBvcmlnaW4gcG9pbnQgb2YgdGhlIGNpcmNsZVxyXG4gICAgICogQHBhcmFtIHJhZGl1cyBSYWRpdXMgb2YgdGhlIGRvdFxyXG4gICAgICogQHBhcmFtIGZpbGxDb2xvciBDb2xvciBvZiB0aGUgZmlsbFxyXG4gICAgICogQHBhcmFtIG91dGxpbmUgU3BlY2lmeSB3aGV0aGVyIGFuIG91dGxpbmUgd2lsbCBiZSBkcmF3biBhcm91bmQgdGhlIGNpcmNsZVxyXG4gICAgICogQHBhcmFtIHN0cm9rZUNvbG9yIFNwZWNpZnkgY29sb3IgZm9yIHRoZSBvdXRsaW5lLCBpZiBub3Qgc3BlY2lmaWVkIHRoZSBjb2xvdXIgd2lsbCBiZSB0aGUgc2FtZSBhcyB0aGUgZmlsbCBjb2xvclxyXG4gICAgICovXHJcbiAgICBkb3QoY29udGV4dCwgY29vcmRzLCByYWRpdXMsIGZpbGxDb2xvciwgb3V0bGluZSA9IGZhbHNlLCBzdHJva2VDb2xvciA9IG51bGwpIHtcclxuICAgICAgICAvLyBMZXQncyB1c2UgYmxhY2sgYnkgc2V0dGluZyBSR0IgdmFsdWVzIHRvIDAsIGFuZCAyNTUgYWxwaGEgKGNvbXBsZXRlbHkgb3BhcXVlKVxyXG4gICAgICAgIC8vIFNlbGVjdCBhIGZpbGwgc3R5bGVcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGZpbGxDb2xvcjtcclxuICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IHJhZGl1cztcclxuICAgICAgICAvLyBEcmF3IGEgZmlsbGVkIGNpcmNsZVxyXG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY29udGV4dC5hcmMoY29vcmRzLngsIGNvb3Jkcy55LCByYWRpdXMsIDAsIE1hdGguUEkgKiAyLCB0cnVlKTtcclxuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG4gICAgICAgIGlmIChvdXRsaW5lKSB7XHJcbiAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBzdHJva2VDb2xvciB8fCBmaWxsQ29sb3I7XHJcbiAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqIERyYXcgYSBjaXJjbGUgYXJvdW5kIGEgcG9pbnQuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGNvbnRleHQgQ29udGV4dCBvbiB3aGljaCB0aGUgY2lyY2xlIHdpbGwgYmUgZHJhd25cclxuICAgICAqIEBwYXJhbSBjb29yZHMgQ29vcmRpbmF0ZXMgZm9yIHRoZSBvcmlnaW4gcG9pbnQgb2YgdGhlIGNpcmNsZVxyXG4gICAgICogQHBhcmFtIHJhZGl1cyBUaGUgcmFkaXVzIG9mIHRoZSBjaXJjbGVcclxuICAgICAqIEBwYXJhbSBsaW5lX3dpZHRoIFRoZSBsaW5lIHdpZHRoIG9mIHRoZSBjaXJjbGVcclxuICAgICAqIEBwYXJhbSBjb2xvciBUaGUgY29sb3Igb2YgdGhlIGxpbmVcclxuICAgICAqL1xyXG4gICAgY2lyY2xlKGNvbnRleHQsIGNvb3JkcywgcmFkaXVzLCBsaW5lX3dpZHRoLCBjb2xvcikge1xyXG4gICAgICAgIC8vIExldCdzIHVzZSBibGFjayBieSBzZXR0aW5nIFJHQiB2YWx1ZXMgdG8gMCwgYW5kIDI1NSBhbHBoYSAoY29tcGxldGVseSBvcGFxdWUpXHJcbiAgICAgICAgLy8gU2VsZWN0IGEgZmlsbCBzdHlsZVxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBjb2xvcjtcclxuICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IGxpbmVfd2lkdGg7XHJcbiAgICAgICAgLy8gRHJhdyBhIGZpbGxlZCBjaXJjbGVcclxuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGNvbnRleHQuYXJjKGNvb3Jkcy54LCBjb29yZHMueSwgcmFkaXVzLCAwLCBNYXRoLlBJICogMiwgdHJ1ZSk7XHJcbiAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBEcmF3IGEgbGluZSBiZXR3ZWVuIHRoZSBsYXN0IGtub3duIHBvc2l0aW9uIG9mIHRoZSBtb3VzZSwgYW5kIHRoZSBjdXJyZW50IHBvc2l0aW9uLlxyXG4gICAgICogQHBhcmFtIGNvbnRleHQgVGhlIGNhbnZhcyBjb250ZXh0IHRoYXQgd2UncmUgZHJhd2luZyBvblxyXG4gICAgICogQHBhcmFtIHVwZGF0ZUxhc3QgV2hldGhlciB0byB1cGRhdGUgdGhlIGxhc3QgcG9zaXRpb24gb2YgdGhlIG1vdXNlXHJcbiAgICAgKi9cclxuICAgIG1vdXNlTGluZShjb250ZXh0LCB3aWR0aCwgY29sb3IsIHVwZGF0ZUxhc3QgPSB0cnVlKSB7XHJcbiAgICAgICAgLy8gSWYgbGFzdFggaXMgbm90IHNldCwgc2V0IGxhc3RYIGFuZCBsYXN0WSB0byB0aGUgY3VycmVudCBwb3NpdGlvbiBcclxuICAgICAgICBpZiAodGhpcy5sYXN0LnggPT0gLTEpIHtcclxuICAgICAgICAgICAgdGhpcy5sYXN0LnggPSB0aGlzLm1vdXNlLng7XHJcbiAgICAgICAgICAgIHRoaXMubGFzdC55ID0gdGhpcy5tb3VzZS55O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBTZWxlY3QgYSBmaWxsIHN0eWxlXHJcbiAgICAgICAgY29udGV4dC5zdHJva2VTdHlsZSA9IGNvbG9yO1xyXG4gICAgICAgIC8vIFNldCB0aGUgbGluZSBcImNhcFwiIHN0eWxlIHRvIHJvdW5kLCBzbyBsaW5lcyBhdCBkaWZmZXJlbnQgYW5nbGVzIGNhbiBqb2luIGludG8gZWFjaCBvdGhlclxyXG4gICAgICAgIGNvbnRleHQubGluZUNhcCA9IFwicm91bmRcIjtcclxuICAgICAgICBjb250ZXh0LmxpbmVKb2luID0gXCJyb3VuZFwiO1xyXG4gICAgICAgIC8vIERyYXcgYSBmaWxsZWQgbGluZVxyXG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgLy8gRmlyc3QsIG1vdmUgdG8gdGhlIG9sZCAocHJldmlvdXMpIHBvc2l0aW9uXHJcbiAgICAgICAgY29udGV4dC5tb3ZlVG8odGhpcy5sYXN0LngsIHRoaXMubGFzdC55KTtcclxuICAgICAgICAvLyBOb3cgZHJhdyBhIGxpbmUgdG8gdGhlIGN1cnJlbnQgdG91Y2gvcG9pbnRlciBwb3NpdGlvblxyXG4gICAgICAgIGNvbnRleHQubGluZVRvKHRoaXMubW91c2UueCwgdGhpcy5tb3VzZS55KTtcclxuICAgICAgICAvLyBTZXQgdGhlIGxpbmUgdGhpY2tuZXNzIGFuZCBkcmF3IHRoZSBsaW5lXHJcbiAgICAgICAgY29udGV4dC5saW5lV2lkdGggPSB3aWR0aDtcclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgaWYgKHVwZGF0ZUxhc3QpIHtcclxuICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSBsYXN0IHBvc2l0aW9uIHRvIHJlZmVyZW5jZSB0aGUgY3VycmVudCBwb3NpdGlvblxyXG4gICAgICAgICAgICB0aGlzLmxhc3QueCA9IHRoaXMubW91c2UueDtcclxuICAgICAgICAgICAgdGhpcy5sYXN0LnkgPSB0aGlzLm1vdXNlLnk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBEcmF3IGEgbGluZSBiZXR3ZWVuIHRoZSBzdGFydCBhbmQgZW5kIHBvaW50cy5cclxuICAgICAqIEBwYXJhbSBjb250ZXh0IFRoZSBjYW52YXMgY29udGV4dCB0aGF0IHdlJ3JlIGRyYXdpbmcgb25cclxuICAgICAqIEBwYXJhbSBzdGFydCBTdGFydCBwb2ludFxyXG4gICAgICogQHBhcmFtIGVuZCBFbmQgcG9pbnRcclxuICAgICAqIEBwYXJhbSB3aWR0aCBXaWR0aCBvZiB0aGUgbGluZVxyXG4gICAgICogQHBhcmFtIGNvbG9yIENvbG9yIG9mIHRoZSBsaW5lXHJcbiAgICAgKi9cclxuICAgIGxpbmUoY29udGV4dCwgc3RhcnQsIGVuZCwgd2lkdGgsIGNvbG9yKSB7XHJcbiAgICAgICAgLy8gU2VsZWN0IGEgZmlsbCBzdHlsZVxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBjb2xvcjtcclxuICAgICAgICAvLyBTZXQgdGhlIGxpbmUgXCJjYXBcIiBzdHlsZSB0byByb3VuZCwgc28gbGluZXMgYXQgZGlmZmVyZW50IGFuZ2xlcyBjYW4gam9pbiBpbnRvIGVhY2ggb3RoZXJcclxuICAgICAgICBjb250ZXh0LmxpbmVDYXAgPSBcInJvdW5kXCI7XHJcbiAgICAgICAgY29udGV4dC5saW5lSm9pbiA9IFwicm91bmRcIjtcclxuICAgICAgICAvLyBEcmF3IGEgZmlsbGVkIGxpbmVcclxuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIC8vIEZpcnN0LCBtb3ZlIHRvIHRoZSBvbGQgKHByZXZpb3VzKSBwb3NpdGlvblxyXG4gICAgICAgIGNvbnRleHQubW92ZVRvKHN0YXJ0LngsIHN0YXJ0LnkpO1xyXG4gICAgICAgIC8vIE5vdyBkcmF3IGEgbGluZSB0byB0aGUgY3VycmVudCB0b3VjaC9wb2ludGVyIHBvc2l0aW9uXHJcbiAgICAgICAgY29udGV4dC5saW5lVG8oZW5kLngsIGVuZC55KTtcclxuICAgICAgICAvLyBTZXQgdGhlIGxpbmUgdGhpY2tuZXNzIGFuZCBkcmF3IHRoZSBsaW5lXHJcbiAgICAgICAgY29udGV4dC5saW5lV2lkdGggPSB3aWR0aDtcclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVNb3VzZVBvc2l0aW9uKGUpIHtcclxuICAgICAgICAvLyBpZiB0aGUgYnJvd3NlciBoYXNuJ3QgcGFzc2VkIGEgcGFyYW1ldGVyLCBidXQgaGFzIHNldCB0aGUgZ2xvYmFsIGV2ZW50IHZhcmlhYmxlXHJcbiAgICAgICAgaWYgKCFlKSB7XHJcbiAgICAgICAgICAgIHZhciBlID0gZXZlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChlLm9mZnNldFgpIHtcclxuICAgICAgICAgICAgdGhpcy5tb3VzZS54ID0gZS5vZmZzZXRYO1xyXG4gICAgICAgICAgICB0aGlzLm1vdXNlLnkgPSBlLm9mZnNldFk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdXBkYXRlVG91Y2hQb3NpdGlvbihlKSB7XHJcbiAgICAgICAgLy8gaWYgdGhlIGJyb3dzZXIgaGFzbid0IHBhc3NlZCBhIHBhcmFtZXRlciwgYnV0IGhhcyBzZXQgdGhlIGdsb2JhbCBldmVudCB2YXJpYWJsZVxyXG4gICAgICAgIGlmICghZSkge1xyXG4gICAgICAgICAgICB2YXIgZSA9IGV2ZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZS50b3VjaGVzKSB7XHJcbiAgICAgICAgICAgIC8vIE9ubHkgZGVhbCB3aXRoIG9uZSBmaW5nZXJcclxuICAgICAgICAgICAgaWYgKGUudG91Y2hlcy5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBpbmZvcm1hdGlvbiBmb3IgZmluZ2VyICMxXHJcbiAgICAgICAgICAgICAgICBjb25zdCB0b3VjaCA9IGUudG91Y2hlc1swXTtcclxuICAgICAgICAgICAgICAgIC8vIHRoZSAndGFyZ2V0JyB3aWxsIGJlIHRoZSBjYW52YXMgZWxlbWVudFxyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3VzZS54ID0gdG91Y2gucGFnZVggLSB0b3VjaC50YXJnZXQub2Zmc2V0TGVmdDtcclxuICAgICAgICAgICAgICAgIHRoaXMubW91c2UueSA9IHRvdWNoLnBhZ2VZIC0gdG91Y2gudGFyZ2V0Lm9mZnNldFRvcDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5leHBvcnQgdmFyIERyYXdTdGF0ZTtcclxuKGZ1bmN0aW9uIChEcmF3U3RhdGUpIHtcclxuICAgIERyYXdTdGF0ZVtEcmF3U3RhdGVbXCJEUkFXSU5HXCJdID0gMF0gPSBcIkRSQVdJTkdcIjtcclxuICAgIERyYXdTdGF0ZVtEcmF3U3RhdGVbXCJTVE9QUEVEXCJdID0gMV0gPSBcIlNUT1BQRURcIjtcclxufSkoRHJhd1N0YXRlIHx8IChEcmF3U3RhdGUgPSB7fSkpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kcmF3LmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2J1aWxkL2RyYXdpbmcvZHJhdy5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuLi91dGlsaXR5L3BvaW50XCI7XHJcbmltcG9ydCB7IENvbG9yIH0gZnJvbSBcIi4uL2RyYXdpbmcvY29sb3JcIjtcclxuZXhwb3J0IHZhciBUYW5rVHVyblN0YXRlO1xyXG4oZnVuY3Rpb24gKFRhbmtUdXJuU3RhdGUpIHtcclxuICAgIC8qKiBUaGUgdGFuayBoYXMgcGVyZm9ybWVkIGFuIGFjdGlvbiB0aGlzIHR1cm4sIGUuZy4gbW92ZWQgb3Igc2hvdCAqL1xyXG4gICAgVGFua1R1cm5TdGF0ZVtUYW5rVHVyblN0YXRlW1wiU0hPVFwiXSA9IDBdID0gXCJTSE9UXCI7XHJcbiAgICBUYW5rVHVyblN0YXRlW1RhbmtUdXJuU3RhdGVbXCJNT1ZFRFwiXSA9IDFdID0gXCJNT1ZFRFwiO1xyXG4gICAgLyoqIFRoZSB0YW5rIGhhc24ndCBwZXJmb3JtZWQgYW4gYWN0aW9uIHRoaXMgdHVybiAqL1xyXG4gICAgVGFua1R1cm5TdGF0ZVtUYW5rVHVyblN0YXRlW1wiTk9UX0FDVEVEXCJdID0gMl0gPSBcIk5PVF9BQ1RFRFwiO1xyXG59KShUYW5rVHVyblN0YXRlIHx8IChUYW5rVHVyblN0YXRlID0ge30pKTtcclxuZXhwb3J0IHZhciBUYW5rSGVhbHRoU3RhdGU7XHJcbihmdW5jdGlvbiAoVGFua0hlYWx0aFN0YXRlKSB7XHJcbiAgICAvKiogVGFuayBjYW4gZG8gZXZlcnl0aGluZyAqL1xyXG4gICAgVGFua0hlYWx0aFN0YXRlW1RhbmtIZWFsdGhTdGF0ZVtcIkFMSVZFXCJdID0gMF0gPSBcIkFMSVZFXCI7XHJcbiAgICAvKiogVGFuayBjYW4ndCBtb3ZlICovXHJcbiAgICBUYW5rSGVhbHRoU3RhdGVbVGFua0hlYWx0aFN0YXRlW1wiRElTQUJMRURcIl0gPSAxXSA9IFwiRElTQUJMRURcIjtcclxuICAgIC8qKiBUYW5rIGNhbid0IGRvIGFueXRoaW5nICovXHJcbiAgICBUYW5rSGVhbHRoU3RhdGVbVGFua0hlYWx0aFN0YXRlW1wiREVBRFwiXSA9IDJdID0gXCJERUFEXCI7XHJcbn0pKFRhbmtIZWFsdGhTdGF0ZSB8fCAoVGFua0hlYWx0aFN0YXRlID0ge30pKTtcclxuLyoqIFByb3ZpZGVzIGdyb3VwaW5nIGZvciBhbGwgdGhlIFRhbmsncyBjb2xvcnMgKi9cclxuY2xhc3MgVGFua0NvbG9yIHtcclxuICAgIGNvbnN0cnVjdG9yKGFjdGl2ZSwgYWN0aXZlX291dGxpbmUsIGxhYmVsLCBhbGl2ZSwgZGlzYWJsZWQsIGRlYWQpIHtcclxuICAgICAgICB0aGlzLmFjdGl2ZSA9IGFjdGl2ZTtcclxuICAgICAgICB0aGlzLmFjdGl2ZU91dGxpbmUgPSBhY3RpdmVfb3V0bGluZTtcclxuICAgICAgICB0aGlzLmxhYmVsID0gbGFiZWw7XHJcbiAgICAgICAgdGhpcy5hbGl2ZSA9IGFsaXZlO1xyXG4gICAgICAgIHRoaXMuZGlzYWJsZWQgPSBkaXNhYmxlZDtcclxuICAgICAgICB0aGlzLmRlYWQgPSBkZWFkO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBUYW5rIHtcclxuICAgIGNvbnN0cnVjdG9yKGlkLCBwbGF5ZXIsIHgsIHkpIHtcclxuICAgICAgICAvKiogT3BhY2l0eSBmb3IgdGhlIHRhbmsncyBsYWJlbCAqL1xyXG4gICAgICAgIHRoaXMuTEFCRUxfT1BBQ0lUWSA9IDAuNztcclxuICAgICAgICAvKiogT3BhY2l0eSBmb3IgdGhlIHBsYXllciBjb2xvciB3aGVuIHRoZSB0YW5rIGlzIGRpc2FibGVkICovXHJcbiAgICAgICAgdGhpcy5ESVNBQkxFRF9PUEFDSVRZID0gMC43O1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLnBsYXllciA9IHBsYXllcjtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFBvaW50KHgsIHkpO1xyXG4gICAgICAgIHRoaXMuaGVhbHRoU3RhdGUgPSBUYW5rSGVhbHRoU3RhdGUuQUxJVkU7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25TdGF0ZSA9IFRhbmtUdXJuU3RhdGUuTk9UX0FDVEVEO1xyXG4gICAgICAgIHRoaXMubGFiZWwgPSBcIlwiOyAvLyArIFwiXCIgY29udmVydHMgdG8gc3RyaW5nXHJcbiAgICAgICAgLy8gdGhpcy5sYWJlbCA9IHRoaXMuaWQgKyBcIlwiOyAvLyArIFwiXCIgY29udmVydHMgdG8gc3RyaW5nXHJcbiAgICAgICAgLy8gaW5pdGlhbGlzZSBjb2xvcnMgZm9yIGVhY2ggb2YgdGhlIHRhbmsncyBzdGF0ZXNcclxuICAgICAgICB0aGlzLmNvbG9yID0gbmV3IFRhbmtDb2xvcihDb2xvci5yZWQoKS50b1JHQkEoKSwgQ29sb3IuZ3JlZW4oKS50b1JHQkEoKSwgQ29sb3IuYmxhY2soKS50b1JHQkEodGhpcy5MQUJFTF9PUEFDSVRZKSwgdGhpcy5wbGF5ZXIuY29sb3IudG9SR0JBKCksIHRoaXMucGxheWVyLmNvbG9yLnRvUkdCQSh0aGlzLkRJU0FCTEVEX09QQUNJVFkpLCBDb2xvci5ncmF5KCkudG9SR0JBKCkpO1xyXG4gICAgfVxyXG4gICAgZHJhdyhjb250ZXh0LCBkcmF3KSB7XHJcbiAgICAgICAgbGV0IFtsYWJlbCwgY29sb3JdID0gdGhpcy51aUVsZW1lbnRzKCk7XHJcbiAgICAgICAgZHJhdy5jaXJjbGUoY29udGV4dCwgdGhpcy5wb3NpdGlvbiwgVGFuay5XSURUSCwgVGFuay5MSU5FX1dJRFRILCBjb2xvcik7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yLmxhYmVsO1xyXG4gICAgICAgIGNvbnRleHQuZm9udCA9IFwiMTZweCBDYWxpYnJpXCI7XHJcbiAgICAgICAgLy8gcHV0IHRoZSB0ZXh0IGluIHRoZSBtaWRkbGUgb2YgdGhlIHRhbmtcclxuICAgICAgICBjb250ZXh0LmZpbGxUZXh0KGxhYmVsLCB0aGlzLnBvc2l0aW9uLngsIHRoaXMucG9zaXRpb24ueSArIDUpO1xyXG4gICAgfVxyXG4gICAgdWlFbGVtZW50cygpIHtcclxuICAgICAgICBsZXQgY29sb3I7XHJcbiAgICAgICAgbGV0IGxhYmVsID0gdGhpcy5sYWJlbDtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMuYWN0aW9uU3RhdGUpIHtcclxuICAgICAgICAgICAgY2FzZSBUYW5rVHVyblN0YXRlLlNIT1Q6XHJcbiAgICAgICAgICAgICAgICBsYWJlbCArPSBcIvCfmoBcIjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFRhbmtUdXJuU3RhdGUuTU9WRUQ6XHJcbiAgICAgICAgICAgICAgICBsYWJlbCArPSBcIuKak1wiO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN3aXRjaCAodGhpcy5oZWFsdGhTdGF0ZSkge1xyXG4gICAgICAgICAgICBjYXNlIFRhbmtIZWFsdGhTdGF0ZS5BTElWRTpcclxuICAgICAgICAgICAgICAgIGNvbG9yID0gdGhpcy5jb2xvci5hbGl2ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFRhbmtIZWFsdGhTdGF0ZS5ESVNBQkxFRDpcclxuICAgICAgICAgICAgICAgIGNvbG9yID0gdGhpcy5jb2xvci5kaXNhYmxlZDtcclxuICAgICAgICAgICAgICAgIGxhYmVsICs9IFwi4pm/XCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBUYW5rSGVhbHRoU3RhdGUuREVBRDpcclxuICAgICAgICAgICAgICAgIGNvbG9yID0gdGhpcy5jb2xvci5kZWFkO1xyXG4gICAgICAgICAgICAgICAgbGFiZWwgKz0gXCLwn5KAXCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFtsYWJlbCwgY29sb3JdO1xyXG4gICAgfVxyXG4gICAgaGlnaGxpZ2h0KGNvbnRleHQsIGRyYXcpIHtcclxuICAgICAgICBkcmF3LmRvdChjb250ZXh0LCB0aGlzLnBvc2l0aW9uLCBUYW5rLldJRFRILCB0aGlzLmNvbG9yLmFjdGl2ZSk7XHJcbiAgICAgICAgZHJhdy5jaXJjbGUoY29udGV4dCwgdGhpcy5wb3NpdGlvbiwgVGFuay5NT1ZFTUVOVF9SQU5HRSwgVGFuay5MSU5FX1dJRFRILCB0aGlzLmNvbG9yLmFjdGl2ZU91dGxpbmUpO1xyXG4gICAgfVxyXG4gICAgYWN0aXZlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFjdGlvblN0YXRlICE9PSBUYW5rVHVyblN0YXRlLlNIT1Q7XHJcbiAgICB9XHJcbn1cclxuLyoqIFRoZSB3aWR0aCBvZiB0aGUgZG90IHdoZW4gZHJhd2luZyB0aGUgdGFuayAqL1xyXG5UYW5rLldJRFRIID0gMTI7XHJcbi8qKiBUaGUgem9uZSBhcm91bmQgdGhlIHRhbmsgdGhhdCB3aWxsIGNhdXNlIGl0IHRvIGJlIGRpc2FibGVkIGluc3RlYWQgb2Yga2lsbGVkICovXHJcblRhbmsuRElTQUJMRURfWk9ORSA9IDAuNTtcclxuLyoqIFRoZSB3aWR0aCBvZiB0aGUgbGluZSB3aGVuIGRyYXdpbmcgdGhlIHRhbmsgKi9cclxuVGFuay5MSU5FX1dJRFRIID0gMTtcclxuLyoqIEhvdyBmYXIgY2FuIHRoZSB0YW5rIG1vdmUgKi9cclxuVGFuay5NT1ZFTUVOVF9SQU5HRSA9IDEwMDtcclxuLyoqIFRoZSB3aWR0aCBvZiB0aGUgbW92ZW1lbnQgbGluZSAqL1xyXG5UYW5rLk1PVkVNRU5UX0xJTkVfV0lEVEggPSAzO1xyXG4vKiogVGhlIGNvbG9yIG9mIHRoZSBtb3ZlbWVudCBsaW5lICovXHJcblRhbmsuTU9WRU1FTlRfTElORV9DT0xPUiA9IENvbG9yLmJsYWNrKCkudG9SR0JBKCk7XHJcbi8qKiBIb3cgZmFyIGNhbiB0aGUgc2hvdCBsaW5lIHJlYWNoICovXHJcblRhbmsuU0hPT1RJTkdfUkFOR0UgPSA0MDk7XHJcbi8qKiBIb3cgZmFzdCBtdXN0IHRoZSBwbGF5ZXIgbW92ZSBmb3IgYSB2YWxpZCBzaG90ICovXHJcblRhbmsuU0hPT1RJTkdfU1BFRUQgPSAzMDtcclxuLyoqIFRoZSBkZWFkem9uZSBhbGxvd2VkIGZvciBmcmVlIG1vdXNlIG1vdmVtZW50IGJlZm9yZSB0aGUgcGxheWVyIHNob290cy5cclxuICogVGhpcyBtZWFucyB0aGF0IHRoZSBwbGF5ZXIgY2FuIHdpZ2dsZSB0aGUgY3Vyc29yIGFyb3VuZCBpbiB0aGUgdGFuaydzIHNwYWNlXHJcbiAqIHRvIHByZXBhcmUgZm9yIHRoZSBzaG90LlxyXG4gKi9cclxuVGFuay5TSE9PVElOR19ERUFEWk9ORSA9IFRhbmsuV0lEVEggKyAyO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD10YW5rLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2J1aWxkL2dhbWVPYmplY3RzL3RhbmsuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGNsYXNzIFBvaW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHggPSAtMSwgeSA9IC0xKSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgfVxyXG4gICAgY29weSgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMueCwgdGhpcy55KTtcclxuICAgIH1cclxuICAgIHRvU3RyaW5nKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnggKyBcIixcIiArIHRoaXMueTtcclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1wb2ludC5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9idWlsZC91dGlsaXR5L3BvaW50LmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IFBvaW50IH0gZnJvbSBcIi4vcG9pbnRcIjtcclxuY2xhc3MgUG9pbnRNYXRoIHtcclxuICAgIC8qKlxyXG4gICAgICogQ2FsY3VsYXRlIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIHR3byBwb2ludHMsIG9uIGEgMkQgcGxhbmUgdXNpbmcgUHl0aG9nb3JlYW4gVGhlb3JlbVxyXG4gICAgICogQHBhcmFtIHN0YXJ0IEZpcnN0IHBvaW50IHdpdGggMkQgY29vcmRpbmF0ZXNcclxuICAgICAqIEBwYXJhbSBlbmQgU2Vjb25kIHBvaW50IHdpdGggMkQgY29vcmRpbmF0ZXNcclxuICAgICAqL1xyXG4gICAgZGlzdDJkKHN0YXJ0LCBlbmQpIHtcclxuICAgICAgICBjb25zdCBkZWx0YVggPSBlbmQueCAtIHN0YXJ0Lng7XHJcbiAgICAgICAgY29uc3QgZGVsdGFZID0gZW5kLnkgLSBzdGFydC55O1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoTWF0aC5hYnMoZGVsdGFYICogZGVsdGFYICsgZGVsdGFZICogZGVsdGFZKSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIENhbGN1bGF0ZSBpZiB0aGUgcG9pbnQgY29sbGlkZXMgd2l0aCB0aGUgY2lyY2xlLlxyXG4gICAgICogQHBhcmFtIHBvaW50IFRoZSBjb29yZGluYXRlcyBvZiB0aGUgcG9pbnQgKHVzZXIncyBjbGljaylcclxuICAgICAqIEBwYXJhbSBjZW50ZXIgVGhlIGNlbnRyZSBvZiB0aGUgY2lyY2xlXHJcbiAgICAgKiBAcGFyYW0gcmFkaXVzIFRoZSByYWRpdXMgb2YgdGhlIGNpcmNsZVxyXG4gICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGVyZSBpcyBjb2xsaXNpb24sIGZhbHNlIG90aGVyd2lzZVxyXG4gICAgICovXHJcbiAgICBjb2xsaWRlQ2lyY2xlKHBvaW50LCBjZW50ZXIsIHJhZGl1cykge1xyXG4gICAgICAgIGNvbnN0IGRpc3RhbmNlID0gdGhpcy5kaXN0MmQocG9pbnQsIGNlbnRlcik7XHJcbiAgICAgICAgaWYgKGRpc3RhbmNlID4gcmFkaXVzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIGlmIHRoZSBwb2ludCBpcyB3aXRoaW4gdGhlIHN0YXJ0IGFuZCBlbmQgb2YgdGhlIGxpbmVcclxuICAgICAqIEBwYXJhbSBwb2ludCBDb29yaWRuYXRlcyBvZiBhIHBvaW50XHJcbiAgICAgKiBAcGFyYW0gc3RhcnQgU3RhcnQgY29vcmRpbmF0ZXMgb2YgYSBsaW5lXHJcbiAgICAgKiBAcGFyYW0gZW5kIEVuZCBjb29yZGluYXRlcyBvZiBhIGxpbmVcclxuICAgICAqL1xyXG4gICAgd2l0aGluKHBvaW50LCBzdGFydCwgZW5kKSB7XHJcbiAgICAgICAgLy8gSW5pdGlhbCBpbXBsZW1lbnRhdGlvbjogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzMyODEyMi8yODIzNTI2XHJcbiAgICAgICAgLy8gT3B0aW1pc2F0aW9uIGFuZCBjb3JyZWN0aW9uOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzI4MTEwLzI4MjM1MjZcclxuICAgICAgICAvLyBhcyB0aGUgcG9pbnQgaXMgZ3VhcmFudGVlZCB0byBiZSBvbiB0aGUgbGluZSBieSBMaW5lOjpjbG9zZXN0UG9pbnQsIHdlIGp1c3QgY2hlY2sgaWYgdGhlIHBvaW50IGlzIHdpdGhpbiB0aGUgbGluZVxyXG4gICAgICAgIGNvbnN0IHdpdGhpbiA9IChzdGFydCwgcG9pbnQsIGVuZCkgPT4gKHN0YXJ0IDw9IHBvaW50ICYmIHBvaW50IDw9IGVuZCkgfHwgKGVuZCA8PSBwb2ludCAmJiBwb2ludCA8PSBzdGFydCk7XHJcbiAgICAgICAgcmV0dXJuIHN0YXJ0LnggIT09IGVuZC54ID8gd2l0aGluKHN0YXJ0LngsIHBvaW50LngsIGVuZC54KSA6IHdpdGhpbihzdGFydC55LCBwb2ludC55LCBlbmQueSk7XHJcbiAgICB9XHJcbn1cclxuY2xhc3MgTGluZSB7XHJcbiAgICAvKiogRmluZCB0aGUgY2xvc2VzdCBwb2ludCBvbiBhIGxpbmUuIFRoZSBjbG9zZXN0IHBvaW50IHRvXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHN0YXJ0IFN0YXJ0IHBvaW50IG9mIHRoZSBsaW5lXHJcbiAgICAgKiBAcGFyYW0gZW5kIEVuZCBwb2ludCBvZiB0aGUgbGluZVxyXG4gICAgICogQHBhcmFtIHBvaW50IFBvaW50IGZvciB3aGljaCB0aGUgY2xvc2VzdCBwb2ludCBvbiB0aGUgbGluZSB3aWxsIGJlIGZvdW5kLlxyXG4gICAgICovXHJcbiAgICBjbG9zZXN0UG9pbnQoc3RhcnQsIGVuZCwgcG9pbnQpIHtcclxuICAgICAgICBjb25zdCBBMSA9IGVuZC55IC0gc3RhcnQueSwgQjEgPSBzdGFydC54IC0gZW5kLng7XHJcbiAgICAgICAgLy8gdHVybiB0aGUgbGluZSBpdG8gZXF1YXRpb24gb2YgdGhlIGZvcm0gQXggKyBCeSA9IENcclxuICAgICAgICBjb25zdCBDMSA9IEExICogc3RhcnQueCArIEIxICogc3RhcnQueTtcclxuICAgICAgICAvLyBmaW5kIHRoZSBwZXJwZW5kaWN1bGFyIGxpbmUgdGhhdCBwYXNzZXMgdGhyb3VnaCB0aGUgbGluZSBhbmQgdGhlIG91dHNpZGUgcG9pbnRcclxuICAgICAgICBjb25zdCBDMiA9IC1CMSAqIHBvaW50LnggKyBBMSAqIHBvaW50Lnk7XHJcbiAgICAgICAgLy8gZmluZCB0aGUgZGV0ZXJtaW5hbnQgb2YgdGhlIHR3byBlcXVhdGlvbnMgYWxnZWJyYWljYWxseVxyXG4gICAgICAgIGNvbnN0IGRldCA9IEExICogQTEgKyBCMSAqIEIxO1xyXG4gICAgICAgIGNvbnN0IGNsb3Nlc3RQb2ludCA9IG5ldyBQb2ludCgpO1xyXG4gICAgICAgIC8vIHVzZSBDcmFtZXIncyBSdWxlIHRvIHNvbHZlIGZvciB0aGUgcG9pbnQgb2YgaW50ZXJzZWN0aW9uXHJcbiAgICAgICAgaWYgKGRldCAhPSAwKSB7XHJcbiAgICAgICAgICAgIGNsb3Nlc3RQb2ludC54ID0gKEExICogQzEgLSBCMSAqIEMyKSAvIGRldDtcclxuICAgICAgICAgICAgY2xvc2VzdFBvaW50LnkgPSAoQTEgKiBDMiArIEIxICogQzEpIC8gZGV0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY2xvc2VzdFBvaW50LnggPSBwb2ludC54O1xyXG4gICAgICAgICAgICBjbG9zZXN0UG9pbnQueSA9IHBvaW50Lnk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjbG9zZXN0UG9pbnQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybiB0aGUgZGlzdGFuY2UgZnJvbSB0aGUgbGluZSB0byB0aGUgY2VudGVyIG9mIHRoZSBjaXJjbGUuXHJcbiAgICAgKiBUaGlzIGlzIGRvbmUgYnkgZmluZGluZyB0aGUgbGVuZ3RoIG9mIHRoZSBwZXJwZW5kaWN1bGFyIGxpbmUgdGhhdCBwYXNzZXMgdGhyb3VnaCB0aGUgbGluZSBhbmQgY2lyY2xlJ3MgY2VudGVyXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHN0YXJ0IFN0YXJ0IGNvb3JkaW5hdGVzIG9mIHRoZSBsaW5lXHJcbiAgICAgKiBAcGFyYW0gZW5kIEVuZCBjb29yZGluYXRlcyBvZiB0aGUgbGluZVxyXG4gICAgICogQHBhcmFtIGNlbnRlciBDZW50ZXIgb2YgdGhlIGNpcmNsZVxyXG4gICAgICogQHJldHVybnMgSWYgdGhlIGNpcmNsZSdzIGNlbnRlciBpcyB3aXRoaW4gdGhlIGxpbmUsIHRoZW4gdGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlbSB3aWxsIGJlIHJldHVybmVkLFxyXG4gICAgICogICAgICAgICAgaWYgdGhlIGNpcmNsZSdzIGNlbnRlciBpcyBub3Qgd2l0aGluIHRoZSBsaW5lLCAtMSB3aWxsIGJlIHJldHVybmVkXHJcbiAgICAgKi9cclxuICAgIGRpc3RDaXJjbGVDZW50ZXIoc3RhcnQsIGVuZCwgY2VudGVyKSB7XHJcbiAgICAgICAgLy8gZmluZCB0aGUgY2xvc2VzdCBwb2ludCB0byB0aGUgY2lyY2xlLCBvbiB0aGUgbGluZVxyXG4gICAgICAgIGNvbnN0IGNsb3Nlc3RQb2ludCA9IHRoaXMuY2xvc2VzdFBvaW50KHN0YXJ0LCBlbmQsIGNlbnRlcik7XHJcbiAgICAgICAgLy8gY2hlY2sgaWYgdGhlIGNsb3Nlc3QgcG9pbnQgaXMgd2l0aGluIHRoZSBzdGFydCBhbmQgZW5kIG9mIHRoZSBsaW5lLCBcclxuICAgICAgICAvLyBhbmQgbm90IHNvbWV3aGVyZSBhbG9uZyBpdHMgaW5maW5pdGUgZXh0ZW5zaW9uXHJcbiAgICAgICAgaWYgKFRhbmtzTWF0aC5wb2ludC53aXRoaW4oY2xvc2VzdFBvaW50LCBzdGFydCwgZW5kKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gVGFua3NNYXRoLnBvaW50LmRpc3QyZChjbG9zZXN0UG9pbnQsIGNlbnRlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayBpZiB0aGUgY2lyY2xlIGlzIGNvbGxpZGluZyB3aXRoIHRoZSBsaW5lXHJcbiAgICAgKiBAcGFyYW0gc3RhcnQgU3RhcnQgY29vcmRpbmF0ZXMgb2YgdGhlIGxpbmVcclxuICAgICAqIEBwYXJhbSBlbmQgRW5kIGNvb3JkaW5hdGVzIG9mIHRoZSBsaW5lXHJcbiAgICAgKiBAcGFyYW0gY2VudGVyIENlbnRlciBwb2ludCBvZiB0aGUgY2lyY2xlXHJcbiAgICAgKiBAcGFyYW0gcmFkaXVzIFJhZGl1cyBvZiB0aGUgY2lyY2xlXHJcbiAgICAgKi9cclxuICAgIGNvbGxpZGVDaXJjbGUoc3RhcnQsIGVuZCwgY2VudGVyLCByYWRpdXMpIHtcclxuICAgICAgICBjb25zdCBkaXN0ID0gdGhpcy5kaXN0Q2lyY2xlQ2VudGVyKHN0YXJ0LCBlbmQsIGNlbnRlcik7XHJcbiAgICAgICAgLy8gaWYgZGlzdGFuY2UgaXMgdW5kZWZpbmVkLCBvciBpcyBmdXJ0aGVyIHRoYW4gdGhlIHJhZGl1cywgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgcmV0dXJuIGRpc3QgPT09IC0xIHx8IGRpc3QgPiByYWRpdXMgPyBmYWxzZSA6IHRydWU7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIFRhbmtzTWF0aCB7XHJcbn1cclxuVGFua3NNYXRoLnBvaW50ID0gbmV3IFBvaW50TWF0aCgpO1xyXG5UYW5rc01hdGgubGluZSA9IG5ldyBMaW5lKCk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRhbmtzTWF0aC5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9idWlsZC91dGlsaXR5L3RhbmtzTWF0aC5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcclxuICogSlNPTiB0byBIVE1MIHBhcnNlci5cclxuICpcclxuICogQ29weXJpZ2h0IDIwMTggRGltaXRhciBUYXNldlxyXG4gKlxyXG4gKiBQZXJtaXNzaW9uIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBhbmQvb3IgZGlzdHJpYnV0ZSB0aGlzIHNvZnR3YXJlIGZvciBhbnkgcHVycG9zZVxyXG4gKiB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLCBwcm92aWRlZCB0aGF0IHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlXHJcbiAqIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIGFwcGVhciBpbiBhbGwgY29waWVzLlxyXG4gKlxyXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXHJcbiAqIFJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkRcclxuICogRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsIElORElSRUNULFxyXG4gKiBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTSBMT1NTIE9GIFVTRSwgREFUQVxyXG4gKiBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUiBPVEhFUiBUT1JUSU9VUyBBQ1RJT04sXHJcbiAqIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SIFBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXHJcbiAqXHJcbiAqIEBhdXRob3IgRGltaXRhciBUYXNldiAyMDE4XHJcbiovXHJcbmV4cG9ydCBjbGFzcyBKMkgge1xyXG4gICAgLyoqXHJcbiAgICAqIENvbnZlcnQgdGhlIEpTT04gdG8gSFRNTC5cclxuICAgICogLSBVc2FnZTpcclxuICAgICogYGBgXHJcbiAgICAqIGNvbnN0IGRlc2NyaXB0aW9uID0ge1xyXG4gICAgKiAgIFwiZGl2XCI6e1xyXG4gICAgKiAgICAgICBcImNsYXNzTmFtZVwiOlwic3R5bGUxXCIsXHJcbiAgICAqICAgICAgIFwiY2hpbGRyZW5cIjpbe1xyXG4gICAgKiAgICAgICAgICBcImlucHV0XCI6e1xyXG4gICAgKiAgICAgICAgICAgICAgIFwiaWRcIjogXCJ1c2VybmFtZS1pbnB1dC1pZFwiLFxyXG4gICAgKiAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInRleHRcIixcclxuICAgICogICAgICAgICAgICAgICBcIm9uY2xpY2tcIjogXCJteS1mdW5jLW5hbWUoKVwiLCAvL29yIGp1c3QgbXktZnVuYy1uYW1lLCB3aXRob3V0IHF1b3RhdGlvbiBtYXJrc1xyXG4gICAgKiAgICAgICAgICAgfVxyXG4gICAgKiAgICAgICB9LHtcclxuICAgICogICAgICAgICAgIFwiaW5wdXRcIjp7XHJcbiAgICAqICAgICAgICAgICAgICAgXCJpZFwiOiBcInBhc3N3b3JkLWlucHV0LWlkXCIsXHJcbiAgICAqICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicGFzc3dvcmRcIlxyXG4gICAgKiAgICAgICAgICAgfVxyXG4gICAgKiAgICAgICB9XVxyXG4gICAgKiAgIH1cclxuICAgICogfVxyXG4gICAgKiBgYGBcclxuICAgICogTm90YWJsZSBzeW50YXggaXM6XHJcbiAgICAqIC0gVG9wIGxldmVsIGVsZW1lbnQ6XHJcbiAgICAqIGBgYFxyXG4gICAgKiB7XHJcbiAgICAqIFwiZGl2XCI6XHJcbiAgICAqICAgICAgLy8gTk9URTogcHJvcGVydGllcyBoZXJlIE1VU1QgbWF0Y2ggdGhlIHByb3BlcnRpZXMgYXZhaWxhYmxlIHRvIHRoZSBIVE1MIGVsZW1lbnRcclxuICAgICogICAgICBcImNsYXNzTmFtZVwiOiBcIi4uLlwiLFxyXG4gICAgKiAgICAgICAvLyB3aWxsIGRvIG5vdGhpbmcsIGFzIGRpdiBkb2Vzbid0IHN1cHBvcnQgdGl0bGVcclxuICAgICogICAgICBcInRpdGxlXCI6XCIuLi5cIlxyXG4gICAgKiAgICAgIFwiLi4uXCJcclxuICAgICogfVxyXG4gICAgKiBgYGBcclxuICAgICogLSBDaGlsZCBlbGVtZW50c1xyXG4gICAgKiBgYGBcclxuICAgICoge1xyXG4gICAgKiBcImRpdlwiOlxyXG4gICAgKiAgIFwiY2xhc3NOYW1lXCI6IFwibXktZGl2LXN0eWxlXCIsXHJcbiAgICAqICAgLy8gdGhlIGxpc3QgaXMgdXNlZCB0byBwcmVzZXJ2ZSB0aGUgb3JkZXIgb2YgdGhlIGNoaWxkcmVuXHJcbiAgICAqICAgXCJjaGlsZHJlblwiOlt7XHJcbiAgICAqICAgICAgIFwiYVwiOntcclxuICAgICogICAgICAgICAgIFwidGV4dFwiOlwiQXBwbGVzXCIsXHJcbiAgICAqICAgICAgICAgICBcImNsYXNzTmFtZVwiOiBcIm15LXN0eWxlc1wiXHJcbiAgICAqICAgICAgIH1cclxuICAgICogICB9LHtcclxuICAgICogICAgICAgXCJpbnB1dFwiOntcclxuICAgICogICAgICAgICAgIFwiY2xhc3NOYW1lXCI6IFwibXktaW5wdXQtc3R5bGVcIlxyXG4gICAgKiAgICAgICB9XHJcbiAgICAqICAgfV1cclxuICAgICogfVxyXG4gICAgKiBgYGBcclxuICAgICogQHBhcmFtIGRpY3QgRGljdGlvbmFyeSBjb250YWluaW5nIHRoZSBkZXNjcmlwdGlvbiBvZiB0aGUgSFRNTFxyXG4gICAgKi9cclxuICAgIHN0YXRpYyBwYXJzZShkaWN0KSB7XHJcbiAgICAgICAgY29uc3QgW3BhcmVudCwgcHJvcHNdID0gSjJILmdldFBhcmVudChkaWN0KTtcclxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBwcm9wcykge1xyXG4gICAgICAgICAgICBpZiAoa2V5ID09PSBcImNoaWxkcmVuXCIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkcmVuID0gcHJvcHNbXCJjaGlsZHJlblwiXTtcclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZHJlbiBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBwIG9mIGNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChKMkgucGFyc2UocCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChKMkgucGFyc2UoY2hpbGRyZW4pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChrZXkgPT09IFwib25jbGlja1wiKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB0aGVyZSdzIG5vIG5lZWQgdG8gZG8gdGhpcyBmb3IgYnV0dG9ucywgdGhlIG9uY2xpY2sgYXR0cmlidXRlIGlzIHByZXNlbnQgZm9yIHRoZW1cclxuICAgICAgICAgICAgICAgIHBhcmVudC5zZXRBdHRyaWJ1dGUoXCJvbmNsaWNrXCIsIHByb3BzW2tleV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcGFyZW50W2tleV0gPSBwcm9wc1trZXldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwYXJlbnQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBhbiBIVE1MIGVsZW1lbnQgZnJvbSB0aGUga2V5IGluIHRoZSBkaWN0aW9uYXJ5LCByZXR1cm4gdGhlIHZhbHVlc1xyXG4gICAgICogQHBhcmFtIGRpY3QgRGljdGlvbmFyeSB3aXRoIDEga2V5LCBhbmQgc29tZSB2YWx1ZXNcclxuICAgICAqIEByZXR1cm5zIEhUTUxFbGVtZW50IG9mIHRoZSBrZXkgaW4gdGhlIGRpY3Rpb25hcnksIGFuZCBhbGwgb2YgaXRzIHZhbHVlc1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0UGFyZW50KGRpY3QpIHtcclxuICAgICAgICBsZXQgcGFyZW50LCBwcm9wcztcclxuICAgICAgICAvLyBnZXQgdGhlIGZpcnN0IGtleSBpbiB0aGUgZGljdGlvbmFyeVxyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIGRpY3QpIHtcclxuICAgICAgICAgICAgcGFyZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChrZXkpO1xyXG4gICAgICAgICAgICBwcm9wcyA9IGRpY3Rba2V5XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFtwYXJlbnQsIHByb3BzXTtcclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1qc29uMmh0bWwuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYnVpbGQvanNvbjJodG1sLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydCB7IEFjdGlvbnMgfSBmcm9tICcuL2FjdGlvbic7XHJcbmV4cG9ydCB7IFNwZWVkIH0gZnJvbSAnLi9zcGVlZCc7XHJcbmV4cG9ydCB7IExlbmd0aCB9IGZyb20gJy4vbGVuZ3RoJztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYnVpbGQvbGltaXRlcnMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgUyB9IGZyb20gXCIuLi91dGlsaXR5L3N0cmluZ0Zvcm1hdFwiO1xyXG5leHBvcnQgY2xhc3MgQ29sb3Ige1xyXG4gICAgY29uc3RydWN0b3IocmVkLCBncmVlbiwgYmx1ZSwgYWxwaGEgPSAxLjApIHtcclxuICAgICAgICB0aGlzLnJlZCA9IHJlZDtcclxuICAgICAgICB0aGlzLmdyZWVuID0gZ3JlZW47XHJcbiAgICAgICAgdGhpcy5ibHVlID0gYmx1ZTtcclxuICAgICAgICB0aGlzLmFscGhhID0gYWxwaGE7XHJcbiAgICB9XHJcbiAgICB0b1JHQkEoYWxwaGEpIHtcclxuICAgICAgICBhbHBoYSA9IGFscGhhICE9PSB1bmRlZmluZWQgPyBhbHBoYSA6IHRoaXMuYWxwaGE7XHJcbiAgICAgICAgcmV0dXJuIFMuZm9ybWF0KFwicmdiYSglcywlcywlcywlcylcIiwgdGhpcy5yZWQsIHRoaXMuZ3JlZW4sIHRoaXMuYmx1ZSwgYWxwaGEpO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIG5leHQoKSB7XHJcbiAgICAgICAgaWYgKENvbG9yLmNvbG9yID09IDApIHtcclxuICAgICAgICAgICAgQ29sb3IuY29sb3IrKztcclxuICAgICAgICAgICAgcmV0dXJuIENvbG9yLnJlZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChDb2xvci5jb2xvciA9PSAxKSB7XHJcbiAgICAgICAgICAgIENvbG9yLmNvbG9yKys7XHJcbiAgICAgICAgICAgIHJldHVybiBDb2xvci5ibHVlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKENvbG9yLmNvbG9yID09IDIpIHtcclxuICAgICAgICAgICAgQ29sb3IuY29sb3IrKztcclxuICAgICAgICAgICAgcmV0dXJuIENvbG9yLmdyZWVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKENvbG9yLmNvbG9yID09IDMpIHtcclxuICAgICAgICAgICAgQ29sb3IuY29sb3IrKztcclxuICAgICAgICAgICAgcmV0dXJuIENvbG9yLnllbGxvdygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJZb3UndmUgdXNlZCBhbGwgdGhlIGF2YWlsYWJsZSBjb2xvdXJzIVwiKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyByZWQoYWxwaGEgPSAxLjApIHtcclxuICAgICAgICByZXR1cm4gbmV3IENvbG9yKDI1NSwgMCwgMCwgYWxwaGEpO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdyZWVuKGFscGhhID0gMS4wKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDb2xvcigwLCAyNTUsIDAsIGFscGhhKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBibHVlKGFscGhhID0gMS4wKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDb2xvcigwLCAwLCAyNTUsIGFscGhhKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBibGFjayhhbHBoYSA9IDEuMCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgQ29sb3IoMCwgMCwgMCwgYWxwaGEpO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHdoaXRlKGFscGhhID0gMS4wKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDb2xvcigyNTUsIDI1NSwgMjU1LCBhbHBoYSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgeWVsbG93KGFscGhhID0gMS4wKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDb2xvcigyNTUsIDI1NSwgMCwgYWxwaGEpO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdyYXkoYWxwaGEgPSAxLjApIHtcclxuICAgICAgICByZXR1cm4gbmV3IENvbG9yKDEyOCwgMTI4LCAxMjgsIGFscGhhKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBwaW5rKGFscGhhID0gMS4wKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDb2xvcigyNTUsIDEwMiwgMjAzLCBhbHBoYSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYyhyZWQsIGdyZWVuLCBibHVlLCBhbHBoYSA9IDEuMCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgQ29sb3IocmVkLCBncmVlbiwgYmx1ZSwgYWxwaGEpO1xyXG4gICAgfVxyXG59XHJcbkNvbG9yLmNvbG9yID0gMDtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29sb3IuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYnVpbGQvZHJhd2luZy9jb2xvci5qc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgY2xhc3MgUyB7XHJcbiAgICBzdGF0aWMgZm9ybWF0KC4uLmEpIHtcclxuICAgICAgICByZXR1cm4gYS5yZWR1Y2UoKHAsIGMpID0+IHAucmVwbGFjZSgvJXMvLCBjKSk7XHJcbiAgICB9XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3RyaW5nRm9ybWF0LmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2J1aWxkL3V0aWxpdHkvc3RyaW5nRm9ybWF0LmpzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydCBjb25zdCBOVU1fUExBWUVSUyA9IDI7XHJcbmV4cG9ydCBjb25zdCBOVU1fVEFOS1MgPSAxO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1nYW1lU2V0dGluZ3MuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYnVpbGQvZ2FtZVNldHRpbmdzLmpzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIENsYXNzZXMgYWRkZWQgdG8gdGhlIGB3aW5kb3dgIG9iamVjdCBhcmUgZ2xvYmFsLCBhbmQgdmlzaWJsZSBpbnNpZGUgdGhlIEhUTUwgY29kZS5cclxuLy8gQW55IGNsYXNzZXMgbm90IGFkZGVkIHRvIHRoZSBgd2luZG93YCBhcmUgaW52aXNpYmxlIChub3QgYWNjZXNzaWJsZSkgZnJvbSB0aGUgSFRNTC5cclxuLy8gR2xvYmFsIGNsYXNzZXNcclxuaW1wb3J0IENvbnRyb2xzIGZyb20gJy4vc2l0ZUNvbnRyb2xzJztcclxud2luZG93W1wiQ29udHJvbHNcIl0gPSBDb250cm9scztcclxuLy8gSW50ZXJuYWwgY2xhc3Nlc1xyXG5pbXBvcnQgeyBVaSB9IGZyb20gXCIuL3VpXCI7XHJcbmltcG9ydCB7IEdhbWVDb250cm9sbGVyLCBHYW1lU3RhdGUgfSBmcm9tICcuL2dhbWVDb250cm9sbGVyJztcclxuaW1wb3J0IHsgVmlld3BvcnQgfSBmcm9tICcuL2dhbWVNYXAvdmlld3BvcnQnO1xyXG5jb25zdCBJRF9HQU1FX0NBTlZBUyA9IFwidGFua3MtY2FudmFzXCI7XHJcbmNvbnN0IElEX0dBTUVfVUkgPSBcInRhbmtzLXVpXCI7XHJcbi8vIFNldC11cCB0aGUgY2FudmFzIGFuZCBhZGQgb3VyIGV2ZW50IGhhbmRsZXJzIGFmdGVyIHRoZSBwYWdlIGhhcyBsb2FkZWRcclxuZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIC8vIGNvbnN0IHdpZHRoID0gd2luZG93LmlubmVyV2lkdGggLSAzMjtcclxuICAgIGNvbnN0IHdpZHRoID0gNDA5NjtcclxuICAgIC8vIHRha2UgOTAlIG9mIHRoZSB3aW5kb3csIGxlYXZlIGEgYml0IG9mIGdhcCBvbiB0aGUgcmlnaHRcclxuICAgIC8vIGNvbnN0IGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCAqIDAuOTtcclxuICAgIGNvbnN0IGhlaWdodCA9IDQwOTY7XHJcbiAgICBjb25zdCB1aSA9IG5ldyBVaShJRF9HQU1FX1VJLCB3aWR0aCk7XHJcbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChJRF9HQU1FX0NBTlZBUyk7XHJcbiAgICBjYW52YXMud2lkdGggPSB3aWR0aDtcclxuICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICB3aW5kb3cub25zY3JvbGwgPSAoZSkgPT4ge1xyXG4gICAgICAgIHVpLnVwZGF0ZShlKTtcclxuICAgIH07XHJcbiAgICBjb25zdCB2aWV3cG9ydCA9IG5ldyBWaWV3cG9ydChjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xyXG4gICAgdmlld3BvcnQubWlkZGxlKCk7XHJcbiAgICBjb25zdCBjb250cm9sbGVyID0gbmV3IEdhbWVDb250cm9sbGVyKGNhbnZhcywgY2FudmFzLmdldENvbnRleHQoXCIyZFwiKSwgdWksIHZpZXdwb3J0KTtcclxuICAgIC8vIHN0YXJ0IHRoZSBnYW1lIGluIE1lbnUgc3RhdGVcclxuICAgIGNvbnRyb2xsZXIuY2hhbmdlR2FtZVN0YXRlKEdhbWVTdGF0ZS5NRU5VKTtcclxuICAgIGNhbnZhcy5zY3JvbGxJbnRvVmlldygpO1xyXG59XHJcbmluaXQoKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWFpbi5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9idWlsZC9tYWluLmpzXG4vLyBtb2R1bGUgaWQgPSAxMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDb250cm9scyB7XHJcbiAgICBzdGF0aWMgdG9nZ2xlX3czX3Nob3coZWxlbSkge1xyXG4gICAgICAgIGlmIChlbGVtLmNsYXNzTmFtZS5pbmRleE9mKFwidzMtc2hvd1wiKSA9PSAtMSkge1xyXG4gICAgICAgICAgICBlbGVtLmNsYXNzTmFtZSArPSBcIiB3My1zaG93XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBlbGVtLmNsYXNzTmFtZSA9IGVsZW0uY2xhc3NOYW1lLnJlcGxhY2UoXCIgdzMtc2hvd1wiLCBcIlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgdzNfb3BlbigpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15U2lkZWJhclwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlPdmVybGF5XCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgdzNfY2xvc2UoKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteVNpZGViYXJcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlPdmVybGF5XCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zaXRlQ29udHJvbHMuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYnVpbGQvc2l0ZUNvbnRyb2xzLmpzXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBKMkggfSBmcm9tIFwiLi9qc29uMmh0bWxcIjtcclxuY2xhc3MgVWlTZWN0aW9uIHtcclxuICAgIGNvbnN0cnVjdG9yKGVsZW0pIHtcclxuICAgICAgICB0aGlzLnBhcmVudCA9IGVsZW07XHJcbiAgICB9XHJcbiAgICBhZGQoZWxlbSkge1xyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudC5pbm5lckhUTUwgPT09IFwiJm5ic3A7XCIpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wYXJlbnQuYXBwZW5kQ2hpbGQoZWxlbSk7XHJcbiAgICB9XHJcbiAgICBjbGVhcigpIHtcclxuICAgICAgICB0aGlzLnBhcmVudC5pbm5lckhUTUwgPSBcIiZuYnNwO1wiO1xyXG4gICAgfVxyXG4gICAgaHRtbCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQ7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIFVpIHtcclxuICAgIGNvbnN0cnVjdG9yKGlkLCB3aWR0aCkge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgIGlmICghdGhpcy5jb250YWluZXIpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIFVJIERPTSBlbGVtZW50IHdhcyBub3QgZm91bmQhXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNldFdpZHRoKHdpZHRoKTtcclxuICAgICAgICBjb25zdCBsZWZ0ID0ge1xyXG4gICAgICAgICAgICBcImRpdlwiOiB7XHJcbiAgICAgICAgICAgICAgICBcImNsYXNzTmFtZVwiOiBcInczLWNvbCBzMSBtMSBsMVwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMubGVmdCA9IG5ldyBVaVNlY3Rpb24oSjJILnBhcnNlKGxlZnQpKTtcclxuICAgICAgICBjb25zdCBtaWRkbGUgPSB7XHJcbiAgICAgICAgICAgIFwiZGl2XCI6IHtcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NOYW1lXCI6IFwidzMtY29sIHMxMCBtMTAgbDEwXCIsXHJcbiAgICAgICAgICAgICAgICBcInN0eWxlXCI6IFwidGV4dC1hbGlnbjpjZW50ZXI7XCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5taWRkbGUgPSBuZXcgVWlTZWN0aW9uKEoySC5wYXJzZShtaWRkbGUpKTtcclxuICAgICAgICBjb25zdCByaWdodCA9IHtcclxuICAgICAgICAgICAgXCJkaXZcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJjbGFzc05hbWVcIjogXCJ3My1jb2wgczEgbTEgbDFcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnJpZ2h0ID0gbmV3IFVpU2VjdGlvbihKMkgucGFyc2UocmlnaHQpKTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmxlZnQuaHRtbCgpKTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLm1pZGRsZS5odG1sKCkpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMucmlnaHQuaHRtbCgpKTtcclxuICAgIH1cclxuICAgIHNldFdpZHRoKHdpZHRoKSB7XHJcbiAgICAgICAgLy8gYXMgYW55IGlnbm9yZXMgdGhlIHJlYWQtb25seSBcInN0eWxlXCIgd2FybmluZywgYXMgd2UgbmVlZCB0byB3cml0ZSB0aGUgd2lkdGggb2YgdGhlIGNhbnZhcyB0byB0aGUgd2lkdGggb2YgdGhlIFVJIGVsZW1lbnRcclxuICAgICAgICAvLyB0aGUgd2lkdGggKyAyIHJlbW92ZXMgdGhlIHNtYWxsIGdhcCBsZWZ0IG9uIHRoZSByaWdodCwgd2hpY2ggaXMgdGhlcmUgZm9yIGFuIHVua25vd24gcmVhc29uXHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUgPSBcIndpZHRoOlwiICsgKHdpZHRoICsgMikgKyBcInB4XCI7XHJcbiAgICB9XHJcbiAgICBjbGVhcigpIHtcclxuICAgICAgICB0aGlzLmxlZnQuY2xlYXIoKTtcclxuICAgICAgICB0aGlzLm1pZGRsZS5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMucmlnaHQuY2xlYXIoKTtcclxuICAgIH1cclxuICAgIHNldFBsYXllcihuYW1lKSB7XHJcbiAgICAgICAgdGhpcy5taWRkbGUuYWRkKEoySC5wYXJzZSh7XHJcbiAgICAgICAgICAgIFwiYlwiOiB7XHJcbiAgICAgICAgICAgICAgICBcInRleHRDb250ZW50XCI6IG5hbWUgKyBcIidzIHR1cm4uXCIsXHJcbiAgICAgICAgICAgICAgICBcImNsYXNzTmFtZVwiOiBcImZhLTJ4XCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuICAgIHVwZGF0ZShlKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIubGVmdCA9IHdpbmRvdy52aXN1YWxWaWV3cG9ydC5wYWdlTGVmdDtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci50b3AgPSB3aW5kb3cudmlzdWFsVmlld3BvcnQucGFnZVRvcDtcclxuICAgIH1cclxufVxyXG5VaS5JRF9CVVRUT05fU0tJUF9UVVJOID0gXCJ0YW5rcy11aS1idXR0b24tc2tpcHR1cm5cIjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dWkuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYnVpbGQvdWkuanNcbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IERyYXcsIERyYXdTdGF0ZSB9IGZyb20gXCIuLi9kcmF3aW5nL2RyYXdcIjtcclxuaW1wb3J0ICogYXMgTGltaXQgZnJvbSBcIi4uL2xpbWl0ZXJzL2luZGV4XCI7XHJcbmltcG9ydCB7IEdhbWVTdGF0ZSB9IGZyb20gXCIuLi9nYW1lQ29udHJvbGxlclwiO1xyXG5pbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuLi91dGlsaXR5L3BvaW50XCI7XHJcbmltcG9ydCB7IFRhbmssIFRhbmtIZWFsdGhTdGF0ZSwgVGFua1R1cm5TdGF0ZSB9IGZyb20gXCIuLi9nYW1lT2JqZWN0cy90YW5rXCI7XHJcbmltcG9ydCB7IEoySCB9IGZyb20gXCIuLi9qc29uMmh0bWxcIjtcclxuY2xhc3MgTW92aW5nVWkge1xyXG4gICAgc3RhdGljIGJ1dHRvbl9za2lwVHVybigpIHtcclxuICAgICAgICByZXR1cm4gSjJILnBhcnNlKHtcclxuICAgICAgICAgICAgXCJidXR0b25cIjoge1xyXG4gICAgICAgICAgICAgICAgXCJzdHlsZVwiOiBcIndpZHRoOjEwMCVcIixcclxuICAgICAgICAgICAgICAgIFwidGV4dENvbnRlbnRcIjogXCJTa2lwIFR1cm5cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYnV0dG9uX2dvVG9TaG9vdGluZygpIHtcclxuICAgICAgICByZXR1cm4gSjJILnBhcnNlKHtcclxuICAgICAgICAgICAgXCJidXR0b25cIjoge1xyXG4gICAgICAgICAgICAgICAgXCJzdHlsZVwiOiBcIndpZHRoOjEwMCVcIixcclxuICAgICAgICAgICAgICAgIFwiY2hpbGRyZW5cIjoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NOYW1lXCI6IFwiZmFzIGZhLXJvY2tldFwiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIE1vdmluZ1N0YXRlIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbnRyb2xsZXIsIGNvbnRleHQsIHVpLCBwbGF5ZXIsIHZpZXdwb3J0KSB7XHJcbiAgICAgICAgdGhpcy5zdGFydE1vdmVtZW50ID0gKGUpID0+IHtcclxuICAgICAgICAgICAgLy8gbGltaXQgdGhlIHN0YXJ0IG9mIHRoZSBsaW5lIHRvIGJlIHRoZSB0YW5rXHJcbiAgICAgICAgICAgIHRoaXMuZHJhdy5sYXN0ID0gbmV3IFBvaW50KHRoaXMuYWN0aXZlLnBvc2l0aW9uLngsIHRoaXMuYWN0aXZlLnBvc2l0aW9uLnkpO1xyXG4gICAgICAgICAgICAvLyBsaW1pdCB0aGUgbGVuZ3RoIG9mIHRoZSBsaW5lIHRvIHRoZSBtYXhpbXVtIGFsbG93ZWQgdGFuayBtb3ZlbWVudCwgYW5kIGRpc2FibGVkIHRhbmtzIGNhbid0IGJlIG1vdmVkXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmxpbmUuaW4odGhpcy5hY3RpdmUucG9zaXRpb24sIHRoaXMuZHJhdy5tb3VzZSkgJiYgdGhpcy5hY3RpdmUuaGVhbHRoU3RhdGUgIT09IFRhbmtIZWFsdGhTdGF0ZS5ESVNBQkxFRCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3LnN0YXRlID0gRHJhd1N0YXRlLkRSQVdJTkc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbGlkTW92ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmVuZE1vdmVtZW50ID0gKGUpID0+IHtcclxuICAgICAgICAgICAgLy8gcmVzZXQgdGhlIGxpbmUgbGltaXQgYXMgdGhlIHVzZXIgaGFzIGxldCBnbyBvZiB0aGUgYnV0dG9uXHJcbiAgICAgICAgICAgIHRoaXMubGluZS5yZXNldCgpO1xyXG4gICAgICAgICAgICAvLyBvbmx5IGFjdCBpZiB0aGUgcG9zaXRpb24gaXMgdmFsaWRcclxuICAgICAgICAgICAgaWYgKHRoaXMudGFua1ZhbGlkUG9zaXRpb24pIHtcclxuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgcG9zaXRpb24gb2YgdGhlIHRhbmsgaW4gdGhlIHBsYXllciBhcnJheVxyXG4gICAgICAgICAgICAgICAgY29uc3QgdGFuayA9IHRoaXMucGxheWVyLnRhbmtzW3RoaXMuYWN0aXZlLmlkXTtcclxuICAgICAgICAgICAgICAgIHRhbmsucG9zaXRpb24gPSB0aGlzLmRyYXcubW91c2UuY29weSgpO1xyXG4gICAgICAgICAgICAgICAgdGFuay5hY3Rpb25TdGF0ZSA9IFRhbmtUdXJuU3RhdGUuTU9WRUQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuc2hvd1VzZXJXYXJuaW5nKFwiXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZW5kVHVybigpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5lbmRUdXJuRWFybHkgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRW5kaW5nIHR1cm4gZWFybHlcIik7XHJcbiAgICAgICAgICAgIC8vIHNldCB0aGUgYWN0aXZlIHRhbmsgdG8gYmUgdGhlIG9uZSB0aGF0IHdhcyBvcmlnaW5hbGx5IHNlbGVjdGVkXHJcbiAgICAgICAgICAgIC8vIHRoaXMgd2lsbCB0ZWxsIHRoZSBzZWxlY3Rpb24gc3RhdGUgdG8gZ28gdG8gc2hvb3Rpbmcgd2l0aG91dCBhIG5ldyBzZWxlY3Rpb25cclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIuYWN0aXZlVGFuay5zZXQodGhpcy5hY3RpdmUpO1xyXG4gICAgICAgICAgICAvLyBydW4gdGhlIGVuZCBvZiB0dXJuIGFjdGlvblxyXG4gICAgICAgICAgICB0aGlzLmVuZFR1cm4oKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZ29Ub1Nob290aW5nID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllci50YW5rc1t0aGlzLmFjdGl2ZS5pZF0uYWN0aW9uU3RhdGUgPSBUYW5rVHVyblN0YXRlLk1PVkVEO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllci5hY3RpdmVUYW5rLnNldCh0aGlzLnBsYXllci50YW5rc1t0aGlzLmFjdGl2ZS5pZF0pO1xyXG4gICAgICAgICAgICB0aGlzLmRyYXcuc3RhdGUgPSBEcmF3U3RhdGUuU1RPUFBFRDtcclxuICAgICAgICAgICAgLy8gcmVkcmF3IGNhbnZhcyB3aXRoIGFsbCBjdXJyZW50IHRhbmtzXHJcbiAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5yZWRyYXdDYW52YXModGhpcy5kcmF3KTtcclxuICAgICAgICAgICAgLy8gZ28gdG8gdGFuayBzZWxlY3Rpb24gc3RhdGVcclxuICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLmNoYW5nZUdhbWVTdGF0ZShHYW1lU3RhdGUuVEFOS19TRUxFQ1RJT04pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5kcmF3TW92ZUxpbmUgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmRyYXcudXBkYXRlTW91c2VQb3NpdGlvbihlKTtcclxuICAgICAgICAgICAgLy8gZHJhdyB0aGUgbW92ZW1lbnQgbGluZSBpZiB0aGUgbW91c2UgYnV0dG9uIGlzIGN1cnJlbnRseSBiZWluZyBwcmVzc2VkXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRyYXcuc3RhdGUgPT0gRHJhd1N0YXRlLkRSQVdJTkcpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxpbmUuaW4odGhpcy5hY3RpdmUucG9zaXRpb24sIHRoaXMuZHJhdy5tb3VzZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbGlkTW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50YW5rVmFsaWRQb3NpdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIgPSBjb250cm9sbGVyO1xyXG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBwbGF5ZXI7XHJcbiAgICAgICAgdGhpcy51aSA9IHVpO1xyXG4gICAgICAgIHRoaXMuZHJhdyA9IG5ldyBEcmF3KCk7XHJcbiAgICAgICAgdGhpcy5saW5lID0gbmV3IExpbWl0Lkxlbmd0aChUYW5rLk1PVkVNRU5UX1JBTkdFKTtcclxuICAgICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMucGxheWVyLmFjdGl2ZVRhbmsuZ2V0KCk7XHJcbiAgICAgICAgdmlld3BvcnQuZ29UbyhwbGF5ZXIudmlld3BvcnRQb3NpdGlvbik7XHJcbiAgICAgICAgY29uc3QgYnV0dG9uX2dvVG9TaG9vdGluZyA9IE1vdmluZ1VpLmJ1dHRvbl9nb1RvU2hvb3RpbmcoKTtcclxuICAgICAgICBidXR0b25fZ29Ub1Nob290aW5nLm9uY2xpY2sgPSB0aGlzLmdvVG9TaG9vdGluZztcclxuICAgICAgICB0aGlzLnVpLmxlZnQuYWRkKGJ1dHRvbl9nb1RvU2hvb3RpbmcpO1xyXG4gICAgfVxyXG4gICAgYWRkRXZlbnRMaXN0ZW5lcnMoY2FudmFzKSB7XHJcbiAgICAgICAgY2FudmFzLm9ubW91c2Vkb3duID0gdGhpcy5zdGFydE1vdmVtZW50O1xyXG4gICAgICAgIGNhbnZhcy5vbm1vdXNlbW92ZSA9IHRoaXMuZHJhd01vdmVMaW5lO1xyXG4gICAgICAgIC8vIHRoZSBtb3VzZXVwIGlzIG9ubHkgb24gdGhlIGNhbnZhcywgb3RoZXJ3aXNlIG5vbmUgb2YgdGhlIFVJIGJ1dHRvbnMgY2FuIGJlIGNsaWNrZWRcclxuICAgICAgICBjYW52YXMub25tb3VzZXVwID0gdGhpcy5lbmRNb3ZlbWVudDtcclxuICAgICAgICAvLyBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMudG91Y2hNb3ZlLCBmYWxzZSk7XHJcbiAgICAgICAgLy8gY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5tb3VzZVVwLCBmYWxzZSk7XHJcbiAgICAgICAgLy8gY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMudG91Y2hNb3ZlLCBmYWxzZSk7XHJcbiAgICB9XHJcbiAgICB2YWxpZE1vdmUoKSB7XHJcbiAgICAgICAgdGhpcy50YW5rVmFsaWRQb3NpdGlvbiA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5kcmF3Lm1vdXNlTGluZSh0aGlzLmNvbnRleHQsIFRhbmsuTU9WRU1FTlRfTElORV9XSURUSCwgVGFuay5NT1ZFTUVOVF9MSU5FX0NPTE9SKTtcclxuICAgIH1cclxuICAgIC8qKiBUaGUgYWN0aW9uIHRvIGJlIHRha2VuIGF0IHRoZSBlbmQgb2YgdGhlIHR1cm4gKi9cclxuICAgIGVuZFR1cm4oKSB7XHJcbiAgICAgICAgdGhpcy5kcmF3LnN0YXRlID0gRHJhd1N0YXRlLlNUT1BQRUQ7XHJcbiAgICAgICAgLy8gcmVkcmF3IGNhbnZhcyB3aXRoIGFsbCBjdXJyZW50IHRhbmtzXHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLnJlZHJhd0NhbnZhcyh0aGlzLmRyYXcpO1xyXG4gICAgICAgIC8vIGdvIHRvIHRhbmsgc2VsZWN0aW9uIHN0YXRlXHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLmNoYW5nZUdhbWVTdGF0ZShHYW1lU3RhdGUuVEFOS19TRUxFQ1RJT04pO1xyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1vdmVtZW50LmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2J1aWxkL2dhbWVTdGF0ZXMvbW92ZW1lbnQuanNcbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydCBjbGFzcyBBY3Rpb25zIHtcclxuICAgIGNvbnN0cnVjdG9yKGxpbWl0ID0gNSkge1xyXG4gICAgICAgIHRoaXMubGltaXQgPSBsaW1pdDtcclxuICAgICAgICB0aGlzLm51bV9hY3Rpb25zID0gMDtcclxuICAgIH1cclxuICAgIHRha2UoKSB7XHJcbiAgICAgICAgdGhpcy5udW1fYWN0aW9ucyArPSAxO1xyXG4gICAgfVxyXG4gICAgLyoqIEVuZCB0aGUgdHVybiBlYXJseSAqL1xyXG4gICAgZW5kKCkge1xyXG4gICAgICAgIHRoaXMubnVtX2FjdGlvbnMgPSB0aGlzLmxpbWl0O1xyXG4gICAgfVxyXG4gICAgb3ZlcigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5udW1fYWN0aW9ucyA+PSB0aGlzLmxpbWl0O1xyXG4gICAgfVxyXG4gICAgcmVzZXQoKSB7XHJcbiAgICAgICAgdGhpcy5udW1fYWN0aW9ucyA9IDA7XHJcbiAgICB9XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YWN0aW9uLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2J1aWxkL2xpbWl0ZXJzL2FjdGlvbi5qc1xuLy8gbW9kdWxlIGlkID0gMTRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgVGFua3NNYXRoIH0gZnJvbSBcIi4uL3V0aWxpdHkvdGFua3NNYXRoXCI7XHJcbmV4cG9ydCBjbGFzcyBTcGVlZCB7XHJcbiAgICAvKipcclxuICAgICAqIENhbGN1YWx0ZXMgYW5kIGtlZXBzIHRyYWNrIG9mIHRoZSB0b3RhbCBsZW5ndGggb2YgYSBsaW5lLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBsaW1pdCBNYXhpbXVtIGxlbmd0aCBvZiBlYWNoIGxpbmUsIGluIGNhbnZhcyBwaXhlbHNcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobGltaXQgPSAyMCkge1xyXG4gICAgICAgIHRoaXMubGltaXQgPSBsaW1pdDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2sgaWYgdGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIHR3byBwb2ludHMgaXMgZ3JlYXRlciB0aGFuIHRoZSBsaW1pdC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gc3RhcnQgU3RhcnQgY29vcmRpbmF0ZXNcclxuICAgICAqIEBwYXJhbSBlbmQgRW5kIGNvb3JkaW5hdGVzXHJcbiAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBkaXN0YW5jZSBpcyBncmVhdGVyIHRoYW4gdGhlIGxpbWl0LCBmYWxzZSBvdGhlcndpc2VcclxuICAgICAqL1xyXG4gICAgZW5vdWdoKHN0YXJ0LCBlbmQpIHtcclxuICAgICAgICBjb25zdCBkaXN0YW5jZSA9IFRhbmtzTWF0aC5wb2ludC5kaXN0MmQoc3RhcnQsIGVuZCk7XHJcbiAgICAgICAgcmV0dXJuIGRpc3RhbmNlID49IHRoaXMubGltaXQ7XHJcbiAgICB9XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3BlZWQuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYnVpbGQvbGltaXRlcnMvc3BlZWQuanNcbi8vIG1vZHVsZSBpZCA9IDE1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IFRhbmtzTWF0aCB9IGZyb20gXCIuLi91dGlsaXR5L3RhbmtzTWF0aFwiO1xyXG5leHBvcnQgY2xhc3MgTGVuZ3RoIHtcclxuICAgIC8qKlxyXG4gICAgICogQ2FsY3VhbHRlcyBhbmQga2VlcHMgdHJhY2sgb2YgdGhlIHRvdGFsIGxlbmd0aCBvZiBhIGxpbmUuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGxpbWl0IE1heGltdW0gbGVuZ3RoIG9mIGVhY2ggbGluZSwgaW4gY2FudmFzIHBpeGVsc1xyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihsaW1pdCA9IDIwMCkge1xyXG4gICAgICAgIHRoaXMubGltaXQgPSBsaW1pdDtcclxuICAgICAgICB0aGlzLmN1cnJlbnQgPSAwO1xyXG4gICAgfVxyXG4gICAgcmVzZXQoKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gMDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQ2FsY3VsYXRlIGRpc3RhbmNlIG9mIENhcnRlc2lhbiBjb29yZGluYXRlcywgYW5kIGluY3JlbWVudCB0aGUgdG90YWwgbGVuZ3RoIG9mIHRoZSBsaW5lLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBzdGFydCBTdGFydCBjb29yZGluYXRlc1xyXG4gICAgICogQHBhcmFtIGVuZCBFbmQgY29vcmRpbmF0ZXNcclxuICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIGxpbmUgaXMgYmVsb3cgdGhlIGxpbWl0LCBmYWxzZSBpZiB0aGUgbGluZSBpcyBsb25nZXIgdGhhbiB0aGUgbGltaXRcclxuICAgICAqL1xyXG4gICAgYWRkKHN0YXJ0LCBlbmQpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnQgKz0gVGFua3NNYXRoLnBvaW50LmRpc3QyZChzdGFydCwgZW5kKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlNob3QgdG90YWwgZGlzdGFuY2U6IFwiLCB0aGlzLmN1cnJlbnQpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnQgPD0gdGhpcy5saW1pdDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2sgaWYgdGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIHR3byBwb2ludHMgaXMgZ3JlYXRlciB0aGFuIHRoZSBsaW1pdC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gc3RhcnQgU3RhcnQgY29vcmRpbmF0ZXNcclxuICAgICAqIEBwYXJhbSBlbmQgRW5kIGNvb3JkaW5hdGVzXHJcbiAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBsaW5lIGlzIGJlbG93IHRoZSBsaW1pdCwgZmFsc2Ugb3RoZXJ3aXNlXHJcbiAgICAgKi9cclxuICAgIGluKHN0YXJ0LCBlbmQpIHtcclxuICAgICAgICBjb25zdCBkaXN0YW5jZSA9IFRhbmtzTWF0aC5wb2ludC5kaXN0MmQoc3RhcnQsIGVuZCk7XHJcbiAgICAgICAgcmV0dXJuIGRpc3RhbmNlIDw9IHRoaXMubGltaXQ7XHJcbiAgICB9XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bGVuZ3RoLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2J1aWxkL2xpbWl0ZXJzL2xlbmd0aC5qc1xuLy8gbW9kdWxlIGlkID0gMTZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgR2FtZVN0YXRlIH0gZnJvbSBcIi4uL2dhbWVDb250cm9sbGVyXCI7XHJcbmltcG9ydCB7IFRhbmsgfSBmcm9tIFwiLi4vZ2FtZU9iamVjdHMvdGFua1wiO1xyXG5pbXBvcnQgeyBEcmF3IH0gZnJvbSBcIi4uL2RyYXdpbmcvZHJhd1wiO1xyXG5pbXBvcnQgKiBhcyBTZXR0aW5ncyBmcm9tICcuLi9nYW1lU2V0dGluZ3MnO1xyXG5pbXBvcnQgKiBhcyBMaW1pdCBmcm9tIFwiLi4vbGltaXRlcnMvaW5kZXhcIjtcclxuZXhwb3J0IGNsYXNzIFBsYWNpbmdTdGF0ZSB7XHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY29udHJvbGxlciBUaGUgZXZlbnRzIGNvbnRyb2xsZXIsIHdoaWNoIGlzIHVzZWQgdG8gY2hhbmdlIHRoZSBnYW1lIHN0YXRlIGFmdGVyIHRoaXMgZXZlbnQgaXMgZmluaXNoZWQuXHJcbiAgICAgKiBAcGFyYW0gY29udGV4dCBDb250ZXh0IG9uIHdoaWNoIHRoZSBvYmplY3RzIGFyZSBkcmF3blxyXG4gICAgICogQHBhcmFtIHBsYXllclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihjb250cm9sbGVyLCBjb250ZXh0LCB1aSwgcGxheWVyLCB2aWV3cG9ydCkge1xyXG4gICAgICAgIHRoaXMuYWRkVGFuayA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhdy51cGRhdGVNb3VzZVBvc2l0aW9uKGUpO1xyXG4gICAgICAgICAgICAvLyBpZiB0aGUgZnV0dXJlIHdpbGwgY2hlY2sgaWYgaXQgY29sbGlkZXMgd2l0aCBhbm90aGVyIHRhbmsgb3IgdGVycmFpblxyXG4gICAgICAgICAgICBjb25zdCB0YW5rID0gbmV3IFRhbmsodGhpcy5wbGF5ZXIudGFua3MubGVuZ3RoLCB0aGlzLnBsYXllciwgdGhpcy5kcmF3Lm1vdXNlLngsIHRoaXMuZHJhdy5tb3VzZS55KTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIudGFua3MucHVzaCh0YW5rKTtcclxuICAgICAgICAgICAgdGFuay5kcmF3KHRoaXMuY29udGV4dCwgdGhpcy5kcmF3KTtcclxuICAgICAgICAgICAgLy8gcGxheWVyIGhhcyBwbGFjZWQgYSB0YW5rXHJcbiAgICAgICAgICAgIHRoaXMudGFua3NQbGFjZWQudGFrZSgpO1xyXG4gICAgICAgICAgICAvLyBpZiB3ZSd2ZSBwbGFjZWQgYXMgbWFueSBvYmplY3RzIGFzIGFsbG93ZWQsIHRoZW4gZ28gdG8gbmV4dCBzdGF0ZVxyXG4gICAgICAgICAgICAvLyBuZXh0X3BsYXllciBpcyBub3QgY2hhbmdlZCBoZXJlLCBhcyBpdCdzIHNldCBpbiB0aGUgY29udHJvbGxlclxyXG4gICAgICAgICAgICBpZiAodGhpcy50YW5rc1BsYWNlZC5vdmVyKCkpIHtcclxuICAgICAgICAgICAgICAgIFBsYWNpbmdTdGF0ZS5wbGF5ZXJzVGFua1BsYWNlbWVudC50YWtlKCk7XHJcbiAgICAgICAgICAgICAgICAvLyBhbGwgb2YgdGhlIHBsYXllcnMgaGF2ZSBwbGFjZWQgdGhlaXIgdGFua3MsIGdvIHRvIG1vdmluZyBzdGF0ZVxyXG4gICAgICAgICAgICAgICAgaWYgKFBsYWNpbmdTdGF0ZS5wbGF5ZXJzVGFua1BsYWNlbWVudC5vdmVyKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuY2hhbmdlR2FtZVN0YXRlKEdhbWVTdGF0ZS5UQU5LX1NFTEVDVElPTik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuY2hhbmdlR2FtZVN0YXRlKEdhbWVTdGF0ZS5UQU5LX1BMQUNFTUVOVCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuY29udHJvbGxlciA9IGNvbnRyb2xsZXI7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcclxuICAgICAgICB0aGlzLmRyYXcgPSBuZXcgRHJhdygpO1xyXG4gICAgICAgIHRoaXMudGFua3NQbGFjZWQgPSBuZXcgTGltaXQuQWN0aW9ucyhTZXR0aW5ncy5OVU1fVEFOS1MpO1xyXG4gICAgICAgIHRoaXMucGxheWVyID0gcGxheWVyO1xyXG4gICAgICAgIHRoaXMudWkgPSB1aTtcclxuICAgICAgICB2aWV3cG9ydC5nb1RvKHBsYXllci52aWV3cG9ydFBvc2l0aW9uKTtcclxuICAgIH1cclxuICAgIGFkZEV2ZW50TGlzdGVuZXJzKGNhbnZhcykge1xyXG4gICAgICAgIGNhbnZhcy5vbm1vdXNlZG93biA9IHRoaXMuYWRkVGFuaztcclxuICAgIH1cclxufVxyXG4vLyBrZWVwcyB0cmFjayBvZiBob3cgbWFueSBwbGF5ZXJzIGhhdmUgcGxhY2VkIHRoZWlyIHRhbmtzIElOIFRPVEFMXHJcblBsYWNpbmdTdGF0ZS5wbGF5ZXJzVGFua1BsYWNlbWVudCA9IG5ldyBMaW1pdC5BY3Rpb25zKFNldHRpbmdzLk5VTV9QTEFZRVJTKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGxhY2VtZW50LmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2J1aWxkL2dhbWVTdGF0ZXMvcGxhY2VtZW50LmpzXG4vLyBtb2R1bGUgaWQgPSAxN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBKMkggfSBmcm9tIFwiLi4vanNvbjJodG1sXCI7XHJcbmltcG9ydCB7IEdhbWVTdGF0ZSB9IGZyb20gXCIuLi9nYW1lQ29udHJvbGxlclwiO1xyXG5pbXBvcnQgeyBEcmF3LCBEcmF3U3RhdGUgfSBmcm9tIFwiLi4vZHJhd2luZy9kcmF3XCI7XHJcbmltcG9ydCB7IFRhbmssIFRhbmtUdXJuU3RhdGUgfSBmcm9tIFwiLi4vZ2FtZU9iamVjdHMvdGFua1wiO1xyXG5pbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuLi91dGlsaXR5L3BvaW50XCI7XHJcbmltcG9ydCB7IFRhbmtzTWF0aCB9IGZyb20gXCIuLi91dGlsaXR5L3RhbmtzTWF0aFwiO1xyXG5pbXBvcnQgeyBMaW5lIH0gZnJvbSBcIi4uL3V0aWxpdHkvbGluZVwiO1xyXG5pbXBvcnQgKiBhcyBMaW1pdCBmcm9tIFwiLi4vbGltaXRlcnMvaW5kZXhcIjtcclxuY2xhc3MgU2hvb3RpbmdVaSB7XHJcbiAgICBzdGF0aWMgYnV0dG9uX3NraXBUdXJuKCkge1xyXG4gICAgICAgIHJldHVybiBKMkgucGFyc2Uoe1xyXG4gICAgICAgICAgICBcImJ1dHRvblwiOiB7XHJcbiAgICAgICAgICAgICAgICBcInN0eWxlXCI6IFwid2lkdGg6MTAwJVwiLFxyXG4gICAgICAgICAgICAgICAgXCJ0ZXh0Q29udGVudFwiOiBcIlNraXBcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIFNob290aW5nU3RhdGUge1xyXG4gICAgY29uc3RydWN0b3IoY29udHJvbGxlciwgY29udGV4dCwgdWksIHBsYXllciwgdmlld3BvcnQpIHtcclxuICAgICAgICAvKiogV2hldGhlciB0aGUgc2hvdCB3YXMgc3VjY2Vzc2Z1bGx5IGZpcmVkLCB3aWxsIGJlIHNldCB0byB0cnVlIGlmIHRoZSBzaG90IGlzIGZhc3QgZW5vdWdoICovXHJcbiAgICAgICAgdGhpcy5zdWNjZXNzZnVsU2hvdCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuc3RhcnRTaG9vdGluZyA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhdy51cGRhdGVNb3VzZVBvc2l0aW9uKGUpO1xyXG4gICAgICAgICAgICB0aGlzLmRyYXcubGFzdCA9IG5ldyBQb2ludCh0aGlzLmFjdGl2ZS5wb3NpdGlvbi54LCB0aGlzLmFjdGl2ZS5wb3NpdGlvbi55KTtcclxuICAgICAgICAgICAgLy8gcmVzZXRzIHRoZSBzdWNjZXNzZnVsIHNob3QgZmxhZ1xyXG4gICAgICAgICAgICB0aGlzLnN1Y2Nlc3NmdWxTaG90ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIC8vIHRoZSBwbGF5ZXIgbXVzdCBzdGFydCBzaG9vdGluZyBmcm9tIHRoZSB0YW5rXHJcbiAgICAgICAgICAgIGNvbnN0IHRhbmsgPSB0aGlzLnBsYXllci50YW5rc1t0aGlzLmFjdGl2ZS5pZF07XHJcbiAgICAgICAgICAgIGlmIChUYW5rc01hdGgucG9pbnQuY29sbGlkZUNpcmNsZSh0aGlzLmRyYXcubW91c2UsIHRhbmsucG9zaXRpb24sIFRhbmsuV0lEVEgpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiB0aGUgbW91c2UgaXMgd2l0aGluIHRoZSB0YW5rXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50YW5rUm9hbWluZ0xlbmd0aC5pbih0aGlzLmFjdGl2ZS5wb3NpdGlvbiwgdGhpcy5kcmF3Lm1vdXNlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHNob3QgY29sbGlzaW9uIHN0YXJ0cyBmcm9tIHRoZSBjZW50cmUgb2YgdGhlIHRhbmtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3RQYXRoLnBvaW50cy5wdXNoKHRoaXMuYWN0aXZlLnBvc2l0aW9uLmNvcHkoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmF3LnN0YXRlID0gRHJhd1N0YXRlLkRSQVdJTkc7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52YWxpZFJhbmdlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNsaWNrIGRpZCBub3QgY29sbGlkZSB3aXRoIHRoZSBhY3RpdmUgdGFua1wiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5jb250aW51ZVNob290aW5nID0gKGUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5kcmF3LnVwZGF0ZU1vdXNlUG9zaXRpb24oZSk7XHJcbiAgICAgICAgICAgIC8vIGRyYXcgdGhlIG1vdmVtZW50IGxpbmUgaWYgdGhlIG1vdXNlIGJ1dHRvbiBpcyBjdXJyZW50bHkgYmVpbmcgcHJlc3NlZFxyXG4gICAgICAgICAgICBpZiAodGhpcy5kcmF3LnN0YXRlID09IERyYXdTdGF0ZS5EUkFXSU5HKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiB0aGUgcGxheWVyIGlzIGp1c3QgbW92aW5nIGFib3V0IG9uIHRoZSB0YW5rJ3Mgc3BhY2VcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRhbmtSb2FtaW5nTGVuZ3RoLmluKHRoaXMuYWN0aXZlLnBvc2l0aW9uLCB0aGlzLmRyYXcubW91c2UpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSb2FtaW5nIGluIHRhbmsgc3BhY2VcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLnNob3dVc2VyV2FybmluZyhcIlwiKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbGlkUmFuZ2UoKTtcclxuICAgICAgICAgICAgICAgIH0gLy8gaWYgdGhlIHBsYXllciBoYXMgc2hvdCBmYXIgYXdheSBzdGFydCBkcmF3aW5nIHRoZSBsaW5lXHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLnNob3RTcGVlZC5lbm91Z2godGhpcy5hY3RpdmUucG9zaXRpb24sIHRoaXMuZHJhdy5tb3VzZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNob290aW5nIVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuc2hvd1VzZXJXYXJuaW5nKFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFsaWRSYW5nZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIG9ubHkgYWRkIHRvIHRoZSBzaG90IHBhdGggaWYgdGhlIHNob3Qgd2FzIHN1Y2Nlc3NmdWxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3RQYXRoLnBvaW50cy5wdXNoKHRoaXMuZHJhdy5tb3VzZS5jb3B5KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBzaG90IGhhcyByZWFjaGVkIHRoZSBtYXggYWxsb3dlZCBsaW1pdCB3ZSBzdG9wIHRoZSBkcmF3aW5nLCB0aGlzIGlzIGFuIGFydGlmaWNpYWxcclxuICAgICAgICAgICAgICAgICAgICAvLyBsaW1pdGF0aW9uIHRvIHN0b3AgYSBzaG90IHRoYXQgZ29lcyBhbG9uZyB0aGUgd2hvbGUgc2NyZWVuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnNob3RMZW5ndGguYWRkKHRoaXMuYWN0aXZlLnBvc2l0aW9uLCB0aGlzLmRyYXcubW91c2UpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU3VjY2Vzc2Z1bCBzaG90IVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdWNjZXNzZnVsU2hvdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhdy5zdGF0ZSA9IERyYXdTdGF0ZS5TVE9QUEVEO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5zaG93VXNlcldhcm5pbmcoXCJTaG9vdGluZyB0b28gc2xvdyFcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTaG9vdGluZyB0b28gc2xvdyFcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmF3LnN0YXRlID0gRHJhd1N0YXRlLlNUT1BQRUQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuc3RvcFNob290aW5nID0gKGUpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcGxheWVyVGFua3NTaG90ID0gdGhpcy5wbGF5ZXIudGFua3NTaG90LmdldCgpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zdWNjZXNzZnVsU2hvdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLmNvbGxpZGUodGhpcy5zaG90UGF0aCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuY2FjaGVMaW5lKHRoaXMuc2hvdFBhdGgpO1xyXG4gICAgICAgICAgICAgICAgcGxheWVyVGFua3NTaG90LnRha2UoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlLmFjdGlvblN0YXRlID0gVGFua1R1cm5TdGF0ZS5TSE9UO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGlmIGFsbCB0aGUgcGxheWVyJ3MgdGFuayBoYXZlIHNob3RcclxuICAgICAgICAgICAgaWYgKHBsYXllclRhbmtzU2hvdC5vdmVyKCkpIHtcclxuICAgICAgICAgICAgICAgIC8vIHJlc2V0IHRoZSBjdXJyZW50IHBsYXllcidzIHRhbmsgYWN0IHN0YXRlc1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXIucmVzZXRUYW5rc0FjdFN0YXRlcygpO1xyXG4gICAgICAgICAgICAgICAgLy8gY2hhbmdlIHRvIHRoZSBuZXh0IHBsYXllciB3aGVuIHRoZSBzdGF0ZSBpcyBuZXh0IGNoYW5nZWRcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5uZXh0UGxheWVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIG5vdCBhbGwgdGFua3MgaGF2ZSBzaG90LCB0aGVuIGtlZXAgdGhlIHN0YXRlIGZvciB0aGUgbmV4dCBzaG9vdGluZ1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXIudGFua3NTaG90LnNldChwbGF5ZXJUYW5rc1Nob3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZHJhdy5zdGF0ZSA9IERyYXdTdGF0ZS5TVE9QUEVEO1xyXG4gICAgICAgICAgICAvLyByZWRyYXcgY2FudmFzIHdpdGggYWxsIGN1cnJlbnQgdGFua3NcclxuICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLnJlZHJhd0NhbnZhcyh0aGlzLmRyYXcpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuY2hhbmdlR2FtZVN0YXRlKEdhbWVTdGF0ZS5UQU5LX1NFTEVDVElPTik7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnNraXBUdXJuID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAvLyByZXNldCB0aGUgY3VycmVudCBwbGF5ZXIncyB0YW5rIGFjdCBzdGF0ZXNcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIucmVzZXRUYW5rc0FjdFN0YXRlcygpO1xyXG4gICAgICAgICAgICAvLyBjaGFuZ2UgdG8gdGhlIG5leHQgcGxheWVyIHdoZW4gdGhlIHN0YXRlIGlzIG5leHQgY2hhbmdlZFxyXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIubmV4dFBsYXllciA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhdy5zdGF0ZSA9IERyYXdTdGF0ZS5TVE9QUEVEO1xyXG4gICAgICAgICAgICAvLyByZWRyYXcgY2FudmFzIHdpdGggYWxsIGN1cnJlbnQgdGFua3NcclxuICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLnJlZHJhd0NhbnZhcyh0aGlzLmRyYXcpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuY2hhbmdlR2FtZVN0YXRlKEdhbWVTdGF0ZS5UQU5LX1NFTEVDVElPTik7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIgPSBjb250cm9sbGVyO1xyXG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBwbGF5ZXI7XHJcbiAgICAgICAgdGhpcy51aSA9IHVpO1xyXG4gICAgICAgIHRoaXMuc2hvdFBhdGggPSBuZXcgTGluZSgpO1xyXG4gICAgICAgIHRoaXMuZHJhdyA9IG5ldyBEcmF3KCk7XHJcbiAgICAgICAgdGhpcy50YW5rUm9hbWluZ0xlbmd0aCA9IG5ldyBMaW1pdC5MZW5ndGgoVGFuay5TSE9PVElOR19ERUFEWk9ORSk7XHJcbiAgICAgICAgdGhpcy5zaG90TGVuZ3RoID0gbmV3IExpbWl0Lkxlbmd0aChUYW5rLlNIT09USU5HX1JBTkdFKTtcclxuICAgICAgICB0aGlzLnNob3RTcGVlZCA9IG5ldyBMaW1pdC5TcGVlZChUYW5rLlNIT09USU5HX1NQRUVEKTtcclxuICAgICAgICBpZiAoIXBsYXllci50YW5rc1Nob3QuYXZhaWxhYmxlKCkpIHtcclxuICAgICAgICAgICAgcGxheWVyLnRhbmtzU2hvdC5zZXQobmV3IExpbWl0LkFjdGlvbnMocGxheWVyLmFjdGl2ZVRhbmtzKCkubGVuZ3RoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5wbGF5ZXIuYWN0aXZlVGFuay5nZXQoKTtcclxuICAgICAgICB2aWV3cG9ydC5nb1RvKHBsYXllci52aWV3cG9ydFBvc2l0aW9uKTtcclxuICAgICAgICBjb25zdCBidXR0b25fc2tpcFR1cm4gPSBTaG9vdGluZ1VpLmJ1dHRvbl9za2lwVHVybigpO1xyXG4gICAgICAgIGJ1dHRvbl9za2lwVHVybi5vbm1vdXNlZG93biA9IHRoaXMuc2tpcFR1cm47XHJcbiAgICAgICAgdWkubGVmdC5hZGQoYnV0dG9uX3NraXBUdXJuKTtcclxuICAgIH1cclxuICAgIGFkZEV2ZW50TGlzdGVuZXJzKGNhbnZhcykge1xyXG4gICAgICAgIGNhbnZhcy5vbm1vdXNlZG93biA9IHRoaXMuc3RhcnRTaG9vdGluZztcclxuICAgICAgICBjYW52YXMub25tb3VzZW1vdmUgPSB0aGlzLmNvbnRpbnVlU2hvb3Rpbmc7XHJcbiAgICAgICAgd2luZG93Lm9ubW91c2V1cCA9IHRoaXMuc3RvcFNob290aW5nO1xyXG4gICAgfVxyXG4gICAgdmFsaWRSYW5nZSgpIHtcclxuICAgICAgICB0aGlzLmRyYXcubW91c2VMaW5lKHRoaXMuY29udGV4dCwgVGFuay5NT1ZFTUVOVF9MSU5FX1dJRFRILCBUYW5rLk1PVkVNRU5UX0xJTkVfQ09MT1IpO1xyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNob290aW5nLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2J1aWxkL2dhbWVTdGF0ZXMvc2hvb3RpbmcuanNcbi8vIG1vZHVsZSBpZCA9IDE4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydCBjbGFzcyBMaW5lIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMucG9pbnRzID0gW107XHJcbiAgICB9XHJcbiAgICBsaXN0KCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiUG9pbnRzIGZvciB0aGUgc2hvdDogXCIsIHRoaXMucG9pbnRzLmpvaW4oXCIsIFwiKSk7XHJcbiAgICB9XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bGluZS5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9idWlsZC91dGlsaXR5L2xpbmUuanNcbi8vIG1vZHVsZSBpZCA9IDE5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IEdhbWVTdGF0ZSB9IGZyb20gXCIuLi9nYW1lQ29udHJvbGxlclwiO1xyXG5pbXBvcnQgeyBUYW5rc01hdGggfSBmcm9tIFwiLi4vdXRpbGl0eS90YW5rc01hdGhcIjtcclxuaW1wb3J0IHsgRHJhdyB9IGZyb20gXCIuLi9kcmF3aW5nL2RyYXdcIjtcclxuaW1wb3J0IHsgVGFuaywgVGFua0hlYWx0aFN0YXRlLCBUYW5rVHVyblN0YXRlIH0gZnJvbSBcIi4uL2dhbWVPYmplY3RzL3RhbmtcIjtcclxuZXhwb3J0IGNsYXNzIFNlbGVjdGlvblN0YXRlIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbnRyb2xsZXIsIGNvbnRleHQsIHVpLCBwbGF5ZXIsIHZpZXdwb3J0KSB7XHJcbiAgICAgICAgdGhpcy5oaWdobGlnaHRUYW5rID0gKGUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5kcmF3LnVwZGF0ZU1vdXNlUG9zaXRpb24oZSk7XHJcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSB1c2VyIGhhcyBjbGlja2VkIGFueSB0YW5rLlxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHRhbmsgb2YgdGhpcy5wbGF5ZXIudGFua3MpIHtcclxuICAgICAgICAgICAgICAgIC8vIHRhbmtzIHRoYXQgbXVzdCBub3QgYmUgc2VsZWN0ZWQ6XHJcbiAgICAgICAgICAgICAgICAvLyAtIGRlYWQgdGFua3NcclxuICAgICAgICAgICAgICAgIC8vIC0gdGFua3MgdGhhdCBoYXZlIGFjdGVkXHJcbiAgICAgICAgICAgICAgICAvLyAtIHRhbmtzIHRoYXQgdGhlIG1vdXNlIGNsaWNrIGRvZXMgbm90IGNvbGxpZGUgd2l0aFxyXG4gICAgICAgICAgICAgICAgaWYgKHRhbmsuaGVhbHRoU3RhdGUgIT09IFRhbmtIZWFsdGhTdGF0ZS5ERUFEICYmXHJcbiAgICAgICAgICAgICAgICAgICAgdGFuay5hY3RpdmUoKSAmJlxyXG4gICAgICAgICAgICAgICAgICAgIFRhbmtzTWF0aC5wb2ludC5jb2xsaWRlQ2lyY2xlKHRoaXMuZHJhdy5tb3VzZSwgdGFuay5wb3NpdGlvbiwgVGFuay5XSURUSCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBoaWdobGlnaHQgdGhlIHNlbGVjdGVkIHRhbmtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN1Y2Nlc3NmdWxTZWxlY3Rpb24odGFuayk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gb25seSBoaWdobGlnaHQgdGhlIGZpcnN0IHRhbmssIGlmIHRoZXJlIGFyZSBtdWx0aXBsZSBvbiB0b3Agb2YgZWFjaCBvdGhlclxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLm1vdXNlVXAgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIGlmIHRoZSB1c2VyIGhhcyBjbGlja2VkIG9uIGFueSBvZiB0aGUgb2JqZWN0cywgZ28gaW50byBtb3ZlbWVudCBzdGF0ZVxyXG4gICAgICAgICAgICBpZiAodGhpcy5wbGF5ZXIuYWN0aXZlVGFuay5hdmFpbGFibGUoKSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IG5leHRTdGF0ZTtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAodGhpcy5hY3RpdmUuYWN0aW9uU3RhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFRhbmtUdXJuU3RhdGUuTk9UX0FDVEVEOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U3RhdGUgPSBHYW1lU3RhdGUuVEFOS19NT1ZFTUVOVDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBUYW5rVHVyblN0YXRlLk1PVkVEOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U3RhdGUgPSBHYW1lU3RhdGUuVEFOS19TSE9PVElORztcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBUYW5rVHVyblN0YXRlLlNIT1Q6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTdGF0ZSA9IEdhbWVTdGF0ZS5UQU5LX1NFTEVDVElPTjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuY2hhbmdlR2FtZVN0YXRlKG5leHRTdGF0ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuY29udHJvbGxlciA9IGNvbnRyb2xsZXI7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcclxuICAgICAgICB0aGlzLnBsYXllciA9IHBsYXllcjtcclxuICAgICAgICB0aGlzLmRyYXcgPSBuZXcgRHJhdygpO1xyXG4gICAgICAgIHRoaXMudWkgPSB1aTtcclxuICAgICAgICB2aWV3cG9ydC5nb1RvKHBsYXllci52aWV3cG9ydFBvc2l0aW9uKTtcclxuICAgIH1cclxuICAgIGFkZEV2ZW50TGlzdGVuZXJzKGNhbnZhcykge1xyXG4gICAgICAgIC8vIGNoZWF0IGFuZCBrZWVwIHRoZSBjdXJyZW50IGFjdGl2ZSB0YW5rLCB3aGlsZSBzd2l0Y2hpbmcgdG8gdGhlIG5leHQgc3RhdGVcclxuICAgICAgICBpZiAodGhpcy5wbGF5ZXIuYWN0aXZlVGFuay5hdmFpbGFibGUoKSkge1xyXG4gICAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMucGxheWVyLmFjdGl2ZVRhbmsuZ2V0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuc3VjY2Vzc2Z1bFNlbGVjdGlvbih0aGlzLmFjdGl2ZSk7XHJcbiAgICAgICAgICAgIHRoaXMubW91c2VVcCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY2FudmFzLm9ubW91c2Vkb3duID0gdGhpcy5oaWdobGlnaHRUYW5rO1xyXG4gICAgICAgICAgICAvLyBOT1RFOiBtb3VzZXVwIGlzIG9uIHRoZSB3aG9sZSB3aW5kb3csIHNvIHRoYXQgZXZlbiBpZiB0aGUgY3Vyc29yIGV4aXRzIHRoZSBjYW52YXMsIHRoZSBldmVudCB3aWxsIHRyaWdnZXJcclxuICAgICAgICAgICAgd2luZG93Lm9ubW91c2V1cCA9IHRoaXMubW91c2VVcDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzdWNjZXNzZnVsU2VsZWN0aW9uKHRhbmspIHtcclxuICAgICAgICB0YW5rLmhpZ2hsaWdodCh0aGlzLmNvbnRleHQsIHRoaXMuZHJhdyk7XHJcbiAgICAgICAgLy8gc3RvcmUgdGhlIGRldGFpbHMgb2YgdGhlIGFjdGl2ZSB0YW5rXHJcbiAgICAgICAgdGhpcy5wbGF5ZXIuYWN0aXZlVGFuay5zZXQodGFuayk7XHJcbiAgICAgICAgdGhpcy5hY3RpdmUgPSB0YW5rO1xyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNlbGVjdGlvbi5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9idWlsZC9nYW1lU3RhdGVzL3NlbGVjdGlvbi5qc1xuLy8gbW9kdWxlIGlkID0gMjBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgRHJhdyB9IGZyb20gXCIuLi9kcmF3aW5nL2RyYXdcIjtcclxuaW1wb3J0IHsgUyB9IGZyb20gXCIuLi91dGlsaXR5L3N0cmluZ0Zvcm1hdFwiO1xyXG5jbGFzcyBNZW51IHtcclxuICAgIGNvbnN0cnVjdG9yKHRpdGxlLCBvcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5maW5hbF9oZWlnaHQgPSAtMTtcclxuICAgICAgICB0aGlzLnN0YXJ0X2hlaWdodCA9IDE1MDtcclxuICAgICAgICB0aGlzLmhlaWdodF9pbmNyZW1lbnQgPSA3MDtcclxuICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcclxuICAgIH1cclxuICAgIGRyYXcoY29udGV4dCwgZHJhdykge1xyXG4gICAgICAgIGNvbnN0IHdpZHRoID0gY29udGV4dC5jYW52YXMud2lkdGg7XHJcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gY29udGV4dC5jYW52YXMuaGVpZ2h0O1xyXG4gICAgICAgIGNvbnRleHQudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IFwicmdiKDEzNSwyMDYsMjUwKVwiO1xyXG4gICAgICAgIGNvbnRleHQuZm9udCA9IFwiNjBweCBHZW9yZ2lhXCI7XHJcbiAgICAgICAgbGV0IHRleHRfaGVpZ2h0ID0gdGhpcy5zdGFydF9oZWlnaHQ7XHJcbiAgICAgICAgY29uc3QgY2VudHJlID0gd2lkdGggLyAyO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFRleHQodGhpcy50aXRsZSwgY2VudHJlLCB0ZXh0X2hlaWdodCk7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBcIldoaXRlXCI7XHJcbiAgICAgICAgY29udGV4dC5mb250ID0gXCIzMHB4IEdlb3JnaWFcIjtcclxuICAgICAgICBmb3IgKGNvbnN0IFtpZCwgb3B0aW9uXSBvZiB0aGlzLm9wdGlvbnMuZW50cmllcygpKSB7XHJcbiAgICAgICAgICAgIHRleHRfaGVpZ2h0ICs9IHRoaXMuaGVpZ2h0X2luY3JlbWVudDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWQoaWQpKSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IFwiWWVsbG93XCI7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmZvbnQgPSBcIjQwcHhcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gXCJCbGFja1wiO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5mb250ID0gXCIzMHB4XCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29udGV4dC5maWxsVGV4dChvcHRpb24sIGNlbnRyZSwgdGV4dF9oZWlnaHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmZpbmFsX2hlaWdodCA9IHRleHRfaGVpZ2h0O1xyXG4gICAgfVxyXG4gICAgc2VsZWN0ZWQoaWQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZF9pdGVtID09PSBpZDtcclxuICAgIH1cclxuICAgIHNlbGVjdChtb3VzZSkge1xyXG4gICAgICAgIGlmICh0aGlzLmZpbmFsX2hlaWdodCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIG1lbnUgaGFzbid0IGJlZW4gZHJhd24uXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBhZGRzIHNvbWUgYnVmZmVyIHNwYWNlIGFyb3VuZCBlYWNoIG9wdGlvbiwgdGhpcyBtYWtlcyBpdCBlYXNpZXIgdG8gc2VsZWN0IGVhY2ggb3B0aW9uXHJcbiAgICAgICAgY29uc3QgYnVmZmVyX3NwYWNlID0gdGhpcy5oZWlnaHRfaW5jcmVtZW50IC8gMjtcclxuICAgICAgICBsZXQgY3VycmVudF9oZWlnaHQgPSB0aGlzLmZpbmFsX2hlaWdodDtcclxuICAgICAgICBsZXQgaWQgPSB0aGlzLm9wdGlvbnMubGVuZ3RoIC0gMTtcclxuICAgICAgICAvLyBjaGVjayB1cCB0byB0aGUgaGVpZ2h0IG9mIHRoZSB0aXRsZSwgdGhlcmUncyBub3QgZ29pbmcgdG8gYmUgYW55dGhpbmcgYWJvdmUgaXRcclxuICAgICAgICB3aGlsZSAoY3VycmVudF9oZWlnaHQgPiB0aGlzLnN0YXJ0X2hlaWdodCkge1xyXG4gICAgICAgICAgICBpZiAobW91c2UueSA+IGN1cnJlbnRfaGVpZ2h0IC0gYnVmZmVyX3NwYWNlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkX2l0ZW0gPSBpZDtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBsb3dlciB0aGUgaGVpZ2h0IHRoYXQgd2UgYXJlIGNoZWNraW5nIG9uLCB0aGlzIGhhcyB0aGUgZWZmZWN0IG9mIG1vdmluZyB0aGVcclxuICAgICAgICAgICAgLy8gbWVudSBpdGVtJ3MgaGl0Ym94IGhpZ2hlciBvbiB0aGUgc2NyZWVuXHJcbiAgICAgICAgICAgIGN1cnJlbnRfaGVpZ2h0IC09IHRoaXMuaGVpZ2h0X2luY3JlbWVudDtcclxuICAgICAgICAgICAgaWQgLT0gMTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIEdhbWVFbmRTdGF0ZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb250cm9sbGVyLCBjb250ZXh0LCBwbGF5ZXIsIHZpZXdwb3J0KSB7XHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyID0gY29udHJvbGxlcjtcclxuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xyXG4gICAgICAgIHRoaXMuZHJhdyA9IG5ldyBEcmF3KCk7XHJcbiAgICAgICAgY29uc3QgbnVtVGFua3MgPSBwbGF5ZXIuYWN0aXZlVGFua3MoKS5sZW5ndGggKyAxO1xyXG4gICAgICAgIGNvbnN0IHRhbmtzU3RyID0gbnVtVGFua3MgPT09IDEgPyBcIiB0YW5rXCIgOiBcIiB0YW5rc1wiO1xyXG4gICAgICAgIHZpZXdwb3J0Lm1pZGRsZSgpO1xyXG4gICAgICAgIHRoaXMubWVudSA9IG5ldyBNZW51KFwiRW5kIG9mIEdhbWVcIiwgW1MuZm9ybWF0KFwiUGxheWVyICVzIFdpbnMhXCIsIHBsYXllci5pZCksIFMuZm9ybWF0KFwiV2l0aCAlcyAlc1wiLCBudW1UYW5rcywgdGFua3NTdHIpXSk7XHJcbiAgICAgICAgdGhpcy5tZW51LmRyYXcodGhpcy5jb250ZXh0LCB0aGlzLmRyYXcpO1xyXG4gICAgfVxyXG4gICAgYWRkRXZlbnRMaXN0ZW5lcnMoY2FudmFzKSB7XHJcbiAgICB9XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Z2FtZUVuZC5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9idWlsZC9nYW1lU3RhdGVzL2dhbWVFbmQuanNcbi8vIG1vZHVsZSBpZCA9IDIxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IEdhbWVTdGF0ZSB9IGZyb20gXCIuLi9nYW1lQ29udHJvbGxlclwiO1xyXG5pbXBvcnQgeyBEcmF3IH0gZnJvbSBcIi4uL2RyYXdpbmcvZHJhd1wiO1xyXG5jbGFzcyBNZW51IHtcclxuICAgIGNvbnN0cnVjdG9yKHRpdGxlLCBvcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5maW5hbF9oZWlnaHQgPSAtMTtcclxuICAgICAgICB0aGlzLnN0YXJ0X2hlaWdodCA9IDE1MDtcclxuICAgICAgICB0aGlzLmhlaWdodF9pbmNyZW1lbnQgPSA3MDtcclxuICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcclxuICAgIH1cclxuICAgIGRyYXcoY29udGV4dCwgZHJhdykge1xyXG4gICAgICAgIGNvbnN0IHdpZHRoID0gY29udGV4dC5jYW52YXMud2lkdGg7XHJcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gY29udGV4dC5jYW52YXMuaGVpZ2h0O1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gXCJCbGFja1wiO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgY29udGV4dC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gXCJyZ2IoMTM1LDIwNiwyNTApXCI7XHJcbiAgICAgICAgY29udGV4dC5mb250ID0gXCI2MHB4IEdlb3JnaWFcIjtcclxuICAgICAgICBsZXQgdGV4dF9oZWlnaHQgPSB0aGlzLnN0YXJ0X2hlaWdodDtcclxuICAgICAgICBjb25zdCBjZW50cmUgPSB3aWR0aCAvIDI7XHJcbiAgICAgICAgY29udGV4dC5maWxsVGV4dCh0aGlzLnRpdGxlLCBjZW50cmUsIHRleHRfaGVpZ2h0KTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IFwiV2hpdGVcIjtcclxuICAgICAgICBjb250ZXh0LmZvbnQgPSBcIjMwcHggR2VvcmdpYVwiO1xyXG4gICAgICAgIGZvciAoY29uc3QgW2lkLCBvcHRpb25dIG9mIHRoaXMub3B0aW9ucy5lbnRyaWVzKCkpIHtcclxuICAgICAgICAgICAgdGV4dF9oZWlnaHQgKz0gdGhpcy5oZWlnaHRfaW5jcmVtZW50O1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZChpZCkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gXCJZZWxsb3dcIjtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuZm9udCA9IFwiNDBweCBHZW9yZ2lhXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IFwiV2hpdGVcIjtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuZm9udCA9IFwiMzBweCBHZW9yZ2lhXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29udGV4dC5maWxsVGV4dChvcHRpb24sIGNlbnRyZSwgdGV4dF9oZWlnaHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmZpbmFsX2hlaWdodCA9IHRleHRfaGVpZ2h0O1xyXG4gICAgfVxyXG4gICAgc2VsZWN0ZWQoaWQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZF9pdGVtID09PSBpZDtcclxuICAgIH1cclxuICAgIHNlbGVjdChtb3VzZSkge1xyXG4gICAgICAgIGlmICh0aGlzLmZpbmFsX2hlaWdodCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIG1lbnUgaGFzbid0IGJlZW4gZHJhd24uXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBhZGRzIHNvbWUgYnVmZmVyIHNwYWNlIGFyb3VuZCBlYWNoIG9wdGlvbiwgdGhpcyBtYWtlcyBpdCBlYXNpZXIgdG8gc2VsZWN0IGVhY2ggb3B0aW9uXHJcbiAgICAgICAgY29uc3QgYnVmZmVyX3NwYWNlID0gdGhpcy5oZWlnaHRfaW5jcmVtZW50IC8gMjtcclxuICAgICAgICBsZXQgY3VycmVudF9oZWlnaHQgPSB0aGlzLmZpbmFsX2hlaWdodDtcclxuICAgICAgICBsZXQgaWQgPSB0aGlzLm9wdGlvbnMubGVuZ3RoIC0gMTtcclxuICAgICAgICAvLyBjaGVjayB1cCB0byB0aGUgaGVpZ2h0IG9mIHRoZSB0aXRsZSwgdGhlcmUncyBub3QgZ29pbmcgdG8gYmUgYW55dGhpbmcgYWJvdmUgaXRcclxuICAgICAgICB3aGlsZSAoY3VycmVudF9oZWlnaHQgPiB0aGlzLnN0YXJ0X2hlaWdodCkge1xyXG4gICAgICAgICAgICBpZiAobW91c2UueSA+IGN1cnJlbnRfaGVpZ2h0IC0gYnVmZmVyX3NwYWNlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkX2l0ZW0gPSBpZDtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBsb3dlciB0aGUgaGVpZ2h0IHRoYXQgd2UgYXJlIGNoZWNraW5nIG9uLCB0aGlzIGhhcyB0aGUgZWZmZWN0IG9mIG1vdmluZyB0aGVcclxuICAgICAgICAgICAgLy8gbWVudSBpdGVtJ3MgaGl0Ym94IGhpZ2hlciBvbiB0aGUgc2NyZWVuXHJcbiAgICAgICAgICAgIGN1cnJlbnRfaGVpZ2h0IC09IHRoaXMuaGVpZ2h0X2luY3JlbWVudDtcclxuICAgICAgICAgICAgaWQgLT0gMTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIE1lbnVTdGF0ZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb250cm9sbGVyLCBjb250ZXh0LCB2aWV3cG9ydCkge1xyXG4gICAgICAgIHRoaXMuc2VsZWN0TWVudWl0ZW0gPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmRyYXcudXBkYXRlTW91c2VQb3NpdGlvbihlKTtcclxuICAgICAgICAgICAgdGhpcy5tZW51LnNlbGVjdCh0aGlzLmRyYXcubW91c2UpO1xyXG4gICAgICAgICAgICB0aGlzLm1lbnUuZHJhdyh0aGlzLmNvbnRleHQsIHRoaXMuZHJhdyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBY3RpdmF0ZXMgdGhlIHNlbGVjdGVkIG1lbnUgb3B0aW9uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5hY3RpdmF0ZU1lbnVPcHRpb24gPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5tZW51LnNlbGVjdGVkX2l0ZW0gPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLmNsZWFyQ2FudmFzKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuY2hhbmdlR2FtZVN0YXRlKEdhbWVTdGF0ZS5UQU5LX1BMQUNFTUVOVCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gaGFuZGxlIG90aGVyIGV2ZW50cywgcHJvYmFibHkgYmV0dGVyIHdpdGggYSBzd2l0Y2ggc3RhdGVtZW50XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIgPSBjb250cm9sbGVyO1xyXG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XHJcbiAgICAgICAgdGhpcy5kcmF3ID0gbmV3IERyYXcoKTtcclxuICAgICAgICB0aGlzLm1lbnUgPSBuZXcgTWVudShcIlRhbmtzXCIsIFtcIlN0YXJ0IGdhbWVcIiwgXCJQb3RhdG9lc1wiLCBcIkFwcGxlc1wiLCBcIklcIiwgXCJDaG9vc2VcIiwgXCJZb3VcIiwgXCJQaWthY2h1XCJdKTtcclxuICAgICAgICB0aGlzLm1lbnUuZHJhdyh0aGlzLmNvbnRleHQsIHRoaXMuZHJhdyk7XHJcbiAgICAgICAgdmlld3BvcnQubWlkZGxlKCk7XHJcbiAgICB9XHJcbiAgICBhZGRFdmVudExpc3RlbmVycyhjYW52YXMpIHtcclxuICAgICAgICBjYW52YXMub25tb3VzZWRvd24gPSB0aGlzLmFjdGl2YXRlTWVudU9wdGlvbjtcclxuICAgICAgICBjYW52YXMub25tb3VzZW1vdmUgPSB0aGlzLnNlbGVjdE1lbnVpdGVtO1xyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1lbnUuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYnVpbGQvZ2FtZVN0YXRlcy9tZW51LmpzXG4vLyBtb2R1bGUgaWQgPSAyMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBUYW5rSGVhbHRoU3RhdGUsIFRhbmtUdXJuU3RhdGUgfSBmcm9tIFwiLi90YW5rXCI7XHJcbmltcG9ydCB7IFNpbmdsZUFjY2VzcyB9IGZyb20gXCIuLi91dGlsaXR5L3NpbmdsZUFjY2Vzc1wiO1xyXG5leHBvcnQgY2xhc3MgUGxheWVyIHtcclxuICAgIGNvbnN0cnVjdG9yKGlkLCBuYW1lLCBjb2xvciwgdmlld3BvcnRQb3NpdGlvbikge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMudGFua3MgPSBuZXcgQXJyYXkoKTtcclxuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XHJcbiAgICAgICAgdGhpcy50YW5rc1Nob3QgPSBuZXcgU2luZ2xlQWNjZXNzKCk7XHJcbiAgICAgICAgdGhpcy5hY3RpdmVUYW5rID0gbmV3IFNpbmdsZUFjY2VzcygpO1xyXG4gICAgICAgIHRoaXMudmlld3BvcnRQb3NpdGlvbiA9IHZpZXdwb3J0UG9zaXRpb247XHJcbiAgICB9XHJcbiAgICBhY3RpdmVUYW5rcygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50YW5rcy5maWx0ZXIoKHRhbmspID0+IHRhbmsuaGVhbHRoU3RhdGUgIT09IFRhbmtIZWFsdGhTdGF0ZS5ERUFEKTtcclxuICAgIH1cclxuICAgIHJlc2V0VGFua3NBY3RTdGF0ZXMoKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCB0YW5rIG9mIHRoaXMudGFua3MpIHtcclxuICAgICAgICAgICAgdGFuay5hY3Rpb25TdGF0ZSA9IFRhbmtUdXJuU3RhdGUuTk9UX0FDVEVEO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1wbGF5ZXIuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYnVpbGQvZ2FtZU9iamVjdHMvcGxheWVyLmpzXG4vLyBtb2R1bGUgaWQgPSAyM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgY2xhc3MgU2luZ2xlQWNjZXNzIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMucmVzb3VyY2UgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuYWNjZXNzZWQgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIHNldChyZXNvdXJjZSkge1xyXG4gICAgICAgIHRoaXMucmVzb3VyY2UgPSByZXNvdXJjZTtcclxuICAgICAgICB0aGlzLmFjY2Vzc2VkID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBhdmFpbGFibGUoKSB7XHJcbiAgICAgICAgcmV0dXJuICF0aGlzLmFjY2Vzc2VkICYmIHRoaXMucmVzb3VyY2UgIT09IG51bGw7XHJcbiAgICB9XHJcbiAgICBnZXQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuYXZhaWxhYmxlKCkpIHtcclxuICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMucmVzb3VyY2U7XHJcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2UgPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4geDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5hY2Nlc3NlZCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGlzIG9iamVjdCBoYXMgYWxyZWFkeSBiZWVuIGFjY2Vzc2VkLlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5yZXNvdXJjZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgcmVzb3VyY2Ugb2JqZWN0IGhhcyBub3QgYmVlbiBzZXQuXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBlcnJvciB3aXRoIHNpbmdsZSBhY2Nlc3Mgb2JqZWN0XCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zaW5nbGVBY2Nlc3MuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYnVpbGQvdXRpbGl0eS9zaW5nbGVBY2Nlc3MuanNcbi8vIG1vZHVsZSBpZCA9IDI0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IENvbG9yIH0gZnJvbSBcIi4uL2RyYXdpbmcvY29sb3JcIjtcclxuZXhwb3J0IGNsYXNzIExpbmVDYWNoZSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmNvbG9yID0gQ29sb3IuZ3JheSgpLnRvUkdCQSgpO1xyXG4gICAgICAgIC8qKiBIb3cgbWFueSBsaW5lcyBzaG91bGQgYmUgcmVkcmF3biAqL1xyXG4gICAgICAgIHRoaXMuc2l6ZSA9IDEwO1xyXG4gICAgICAgIHRoaXMucG9pbnRzID0gW107XHJcbiAgICB9XHJcbiAgICAvKiogUmVtb3ZlIGxpbmVzIHRoYXQgYXJlIG91dHNpZGUgb2YgdGhlIGNhY2hlIHNpemUgKi9cclxuICAgIGxpbmVzKCkge1xyXG4gICAgICAgIGNvbnN0IHNpemUgPSB0aGlzLnBvaW50cy5sZW5ndGg7XHJcbiAgICAgICAgaWYgKHNpemUgPiB0aGlzLnNpemUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucG9pbnRzLnNsaWNlKHNpemUgLSB0aGlzLnNpemUsIHNpemUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5wb2ludHM7XHJcbiAgICB9XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bGluZUNhY2hlLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2J1aWxkL3V0aWxpdHkvbGluZUNhY2hlLmpzXG4vLyBtb2R1bGUgaWQgPSAyNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBUYW5rSGVhbHRoU3RhdGUsIFRhbmsgfSBmcm9tIFwiLi9nYW1lT2JqZWN0cy90YW5rXCI7XHJcbmltcG9ydCB7IFRhbmtzTWF0aCB9IGZyb20gXCIuL3V0aWxpdHkvdGFua3NNYXRoXCI7XHJcbmltcG9ydCB7IFMgfSBmcm9tIFwiLi91dGlsaXR5L3N0cmluZ0Zvcm1hdFwiO1xyXG5leHBvcnQgY2xhc3MgQ29sbGlzaW9uIHtcclxuICAgIHN0YXRpYyBkZWJ1Z1Nob3QobGluZSwgc3RhcnQsIGVuZCwgdGFuaywgZGlzdGFuY2UpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IHNlZ21lbnQgb2YgbGluZS5wb2ludHMpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coUy5mb3JtYXQoXCIlcywlc1wiLCBzZWdtZW50LngsIC1zZWdtZW50LnkpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2coUy5mb3JtYXQoXCJDb2xsaXNpb24gdmVyc3VzIGxpbmU6XFxuJXMsJXNcXG4lcywlc1wiLCBzdGFydC54LCAtc3RhcnQueSwgZW5kLngsIC1lbmQueSkpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFMuZm9ybWF0KFwiVGFuayBJRDogJXNcXG5Qb3NpdGlvbjogKCVzLCVzKVwiLCB0YW5rLmlkLCB0YW5rLnBvc2l0aW9uLngsIC10YW5rLnBvc2l0aW9uLnkpKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkRpc3RhbmNlOiBcIiwgZGlzdGFuY2UpO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGNvbGxpZGUobGluZSwgbnVtUG9pbnRzLCB0YW5rcykge1xyXG4gICAgICAgIC8vIGxvb3Agb3ZlciBhbGwgdGhlaXIgdGFua3NcclxuICAgICAgICBmb3IgKGNvbnN0IHRhbmsgb2YgdGFua3MpIHtcclxuICAgICAgICAgICAgLy8gb25seSBkbyBjb2xsaXNpb24gZGV0ZWN0aW9uIHZlcnN1cyB0YW5rcyB0aGF0IGhhdmUgbm90IGJlZW4gYWxyZWFkeSBraWxsZWRcclxuICAgICAgICAgICAgaWYgKHRhbmsuaGVhbHRoU3RhdGUgIT09IFRhbmtIZWFsdGhTdGF0ZS5ERUFEKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBlYWNoIHNlZ21lbnQgb2YgdGhlIGxpbmUgZm9yIGNvbGxpc2lvbiB3aXRoIHRoZSB0YW5rXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IG51bVBvaW50czsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RhcnQgPSBsaW5lLnBvaW50c1tpIC0gMV07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZW5kID0gbGluZS5wb2ludHNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGlzdCA9IFRhbmtzTWF0aC5saW5lLmRpc3RDaXJjbGVDZW50ZXIoc3RhcnQsIGVuZCwgdGFuay5wb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWJ1Z1Nob3QobGluZSwgc3RhcnQsIGVuZCwgdGFuaywgZGlzdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpc3QgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNob3QgaGl0IHRoZSB0YW5rLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgbGluZSBnbGFuY2VzIHRoZSB0YW5rLCBtYXJrIGFzIGRpc2FibGVkXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFRhbmsuV0lEVEggLSBUYW5rLkRJU0FCTEVEX1pPTkUgPD0gZGlzdCAmJiBkaXN0IDw9IFRhbmsuV0lEVEggKyBUYW5rLkRJU0FCTEVEX1pPTkUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFuay5oZWFsdGhTdGF0ZSA9IFRhbmtIZWFsdGhTdGF0ZS5ESVNBQkxFRDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUYW5rXCIsIHRhbmsuaWQsIFwiZGlzYWJsZWQhXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzdG9wIGNoZWNraW5nIGNvbGxpc2lvbiBmb3IgdGhpcyB0YW5rLCBhbmQgZ28gb24gdGhlIG5leHQgb25lXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gLy8gaWYgdGhlIGxpbmUgcGFzc2VzIHRocm91Z2ggdGhlIHRhbmssIG1hcmsgZGVhZFxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGRpc3QgPCBUYW5rLldJRFRIKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhbmsuaGVhbHRoU3RhdGUgPSBUYW5rSGVhbHRoU3RhdGUuREVBRDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUYW5rXCIsIHRhbmsuaWQsIFwiZGVhZCFcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHN0b3AgY2hlY2tpbmcgY29sbGlzaW9uIGZvciB0aGlzIHRhbmssIGFuZCBnbyBvbiB0aGUgbmV4dCBvbmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWdhbWVDb2xsaXNpb24uanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYnVpbGQvZ2FtZUNvbGxpc2lvbi5qc1xuLy8gbW9kdWxlIGlkID0gMjZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGNsYXNzIFZpZXdwb3J0IHtcclxuICAgIGNvbnN0cnVjdG9yKGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQpIHtcclxuICAgICAgICB0aGlzLmNhbnZhc1dpZHRoID0gY2FudmFzV2lkdGg7XHJcbiAgICAgICAgdGhpcy5jYW52YXNIZWlnaHQgPSBjYW52YXNIZWlnaHQ7XHJcbiAgICB9XHJcbiAgICBtaWRkbGUoeSA9IDApIHtcclxuICAgICAgICB0aGlzLmdvKHRoaXMuY2FudmFzV2lkdGggLyA0LCB5KTtcclxuICAgIH1cclxuICAgIGdvKHgsIHkpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlRyeWluZyB0byBzY3JvbGwgdG9cIiwgeCwgeSk7XHJcbiAgICAgICAgd2luZG93LnNjcm9sbCh4LCB5KTtcclxuICAgIH1cclxuICAgIGdvVG8ocG9pbnQpIHtcclxuICAgICAgICB0aGlzLmdvKHBvaW50LngsIHBvaW50LnkpO1xyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXZpZXdwb3J0LmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2J1aWxkL2dhbWVNYXAvdmlld3BvcnQuanNcbi8vIG1vZHVsZSBpZCA9IDI3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=