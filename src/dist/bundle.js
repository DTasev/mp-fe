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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__utility_point__ = __webpack_require__(2);
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utility_point__ = __webpack_require__(2);

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
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return TankTurnState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return TankHealthState; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utility_point__ = __webpack_require__(2);
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
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__point__ = __webpack_require__(2);

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
    const viewportWidth = window.visualViewport.width;
    const ui = new __WEBPACK_IMPORTED_MODULE_1__ui__["a" /* Ui */](ID_GAME_UI, viewportWidth);
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
        this.container.style.width = (width + 2) + "px";
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
        const newLeft = window.visualViewport.pageLeft;
        const newTop = window.visualViewport.pageTop;
        console.log("Trying to set UI to", newLeft, newTop);
        this.container.style.left = newLeft + "px";
        this.container.style.top = newTop + "px";
        console.log("Actual values", this.container.style.left, this.container.style.top);
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utility_point__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__gameObjects_tank__ = __webpack_require__(3);
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__gameObjects_tank__ = __webpack_require__(3);
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__gameObjects_tank__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__utility_point__ = __webpack_require__(2);
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__gameObjects_tank__ = __webpack_require__(3);




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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tank__ = __webpack_require__(3);
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__gameObjects_tank__ = __webpack_require__(3);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNmJmMzk5MzcwZGE0MTlmMTczY2QiLCJ3ZWJwYWNrOi8vLy4vc3JjL2J1aWxkL2dhbWVDb250cm9sbGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9idWlsZC9kcmF3aW5nL2RyYXcuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2J1aWxkL3V0aWxpdHkvcG9pbnQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2J1aWxkL2dhbWVPYmplY3RzL3RhbmsuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2J1aWxkL3V0aWxpdHkvdGFua3NNYXRoLmpzIiwid2VicGFjazovLy8uL3NyYy9idWlsZC9qc29uMmh0bWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2J1aWxkL2xpbWl0ZXJzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9idWlsZC9kcmF3aW5nL2NvbG9yLmpzIiwid2VicGFjazovLy8uL3NyYy9idWlsZC91dGlsaXR5L3N0cmluZ0Zvcm1hdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYnVpbGQvZ2FtZVNldHRpbmdzLmpzIiwid2VicGFjazovLy8uL3NyYy9idWlsZC9tYWluLmpzIiwid2VicGFjazovLy8uL3NyYy9idWlsZC9zaXRlQ29udHJvbHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2J1aWxkL3VpLmpzIiwid2VicGFjazovLy8uL3NyYy9idWlsZC9nYW1lU3RhdGVzL21vdmVtZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9idWlsZC9saW1pdGVycy9hY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2J1aWxkL2xpbWl0ZXJzL3NwZWVkLmpzIiwid2VicGFjazovLy8uL3NyYy9idWlsZC9saW1pdGVycy9sZW5ndGguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2J1aWxkL2dhbWVTdGF0ZXMvcGxhY2VtZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9idWlsZC9nYW1lU3RhdGVzL3Nob290aW5nLmpzIiwid2VicGFjazovLy8uL3NyYy9idWlsZC91dGlsaXR5L2xpbmUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2J1aWxkL2dhbWVTdGF0ZXMvc2VsZWN0aW9uLmpzIiwid2VicGFjazovLy8uL3NyYy9idWlsZC9nYW1lU3RhdGVzL2dhbWVFbmQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2J1aWxkL2dhbWVTdGF0ZXMvbWVudS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYnVpbGQvZ2FtZU9iamVjdHMvcGxheWVyLmpzIiwid2VicGFjazovLy8uL3NyYy9idWlsZC91dGlsaXR5L3NpbmdsZUFjY2Vzcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYnVpbGQvdXRpbGl0eS9saW5lQ2FjaGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2J1aWxkL2dhbWVDb2xsaXNpb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2J1aWxkL2dhbWVNYXAvdmlld3BvcnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3RHNCO0FBQ0M7QUFDQztBQUNDO0FBQ0Y7QUFDSDtBQUNIO0FBQ0Q7QUFDSTtBQUNKO0FBQ0k7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyw4QkFBOEI7QUFDL0I7QUFDQTtBQUNBO0FBQ0EsZ0ZBQWdGLElBQUk7QUFDcEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIseUVBQTBCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLDZCQUE2QjtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQSwwQzs7Ozs7Ozs7O0FDL0pnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLDhCQUE4QjtBQUMvQixnQzs7Ozs7OztBQzFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0EsaUM7Ozs7Ozs7Ozs7O0FDWmdCO0FBQ0E7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLHNDQUFzQztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQywwQ0FBMEM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEIscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQzs7Ozs7Ozs7QUM3R2dCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQSxxQzs7Ozs7OztBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBLHFDOzs7Ozs7Ozs7Ozs7O0FDaEhrQjtBQUNGO0FBQ0M7QUFDakIsaUM7Ozs7Ozs7O0FDSFk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBLGlDOzs7Ozs7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0Esd0M7Ozs7Ozs7QUNMQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFDQSx3Qzs7Ozs7Ozs7Ozs7QUNGQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNhO0FBQ3VCO0FBQ2pCO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0M7Ozs7Ozs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBLHdDOzs7Ozs7OztBQ2xCYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkM7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0Q0FBNEM7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBLDhCOzs7Ozs7Ozs7Ozs7O0FDNUUwQjtBQUMxQjtBQUNvQjtBQUNKO0FBQytCO0FBQ2pDO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBLG9DOzs7Ozs7O0FDbkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBLGtDOzs7Ozs7OztBQ25Cb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBLGlDOzs7Ozs7OztBQ3RCb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0Esa0M7Ozs7Ozs7Ozs7OztBQ3RDb0I7QUFDTDtBQUNBO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBLHFDOzs7Ozs7Ozs7Ozs7Ozs7QUNoRGM7QUFDTTtBQUNNO0FBQ0k7QUFDZDtBQUNJO0FBQ0w7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0Esb0M7Ozs7Ozs7QUN0SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQSxnQzs7Ozs7Ozs7Ozs7QUNSb0I7QUFDQTtBQUNMO0FBQ2dDO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0EscUM7Ozs7Ozs7OztBQ3JFZTtBQUNIO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQSxtQzs7Ozs7Ozs7O0FDekVvQjtBQUNMO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0EsZ0M7Ozs7Ozs7OztBQzFGeUM7QUFDbEI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0Esa0M7Ozs7Ozs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQSx3Qzs7Ozs7Ozs7QUM3QmdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBLHFDOzs7Ozs7Ozs7O0FDakJnQztBQUNaO0FBQ1I7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsZUFBZTtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0EseUM7Ozs7Ozs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0Esb0MiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMTApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDZiZjM5OTM3MGRhNDE5ZjE3M2NkIiwiaW1wb3J0IHsgTW92aW5nU3RhdGUgfSBmcm9tIFwiLi9nYW1lU3RhdGVzL21vdmVtZW50XCI7XHJcbmltcG9ydCB7IFBsYWNpbmdTdGF0ZSB9IGZyb20gXCIuL2dhbWVTdGF0ZXMvcGxhY2VtZW50XCI7XHJcbmltcG9ydCB7IFNob290aW5nU3RhdGUgfSBmcm9tIFwiLi9nYW1lU3RhdGVzL3Nob290aW5nXCI7XHJcbmltcG9ydCB7IFNlbGVjdGlvblN0YXRlIH0gZnJvbSBcIi4vZ2FtZVN0YXRlcy9zZWxlY3Rpb25cIjtcclxuaW1wb3J0IHsgR2FtZUVuZFN0YXRlIH0gZnJvbSBcIi4vZ2FtZVN0YXRlcy9nYW1lRW5kXCI7XHJcbmltcG9ydCB7IE1lbnVTdGF0ZSB9IGZyb20gXCIuL2dhbWVTdGF0ZXMvbWVudVwiO1xyXG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tICcuL2dhbWVPYmplY3RzL3BsYXllcic7XHJcbmltcG9ydCB7IENvbG9yIH0gZnJvbSAnLi9kcmF3aW5nL2NvbG9yJztcclxuaW1wb3J0IHsgTGluZUNhY2hlIH0gZnJvbSAnLi91dGlsaXR5L2xpbmVDYWNoZSc7XHJcbmltcG9ydCB7IFBvaW50IH0gZnJvbSAnLi91dGlsaXR5L3BvaW50JztcclxuaW1wb3J0IHsgQ29sbGlzaW9uIH0gZnJvbSBcIi4vZ2FtZUNvbGxpc2lvblwiO1xyXG5pbXBvcnQgKiBhcyBTZXR0aW5ncyBmcm9tICcuL2dhbWVTZXR0aW5ncyc7XHJcbmV4cG9ydCB2YXIgR2FtZVN0YXRlO1xyXG4oZnVuY3Rpb24gKEdhbWVTdGF0ZSkge1xyXG4gICAgR2FtZVN0YXRlW0dhbWVTdGF0ZVtcIk1FTlVcIl0gPSAwXSA9IFwiTUVOVVwiO1xyXG4gICAgR2FtZVN0YXRlW0dhbWVTdGF0ZVtcIlRBTktfUExBQ0VNRU5UXCJdID0gMV0gPSBcIlRBTktfUExBQ0VNRU5UXCI7XHJcbiAgICBHYW1lU3RhdGVbR2FtZVN0YXRlW1wiVEFOS19NT1ZFTUVOVFwiXSA9IDJdID0gXCJUQU5LX01PVkVNRU5UXCI7XHJcbiAgICBHYW1lU3RhdGVbR2FtZVN0YXRlW1wiVEFOS19TRUxFQ1RJT05cIl0gPSAzXSA9IFwiVEFOS19TRUxFQ1RJT05cIjtcclxuICAgIEdhbWVTdGF0ZVtHYW1lU3RhdGVbXCJUQU5LX1NIT09USU5HXCJdID0gNF0gPSBcIlRBTktfU0hPT1RJTkdcIjtcclxuICAgIEdhbWVTdGF0ZVtHYW1lU3RhdGVbXCJHQU1FX0VORFwiXSA9IDVdID0gXCJHQU1FX0VORFwiO1xyXG59KShHYW1lU3RhdGUgfHwgKEdhbWVTdGF0ZSA9IHt9KSk7XHJcbi8qKlxyXG4gKiBJbXBsZW1lbnRhdGlvbiBmb3IgdGhlIGFjdGlvbnMgdGhhdCB3aWxsIGJlIGV4ZWN1dGVkIGFjY29yZGluZyB0byBwbGF5ZXIgYWN0aW9ucy5cclxuICpcclxuICogRnVuY3Rpb25zIGFyZSB3cmFwcGVkIHRvIGtlZXAgYHRoaXNgIGNvbnRleHQuIFRoaXMgaXMgdGhlIChlOk1vdXNlRXZlbnQpID0+IHsuLi59IHN5bnRheC5cclxuICpcclxuICogSW4gc2hvcnQsIGJlY2F1c2UgdGhlIG1ldGhvZHMgYXJlIGFkZGVkIGFzIGV2ZW50IGxpc3RlbmVycyAoYW5kIGFyZSBub3QgY2FsbGVkIGRpcmVjdGx5KSwgdGhlIGB0aGlzYCByZWZlcmVuY2Ugc3RhcnRzIHBvaW50aW5nXHJcbiAqIHRvd2FyZHMgdGhlIGB3aW5kb3dgIG9iamVjdC4gVGhlIGNsb3N1cmUga2VlcHMgdGhlIGB0aGlzYCB0byBwb2ludCB0b3dhcmRzIHRoZSBwcm9wZXIgaW5zdGFuY2Ugb2YgdGhlIG9iamVjdC5cclxuICpcclxuICogRm9yIG1vcmUgZGV0YWlsczogaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0L3dpa2kvJ3RoaXMnLWluLVR5cGVTY3JpcHQjcmVkLWZsYWdzLWZvci10aGlzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgR2FtZUNvbnRyb2xsZXIge1xyXG4gICAgY29uc3RydWN0b3IoY2FudmFzLCBjb250ZXh0LCB1aSwgdmlld3BvcnQpIHtcclxuICAgICAgICAvKiogQWxsIHRoZSBwbGF5ZXJzIGluIHRoZSBnYW1lICovXHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzID0gW107XHJcbiAgICAgICAgLyoqIEZsYWcgdG8gc3BlY2lmeSBpZiB0aGUgY3VycmVudCBwbGF5ZXIncyB0dXJuIGlzIG92ZXIgKi9cclxuICAgICAgICB0aGlzLm5leHRQbGF5ZXIgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcclxuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xyXG4gICAgICAgIHRoaXMudWkgPSB1aTtcclxuICAgICAgICB0aGlzLnZpZXdwb3J0ID0gdmlld3BvcnQ7XHJcbiAgICAgICAgdGhpcy5saW5lQ2FjaGUgPSBuZXcgTGluZUNhY2hlKCk7XHJcbiAgICAgICAgbGV0IHBsYXllclBvc2l0aW9ucyA9IFtcclxuICAgICAgICAgICAgbmV3IFBvaW50KDAsIDApLFxyXG4gICAgICAgICAgICBuZXcgUG9pbnQoNDA5NiwgNDA5NilcclxuICAgICAgICBdO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBsYXllciA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBTZXR0aW5ncy5OVU1fUExBWUVSUzsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVycy5wdXNoKG5ldyBQbGF5ZXIoaSwgXCJQbGF5ZXIgXCIgKyAoaSArIDEpLCBDb2xvci5uZXh0KCksIHBsYXllclBvc2l0aW9uc1tpXSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogVGhlIGdhbWUgZXZlbnRzIHNob3VsZCBiZSBpbiB0aGlzIG9yZGVyOlxyXG4gICAgICogTWVudVxyXG4gICAgICogUGxhY2luZyBmb3IgZWFjaCBwbGF5ZXJcclxuICAgICAqIFJlcGVhdCB1bnRpbCBnYW1lIG92ZXJcclxuICAgICAqICBNb3ZpbmcsIFNob290aW5nIGZvciBQMVxyXG4gICAgICogIE1vdmluZywgU2hvb3RpbmcgZm9yIFAyXHJcbiAgICAgKiBAcGFyYW0gbmV3U3RhdGVcclxuICAgICAqL1xyXG4gICAgY2hhbmdlR2FtZVN0YXRlKG5ld1N0YXRlKSB7XHJcbiAgICAgICAgdGhpcy51aS5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSBuZXdTdGF0ZTtcclxuICAgICAgICAvLyBjbGVhcnMgYW55IG9sZCBldmVudHMgdGhhdCB3ZXJlIGFkZGVkXHJcbiAgICAgICAgdGhpcy5jYW52YXMub25tb3VzZWRvd24gPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLm9ubW91c2V1cCA9IG51bGw7XHJcbiAgICAgICAgd2luZG93Lm9ubW91c2V1cCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jYW52YXMub25tb3VzZW1vdmUgPSBudWxsO1xyXG4gICAgICAgIC8vIGlmIHRoZSBzdGF0ZSBoYXMgbWFya2VkIHRoZSBlbmQgb2YgdGhlIHBsYXllcidzIHR1cm4sIHRoZW4gd2UgZ28gdG8gdGhlIG5leHQgcGxheWVyXHJcbiAgICAgICAgaWYgKHRoaXMubmV4dFBsYXllcikge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZVBsYXllcigpO1xyXG4gICAgICAgICAgICB0aGlzLm5leHRQbGF5ZXIgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy5wbGF5ZXJzW3RoaXMuY3VycmVudFBsYXllcl07XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgIT09IEdhbWVTdGF0ZS5NRU5VICYmIHRoaXMuc3RhdGUgIT09IEdhbWVTdGF0ZS5UQU5LX1BMQUNFTUVOVCAmJiBwbGF5ZXIuYWN0aXZlVGFua3MoKS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IEdhbWVTdGF0ZS5HQU1FX0VORDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJUaGlzIGlzXCIsIHBsYXllci5uYW1lLCBcInBsYXlpbmcuXCIpO1xyXG4gICAgICAgIHRoaXMudWkuc2V0UGxheWVyKHBsYXllci5uYW1lKTtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMuc3RhdGUpIHtcclxuICAgICAgICAgICAgY2FzZSBHYW1lU3RhdGUuTUVOVTpcclxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9uID0gbmV3IE1lbnVTdGF0ZSh0aGlzLCB0aGlzLmNvbnRleHQsIHRoaXMudmlld3BvcnQpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJbml0aWFsaXNpbmcgTUVOVVwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIEdhbWVTdGF0ZS5UQU5LX1BMQUNFTUVOVDpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSW5pdGlhbGlzaW5nIFRBTksgUExBQ0lOR1wiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9uID0gbmV3IFBsYWNpbmdTdGF0ZSh0aGlzLCB0aGlzLmNvbnRleHQsIHRoaXMudWksIHBsYXllciwgdGhpcy52aWV3cG9ydCk7XHJcbiAgICAgICAgICAgICAgICAvLyBmb3JjZSB0aGUgbmV4dCBwbGF5ZXIgYWZ0ZXIgcGxhY2luZyB0YW5rc1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0UGxheWVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIEdhbWVTdGF0ZS5UQU5LX1NFTEVDVElPTjpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSW5pdGlhbGlzaW5nIFRBTksgU0VMRUNUSU9OXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hY3Rpb24gPSBuZXcgU2VsZWN0aW9uU3RhdGUodGhpcywgdGhpcy5jb250ZXh0LCB0aGlzLnVpLCBwbGF5ZXIsIHRoaXMudmlld3BvcnQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgR2FtZVN0YXRlLlRBTktfTU9WRU1FTlQ6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkluaXRpYWxpc2luZyBUQU5LIE1PVkVNRU5UXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hY3Rpb24gPSBuZXcgTW92aW5nU3RhdGUodGhpcywgdGhpcy5jb250ZXh0LCB0aGlzLnVpLCBwbGF5ZXIsIHRoaXMudmlld3BvcnQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgR2FtZVN0YXRlLlRBTktfU0hPT1RJTkc6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkluaXRpYWxpc2luZyBUQU5LIFNIT09USU5HXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hY3Rpb24gPSBuZXcgU2hvb3RpbmdTdGF0ZSh0aGlzLCB0aGlzLmNvbnRleHQsIHRoaXMudWksIHBsYXllciwgdGhpcy52aWV3cG9ydCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBHYW1lU3RhdGUuR0FNRV9FTkQ6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkluaXRpYWxpc2luZyBHQU1FIEVORFwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9uID0gbmV3IEdhbWVFbmRTdGF0ZSh0aGlzLCB0aGlzLmNvbnRleHQsIHBsYXllciwgdGhpcy52aWV3cG9ydCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBnYW1lIHNob3VsZCBuZXZlciBiZSBpbiBhbiB1bmtub3duIHN0YXRlLCBzb21ldGhpbmcgaGFzIGdvbmUgdGVycmlibHkgd3JvbmchXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBhZGQgdGhlIG1vdXNlIGV2ZW50cyBmb3IgdGhlIG5ldyBzdGF0ZVxyXG4gICAgICAgIHRoaXMuYWN0aW9uLmFkZEV2ZW50TGlzdGVuZXJzKHRoaXMuY2FudmFzKTtcclxuICAgIH1cclxuICAgIC8qKiBDbGVhcnMgZXZlcnl0aGluZyBmcm9tIHRoZSBjYW52YXMgb24gdGhlIHNjcmVlbi4gVG8gc2hvdyBhbnl0aGluZyBhZnRlcndhcmRzIGl0IG5lZWRzIHRvIGJlIHJlZHJhd24uICovXHJcbiAgICBjbGVhckNhbnZhcygpIHtcclxuICAgICAgICB0aGlzLmNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xyXG4gICAgfVxyXG4gICAgcmVkcmF3Q2FudmFzKGRyYXcpIHtcclxuICAgICAgICB0aGlzLmNsZWFyQ2FudmFzKCk7XHJcbiAgICAgICAgLy8gZHJhdyBldmVyeSBwbGF5ZXIgZm9yIGV2ZXJ5IHRhbmtcclxuICAgICAgICBmb3IgKGNvbnN0IHBsYXllciBvZiB0aGlzLnBsYXllcnMpIHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCB0YW5rIG9mIHBsYXllci50YW5rcykge1xyXG4gICAgICAgICAgICAgICAgdGFuay5kcmF3KHRoaXMuY29udGV4dCwgZHJhdyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3Qgb2xkX2xpbmVzX2NvbG9yID0gQ29sb3IuZ3JheSgwLjUpLnRvUkdCQSgpO1xyXG4gICAgICAgIC8vIGRyYXcgdGhlIGxhc3QgTiBsaW5lc1xyXG4gICAgICAgIGZvciAoY29uc3QgbGluZV9wYXRoIG9mIHRoaXMubGluZUNhY2hlLmxpbmVzKCkpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBsaW5lX3BhdGgucG9pbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBvbGQgbGluZXMgYXJlIGN1cnJlbnRseSBoYWxmLXRyYW5zcGFyZW50XHJcbiAgICAgICAgICAgICAgICBkcmF3LmxpbmUodGhpcy5jb250ZXh0LCBsaW5lX3BhdGgucG9pbnRzW2kgLSAxXSwgbGluZV9wYXRoLnBvaW50c1tpXSwgMSwgb2xkX2xpbmVzX2NvbG9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbGxpZGUobGluZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0gU3RhcnRpbmcgQ29sbGlzaW9uIC0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XHJcbiAgICAgICAgY29uc3QgbnVtUG9pbnRzID0gbGluZS5wb2ludHMubGVuZ3RoO1xyXG4gICAgICAgIC8vIGZvciBldmVyeSBwbGF5ZXIgd2hvIGlzbnQgdGhlIGN1cnJlbnQgcGxheWVyXHJcbiAgICAgICAgZm9yIChjb25zdCBwbGF5ZXIgb2YgdGhpcy5wbGF5ZXJzLmZpbHRlcigocCkgPT4gcC5pZCAhPT0gdGhpcy5jdXJyZW50UGxheWVyKSkge1xyXG4gICAgICAgICAgICBDb2xsaXNpb24uY29sbGlkZShsaW5lLCBudW1Qb2ludHMsIHBsYXllci50YW5rcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2FjaGVMaW5lKHBhdGgpIHtcclxuICAgICAgICB0aGlzLmxpbmVDYWNoZS5wb2ludHMucHVzaChwYXRoKTtcclxuICAgIH1cclxuICAgIHNob3dVc2VyV2FybmluZyhtZXNzYWdlKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1c2VyLXdhcm5pbmdcIikuaW5uZXJIVE1MID0gbWVzc2FnZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQHJldHVybnMgZmFsc2UgaWYgdGhlcmUgYXJlIHN0aWxsIHBsYXllcnMgdG8gdGFrZSB0aGVpciB0dXJuLCB0cnVlIGlmIGFsbCBwbGF5ZXJzIGhhdmUgY29tcGxldGVkIHRoZWlyIHR1cm5zIGZvciB0aGUgc3RhdGVcclxuICAgICovXHJcbiAgICBjaGFuZ2VQbGF5ZXIoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBsYXllciA9PT0gU2V0dGluZ3MuTlVNX1BMQVlFUlMgLSAxKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBsYXllciA9IDA7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmN1cnJlbnRQbGF5ZXIgKz0gMTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Z2FtZUNvbnRyb2xsZXIuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYnVpbGQvZ2FtZUNvbnRyb2xsZXIuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi4vdXRpbGl0eS9wb2ludFwiO1xyXG5leHBvcnQgY2xhc3MgRHJhdyB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLm1vdXNlID0gbmV3IFBvaW50KCk7XHJcbiAgICAgICAgdGhpcy5sYXN0ID0gbmV3IFBvaW50KCk7XHJcbiAgICB9XHJcbiAgICAvKiogRHJhdyBhIGRvdCAoYSBmaWxsZWQgY2lyY2xlKSBhcm91bmQgdGhlIHBvaW50LlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBjb250ZXh0IENvbnRleHQgb24gd2hpY2ggdGhlIGNpcmNsZSB3aWxsIGJlIGRyYXduXHJcbiAgICAgKiBAcGFyYW0gY29vcmRzIENvb3JkaW5hdGVzIGZvciB0aGUgb3JpZ2luIHBvaW50IG9mIHRoZSBjaXJjbGVcclxuICAgICAqIEBwYXJhbSByYWRpdXMgUmFkaXVzIG9mIHRoZSBkb3RcclxuICAgICAqIEBwYXJhbSBmaWxsQ29sb3IgQ29sb3Igb2YgdGhlIGZpbGxcclxuICAgICAqIEBwYXJhbSBvdXRsaW5lIFNwZWNpZnkgd2hldGhlciBhbiBvdXRsaW5lIHdpbGwgYmUgZHJhd24gYXJvdW5kIHRoZSBjaXJjbGVcclxuICAgICAqIEBwYXJhbSBzdHJva2VDb2xvciBTcGVjaWZ5IGNvbG9yIGZvciB0aGUgb3V0bGluZSwgaWYgbm90IHNwZWNpZmllZCB0aGUgY29sb3VyIHdpbGwgYmUgdGhlIHNhbWUgYXMgdGhlIGZpbGwgY29sb3JcclxuICAgICAqL1xyXG4gICAgZG90KGNvbnRleHQsIGNvb3JkcywgcmFkaXVzLCBmaWxsQ29sb3IsIG91dGxpbmUgPSBmYWxzZSwgc3Ryb2tlQ29sb3IgPSBudWxsKSB7XHJcbiAgICAgICAgLy8gTGV0J3MgdXNlIGJsYWNrIGJ5IHNldHRpbmcgUkdCIHZhbHVlcyB0byAwLCBhbmQgMjU1IGFscGhhIChjb21wbGV0ZWx5IG9wYXF1ZSlcclxuICAgICAgICAvLyBTZWxlY3QgYSBmaWxsIHN0eWxlXHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBmaWxsQ29sb3I7XHJcbiAgICAgICAgY29udGV4dC5saW5lV2lkdGggPSByYWRpdXM7XHJcbiAgICAgICAgLy8gRHJhdyBhIGZpbGxlZCBjaXJjbGVcclxuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGNvbnRleHQuYXJjKGNvb3Jkcy54LCBjb29yZHMueSwgcmFkaXVzLCAwLCBNYXRoLlBJICogMiwgdHJ1ZSk7XHJcbiAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgICAgICBpZiAob3V0bGluZSkge1xyXG4gICAgICAgICAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gc3Ryb2tlQ29sb3IgfHwgZmlsbENvbG9yO1xyXG4gICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKiBEcmF3IGEgY2lyY2xlIGFyb3VuZCBhIHBvaW50LlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBjb250ZXh0IENvbnRleHQgb24gd2hpY2ggdGhlIGNpcmNsZSB3aWxsIGJlIGRyYXduXHJcbiAgICAgKiBAcGFyYW0gY29vcmRzIENvb3JkaW5hdGVzIGZvciB0aGUgb3JpZ2luIHBvaW50IG9mIHRoZSBjaXJjbGVcclxuICAgICAqIEBwYXJhbSByYWRpdXMgVGhlIHJhZGl1cyBvZiB0aGUgY2lyY2xlXHJcbiAgICAgKiBAcGFyYW0gbGluZV93aWR0aCBUaGUgbGluZSB3aWR0aCBvZiB0aGUgY2lyY2xlXHJcbiAgICAgKiBAcGFyYW0gY29sb3IgVGhlIGNvbG9yIG9mIHRoZSBsaW5lXHJcbiAgICAgKi9cclxuICAgIGNpcmNsZShjb250ZXh0LCBjb29yZHMsIHJhZGl1cywgbGluZV93aWR0aCwgY29sb3IpIHtcclxuICAgICAgICAvLyBMZXQncyB1c2UgYmxhY2sgYnkgc2V0dGluZyBSR0IgdmFsdWVzIHRvIDAsIGFuZCAyNTUgYWxwaGEgKGNvbXBsZXRlbHkgb3BhcXVlKVxyXG4gICAgICAgIC8vIFNlbGVjdCBhIGZpbGwgc3R5bGVcclxuICAgICAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gY29sb3I7XHJcbiAgICAgICAgY29udGV4dC5saW5lV2lkdGggPSBsaW5lX3dpZHRoO1xyXG4gICAgICAgIC8vIERyYXcgYSBmaWxsZWQgY2lyY2xlXHJcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjb250ZXh0LmFyYyhjb29yZHMueCwgY29vcmRzLnksIHJhZGl1cywgMCwgTWF0aC5QSSAqIDIsIHRydWUpO1xyXG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogRHJhdyBhIGxpbmUgYmV0d2VlbiB0aGUgbGFzdCBrbm93biBwb3NpdGlvbiBvZiB0aGUgbW91c2UsIGFuZCB0aGUgY3VycmVudCBwb3NpdGlvbi5cclxuICAgICAqIEBwYXJhbSBjb250ZXh0IFRoZSBjYW52YXMgY29udGV4dCB0aGF0IHdlJ3JlIGRyYXdpbmcgb25cclxuICAgICAqIEBwYXJhbSB1cGRhdGVMYXN0IFdoZXRoZXIgdG8gdXBkYXRlIHRoZSBsYXN0IHBvc2l0aW9uIG9mIHRoZSBtb3VzZVxyXG4gICAgICovXHJcbiAgICBtb3VzZUxpbmUoY29udGV4dCwgd2lkdGgsIGNvbG9yLCB1cGRhdGVMYXN0ID0gdHJ1ZSkge1xyXG4gICAgICAgIC8vIElmIGxhc3RYIGlzIG5vdCBzZXQsIHNldCBsYXN0WCBhbmQgbGFzdFkgdG8gdGhlIGN1cnJlbnQgcG9zaXRpb24gXHJcbiAgICAgICAgaWYgKHRoaXMubGFzdC54ID09IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMubGFzdC54ID0gdGhpcy5tb3VzZS54O1xyXG4gICAgICAgICAgICB0aGlzLmxhc3QueSA9IHRoaXMubW91c2UueTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gU2VsZWN0IGEgZmlsbCBzdHlsZVxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBjb2xvcjtcclxuICAgICAgICAvLyBTZXQgdGhlIGxpbmUgXCJjYXBcIiBzdHlsZSB0byByb3VuZCwgc28gbGluZXMgYXQgZGlmZmVyZW50IGFuZ2xlcyBjYW4gam9pbiBpbnRvIGVhY2ggb3RoZXJcclxuICAgICAgICBjb250ZXh0LmxpbmVDYXAgPSBcInJvdW5kXCI7XHJcbiAgICAgICAgY29udGV4dC5saW5lSm9pbiA9IFwicm91bmRcIjtcclxuICAgICAgICAvLyBEcmF3IGEgZmlsbGVkIGxpbmVcclxuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIC8vIEZpcnN0LCBtb3ZlIHRvIHRoZSBvbGQgKHByZXZpb3VzKSBwb3NpdGlvblxyXG4gICAgICAgIGNvbnRleHQubW92ZVRvKHRoaXMubGFzdC54LCB0aGlzLmxhc3QueSk7XHJcbiAgICAgICAgLy8gTm93IGRyYXcgYSBsaW5lIHRvIHRoZSBjdXJyZW50IHRvdWNoL3BvaW50ZXIgcG9zaXRpb25cclxuICAgICAgICBjb250ZXh0LmxpbmVUbyh0aGlzLm1vdXNlLngsIHRoaXMubW91c2UueSk7XHJcbiAgICAgICAgLy8gU2V0IHRoZSBsaW5lIHRoaWNrbmVzcyBhbmQgZHJhdyB0aGUgbGluZVxyXG4gICAgICAgIGNvbnRleHQubGluZVdpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGlmICh1cGRhdGVMYXN0KSB7XHJcbiAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgbGFzdCBwb3NpdGlvbiB0byByZWZlcmVuY2UgdGhlIGN1cnJlbnQgcG9zaXRpb25cclxuICAgICAgICAgICAgdGhpcy5sYXN0LnggPSB0aGlzLm1vdXNlLng7XHJcbiAgICAgICAgICAgIHRoaXMubGFzdC55ID0gdGhpcy5tb3VzZS55O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogRHJhdyBhIGxpbmUgYmV0d2VlbiB0aGUgc3RhcnQgYW5kIGVuZCBwb2ludHMuXHJcbiAgICAgKiBAcGFyYW0gY29udGV4dCBUaGUgY2FudmFzIGNvbnRleHQgdGhhdCB3ZSdyZSBkcmF3aW5nIG9uXHJcbiAgICAgKiBAcGFyYW0gc3RhcnQgU3RhcnQgcG9pbnRcclxuICAgICAqIEBwYXJhbSBlbmQgRW5kIHBvaW50XHJcbiAgICAgKiBAcGFyYW0gd2lkdGggV2lkdGggb2YgdGhlIGxpbmVcclxuICAgICAqIEBwYXJhbSBjb2xvciBDb2xvciBvZiB0aGUgbGluZVxyXG4gICAgICovXHJcbiAgICBsaW5lKGNvbnRleHQsIHN0YXJ0LCBlbmQsIHdpZHRoLCBjb2xvcikge1xyXG4gICAgICAgIC8vIFNlbGVjdCBhIGZpbGwgc3R5bGVcclxuICAgICAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gY29sb3I7XHJcbiAgICAgICAgLy8gU2V0IHRoZSBsaW5lIFwiY2FwXCIgc3R5bGUgdG8gcm91bmQsIHNvIGxpbmVzIGF0IGRpZmZlcmVudCBhbmdsZXMgY2FuIGpvaW4gaW50byBlYWNoIG90aGVyXHJcbiAgICAgICAgY29udGV4dC5saW5lQ2FwID0gXCJyb3VuZFwiO1xyXG4gICAgICAgIGNvbnRleHQubGluZUpvaW4gPSBcInJvdW5kXCI7XHJcbiAgICAgICAgLy8gRHJhdyBhIGZpbGxlZCBsaW5lXHJcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICAvLyBGaXJzdCwgbW92ZSB0byB0aGUgb2xkIChwcmV2aW91cykgcG9zaXRpb25cclxuICAgICAgICBjb250ZXh0Lm1vdmVUbyhzdGFydC54LCBzdGFydC55KTtcclxuICAgICAgICAvLyBOb3cgZHJhdyBhIGxpbmUgdG8gdGhlIGN1cnJlbnQgdG91Y2gvcG9pbnRlciBwb3NpdGlvblxyXG4gICAgICAgIGNvbnRleHQubGluZVRvKGVuZC54LCBlbmQueSk7XHJcbiAgICAgICAgLy8gU2V0IHRoZSBsaW5lIHRoaWNrbmVzcyBhbmQgZHJhdyB0aGUgbGluZVxyXG4gICAgICAgIGNvbnRleHQubGluZVdpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlTW91c2VQb3NpdGlvbihlKSB7XHJcbiAgICAgICAgLy8gaWYgdGhlIGJyb3dzZXIgaGFzbid0IHBhc3NlZCBhIHBhcmFtZXRlciwgYnV0IGhhcyBzZXQgdGhlIGdsb2JhbCBldmVudCB2YXJpYWJsZVxyXG4gICAgICAgIGlmICghZSkge1xyXG4gICAgICAgICAgICB2YXIgZSA9IGV2ZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZS5vZmZzZXRYKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW91c2UueCA9IGUub2Zmc2V0WDtcclxuICAgICAgICAgICAgdGhpcy5tb3VzZS55ID0gZS5vZmZzZXRZO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHVwZGF0ZVRvdWNoUG9zaXRpb24oZSkge1xyXG4gICAgICAgIC8vIGlmIHRoZSBicm93c2VyIGhhc24ndCBwYXNzZWQgYSBwYXJhbWV0ZXIsIGJ1dCBoYXMgc2V0IHRoZSBnbG9iYWwgZXZlbnQgdmFyaWFibGVcclxuICAgICAgICBpZiAoIWUpIHtcclxuICAgICAgICAgICAgdmFyIGUgPSBldmVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGUudG91Y2hlcykge1xyXG4gICAgICAgICAgICAvLyBPbmx5IGRlYWwgd2l0aCBvbmUgZmluZ2VyXHJcbiAgICAgICAgICAgIGlmIChlLnRvdWNoZXMubGVuZ3RoID09IDEpIHtcclxuICAgICAgICAgICAgICAgIC8vIEdldCB0aGUgaW5mb3JtYXRpb24gZm9yIGZpbmdlciAjMVxyXG4gICAgICAgICAgICAgICAgY29uc3QgdG91Y2ggPSBlLnRvdWNoZXNbMF07XHJcbiAgICAgICAgICAgICAgICAvLyB0aGUgJ3RhcmdldCcgd2lsbCBiZSB0aGUgY2FudmFzIGVsZW1lbnRcclxuICAgICAgICAgICAgICAgIHRoaXMubW91c2UueCA9IHRvdWNoLnBhZ2VYIC0gdG91Y2gudGFyZ2V0Lm9mZnNldExlZnQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vdXNlLnkgPSB0b3VjaC5wYWdlWSAtIHRvdWNoLnRhcmdldC5vZmZzZXRUb3A7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IHZhciBEcmF3U3RhdGU7XHJcbihmdW5jdGlvbiAoRHJhd1N0YXRlKSB7XHJcbiAgICBEcmF3U3RhdGVbRHJhd1N0YXRlW1wiRFJBV0lOR1wiXSA9IDBdID0gXCJEUkFXSU5HXCI7XHJcbiAgICBEcmF3U3RhdGVbRHJhd1N0YXRlW1wiU1RPUFBFRFwiXSA9IDFdID0gXCJTVE9QUEVEXCI7XHJcbn0pKERyYXdTdGF0ZSB8fCAoRHJhd1N0YXRlID0ge30pKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZHJhdy5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9idWlsZC9kcmF3aW5nL2RyYXcuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGNsYXNzIFBvaW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHggPSAtMSwgeSA9IC0xKSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgfVxyXG4gICAgY29weSgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMueCwgdGhpcy55KTtcclxuICAgIH1cclxuICAgIHRvU3RyaW5nKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnggKyBcIixcIiArIHRoaXMueTtcclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1wb2ludC5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9idWlsZC91dGlsaXR5L3BvaW50LmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IFBvaW50IH0gZnJvbSBcIi4uL3V0aWxpdHkvcG9pbnRcIjtcclxuaW1wb3J0IHsgQ29sb3IgfSBmcm9tIFwiLi4vZHJhd2luZy9jb2xvclwiO1xyXG5leHBvcnQgdmFyIFRhbmtUdXJuU3RhdGU7XHJcbihmdW5jdGlvbiAoVGFua1R1cm5TdGF0ZSkge1xyXG4gICAgLyoqIFRoZSB0YW5rIGhhcyBwZXJmb3JtZWQgYW4gYWN0aW9uIHRoaXMgdHVybiwgZS5nLiBtb3ZlZCBvciBzaG90ICovXHJcbiAgICBUYW5rVHVyblN0YXRlW1RhbmtUdXJuU3RhdGVbXCJTSE9UXCJdID0gMF0gPSBcIlNIT1RcIjtcclxuICAgIFRhbmtUdXJuU3RhdGVbVGFua1R1cm5TdGF0ZVtcIk1PVkVEXCJdID0gMV0gPSBcIk1PVkVEXCI7XHJcbiAgICAvKiogVGhlIHRhbmsgaGFzbid0IHBlcmZvcm1lZCBhbiBhY3Rpb24gdGhpcyB0dXJuICovXHJcbiAgICBUYW5rVHVyblN0YXRlW1RhbmtUdXJuU3RhdGVbXCJOT1RfQUNURURcIl0gPSAyXSA9IFwiTk9UX0FDVEVEXCI7XHJcbn0pKFRhbmtUdXJuU3RhdGUgfHwgKFRhbmtUdXJuU3RhdGUgPSB7fSkpO1xyXG5leHBvcnQgdmFyIFRhbmtIZWFsdGhTdGF0ZTtcclxuKGZ1bmN0aW9uIChUYW5rSGVhbHRoU3RhdGUpIHtcclxuICAgIC8qKiBUYW5rIGNhbiBkbyBldmVyeXRoaW5nICovXHJcbiAgICBUYW5rSGVhbHRoU3RhdGVbVGFua0hlYWx0aFN0YXRlW1wiQUxJVkVcIl0gPSAwXSA9IFwiQUxJVkVcIjtcclxuICAgIC8qKiBUYW5rIGNhbid0IG1vdmUgKi9cclxuICAgIFRhbmtIZWFsdGhTdGF0ZVtUYW5rSGVhbHRoU3RhdGVbXCJESVNBQkxFRFwiXSA9IDFdID0gXCJESVNBQkxFRFwiO1xyXG4gICAgLyoqIFRhbmsgY2FuJ3QgZG8gYW55dGhpbmcgKi9cclxuICAgIFRhbmtIZWFsdGhTdGF0ZVtUYW5rSGVhbHRoU3RhdGVbXCJERUFEXCJdID0gMl0gPSBcIkRFQURcIjtcclxufSkoVGFua0hlYWx0aFN0YXRlIHx8IChUYW5rSGVhbHRoU3RhdGUgPSB7fSkpO1xyXG4vKiogUHJvdmlkZXMgZ3JvdXBpbmcgZm9yIGFsbCB0aGUgVGFuaydzIGNvbG9ycyAqL1xyXG5jbGFzcyBUYW5rQ29sb3Ige1xyXG4gICAgY29uc3RydWN0b3IoYWN0aXZlLCBhY3RpdmVfb3V0bGluZSwgbGFiZWwsIGFsaXZlLCBkaXNhYmxlZCwgZGVhZCkge1xyXG4gICAgICAgIHRoaXMuYWN0aXZlID0gYWN0aXZlO1xyXG4gICAgICAgIHRoaXMuYWN0aXZlT3V0bGluZSA9IGFjdGl2ZV9vdXRsaW5lO1xyXG4gICAgICAgIHRoaXMubGFiZWwgPSBsYWJlbDtcclxuICAgICAgICB0aGlzLmFsaXZlID0gYWxpdmU7XHJcbiAgICAgICAgdGhpcy5kaXNhYmxlZCA9IGRpc2FibGVkO1xyXG4gICAgICAgIHRoaXMuZGVhZCA9IGRlYWQ7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIFRhbmsge1xyXG4gICAgY29uc3RydWN0b3IoaWQsIHBsYXllciwgeCwgeSkge1xyXG4gICAgICAgIC8qKiBPcGFjaXR5IGZvciB0aGUgdGFuaydzIGxhYmVsICovXHJcbiAgICAgICAgdGhpcy5MQUJFTF9PUEFDSVRZID0gMC43O1xyXG4gICAgICAgIC8qKiBPcGFjaXR5IGZvciB0aGUgcGxheWVyIGNvbG9yIHdoZW4gdGhlIHRhbmsgaXMgZGlzYWJsZWQgKi9cclxuICAgICAgICB0aGlzLkRJU0FCTEVEX09QQUNJVFkgPSAwLjc7XHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgICAgIHRoaXMucGxheWVyID0gcGxheWVyO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXcgUG9pbnQoeCwgeSk7XHJcbiAgICAgICAgdGhpcy5oZWFsdGhTdGF0ZSA9IFRhbmtIZWFsdGhTdGF0ZS5BTElWRTtcclxuICAgICAgICB0aGlzLmFjdGlvblN0YXRlID0gVGFua1R1cm5TdGF0ZS5OT1RfQUNURUQ7XHJcbiAgICAgICAgdGhpcy5sYWJlbCA9IFwiXCI7IC8vICsgXCJcIiBjb252ZXJ0cyB0byBzdHJpbmdcclxuICAgICAgICAvLyB0aGlzLmxhYmVsID0gdGhpcy5pZCArIFwiXCI7IC8vICsgXCJcIiBjb252ZXJ0cyB0byBzdHJpbmdcclxuICAgICAgICAvLyBpbml0aWFsaXNlIGNvbG9ycyBmb3IgZWFjaCBvZiB0aGUgdGFuaydzIHN0YXRlc1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBuZXcgVGFua0NvbG9yKENvbG9yLnJlZCgpLnRvUkdCQSgpLCBDb2xvci5ncmVlbigpLnRvUkdCQSgpLCBDb2xvci5ibGFjaygpLnRvUkdCQSh0aGlzLkxBQkVMX09QQUNJVFkpLCB0aGlzLnBsYXllci5jb2xvci50b1JHQkEoKSwgdGhpcy5wbGF5ZXIuY29sb3IudG9SR0JBKHRoaXMuRElTQUJMRURfT1BBQ0lUWSksIENvbG9yLmdyYXkoKS50b1JHQkEoKSk7XHJcbiAgICB9XHJcbiAgICBkcmF3KGNvbnRleHQsIGRyYXcpIHtcclxuICAgICAgICBsZXQgW2xhYmVsLCBjb2xvcl0gPSB0aGlzLnVpRWxlbWVudHMoKTtcclxuICAgICAgICBkcmF3LmNpcmNsZShjb250ZXh0LCB0aGlzLnBvc2l0aW9uLCBUYW5rLldJRFRILCBUYW5rLkxJTkVfV0lEVEgsIGNvbG9yKTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMuY29sb3IubGFiZWw7XHJcbiAgICAgICAgY29udGV4dC5mb250ID0gXCIxNnB4IENhbGlicmlcIjtcclxuICAgICAgICAvLyBwdXQgdGhlIHRleHQgaW4gdGhlIG1pZGRsZSBvZiB0aGUgdGFua1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFRleHQobGFiZWwsIHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55ICsgNSk7XHJcbiAgICB9XHJcbiAgICB1aUVsZW1lbnRzKCkge1xyXG4gICAgICAgIGxldCBjb2xvcjtcclxuICAgICAgICBsZXQgbGFiZWwgPSB0aGlzLmxhYmVsO1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy5hY3Rpb25TdGF0ZSkge1xyXG4gICAgICAgICAgICBjYXNlIFRhbmtUdXJuU3RhdGUuU0hPVDpcclxuICAgICAgICAgICAgICAgIGxhYmVsICs9IFwi8J+agFwiO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgVGFua1R1cm5TdGF0ZS5NT1ZFRDpcclxuICAgICAgICAgICAgICAgIGxhYmVsICs9IFwi4pqTXCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLmhlYWx0aFN0YXRlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgVGFua0hlYWx0aFN0YXRlLkFMSVZFOlxyXG4gICAgICAgICAgICAgICAgY29sb3IgPSB0aGlzLmNvbG9yLmFsaXZlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgVGFua0hlYWx0aFN0YXRlLkRJU0FCTEVEOlxyXG4gICAgICAgICAgICAgICAgY29sb3IgPSB0aGlzLmNvbG9yLmRpc2FibGVkO1xyXG4gICAgICAgICAgICAgICAgbGFiZWwgKz0gXCLimb9cIjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFRhbmtIZWFsdGhTdGF0ZS5ERUFEOlxyXG4gICAgICAgICAgICAgICAgY29sb3IgPSB0aGlzLmNvbG9yLmRlYWQ7XHJcbiAgICAgICAgICAgICAgICBsYWJlbCArPSBcIvCfkoBcIjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW2xhYmVsLCBjb2xvcl07XHJcbiAgICB9XHJcbiAgICBoaWdobGlnaHQoY29udGV4dCwgZHJhdykge1xyXG4gICAgICAgIGRyYXcuZG90KGNvbnRleHQsIHRoaXMucG9zaXRpb24sIFRhbmsuV0lEVEgsIHRoaXMuY29sb3IuYWN0aXZlKTtcclxuICAgICAgICBkcmF3LmNpcmNsZShjb250ZXh0LCB0aGlzLnBvc2l0aW9uLCBUYW5rLk1PVkVNRU5UX1JBTkdFLCBUYW5rLkxJTkVfV0lEVEgsIHRoaXMuY29sb3IuYWN0aXZlT3V0bGluZSk7XHJcbiAgICB9XHJcbiAgICBhY3RpdmUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYWN0aW9uU3RhdGUgIT09IFRhbmtUdXJuU3RhdGUuU0hPVDtcclxuICAgIH1cclxufVxyXG4vKiogVGhlIHdpZHRoIG9mIHRoZSBkb3Qgd2hlbiBkcmF3aW5nIHRoZSB0YW5rICovXHJcblRhbmsuV0lEVEggPSAxMjtcclxuLyoqIFRoZSB6b25lIGFyb3VuZCB0aGUgdGFuayB0aGF0IHdpbGwgY2F1c2UgaXQgdG8gYmUgZGlzYWJsZWQgaW5zdGVhZCBvZiBraWxsZWQgKi9cclxuVGFuay5ESVNBQkxFRF9aT05FID0gMC41O1xyXG4vKiogVGhlIHdpZHRoIG9mIHRoZSBsaW5lIHdoZW4gZHJhd2luZyB0aGUgdGFuayAqL1xyXG5UYW5rLkxJTkVfV0lEVEggPSAxO1xyXG4vKiogSG93IGZhciBjYW4gdGhlIHRhbmsgbW92ZSAqL1xyXG5UYW5rLk1PVkVNRU5UX1JBTkdFID0gMTAwO1xyXG4vKiogVGhlIHdpZHRoIG9mIHRoZSBtb3ZlbWVudCBsaW5lICovXHJcblRhbmsuTU9WRU1FTlRfTElORV9XSURUSCA9IDM7XHJcbi8qKiBUaGUgY29sb3Igb2YgdGhlIG1vdmVtZW50IGxpbmUgKi9cclxuVGFuay5NT1ZFTUVOVF9MSU5FX0NPTE9SID0gQ29sb3IuYmxhY2soKS50b1JHQkEoKTtcclxuLyoqIEhvdyBmYXIgY2FuIHRoZSBzaG90IGxpbmUgcmVhY2ggKi9cclxuVGFuay5TSE9PVElOR19SQU5HRSA9IDQwOTtcclxuLyoqIEhvdyBmYXN0IG11c3QgdGhlIHBsYXllciBtb3ZlIGZvciBhIHZhbGlkIHNob3QgKi9cclxuVGFuay5TSE9PVElOR19TUEVFRCA9IDMwO1xyXG4vKiogVGhlIGRlYWR6b25lIGFsbG93ZWQgZm9yIGZyZWUgbW91c2UgbW92ZW1lbnQgYmVmb3JlIHRoZSBwbGF5ZXIgc2hvb3RzLlxyXG4gKiBUaGlzIG1lYW5zIHRoYXQgdGhlIHBsYXllciBjYW4gd2lnZ2xlIHRoZSBjdXJzb3IgYXJvdW5kIGluIHRoZSB0YW5rJ3Mgc3BhY2VcclxuICogdG8gcHJlcGFyZSBmb3IgdGhlIHNob3QuXHJcbiAqL1xyXG5UYW5rLlNIT09USU5HX0RFQURaT05FID0gVGFuay5XSURUSCArIDI7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRhbmsuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYnVpbGQvZ2FtZU9iamVjdHMvdGFuay5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuL3BvaW50XCI7XHJcbmNsYXNzIFBvaW50TWF0aCB7XHJcbiAgICAvKipcclxuICAgICAqIENhbGN1bGF0ZSB0aGUgZGlzdGFuY2UgYmV0d2VlbiB0d28gcG9pbnRzLCBvbiBhIDJEIHBsYW5lIHVzaW5nIFB5dGhvZ29yZWFuIFRoZW9yZW1cclxuICAgICAqIEBwYXJhbSBzdGFydCBGaXJzdCBwb2ludCB3aXRoIDJEIGNvb3JkaW5hdGVzXHJcbiAgICAgKiBAcGFyYW0gZW5kIFNlY29uZCBwb2ludCB3aXRoIDJEIGNvb3JkaW5hdGVzXHJcbiAgICAgKi9cclxuICAgIGRpc3QyZChzdGFydCwgZW5kKSB7XHJcbiAgICAgICAgY29uc3QgZGVsdGFYID0gZW5kLnggLSBzdGFydC54O1xyXG4gICAgICAgIGNvbnN0IGRlbHRhWSA9IGVuZC55IC0gc3RhcnQueTtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGguYWJzKGRlbHRhWCAqIGRlbHRhWCArIGRlbHRhWSAqIGRlbHRhWSkpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGUgaWYgdGhlIHBvaW50IGNvbGxpZGVzIHdpdGggdGhlIGNpcmNsZS5cclxuICAgICAqIEBwYXJhbSBwb2ludCBUaGUgY29vcmRpbmF0ZXMgb2YgdGhlIHBvaW50ICh1c2VyJ3MgY2xpY2spXHJcbiAgICAgKiBAcGFyYW0gY2VudGVyIFRoZSBjZW50cmUgb2YgdGhlIGNpcmNsZVxyXG4gICAgICogQHBhcmFtIHJhZGl1cyBUaGUgcmFkaXVzIG9mIHRoZSBjaXJjbGVcclxuICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlcmUgaXMgY29sbGlzaW9uLCBmYWxzZSBvdGhlcndpc2VcclxuICAgICAqL1xyXG4gICAgY29sbGlkZUNpcmNsZShwb2ludCwgY2VudGVyLCByYWRpdXMpIHtcclxuICAgICAgICBjb25zdCBkaXN0YW5jZSA9IHRoaXMuZGlzdDJkKHBvaW50LCBjZW50ZXIpO1xyXG4gICAgICAgIGlmIChkaXN0YW5jZSA+IHJhZGl1cykge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayBpZiB0aGUgcG9pbnQgaXMgd2l0aGluIHRoZSBzdGFydCBhbmQgZW5kIG9mIHRoZSBsaW5lXHJcbiAgICAgKiBAcGFyYW0gcG9pbnQgQ29vcmlkbmF0ZXMgb2YgYSBwb2ludFxyXG4gICAgICogQHBhcmFtIHN0YXJ0IFN0YXJ0IGNvb3JkaW5hdGVzIG9mIGEgbGluZVxyXG4gICAgICogQHBhcmFtIGVuZCBFbmQgY29vcmRpbmF0ZXMgb2YgYSBsaW5lXHJcbiAgICAgKi9cclxuICAgIHdpdGhpbihwb2ludCwgc3RhcnQsIGVuZCkge1xyXG4gICAgICAgIC8vIEluaXRpYWwgaW1wbGVtZW50YXRpb246IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zMjgxMjIvMjgyMzUyNlxyXG4gICAgICAgIC8vIE9wdGltaXNhdGlvbiBhbmQgY29ycmVjdGlvbjogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzMyODExMC8yODIzNTI2XHJcbiAgICAgICAgLy8gYXMgdGhlIHBvaW50IGlzIGd1YXJhbnRlZWQgdG8gYmUgb24gdGhlIGxpbmUgYnkgTGluZTo6Y2xvc2VzdFBvaW50LCB3ZSBqdXN0IGNoZWNrIGlmIHRoZSBwb2ludCBpcyB3aXRoaW4gdGhlIGxpbmVcclxuICAgICAgICBjb25zdCB3aXRoaW4gPSAoc3RhcnQsIHBvaW50LCBlbmQpID0+IChzdGFydCA8PSBwb2ludCAmJiBwb2ludCA8PSBlbmQpIHx8IChlbmQgPD0gcG9pbnQgJiYgcG9pbnQgPD0gc3RhcnQpO1xyXG4gICAgICAgIHJldHVybiBzdGFydC54ICE9PSBlbmQueCA/IHdpdGhpbihzdGFydC54LCBwb2ludC54LCBlbmQueCkgOiB3aXRoaW4oc3RhcnQueSwgcG9pbnQueSwgZW5kLnkpO1xyXG4gICAgfVxyXG59XHJcbmNsYXNzIExpbmUge1xyXG4gICAgLyoqIEZpbmQgdGhlIGNsb3Nlc3QgcG9pbnQgb24gYSBsaW5lLiBUaGUgY2xvc2VzdCBwb2ludCB0b1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBzdGFydCBTdGFydCBwb2ludCBvZiB0aGUgbGluZVxyXG4gICAgICogQHBhcmFtIGVuZCBFbmQgcG9pbnQgb2YgdGhlIGxpbmVcclxuICAgICAqIEBwYXJhbSBwb2ludCBQb2ludCBmb3Igd2hpY2ggdGhlIGNsb3Nlc3QgcG9pbnQgb24gdGhlIGxpbmUgd2lsbCBiZSBmb3VuZC5cclxuICAgICAqL1xyXG4gICAgY2xvc2VzdFBvaW50KHN0YXJ0LCBlbmQsIHBvaW50KSB7XHJcbiAgICAgICAgY29uc3QgQTEgPSBlbmQueSAtIHN0YXJ0LnksIEIxID0gc3RhcnQueCAtIGVuZC54O1xyXG4gICAgICAgIC8vIHR1cm4gdGhlIGxpbmUgaXRvIGVxdWF0aW9uIG9mIHRoZSBmb3JtIEF4ICsgQnkgPSBDXHJcbiAgICAgICAgY29uc3QgQzEgPSBBMSAqIHN0YXJ0LnggKyBCMSAqIHN0YXJ0Lnk7XHJcbiAgICAgICAgLy8gZmluZCB0aGUgcGVycGVuZGljdWxhciBsaW5lIHRoYXQgcGFzc2VzIHRocm91Z2ggdGhlIGxpbmUgYW5kIHRoZSBvdXRzaWRlIHBvaW50XHJcbiAgICAgICAgY29uc3QgQzIgPSAtQjEgKiBwb2ludC54ICsgQTEgKiBwb2ludC55O1xyXG4gICAgICAgIC8vIGZpbmQgdGhlIGRldGVybWluYW50IG9mIHRoZSB0d28gZXF1YXRpb25zIGFsZ2VicmFpY2FsbHlcclxuICAgICAgICBjb25zdCBkZXQgPSBBMSAqIEExICsgQjEgKiBCMTtcclxuICAgICAgICBjb25zdCBjbG9zZXN0UG9pbnQgPSBuZXcgUG9pbnQoKTtcclxuICAgICAgICAvLyB1c2UgQ3JhbWVyJ3MgUnVsZSB0byBzb2x2ZSBmb3IgdGhlIHBvaW50IG9mIGludGVyc2VjdGlvblxyXG4gICAgICAgIGlmIChkZXQgIT0gMCkge1xyXG4gICAgICAgICAgICBjbG9zZXN0UG9pbnQueCA9IChBMSAqIEMxIC0gQjEgKiBDMikgLyBkZXQ7XHJcbiAgICAgICAgICAgIGNsb3Nlc3RQb2ludC55ID0gKEExICogQzIgKyBCMSAqIEMxKSAvIGRldDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNsb3Nlc3RQb2ludC54ID0gcG9pbnQueDtcclxuICAgICAgICAgICAgY2xvc2VzdFBvaW50LnkgPSBwb2ludC55O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY2xvc2VzdFBvaW50O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm4gdGhlIGRpc3RhbmNlIGZyb20gdGhlIGxpbmUgdG8gdGhlIGNlbnRlciBvZiB0aGUgY2lyY2xlLlxyXG4gICAgICogVGhpcyBpcyBkb25lIGJ5IGZpbmRpbmcgdGhlIGxlbmd0aCBvZiB0aGUgcGVycGVuZGljdWxhciBsaW5lIHRoYXQgcGFzc2VzIHRocm91Z2ggdGhlIGxpbmUgYW5kIGNpcmNsZSdzIGNlbnRlclxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBzdGFydCBTdGFydCBjb29yZGluYXRlcyBvZiB0aGUgbGluZVxyXG4gICAgICogQHBhcmFtIGVuZCBFbmQgY29vcmRpbmF0ZXMgb2YgdGhlIGxpbmVcclxuICAgICAqIEBwYXJhbSBjZW50ZXIgQ2VudGVyIG9mIHRoZSBjaXJjbGVcclxuICAgICAqIEByZXR1cm5zIElmIHRoZSBjaXJjbGUncyBjZW50ZXIgaXMgd2l0aGluIHRoZSBsaW5lLCB0aGVuIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIHRoZW0gd2lsbCBiZSByZXR1cm5lZCxcclxuICAgICAqICAgICAgICAgIGlmIHRoZSBjaXJjbGUncyBjZW50ZXIgaXMgbm90IHdpdGhpbiB0aGUgbGluZSwgLTEgd2lsbCBiZSByZXR1cm5lZFxyXG4gICAgICovXHJcbiAgICBkaXN0Q2lyY2xlQ2VudGVyKHN0YXJ0LCBlbmQsIGNlbnRlcikge1xyXG4gICAgICAgIC8vIGZpbmQgdGhlIGNsb3Nlc3QgcG9pbnQgdG8gdGhlIGNpcmNsZSwgb24gdGhlIGxpbmVcclxuICAgICAgICBjb25zdCBjbG9zZXN0UG9pbnQgPSB0aGlzLmNsb3Nlc3RQb2ludChzdGFydCwgZW5kLCBjZW50ZXIpO1xyXG4gICAgICAgIC8vIGNoZWNrIGlmIHRoZSBjbG9zZXN0IHBvaW50IGlzIHdpdGhpbiB0aGUgc3RhcnQgYW5kIGVuZCBvZiB0aGUgbGluZSwgXHJcbiAgICAgICAgLy8gYW5kIG5vdCBzb21ld2hlcmUgYWxvbmcgaXRzIGluZmluaXRlIGV4dGVuc2lvblxyXG4gICAgICAgIGlmIChUYW5rc01hdGgucG9pbnQud2l0aGluKGNsb3Nlc3RQb2ludCwgc3RhcnQsIGVuZCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFRhbmtzTWF0aC5wb2ludC5kaXN0MmQoY2xvc2VzdFBvaW50LCBjZW50ZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2sgaWYgdGhlIGNpcmNsZSBpcyBjb2xsaWRpbmcgd2l0aCB0aGUgbGluZVxyXG4gICAgICogQHBhcmFtIHN0YXJ0IFN0YXJ0IGNvb3JkaW5hdGVzIG9mIHRoZSBsaW5lXHJcbiAgICAgKiBAcGFyYW0gZW5kIEVuZCBjb29yZGluYXRlcyBvZiB0aGUgbGluZVxyXG4gICAgICogQHBhcmFtIGNlbnRlciBDZW50ZXIgcG9pbnQgb2YgdGhlIGNpcmNsZVxyXG4gICAgICogQHBhcmFtIHJhZGl1cyBSYWRpdXMgb2YgdGhlIGNpcmNsZVxyXG4gICAgICovXHJcbiAgICBjb2xsaWRlQ2lyY2xlKHN0YXJ0LCBlbmQsIGNlbnRlciwgcmFkaXVzKSB7XHJcbiAgICAgICAgY29uc3QgZGlzdCA9IHRoaXMuZGlzdENpcmNsZUNlbnRlcihzdGFydCwgZW5kLCBjZW50ZXIpO1xyXG4gICAgICAgIC8vIGlmIGRpc3RhbmNlIGlzIHVuZGVmaW5lZCwgb3IgaXMgZnVydGhlciB0aGFuIHRoZSByYWRpdXMsIHJldHVybiBmYWxzZVxyXG4gICAgICAgIHJldHVybiBkaXN0ID09PSAtMSB8fCBkaXN0ID4gcmFkaXVzID8gZmFsc2UgOiB0cnVlO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBUYW5rc01hdGgge1xyXG59XHJcblRhbmtzTWF0aC5wb2ludCA9IG5ldyBQb2ludE1hdGgoKTtcclxuVGFua3NNYXRoLmxpbmUgPSBuZXcgTGluZSgpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD10YW5rc01hdGguanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYnVpbGQvdXRpbGl0eS90YW5rc01hdGguanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXHJcbiAqIEpTT04gdG8gSFRNTCBwYXJzZXIuXHJcbiAqXHJcbiAqIENvcHlyaWdodCAyMDE4IERpbWl0YXIgVGFzZXZcclxuICpcclxuICogUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55IHB1cnBvc2VcclxuICogd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZCwgcHJvdmlkZWQgdGhhdCB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZVxyXG4gKiBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBhcHBlYXIgaW4gYWxsIGNvcGllcy5cclxuICpcclxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiBBTkQgVEhFIEFVVEhPUiBESVNDTEFJTVMgQUxMIFdBUlJBTlRJRVMgV0lUSFxyXG4gKiBSRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EXHJcbiAqIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUiBBTlkgU1BFQ0lBTCwgRElSRUNULCBJTkRJUkVDVCxcclxuICogT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9SIEFOWSBEQU1BR0VTIFdIQVRTT0VWRVIgUkVTVUxUSU5HIEZST00gTE9TUyBPRiBVU0UsIERBVEFcclxuICogT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1IgT1RIRVIgVE9SVElPVVMgQUNUSU9OLFxyXG4gKiBBUklTSU5HIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUiBQRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxyXG4gKlxyXG4gKiBAYXV0aG9yIERpbWl0YXIgVGFzZXYgMjAxOFxyXG4qL1xyXG5leHBvcnQgY2xhc3MgSjJIIHtcclxuICAgIC8qKlxyXG4gICAgKiBDb252ZXJ0IHRoZSBKU09OIHRvIEhUTUwuXHJcbiAgICAqIC0gVXNhZ2U6XHJcbiAgICAqIGBgYFxyXG4gICAgKiBjb25zdCBkZXNjcmlwdGlvbiA9IHtcclxuICAgICogICBcImRpdlwiOntcclxuICAgICogICAgICAgXCJjbGFzc05hbWVcIjpcInN0eWxlMVwiLFxyXG4gICAgKiAgICAgICBcImNoaWxkcmVuXCI6W3tcclxuICAgICogICAgICAgICAgXCJpbnB1dFwiOntcclxuICAgICogICAgICAgICAgICAgICBcImlkXCI6IFwidXNlcm5hbWUtaW5wdXQtaWRcIixcclxuICAgICogICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0ZXh0XCIsXHJcbiAgICAqICAgICAgICAgICAgICAgXCJvbmNsaWNrXCI6IFwibXktZnVuYy1uYW1lKClcIiwgLy9vciBqdXN0IG15LWZ1bmMtbmFtZSwgd2l0aG91dCBxdW90YXRpb24gbWFya3NcclxuICAgICogICAgICAgICAgIH1cclxuICAgICogICAgICAgfSx7XHJcbiAgICAqICAgICAgICAgICBcImlucHV0XCI6e1xyXG4gICAgKiAgICAgICAgICAgICAgIFwiaWRcIjogXCJwYXNzd29yZC1pbnB1dC1pZFwiLFxyXG4gICAgKiAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInBhc3N3b3JkXCJcclxuICAgICogICAgICAgICAgIH1cclxuICAgICogICAgICAgfV1cclxuICAgICogICB9XHJcbiAgICAqIH1cclxuICAgICogYGBgXHJcbiAgICAqIE5vdGFibGUgc3ludGF4IGlzOlxyXG4gICAgKiAtIFRvcCBsZXZlbCBlbGVtZW50OlxyXG4gICAgKiBgYGBcclxuICAgICoge1xyXG4gICAgKiBcImRpdlwiOlxyXG4gICAgKiAgICAgIC8vIE5PVEU6IHByb3BlcnRpZXMgaGVyZSBNVVNUIG1hdGNoIHRoZSBwcm9wZXJ0aWVzIGF2YWlsYWJsZSB0byB0aGUgSFRNTCBlbGVtZW50XHJcbiAgICAqICAgICAgXCJjbGFzc05hbWVcIjogXCIuLi5cIixcclxuICAgICogICAgICAgLy8gd2lsbCBkbyBub3RoaW5nLCBhcyBkaXYgZG9lc24ndCBzdXBwb3J0IHRpdGxlXHJcbiAgICAqICAgICAgXCJ0aXRsZVwiOlwiLi4uXCJcclxuICAgICogICAgICBcIi4uLlwiXHJcbiAgICAqIH1cclxuICAgICogYGBgXHJcbiAgICAqIC0gQ2hpbGQgZWxlbWVudHNcclxuICAgICogYGBgXHJcbiAgICAqIHtcclxuICAgICogXCJkaXZcIjpcclxuICAgICogICBcImNsYXNzTmFtZVwiOiBcIm15LWRpdi1zdHlsZVwiLFxyXG4gICAgKiAgIC8vIHRoZSBsaXN0IGlzIHVzZWQgdG8gcHJlc2VydmUgdGhlIG9yZGVyIG9mIHRoZSBjaGlsZHJlblxyXG4gICAgKiAgIFwiY2hpbGRyZW5cIjpbe1xyXG4gICAgKiAgICAgICBcImFcIjp7XHJcbiAgICAqICAgICAgICAgICBcInRleHRcIjpcIkFwcGxlc1wiLFxyXG4gICAgKiAgICAgICAgICAgXCJjbGFzc05hbWVcIjogXCJteS1zdHlsZXNcIlxyXG4gICAgKiAgICAgICB9XHJcbiAgICAqICAgfSx7XHJcbiAgICAqICAgICAgIFwiaW5wdXRcIjp7XHJcbiAgICAqICAgICAgICAgICBcImNsYXNzTmFtZVwiOiBcIm15LWlucHV0LXN0eWxlXCJcclxuICAgICogICAgICAgfVxyXG4gICAgKiAgIH1dXHJcbiAgICAqIH1cclxuICAgICogYGBgXHJcbiAgICAqIEBwYXJhbSBkaWN0IERpY3Rpb25hcnkgY29udGFpbmluZyB0aGUgZGVzY3JpcHRpb24gb2YgdGhlIEhUTUxcclxuICAgICovXHJcbiAgICBzdGF0aWMgcGFyc2UoZGljdCkge1xyXG4gICAgICAgIGNvbnN0IFtwYXJlbnQsIHByb3BzXSA9IEoySC5nZXRQYXJlbnQoZGljdCk7XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gcHJvcHMpIHtcclxuICAgICAgICAgICAgaWYgKGtleSA9PT0gXCJjaGlsZHJlblwiKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaGlsZHJlbiA9IHByb3BzW1wiY2hpbGRyZW5cIl07XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGRyZW4gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcCBvZiBjaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoSjJILnBhcnNlKHApKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoSjJILnBhcnNlKGNoaWxkcmVuKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoa2V5ID09PSBcIm9uY2xpY2tcIikge1xyXG4gICAgICAgICAgICAgICAgLy8gdGhlcmUncyBubyBuZWVkIHRvIGRvIHRoaXMgZm9yIGJ1dHRvbnMsIHRoZSBvbmNsaWNrIGF0dHJpYnV0ZSBpcyBwcmVzZW50IGZvciB0aGVtXHJcbiAgICAgICAgICAgICAgICBwYXJlbnQuc2V0QXR0cmlidXRlKFwib25jbGlja1wiLCBwcm9wc1trZXldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHBhcmVudFtrZXldID0gcHJvcHNba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGFyZW50O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYW4gSFRNTCBlbGVtZW50IGZyb20gdGhlIGtleSBpbiB0aGUgZGljdGlvbmFyeSwgcmV0dXJuIHRoZSB2YWx1ZXNcclxuICAgICAqIEBwYXJhbSBkaWN0IERpY3Rpb25hcnkgd2l0aCAxIGtleSwgYW5kIHNvbWUgdmFsdWVzXHJcbiAgICAgKiBAcmV0dXJucyBIVE1MRWxlbWVudCBvZiB0aGUga2V5IGluIHRoZSBkaWN0aW9uYXJ5LCBhbmQgYWxsIG9mIGl0cyB2YWx1ZXNcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldFBhcmVudChkaWN0KSB7XHJcbiAgICAgICAgbGV0IHBhcmVudCwgcHJvcHM7XHJcbiAgICAgICAgLy8gZ2V0IHRoZSBmaXJzdCBrZXkgaW4gdGhlIGRpY3Rpb25hcnlcclxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBkaWN0KSB7XHJcbiAgICAgICAgICAgIHBhcmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoa2V5KTtcclxuICAgICAgICAgICAgcHJvcHMgPSBkaWN0W2tleV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBbcGFyZW50LCBwcm9wc107XHJcbiAgICB9XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9anNvbjJodG1sLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2J1aWxkL2pzb24yaHRtbC5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgeyBBY3Rpb25zIH0gZnJvbSAnLi9hY3Rpb24nO1xyXG5leHBvcnQgeyBTcGVlZCB9IGZyb20gJy4vc3BlZWQnO1xyXG5leHBvcnQgeyBMZW5ndGggfSBmcm9tICcuL2xlbmd0aCc7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2J1aWxkL2xpbWl0ZXJzL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IFMgfSBmcm9tIFwiLi4vdXRpbGl0eS9zdHJpbmdGb3JtYXRcIjtcclxuZXhwb3J0IGNsYXNzIENvbG9yIHtcclxuICAgIGNvbnN0cnVjdG9yKHJlZCwgZ3JlZW4sIGJsdWUsIGFscGhhID0gMS4wKSB7XHJcbiAgICAgICAgdGhpcy5yZWQgPSByZWQ7XHJcbiAgICAgICAgdGhpcy5ncmVlbiA9IGdyZWVuO1xyXG4gICAgICAgIHRoaXMuYmx1ZSA9IGJsdWU7XHJcbiAgICAgICAgdGhpcy5hbHBoYSA9IGFscGhhO1xyXG4gICAgfVxyXG4gICAgdG9SR0JBKGFscGhhKSB7XHJcbiAgICAgICAgYWxwaGEgPSBhbHBoYSAhPT0gdW5kZWZpbmVkID8gYWxwaGEgOiB0aGlzLmFscGhhO1xyXG4gICAgICAgIHJldHVybiBTLmZvcm1hdChcInJnYmEoJXMsJXMsJXMsJXMpXCIsIHRoaXMucmVkLCB0aGlzLmdyZWVuLCB0aGlzLmJsdWUsIGFscGhhKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBuZXh0KCkge1xyXG4gICAgICAgIGlmIChDb2xvci5jb2xvciA9PSAwKSB7XHJcbiAgICAgICAgICAgIENvbG9yLmNvbG9yKys7XHJcbiAgICAgICAgICAgIHJldHVybiBDb2xvci5yZWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoQ29sb3IuY29sb3IgPT0gMSkge1xyXG4gICAgICAgICAgICBDb2xvci5jb2xvcisrO1xyXG4gICAgICAgICAgICByZXR1cm4gQ29sb3IuYmx1ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChDb2xvci5jb2xvciA9PSAyKSB7XHJcbiAgICAgICAgICAgIENvbG9yLmNvbG9yKys7XHJcbiAgICAgICAgICAgIHJldHVybiBDb2xvci5ncmVlbigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChDb2xvci5jb2xvciA9PSAzKSB7XHJcbiAgICAgICAgICAgIENvbG9yLmNvbG9yKys7XHJcbiAgICAgICAgICAgIHJldHVybiBDb2xvci55ZWxsb3coKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiWW91J3ZlIHVzZWQgYWxsIHRoZSBhdmFpbGFibGUgY29sb3VycyFcIik7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcmVkKGFscGhhID0gMS4wKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDb2xvcigyNTUsIDAsIDAsIGFscGhhKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBncmVlbihhbHBoYSA9IDEuMCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgQ29sb3IoMCwgMjU1LCAwLCBhbHBoYSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYmx1ZShhbHBoYSA9IDEuMCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgQ29sb3IoMCwgMCwgMjU1LCBhbHBoYSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYmxhY2soYWxwaGEgPSAxLjApIHtcclxuICAgICAgICByZXR1cm4gbmV3IENvbG9yKDAsIDAsIDAsIGFscGhhKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyB3aGl0ZShhbHBoYSA9IDEuMCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgQ29sb3IoMjU1LCAyNTUsIDI1NSwgYWxwaGEpO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHllbGxvdyhhbHBoYSA9IDEuMCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgQ29sb3IoMjU1LCAyNTUsIDAsIGFscGhhKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBncmF5KGFscGhhID0gMS4wKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDb2xvcigxMjgsIDEyOCwgMTI4LCBhbHBoYSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcGluayhhbHBoYSA9IDEuMCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgQ29sb3IoMjU1LCAxMDIsIDIwMywgYWxwaGEpO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGMocmVkLCBncmVlbiwgYmx1ZSwgYWxwaGEgPSAxLjApIHtcclxuICAgICAgICByZXR1cm4gbmV3IENvbG9yKHJlZCwgZ3JlZW4sIGJsdWUsIGFscGhhKTtcclxuICAgIH1cclxufVxyXG5Db2xvci5jb2xvciA9IDA7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbG9yLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2J1aWxkL2RyYXdpbmcvY29sb3IuanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGNsYXNzIFMge1xyXG4gICAgc3RhdGljIGZvcm1hdCguLi5hKSB7XHJcbiAgICAgICAgcmV0dXJuIGEucmVkdWNlKChwLCBjKSA9PiBwLnJlcGxhY2UoLyVzLywgYykpO1xyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN0cmluZ0Zvcm1hdC5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9idWlsZC91dGlsaXR5L3N0cmluZ0Zvcm1hdC5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgY29uc3QgTlVNX1BMQVlFUlMgPSAyO1xyXG5leHBvcnQgY29uc3QgTlVNX1RBTktTID0gMTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Z2FtZVNldHRpbmdzLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2J1aWxkL2dhbWVTZXR0aW5ncy5qc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBDbGFzc2VzIGFkZGVkIHRvIHRoZSBgd2luZG93YCBvYmplY3QgYXJlIGdsb2JhbCwgYW5kIHZpc2libGUgaW5zaWRlIHRoZSBIVE1MIGNvZGUuXHJcbi8vIEFueSBjbGFzc2VzIG5vdCBhZGRlZCB0byB0aGUgYHdpbmRvd2AgYXJlIGludmlzaWJsZSAobm90IGFjY2Vzc2libGUpIGZyb20gdGhlIEhUTUwuXHJcbi8vIEdsb2JhbCBjbGFzc2VzXHJcbmltcG9ydCBDb250cm9scyBmcm9tICcuL3NpdGVDb250cm9scyc7XHJcbndpbmRvd1tcIkNvbnRyb2xzXCJdID0gQ29udHJvbHM7XHJcbi8vIEludGVybmFsIGNsYXNzZXNcclxuaW1wb3J0IHsgVWkgfSBmcm9tIFwiLi91aVwiO1xyXG5pbXBvcnQgeyBHYW1lQ29udHJvbGxlciwgR2FtZVN0YXRlIH0gZnJvbSAnLi9nYW1lQ29udHJvbGxlcic7XHJcbmltcG9ydCB7IFZpZXdwb3J0IH0gZnJvbSAnLi9nYW1lTWFwL3ZpZXdwb3J0JztcclxuY29uc3QgSURfR0FNRV9DQU5WQVMgPSBcInRhbmtzLWNhbnZhc1wiO1xyXG5jb25zdCBJRF9HQU1FX1VJID0gXCJ0YW5rcy11aVwiO1xyXG4vLyBTZXQtdXAgdGhlIGNhbnZhcyBhbmQgYWRkIG91ciBldmVudCBoYW5kbGVycyBhZnRlciB0aGUgcGFnZSBoYXMgbG9hZGVkXHJcbmZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAvLyBjb25zdCB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gMzI7XHJcbiAgICBjb25zdCB3aWR0aCA9IDQwOTY7XHJcbiAgICAvLyB0YWtlIDkwJSBvZiB0aGUgd2luZG93LCBsZWF2ZSBhIGJpdCBvZiBnYXAgb24gdGhlIHJpZ2h0XHJcbiAgICAvLyBjb25zdCBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgKiAwLjk7XHJcbiAgICBjb25zdCBoZWlnaHQgPSA0MDk2O1xyXG4gICAgY29uc3Qgdmlld3BvcnRXaWR0aCA9IHdpbmRvdy52aXN1YWxWaWV3cG9ydC53aWR0aDtcclxuICAgIGNvbnN0IHVpID0gbmV3IFVpKElEX0dBTUVfVUksIHZpZXdwb3J0V2lkdGgpO1xyXG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoSURfR0FNRV9DQU5WQVMpO1xyXG4gICAgY2FudmFzLndpZHRoID0gd2lkdGg7XHJcbiAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgd2luZG93Lm9uc2Nyb2xsID0gKGUpID0+IHtcclxuICAgICAgICB1aS51cGRhdGUoZSk7XHJcbiAgICB9O1xyXG4gICAgY29uc3Qgdmlld3BvcnQgPSBuZXcgVmlld3BvcnQoY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuICAgIHZpZXdwb3J0Lm1pZGRsZSgpO1xyXG4gICAgY29uc3QgY29udHJvbGxlciA9IG5ldyBHYW1lQ29udHJvbGxlcihjYW52YXMsIGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIiksIHVpLCB2aWV3cG9ydCk7XHJcbiAgICAvLyBzdGFydCB0aGUgZ2FtZSBpbiBNZW51IHN0YXRlXHJcbiAgICBjb250cm9sbGVyLmNoYW5nZUdhbWVTdGF0ZShHYW1lU3RhdGUuTUVOVSk7XHJcbiAgICBjYW52YXMuc2Nyb2xsSW50b1ZpZXcoKTtcclxufVxyXG5pbml0KCk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1haW4uanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYnVpbGQvbWFpbi5qc1xuLy8gbW9kdWxlIGlkID0gMTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udHJvbHMge1xyXG4gICAgc3RhdGljIHRvZ2dsZV93M19zaG93KGVsZW0pIHtcclxuICAgICAgICBpZiAoZWxlbS5jbGFzc05hbWUuaW5kZXhPZihcInczLXNob3dcIikgPT0gLTEpIHtcclxuICAgICAgICAgICAgZWxlbS5jbGFzc05hbWUgKz0gXCIgdzMtc2hvd1wiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZWxlbS5jbGFzc05hbWUgPSBlbGVtLmNsYXNzTmFtZS5yZXBsYWNlKFwiIHczLXNob3dcIiwgXCJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc3RhdGljIHczX29wZW4oKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteVNpZGViYXJcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15T3ZlcmxheVwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHczX2Nsb3NlKCkge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlTaWRlYmFyXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15T3ZlcmxheVwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICB9XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2l0ZUNvbnRyb2xzLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2J1aWxkL3NpdGVDb250cm9scy5qc1xuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgSjJIIH0gZnJvbSBcIi4vanNvbjJodG1sXCI7XHJcbmNsYXNzIFVpU2VjdGlvbiB7XHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtKSB7XHJcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBlbGVtO1xyXG4gICAgfVxyXG4gICAgYWRkKGVsZW0pIHtcclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQuaW5uZXJIVE1MID09PSBcIiZuYnNwO1wiKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50LmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGFyZW50LmFwcGVuZENoaWxkKGVsZW0pO1xyXG4gICAgfVxyXG4gICAgY2xlYXIoKSB7XHJcbiAgICAgICAgdGhpcy5wYXJlbnQuaW5uZXJIVE1MID0gXCImbmJzcDtcIjtcclxuICAgIH1cclxuICAgIGh0bWwoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50O1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBVaSB7XHJcbiAgICBjb25zdHJ1Y3RvcihpZCwgd2lkdGgpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICBpZiAoIXRoaXMuY29udGFpbmVyKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBVSSBET00gZWxlbWVudCB3YXMgbm90IGZvdW5kIVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZXRXaWR0aCh3aWR0aCk7XHJcbiAgICAgICAgY29uc3QgbGVmdCA9IHtcclxuICAgICAgICAgICAgXCJkaXZcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJjbGFzc05hbWVcIjogXCJ3My1jb2wgczEgbTEgbDFcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmxlZnQgPSBuZXcgVWlTZWN0aW9uKEoySC5wYXJzZShsZWZ0KSk7XHJcbiAgICAgICAgY29uc3QgbWlkZGxlID0ge1xyXG4gICAgICAgICAgICBcImRpdlwiOiB7XHJcbiAgICAgICAgICAgICAgICBcImNsYXNzTmFtZVwiOiBcInczLWNvbCBzMTAgbTEwIGwxMFwiLFxyXG4gICAgICAgICAgICAgICAgXCJzdHlsZVwiOiBcInRleHQtYWxpZ246Y2VudGVyO1wiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMubWlkZGxlID0gbmV3IFVpU2VjdGlvbihKMkgucGFyc2UobWlkZGxlKSk7XHJcbiAgICAgICAgY29uc3QgcmlnaHQgPSB7XHJcbiAgICAgICAgICAgIFwiZGl2XCI6IHtcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NOYW1lXCI6IFwidzMtY29sIHMxIG0xIGwxXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5yaWdodCA9IG5ldyBVaVNlY3Rpb24oSjJILnBhcnNlKHJpZ2h0KSk7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5sZWZ0Lmh0bWwoKSk7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5taWRkbGUuaHRtbCgpKTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnJpZ2h0Lmh0bWwoKSk7XHJcbiAgICB9XHJcbiAgICBzZXRXaWR0aCh3aWR0aCkge1xyXG4gICAgICAgIC8vIGFzIGFueSBpZ25vcmVzIHRoZSByZWFkLW9ubHkgXCJzdHlsZVwiIHdhcm5pbmcsIGFzIHdlIG5lZWQgdG8gd3JpdGUgdGhlIHdpZHRoIG9mIHRoZSBjYW52YXMgdG8gdGhlIHdpZHRoIG9mIHRoZSBVSSBlbGVtZW50XHJcbiAgICAgICAgLy8gdGhlIHdpZHRoICsgMiByZW1vdmVzIHRoZSBzbWFsbCBnYXAgbGVmdCBvbiB0aGUgcmlnaHQsIHdoaWNoIGlzIHRoZXJlIGZvciBhbiB1bmtub3duIHJlYXNvblxyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLndpZHRoID0gKHdpZHRoICsgMikgKyBcInB4XCI7XHJcbiAgICB9XHJcbiAgICBjbGVhcigpIHtcclxuICAgICAgICB0aGlzLmxlZnQuY2xlYXIoKTtcclxuICAgICAgICB0aGlzLm1pZGRsZS5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMucmlnaHQuY2xlYXIoKTtcclxuICAgIH1cclxuICAgIHNldFBsYXllcihuYW1lKSB7XHJcbiAgICAgICAgdGhpcy5taWRkbGUuYWRkKEoySC5wYXJzZSh7XHJcbiAgICAgICAgICAgIFwiYlwiOiB7XHJcbiAgICAgICAgICAgICAgICBcInRleHRDb250ZW50XCI6IG5hbWUgKyBcIidzIHR1cm4uXCIsXHJcbiAgICAgICAgICAgICAgICBcImNsYXNzTmFtZVwiOiBcImZhLTJ4XCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuICAgIHVwZGF0ZShlKSB7XHJcbiAgICAgICAgY29uc3QgbmV3TGVmdCA9IHdpbmRvdy52aXN1YWxWaWV3cG9ydC5wYWdlTGVmdDtcclxuICAgICAgICBjb25zdCBuZXdUb3AgPSB3aW5kb3cudmlzdWFsVmlld3BvcnQucGFnZVRvcDtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlRyeWluZyB0byBzZXQgVUkgdG9cIiwgbmV3TGVmdCwgbmV3VG9wKTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gbmV3TGVmdCArIFwicHhcIjtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS50b3AgPSBuZXdUb3AgKyBcInB4XCI7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJBY3R1YWwgdmFsdWVzXCIsIHRoaXMuY29udGFpbmVyLnN0eWxlLmxlZnQsIHRoaXMuY29udGFpbmVyLnN0eWxlLnRvcCk7XHJcbiAgICB9XHJcbn1cclxuVWkuSURfQlVUVE9OX1NLSVBfVFVSTiA9IFwidGFua3MtdWktYnV0dG9uLXNraXB0dXJuXCI7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXVpLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2J1aWxkL3VpLmpzXG4vLyBtb2R1bGUgaWQgPSAxMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBEcmF3LCBEcmF3U3RhdGUgfSBmcm9tIFwiLi4vZHJhd2luZy9kcmF3XCI7XHJcbmltcG9ydCAqIGFzIExpbWl0IGZyb20gXCIuLi9saW1pdGVycy9pbmRleFwiO1xyXG5pbXBvcnQgeyBHYW1lU3RhdGUgfSBmcm9tIFwiLi4vZ2FtZUNvbnRyb2xsZXJcIjtcclxuaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi4vdXRpbGl0eS9wb2ludFwiO1xyXG5pbXBvcnQgeyBUYW5rLCBUYW5rSGVhbHRoU3RhdGUsIFRhbmtUdXJuU3RhdGUgfSBmcm9tIFwiLi4vZ2FtZU9iamVjdHMvdGFua1wiO1xyXG5pbXBvcnQgeyBKMkggfSBmcm9tIFwiLi4vanNvbjJodG1sXCI7XHJcbmNsYXNzIE1vdmluZ1VpIHtcclxuICAgIHN0YXRpYyBidXR0b25fc2tpcFR1cm4oKSB7XHJcbiAgICAgICAgcmV0dXJuIEoySC5wYXJzZSh7XHJcbiAgICAgICAgICAgIFwiYnV0dG9uXCI6IHtcclxuICAgICAgICAgICAgICAgIFwic3R5bGVcIjogXCJ3aWR0aDoxMDAlXCIsXHJcbiAgICAgICAgICAgICAgICBcInRleHRDb250ZW50XCI6IFwiU2tpcCBUdXJuXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGJ1dHRvbl9nb1RvU2hvb3RpbmcoKSB7XHJcbiAgICAgICAgcmV0dXJuIEoySC5wYXJzZSh7XHJcbiAgICAgICAgICAgIFwiYnV0dG9uXCI6IHtcclxuICAgICAgICAgICAgICAgIFwic3R5bGVcIjogXCJ3aWR0aDoxMDAlXCIsXHJcbiAgICAgICAgICAgICAgICBcImNoaWxkcmVuXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBcImlcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzTmFtZVwiOiBcImZhcyBmYS1yb2NrZXRcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBNb3ZpbmdTdGF0ZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb250cm9sbGVyLCBjb250ZXh0LCB1aSwgcGxheWVyLCB2aWV3cG9ydCkge1xyXG4gICAgICAgIHRoaXMuc3RhcnRNb3ZlbWVudCA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIGxpbWl0IHRoZSBzdGFydCBvZiB0aGUgbGluZSB0byBiZSB0aGUgdGFua1xyXG4gICAgICAgICAgICB0aGlzLmRyYXcubGFzdCA9IG5ldyBQb2ludCh0aGlzLmFjdGl2ZS5wb3NpdGlvbi54LCB0aGlzLmFjdGl2ZS5wb3NpdGlvbi55KTtcclxuICAgICAgICAgICAgLy8gbGltaXQgdGhlIGxlbmd0aCBvZiB0aGUgbGluZSB0byB0aGUgbWF4aW11bSBhbGxvd2VkIHRhbmsgbW92ZW1lbnQsIGFuZCBkaXNhYmxlZCB0YW5rcyBjYW4ndCBiZSBtb3ZlZFxyXG4gICAgICAgICAgICBpZiAodGhpcy5saW5lLmluKHRoaXMuYWN0aXZlLnBvc2l0aW9uLCB0aGlzLmRyYXcubW91c2UpICYmIHRoaXMuYWN0aXZlLmhlYWx0aFN0YXRlICE9PSBUYW5rSGVhbHRoU3RhdGUuRElTQUJMRUQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhdy5zdGF0ZSA9IERyYXdTdGF0ZS5EUkFXSU5HO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52YWxpZE1vdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5lbmRNb3ZlbWVudCA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIHJlc2V0IHRoZSBsaW5lIGxpbWl0IGFzIHRoZSB1c2VyIGhhcyBsZXQgZ28gb2YgdGhlIGJ1dHRvblxyXG4gICAgICAgICAgICB0aGlzLmxpbmUucmVzZXQoKTtcclxuICAgICAgICAgICAgLy8gb25seSBhY3QgaWYgdGhlIHBvc2l0aW9uIGlzIHZhbGlkXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRhbmtWYWxpZFBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB1cGRhdGUgdGhlIHBvc2l0aW9uIG9mIHRoZSB0YW5rIGluIHRoZSBwbGF5ZXIgYXJyYXlcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRhbmsgPSB0aGlzLnBsYXllci50YW5rc1t0aGlzLmFjdGl2ZS5pZF07XHJcbiAgICAgICAgICAgICAgICB0YW5rLnBvc2l0aW9uID0gdGhpcy5kcmF3Lm1vdXNlLmNvcHkoKTtcclxuICAgICAgICAgICAgICAgIHRhbmsuYWN0aW9uU3RhdGUgPSBUYW5rVHVyblN0YXRlLk1PVkVEO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLnNob3dVc2VyV2FybmluZyhcIlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmVuZFR1cm4oKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZW5kVHVybkVhcmx5ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVuZGluZyB0dXJuIGVhcmx5XCIpO1xyXG4gICAgICAgICAgICAvLyBzZXQgdGhlIGFjdGl2ZSB0YW5rIHRvIGJlIHRoZSBvbmUgdGhhdCB3YXMgb3JpZ2luYWxseSBzZWxlY3RlZFxyXG4gICAgICAgICAgICAvLyB0aGlzIHdpbGwgdGVsbCB0aGUgc2VsZWN0aW9uIHN0YXRlIHRvIGdvIHRvIHNob290aW5nIHdpdGhvdXQgYSBuZXcgc2VsZWN0aW9uXHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyLmFjdGl2ZVRhbmsuc2V0KHRoaXMuYWN0aXZlKTtcclxuICAgICAgICAgICAgLy8gcnVuIHRoZSBlbmQgb2YgdHVybiBhY3Rpb25cclxuICAgICAgICAgICAgdGhpcy5lbmRUdXJuKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmdvVG9TaG9vdGluZyA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIudGFua3NbdGhpcy5hY3RpdmUuaWRdLmFjdGlvblN0YXRlID0gVGFua1R1cm5TdGF0ZS5NT1ZFRDtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIuYWN0aXZlVGFuay5zZXQodGhpcy5wbGF5ZXIudGFua3NbdGhpcy5hY3RpdmUuaWRdKTtcclxuICAgICAgICAgICAgdGhpcy5kcmF3LnN0YXRlID0gRHJhd1N0YXRlLlNUT1BQRUQ7XHJcbiAgICAgICAgICAgIC8vIHJlZHJhdyBjYW52YXMgd2l0aCBhbGwgY3VycmVudCB0YW5rc1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIucmVkcmF3Q2FudmFzKHRoaXMuZHJhdyk7XHJcbiAgICAgICAgICAgIC8vIGdvIHRvIHRhbmsgc2VsZWN0aW9uIHN0YXRlXHJcbiAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5jaGFuZ2VHYW1lU3RhdGUoR2FtZVN0YXRlLlRBTktfU0VMRUNUSU9OKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZHJhd01vdmVMaW5lID0gKGUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5kcmF3LnVwZGF0ZU1vdXNlUG9zaXRpb24oZSk7XHJcbiAgICAgICAgICAgIC8vIGRyYXcgdGhlIG1vdmVtZW50IGxpbmUgaWYgdGhlIG1vdXNlIGJ1dHRvbiBpcyBjdXJyZW50bHkgYmVpbmcgcHJlc3NlZFxyXG4gICAgICAgICAgICBpZiAodGhpcy5kcmF3LnN0YXRlID09IERyYXdTdGF0ZS5EUkFXSU5HKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5saW5lLmluKHRoaXMuYWN0aXZlLnBvc2l0aW9uLCB0aGlzLmRyYXcubW91c2UpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52YWxpZE1vdmUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGFua1ZhbGlkUG9zaXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyID0gY29udHJvbGxlcjtcclxuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xyXG4gICAgICAgIHRoaXMucGxheWVyID0gcGxheWVyO1xyXG4gICAgICAgIHRoaXMudWkgPSB1aTtcclxuICAgICAgICB0aGlzLmRyYXcgPSBuZXcgRHJhdygpO1xyXG4gICAgICAgIHRoaXMubGluZSA9IG5ldyBMaW1pdC5MZW5ndGgoVGFuay5NT1ZFTUVOVF9SQU5HRSk7XHJcbiAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLnBsYXllci5hY3RpdmVUYW5rLmdldCgpO1xyXG4gICAgICAgIHZpZXdwb3J0LmdvVG8ocGxheWVyLnZpZXdwb3J0UG9zaXRpb24pO1xyXG4gICAgICAgIGNvbnN0IGJ1dHRvbl9nb1RvU2hvb3RpbmcgPSBNb3ZpbmdVaS5idXR0b25fZ29Ub1Nob290aW5nKCk7XHJcbiAgICAgICAgYnV0dG9uX2dvVG9TaG9vdGluZy5vbmNsaWNrID0gdGhpcy5nb1RvU2hvb3Rpbmc7XHJcbiAgICAgICAgdGhpcy51aS5sZWZ0LmFkZChidXR0b25fZ29Ub1Nob290aW5nKTtcclxuICAgIH1cclxuICAgIGFkZEV2ZW50TGlzdGVuZXJzKGNhbnZhcykge1xyXG4gICAgICAgIGNhbnZhcy5vbm1vdXNlZG93biA9IHRoaXMuc3RhcnRNb3ZlbWVudDtcclxuICAgICAgICBjYW52YXMub25tb3VzZW1vdmUgPSB0aGlzLmRyYXdNb3ZlTGluZTtcclxuICAgICAgICAvLyB0aGUgbW91c2V1cCBpcyBvbmx5IG9uIHRoZSBjYW52YXMsIG90aGVyd2lzZSBub25lIG9mIHRoZSBVSSBidXR0b25zIGNhbiBiZSBjbGlja2VkXHJcbiAgICAgICAgY2FudmFzLm9ubW91c2V1cCA9IHRoaXMuZW5kTW92ZW1lbnQ7XHJcbiAgICAgICAgLy8gY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLnRvdWNoTW92ZSwgZmFsc2UpO1xyXG4gICAgICAgIC8vIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMubW91c2VVcCwgZmFsc2UpO1xyXG4gICAgICAgIC8vIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLnRvdWNoTW92ZSwgZmFsc2UpO1xyXG4gICAgfVxyXG4gICAgdmFsaWRNb3ZlKCkge1xyXG4gICAgICAgIHRoaXMudGFua1ZhbGlkUG9zaXRpb24gPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuZHJhdy5tb3VzZUxpbmUodGhpcy5jb250ZXh0LCBUYW5rLk1PVkVNRU5UX0xJTkVfV0lEVEgsIFRhbmsuTU9WRU1FTlRfTElORV9DT0xPUik7XHJcbiAgICB9XHJcbiAgICAvKiogVGhlIGFjdGlvbiB0byBiZSB0YWtlbiBhdCB0aGUgZW5kIG9mIHRoZSB0dXJuICovXHJcbiAgICBlbmRUdXJuKCkge1xyXG4gICAgICAgIHRoaXMuZHJhdy5zdGF0ZSA9IERyYXdTdGF0ZS5TVE9QUEVEO1xyXG4gICAgICAgIC8vIHJlZHJhdyBjYW52YXMgd2l0aCBhbGwgY3VycmVudCB0YW5rc1xyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5yZWRyYXdDYW52YXModGhpcy5kcmF3KTtcclxuICAgICAgICAvLyBnbyB0byB0YW5rIHNlbGVjdGlvbiBzdGF0ZVxyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5jaGFuZ2VHYW1lU3RhdGUoR2FtZVN0YXRlLlRBTktfU0VMRUNUSU9OKTtcclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1tb3ZlbWVudC5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9idWlsZC9nYW1lU3RhdGVzL21vdmVtZW50LmpzXG4vLyBtb2R1bGUgaWQgPSAxM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgY2xhc3MgQWN0aW9ucyB7XHJcbiAgICBjb25zdHJ1Y3RvcihsaW1pdCA9IDUpIHtcclxuICAgICAgICB0aGlzLmxpbWl0ID0gbGltaXQ7XHJcbiAgICAgICAgdGhpcy5udW1fYWN0aW9ucyA9IDA7XHJcbiAgICB9XHJcbiAgICB0YWtlKCkge1xyXG4gICAgICAgIHRoaXMubnVtX2FjdGlvbnMgKz0gMTtcclxuICAgIH1cclxuICAgIC8qKiBFbmQgdGhlIHR1cm4gZWFybHkgKi9cclxuICAgIGVuZCgpIHtcclxuICAgICAgICB0aGlzLm51bV9hY3Rpb25zID0gdGhpcy5saW1pdDtcclxuICAgIH1cclxuICAgIG92ZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubnVtX2FjdGlvbnMgPj0gdGhpcy5saW1pdDtcclxuICAgIH1cclxuICAgIHJlc2V0KCkge1xyXG4gICAgICAgIHRoaXMubnVtX2FjdGlvbnMgPSAwO1xyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFjdGlvbi5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9idWlsZC9saW1pdGVycy9hY3Rpb24uanNcbi8vIG1vZHVsZSBpZCA9IDE0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IFRhbmtzTWF0aCB9IGZyb20gXCIuLi91dGlsaXR5L3RhbmtzTWF0aFwiO1xyXG5leHBvcnQgY2xhc3MgU3BlZWQge1xyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWFsdGVzIGFuZCBrZWVwcyB0cmFjayBvZiB0aGUgdG90YWwgbGVuZ3RoIG9mIGEgbGluZS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gbGltaXQgTWF4aW11bSBsZW5ndGggb2YgZWFjaCBsaW5lLCBpbiBjYW52YXMgcGl4ZWxzXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGxpbWl0ID0gMjApIHtcclxuICAgICAgICB0aGlzLmxpbWl0ID0gbGltaXQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIGlmIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIHRoZSB0d28gcG9pbnRzIGlzIGdyZWF0ZXIgdGhhbiB0aGUgbGltaXQuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHN0YXJ0IFN0YXJ0IGNvb3JkaW5hdGVzXHJcbiAgICAgKiBAcGFyYW0gZW5kIEVuZCBjb29yZGluYXRlc1xyXG4gICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgZGlzdGFuY2UgaXMgZ3JlYXRlciB0aGFuIHRoZSBsaW1pdCwgZmFsc2Ugb3RoZXJ3aXNlXHJcbiAgICAgKi9cclxuICAgIGVub3VnaChzdGFydCwgZW5kKSB7XHJcbiAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBUYW5rc01hdGgucG9pbnQuZGlzdDJkKHN0YXJ0LCBlbmQpO1xyXG4gICAgICAgIHJldHVybiBkaXN0YW5jZSA+PSB0aGlzLmxpbWl0O1xyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNwZWVkLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2J1aWxkL2xpbWl0ZXJzL3NwZWVkLmpzXG4vLyBtb2R1bGUgaWQgPSAxNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBUYW5rc01hdGggfSBmcm9tIFwiLi4vdXRpbGl0eS90YW5rc01hdGhcIjtcclxuZXhwb3J0IGNsYXNzIExlbmd0aCB7XHJcbiAgICAvKipcclxuICAgICAqIENhbGN1YWx0ZXMgYW5kIGtlZXBzIHRyYWNrIG9mIHRoZSB0b3RhbCBsZW5ndGggb2YgYSBsaW5lLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBsaW1pdCBNYXhpbXVtIGxlbmd0aCBvZiBlYWNoIGxpbmUsIGluIGNhbnZhcyBwaXhlbHNcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobGltaXQgPSAyMDApIHtcclxuICAgICAgICB0aGlzLmxpbWl0ID0gbGltaXQ7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gMDtcclxuICAgIH1cclxuICAgIHJlc2V0KCkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudCA9IDA7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIENhbGN1bGF0ZSBkaXN0YW5jZSBvZiBDYXJ0ZXNpYW4gY29vcmRpbmF0ZXMsIGFuZCBpbmNyZW1lbnQgdGhlIHRvdGFsIGxlbmd0aCBvZiB0aGUgbGluZS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gc3RhcnQgU3RhcnQgY29vcmRpbmF0ZXNcclxuICAgICAqIEBwYXJhbSBlbmQgRW5kIGNvb3JkaW5hdGVzXHJcbiAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBsaW5lIGlzIGJlbG93IHRoZSBsaW1pdCwgZmFsc2UgaWYgdGhlIGxpbmUgaXMgbG9uZ2VyIHRoYW4gdGhlIGxpbWl0XHJcbiAgICAgKi9cclxuICAgIGFkZChzdGFydCwgZW5kKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50ICs9IFRhbmtzTWF0aC5wb2ludC5kaXN0MmQoc3RhcnQsIGVuZCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJTaG90IHRvdGFsIGRpc3RhbmNlOiBcIiwgdGhpcy5jdXJyZW50KTtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50IDw9IHRoaXMubGltaXQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIGlmIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIHRoZSB0d28gcG9pbnRzIGlzIGdyZWF0ZXIgdGhhbiB0aGUgbGltaXQuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHN0YXJ0IFN0YXJ0IGNvb3JkaW5hdGVzXHJcbiAgICAgKiBAcGFyYW0gZW5kIEVuZCBjb29yZGluYXRlc1xyXG4gICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgbGluZSBpcyBiZWxvdyB0aGUgbGltaXQsIGZhbHNlIG90aGVyd2lzZVxyXG4gICAgICovXHJcbiAgICBpbihzdGFydCwgZW5kKSB7XHJcbiAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBUYW5rc01hdGgucG9pbnQuZGlzdDJkKHN0YXJ0LCBlbmQpO1xyXG4gICAgICAgIHJldHVybiBkaXN0YW5jZSA8PSB0aGlzLmxpbWl0O1xyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxlbmd0aC5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9idWlsZC9saW1pdGVycy9sZW5ndGguanNcbi8vIG1vZHVsZSBpZCA9IDE2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IEdhbWVTdGF0ZSB9IGZyb20gXCIuLi9nYW1lQ29udHJvbGxlclwiO1xyXG5pbXBvcnQgeyBUYW5rIH0gZnJvbSBcIi4uL2dhbWVPYmplY3RzL3RhbmtcIjtcclxuaW1wb3J0IHsgRHJhdyB9IGZyb20gXCIuLi9kcmF3aW5nL2RyYXdcIjtcclxuaW1wb3J0ICogYXMgU2V0dGluZ3MgZnJvbSAnLi4vZ2FtZVNldHRpbmdzJztcclxuaW1wb3J0ICogYXMgTGltaXQgZnJvbSBcIi4uL2xpbWl0ZXJzL2luZGV4XCI7XHJcbmV4cG9ydCBjbGFzcyBQbGFjaW5nU3RhdGUge1xyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGNvbnRyb2xsZXIgVGhlIGV2ZW50cyBjb250cm9sbGVyLCB3aGljaCBpcyB1c2VkIHRvIGNoYW5nZSB0aGUgZ2FtZSBzdGF0ZSBhZnRlciB0aGlzIGV2ZW50IGlzIGZpbmlzaGVkLlxyXG4gICAgICogQHBhcmFtIGNvbnRleHQgQ29udGV4dCBvbiB3aGljaCB0aGUgb2JqZWN0cyBhcmUgZHJhd25cclxuICAgICAqIEBwYXJhbSBwbGF5ZXJcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoY29udHJvbGxlciwgY29udGV4dCwgdWksIHBsYXllciwgdmlld3BvcnQpIHtcclxuICAgICAgICB0aGlzLmFkZFRhbmsgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmRyYXcudXBkYXRlTW91c2VQb3NpdGlvbihlKTtcclxuICAgICAgICAgICAgLy8gaWYgdGhlIGZ1dHVyZSB3aWxsIGNoZWNrIGlmIGl0IGNvbGxpZGVzIHdpdGggYW5vdGhlciB0YW5rIG9yIHRlcnJhaW5cclxuICAgICAgICAgICAgY29uc3QgdGFuayA9IG5ldyBUYW5rKHRoaXMucGxheWVyLnRhbmtzLmxlbmd0aCwgdGhpcy5wbGF5ZXIsIHRoaXMuZHJhdy5tb3VzZS54LCB0aGlzLmRyYXcubW91c2UueSk7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyLnRhbmtzLnB1c2godGFuayk7XHJcbiAgICAgICAgICAgIHRhbmsuZHJhdyh0aGlzLmNvbnRleHQsIHRoaXMuZHJhdyk7XHJcbiAgICAgICAgICAgIC8vIHBsYXllciBoYXMgcGxhY2VkIGEgdGFua1xyXG4gICAgICAgICAgICB0aGlzLnRhbmtzUGxhY2VkLnRha2UoKTtcclxuICAgICAgICAgICAgLy8gaWYgd2UndmUgcGxhY2VkIGFzIG1hbnkgb2JqZWN0cyBhcyBhbGxvd2VkLCB0aGVuIGdvIHRvIG5leHQgc3RhdGVcclxuICAgICAgICAgICAgLy8gbmV4dF9wbGF5ZXIgaXMgbm90IGNoYW5nZWQgaGVyZSwgYXMgaXQncyBzZXQgaW4gdGhlIGNvbnRyb2xsZXJcclxuICAgICAgICAgICAgaWYgKHRoaXMudGFua3NQbGFjZWQub3ZlcigpKSB7XHJcbiAgICAgICAgICAgICAgICBQbGFjaW5nU3RhdGUucGxheWVyc1RhbmtQbGFjZW1lbnQudGFrZSgpO1xyXG4gICAgICAgICAgICAgICAgLy8gYWxsIG9mIHRoZSBwbGF5ZXJzIGhhdmUgcGxhY2VkIHRoZWlyIHRhbmtzLCBnbyB0byBtb3Zpbmcgc3RhdGVcclxuICAgICAgICAgICAgICAgIGlmIChQbGFjaW5nU3RhdGUucGxheWVyc1RhbmtQbGFjZW1lbnQub3ZlcigpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLmNoYW5nZUdhbWVTdGF0ZShHYW1lU3RhdGUuVEFOS19TRUxFQ1RJT04pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLmNoYW5nZUdhbWVTdGF0ZShHYW1lU3RhdGUuVEFOS19QTEFDRU1FTlQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIgPSBjb250cm9sbGVyO1xyXG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XHJcbiAgICAgICAgdGhpcy5kcmF3ID0gbmV3IERyYXcoKTtcclxuICAgICAgICB0aGlzLnRhbmtzUGxhY2VkID0gbmV3IExpbWl0LkFjdGlvbnMoU2V0dGluZ3MuTlVNX1RBTktTKTtcclxuICAgICAgICB0aGlzLnBsYXllciA9IHBsYXllcjtcclxuICAgICAgICB0aGlzLnVpID0gdWk7XHJcbiAgICAgICAgdmlld3BvcnQuZ29UbyhwbGF5ZXIudmlld3BvcnRQb3NpdGlvbik7XHJcbiAgICB9XHJcbiAgICBhZGRFdmVudExpc3RlbmVycyhjYW52YXMpIHtcclxuICAgICAgICBjYW52YXMub25tb3VzZWRvd24gPSB0aGlzLmFkZFRhbms7XHJcbiAgICB9XHJcbn1cclxuLy8ga2VlcHMgdHJhY2sgb2YgaG93IG1hbnkgcGxheWVycyBoYXZlIHBsYWNlZCB0aGVpciB0YW5rcyBJTiBUT1RBTFxyXG5QbGFjaW5nU3RhdGUucGxheWVyc1RhbmtQbGFjZW1lbnQgPSBuZXcgTGltaXQuQWN0aW9ucyhTZXR0aW5ncy5OVU1fUExBWUVSUyk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBsYWNlbWVudC5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9idWlsZC9nYW1lU3RhdGVzL3BsYWNlbWVudC5qc1xuLy8gbW9kdWxlIGlkID0gMTdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgSjJIIH0gZnJvbSBcIi4uL2pzb24yaHRtbFwiO1xyXG5pbXBvcnQgeyBHYW1lU3RhdGUgfSBmcm9tIFwiLi4vZ2FtZUNvbnRyb2xsZXJcIjtcclxuaW1wb3J0IHsgRHJhdywgRHJhd1N0YXRlIH0gZnJvbSBcIi4uL2RyYXdpbmcvZHJhd1wiO1xyXG5pbXBvcnQgeyBUYW5rLCBUYW5rVHVyblN0YXRlIH0gZnJvbSBcIi4uL2dhbWVPYmplY3RzL3RhbmtcIjtcclxuaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi4vdXRpbGl0eS9wb2ludFwiO1xyXG5pbXBvcnQgeyBUYW5rc01hdGggfSBmcm9tIFwiLi4vdXRpbGl0eS90YW5rc01hdGhcIjtcclxuaW1wb3J0IHsgTGluZSB9IGZyb20gXCIuLi91dGlsaXR5L2xpbmVcIjtcclxuaW1wb3J0ICogYXMgTGltaXQgZnJvbSBcIi4uL2xpbWl0ZXJzL2luZGV4XCI7XHJcbmNsYXNzIFNob290aW5nVWkge1xyXG4gICAgc3RhdGljIGJ1dHRvbl9za2lwVHVybigpIHtcclxuICAgICAgICByZXR1cm4gSjJILnBhcnNlKHtcclxuICAgICAgICAgICAgXCJidXR0b25cIjoge1xyXG4gICAgICAgICAgICAgICAgXCJzdHlsZVwiOiBcIndpZHRoOjEwMCVcIixcclxuICAgICAgICAgICAgICAgIFwidGV4dENvbnRlbnRcIjogXCJTa2lwXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBTaG9vdGluZ1N0YXRlIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbnRyb2xsZXIsIGNvbnRleHQsIHVpLCBwbGF5ZXIsIHZpZXdwb3J0KSB7XHJcbiAgICAgICAgLyoqIFdoZXRoZXIgdGhlIHNob3Qgd2FzIHN1Y2Nlc3NmdWxseSBmaXJlZCwgd2lsbCBiZSBzZXQgdG8gdHJ1ZSBpZiB0aGUgc2hvdCBpcyBmYXN0IGVub3VnaCAqL1xyXG4gICAgICAgIHRoaXMuc3VjY2Vzc2Z1bFNob3QgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnN0YXJ0U2hvb3RpbmcgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmRyYXcudXBkYXRlTW91c2VQb3NpdGlvbihlKTtcclxuICAgICAgICAgICAgdGhpcy5kcmF3Lmxhc3QgPSBuZXcgUG9pbnQodGhpcy5hY3RpdmUucG9zaXRpb24ueCwgdGhpcy5hY3RpdmUucG9zaXRpb24ueSk7XHJcbiAgICAgICAgICAgIC8vIHJlc2V0cyB0aGUgc3VjY2Vzc2Z1bCBzaG90IGZsYWdcclxuICAgICAgICAgICAgdGhpcy5zdWNjZXNzZnVsU2hvdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAvLyB0aGUgcGxheWVyIG11c3Qgc3RhcnQgc2hvb3RpbmcgZnJvbSB0aGUgdGFua1xyXG4gICAgICAgICAgICBjb25zdCB0YW5rID0gdGhpcy5wbGF5ZXIudGFua3NbdGhpcy5hY3RpdmUuaWRdO1xyXG4gICAgICAgICAgICBpZiAoVGFua3NNYXRoLnBvaW50LmNvbGxpZGVDaXJjbGUodGhpcy5kcmF3Lm1vdXNlLCB0YW5rLnBvc2l0aW9uLCBUYW5rLldJRFRIKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIG1vdXNlIGlzIHdpdGhpbiB0aGUgdGFua1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudGFua1JvYW1pbmdMZW5ndGguaW4odGhpcy5hY3RpdmUucG9zaXRpb24sIHRoaXMuZHJhdy5tb3VzZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBzaG90IGNvbGxpc2lvbiBzdGFydHMgZnJvbSB0aGUgY2VudHJlIG9mIHRoZSB0YW5rXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG90UGF0aC5wb2ludHMucHVzaCh0aGlzLmFjdGl2ZS5wb3NpdGlvbi5jb3B5KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhdy5zdGF0ZSA9IERyYXdTdGF0ZS5EUkFXSU5HO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFsaWRSYW5nZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDbGljayBkaWQgbm90IGNvbGxpZGUgd2l0aCB0aGUgYWN0aXZlIHRhbmtcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuY29udGludWVTaG9vdGluZyA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhdy51cGRhdGVNb3VzZVBvc2l0aW9uKGUpO1xyXG4gICAgICAgICAgICAvLyBkcmF3IHRoZSBtb3ZlbWVudCBsaW5lIGlmIHRoZSBtb3VzZSBidXR0b24gaXMgY3VycmVudGx5IGJlaW5nIHByZXNzZWRcclxuICAgICAgICAgICAgaWYgKHRoaXMuZHJhdy5zdGF0ZSA9PSBEcmF3U3RhdGUuRFJBV0lORykge1xyXG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIHBsYXllciBpcyBqdXN0IG1vdmluZyBhYm91dCBvbiB0aGUgdGFuaydzIHNwYWNlXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50YW5rUm9hbWluZ0xlbmd0aC5pbih0aGlzLmFjdGl2ZS5wb3NpdGlvbiwgdGhpcy5kcmF3Lm1vdXNlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUm9hbWluZyBpbiB0YW5rIHNwYWNlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5zaG93VXNlcldhcm5pbmcoXCJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52YWxpZFJhbmdlKCk7XHJcbiAgICAgICAgICAgICAgICB9IC8vIGlmIHRoZSBwbGF5ZXIgaGFzIHNob3QgZmFyIGF3YXkgc3RhcnQgZHJhd2luZyB0aGUgbGluZVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5zaG90U3BlZWQuZW5vdWdoKHRoaXMuYWN0aXZlLnBvc2l0aW9uLCB0aGlzLmRyYXcubW91c2UpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTaG9vdGluZyFcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLnNob3dVc2VyV2FybmluZyhcIlwiKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbGlkUmFuZ2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBvbmx5IGFkZCB0byB0aGUgc2hvdCBwYXRoIGlmIHRoZSBzaG90IHdhcyBzdWNjZXNzZnVsXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG90UGF0aC5wb2ludHMucHVzaCh0aGlzLmRyYXcubW91c2UuY29weSgpKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgc2hvdCBoYXMgcmVhY2hlZCB0aGUgbWF4IGFsbG93ZWQgbGltaXQgd2Ugc3RvcCB0aGUgZHJhd2luZywgdGhpcyBpcyBhbiBhcnRpZmljaWFsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbGltaXRhdGlvbiB0byBzdG9wIGEgc2hvdCB0aGF0IGdvZXMgYWxvbmcgdGhlIHdob2xlIHNjcmVlblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5zaG90TGVuZ3RoLmFkZCh0aGlzLmFjdGl2ZS5wb3NpdGlvbiwgdGhpcy5kcmF3Lm1vdXNlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlN1Y2Nlc3NmdWwgc2hvdCFcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3VjY2Vzc2Z1bFNob3QgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXcuc3RhdGUgPSBEcmF3U3RhdGUuU1RPUFBFRDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuc2hvd1VzZXJXYXJuaW5nKFwiU2hvb3RpbmcgdG9vIHNsb3chXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2hvb3RpbmcgdG9vIHNsb3chXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhdy5zdGF0ZSA9IERyYXdTdGF0ZS5TVE9QUEVEO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnN0b3BTaG9vdGluZyA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBsYXllclRhbmtzU2hvdCA9IHRoaXMucGxheWVyLnRhbmtzU2hvdC5nZXQoKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3VjY2Vzc2Z1bFNob3QpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5jb2xsaWRlKHRoaXMuc2hvdFBhdGgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLmNhY2hlTGluZSh0aGlzLnNob3RQYXRoKTtcclxuICAgICAgICAgICAgICAgIHBsYXllclRhbmtzU2hvdC50YWtlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZS5hY3Rpb25TdGF0ZSA9IFRhbmtUdXJuU3RhdGUuU0hPVDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBpZiBhbGwgdGhlIHBsYXllcidzIHRhbmsgaGF2ZSBzaG90XHJcbiAgICAgICAgICAgIGlmIChwbGF5ZXJUYW5rc1Nob3Qub3ZlcigpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyByZXNldCB0aGUgY3VycmVudCBwbGF5ZXIncyB0YW5rIGFjdCBzdGF0ZXNcclxuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyLnJlc2V0VGFua3NBY3RTdGF0ZXMoKTtcclxuICAgICAgICAgICAgICAgIC8vIGNoYW5nZSB0byB0aGUgbmV4dCBwbGF5ZXIgd2hlbiB0aGUgc3RhdGUgaXMgbmV4dCBjaGFuZ2VkXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIubmV4dFBsYXllciA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiBub3QgYWxsIHRhbmtzIGhhdmUgc2hvdCwgdGhlbiBrZWVwIHRoZSBzdGF0ZSBmb3IgdGhlIG5leHQgc2hvb3RpbmdcclxuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyLnRhbmtzU2hvdC5zZXQocGxheWVyVGFua3NTaG90KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmRyYXcuc3RhdGUgPSBEcmF3U3RhdGUuU1RPUFBFRDtcclxuICAgICAgICAgICAgLy8gcmVkcmF3IGNhbnZhcyB3aXRoIGFsbCBjdXJyZW50IHRhbmtzXHJcbiAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5yZWRyYXdDYW52YXModGhpcy5kcmF3KTtcclxuICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLmNoYW5nZUdhbWVTdGF0ZShHYW1lU3RhdGUuVEFOS19TRUxFQ1RJT04pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5za2lwVHVybiA9ICgpID0+IHtcclxuICAgICAgICAgICAgLy8gcmVzZXQgdGhlIGN1cnJlbnQgcGxheWVyJ3MgdGFuayBhY3Qgc3RhdGVzXHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyLnJlc2V0VGFua3NBY3RTdGF0ZXMoKTtcclxuICAgICAgICAgICAgLy8gY2hhbmdlIHRvIHRoZSBuZXh0IHBsYXllciB3aGVuIHRoZSBzdGF0ZSBpcyBuZXh0IGNoYW5nZWRcclxuICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLm5leHRQbGF5ZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmRyYXcuc3RhdGUgPSBEcmF3U3RhdGUuU1RPUFBFRDtcclxuICAgICAgICAgICAgLy8gcmVkcmF3IGNhbnZhcyB3aXRoIGFsbCBjdXJyZW50IHRhbmtzXHJcbiAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5yZWRyYXdDYW52YXModGhpcy5kcmF3KTtcclxuICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLmNoYW5nZUdhbWVTdGF0ZShHYW1lU3RhdGUuVEFOS19TRUxFQ1RJT04pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyID0gY29udHJvbGxlcjtcclxuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xyXG4gICAgICAgIHRoaXMucGxheWVyID0gcGxheWVyO1xyXG4gICAgICAgIHRoaXMudWkgPSB1aTtcclxuICAgICAgICB0aGlzLnNob3RQYXRoID0gbmV3IExpbmUoKTtcclxuICAgICAgICB0aGlzLmRyYXcgPSBuZXcgRHJhdygpO1xyXG4gICAgICAgIHRoaXMudGFua1JvYW1pbmdMZW5ndGggPSBuZXcgTGltaXQuTGVuZ3RoKFRhbmsuU0hPT1RJTkdfREVBRFpPTkUpO1xyXG4gICAgICAgIHRoaXMuc2hvdExlbmd0aCA9IG5ldyBMaW1pdC5MZW5ndGgoVGFuay5TSE9PVElOR19SQU5HRSk7XHJcbiAgICAgICAgdGhpcy5zaG90U3BlZWQgPSBuZXcgTGltaXQuU3BlZWQoVGFuay5TSE9PVElOR19TUEVFRCk7XHJcbiAgICAgICAgaWYgKCFwbGF5ZXIudGFua3NTaG90LmF2YWlsYWJsZSgpKSB7XHJcbiAgICAgICAgICAgIHBsYXllci50YW5rc1Nob3Quc2V0KG5ldyBMaW1pdC5BY3Rpb25zKHBsYXllci5hY3RpdmVUYW5rcygpLmxlbmd0aCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMucGxheWVyLmFjdGl2ZVRhbmsuZ2V0KCk7XHJcbiAgICAgICAgdmlld3BvcnQuZ29UbyhwbGF5ZXIudmlld3BvcnRQb3NpdGlvbik7XHJcbiAgICAgICAgY29uc3QgYnV0dG9uX3NraXBUdXJuID0gU2hvb3RpbmdVaS5idXR0b25fc2tpcFR1cm4oKTtcclxuICAgICAgICBidXR0b25fc2tpcFR1cm4ub25tb3VzZWRvd24gPSB0aGlzLnNraXBUdXJuO1xyXG4gICAgICAgIHVpLmxlZnQuYWRkKGJ1dHRvbl9za2lwVHVybik7XHJcbiAgICB9XHJcbiAgICBhZGRFdmVudExpc3RlbmVycyhjYW52YXMpIHtcclxuICAgICAgICBjYW52YXMub25tb3VzZWRvd24gPSB0aGlzLnN0YXJ0U2hvb3Rpbmc7XHJcbiAgICAgICAgY2FudmFzLm9ubW91c2Vtb3ZlID0gdGhpcy5jb250aW51ZVNob290aW5nO1xyXG4gICAgICAgIHdpbmRvdy5vbm1vdXNldXAgPSB0aGlzLnN0b3BTaG9vdGluZztcclxuICAgIH1cclxuICAgIHZhbGlkUmFuZ2UoKSB7XHJcbiAgICAgICAgdGhpcy5kcmF3Lm1vdXNlTGluZSh0aGlzLmNvbnRleHQsIFRhbmsuTU9WRU1FTlRfTElORV9XSURUSCwgVGFuay5NT1ZFTUVOVF9MSU5FX0NPTE9SKTtcclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zaG9vdGluZy5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9idWlsZC9nYW1lU3RhdGVzL3Nob290aW5nLmpzXG4vLyBtb2R1bGUgaWQgPSAxOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgY2xhc3MgTGluZSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnBvaW50cyA9IFtdO1xyXG4gICAgfVxyXG4gICAgbGlzdCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlBvaW50cyBmb3IgdGhlIHNob3Q6IFwiLCB0aGlzLnBvaW50cy5qb2luKFwiLCBcIikpO1xyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxpbmUuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYnVpbGQvdXRpbGl0eS9saW5lLmpzXG4vLyBtb2R1bGUgaWQgPSAxOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBHYW1lU3RhdGUgfSBmcm9tIFwiLi4vZ2FtZUNvbnRyb2xsZXJcIjtcclxuaW1wb3J0IHsgVGFua3NNYXRoIH0gZnJvbSBcIi4uL3V0aWxpdHkvdGFua3NNYXRoXCI7XHJcbmltcG9ydCB7IERyYXcgfSBmcm9tIFwiLi4vZHJhd2luZy9kcmF3XCI7XHJcbmltcG9ydCB7IFRhbmssIFRhbmtIZWFsdGhTdGF0ZSwgVGFua1R1cm5TdGF0ZSB9IGZyb20gXCIuLi9nYW1lT2JqZWN0cy90YW5rXCI7XHJcbmV4cG9ydCBjbGFzcyBTZWxlY3Rpb25TdGF0ZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb250cm9sbGVyLCBjb250ZXh0LCB1aSwgcGxheWVyLCB2aWV3cG9ydCkge1xyXG4gICAgICAgIHRoaXMuaGlnaGxpZ2h0VGFuayA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhdy51cGRhdGVNb3VzZVBvc2l0aW9uKGUpO1xyXG4gICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgdXNlciBoYXMgY2xpY2tlZCBhbnkgdGFuay5cclxuICAgICAgICAgICAgZm9yIChjb25zdCB0YW5rIG9mIHRoaXMucGxheWVyLnRhbmtzKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB0YW5rcyB0aGF0IG11c3Qgbm90IGJlIHNlbGVjdGVkOlxyXG4gICAgICAgICAgICAgICAgLy8gLSBkZWFkIHRhbmtzXHJcbiAgICAgICAgICAgICAgICAvLyAtIHRhbmtzIHRoYXQgaGF2ZSBhY3RlZFxyXG4gICAgICAgICAgICAgICAgLy8gLSB0YW5rcyB0aGF0IHRoZSBtb3VzZSBjbGljayBkb2VzIG5vdCBjb2xsaWRlIHdpdGhcclxuICAgICAgICAgICAgICAgIGlmICh0YW5rLmhlYWx0aFN0YXRlICE9PSBUYW5rSGVhbHRoU3RhdGUuREVBRCAmJlxyXG4gICAgICAgICAgICAgICAgICAgIHRhbmsuYWN0aXZlKCkgJiZcclxuICAgICAgICAgICAgICAgICAgICBUYW5rc01hdGgucG9pbnQuY29sbGlkZUNpcmNsZSh0aGlzLmRyYXcubW91c2UsIHRhbmsucG9zaXRpb24sIFRhbmsuV0lEVEgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaGlnaGxpZ2h0IHRoZSBzZWxlY3RlZCB0YW5rXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdWNjZXNzZnVsU2VsZWN0aW9uKHRhbmspO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIG9ubHkgaGlnaGxpZ2h0IHRoZSBmaXJzdCB0YW5rLCBpZiB0aGVyZSBhcmUgbXVsdGlwbGUgb24gdG9wIG9mIGVhY2ggb3RoZXJcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5tb3VzZVVwID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAvLyBpZiB0aGUgdXNlciBoYXMgY2xpY2tlZCBvbiBhbnkgb2YgdGhlIG9iamVjdHMsIGdvIGludG8gbW92ZW1lbnQgc3RhdGVcclxuICAgICAgICAgICAgaWYgKHRoaXMucGxheWVyLmFjdGl2ZVRhbmsuYXZhaWxhYmxlKCkpIHtcclxuICAgICAgICAgICAgICAgIGxldCBuZXh0U3RhdGU7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRoaXMuYWN0aXZlLmFjdGlvblN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBUYW5rVHVyblN0YXRlLk5PVF9BQ1RFRDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFN0YXRlID0gR2FtZVN0YXRlLlRBTktfTU9WRU1FTlQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgVGFua1R1cm5TdGF0ZS5NT1ZFRDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFN0YXRlID0gR2FtZVN0YXRlLlRBTktfU0hPT1RJTkc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgVGFua1R1cm5TdGF0ZS5TSE9UOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U3RhdGUgPSBHYW1lU3RhdGUuVEFOS19TRUxFQ1RJT047XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLmNoYW5nZUdhbWVTdGF0ZShuZXh0U3RhdGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIgPSBjb250cm9sbGVyO1xyXG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBwbGF5ZXI7XHJcbiAgICAgICAgdGhpcy5kcmF3ID0gbmV3IERyYXcoKTtcclxuICAgICAgICB0aGlzLnVpID0gdWk7XHJcbiAgICAgICAgdmlld3BvcnQuZ29UbyhwbGF5ZXIudmlld3BvcnRQb3NpdGlvbik7XHJcbiAgICB9XHJcbiAgICBhZGRFdmVudExpc3RlbmVycyhjYW52YXMpIHtcclxuICAgICAgICAvLyBjaGVhdCBhbmQga2VlcCB0aGUgY3VycmVudCBhY3RpdmUgdGFuaywgd2hpbGUgc3dpdGNoaW5nIHRvIHRoZSBuZXh0IHN0YXRlXHJcbiAgICAgICAgaWYgKHRoaXMucGxheWVyLmFjdGl2ZVRhbmsuYXZhaWxhYmxlKCkpIHtcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLnBsYXllci5hY3RpdmVUYW5rLmdldCgpO1xyXG4gICAgICAgICAgICB0aGlzLnN1Y2Nlc3NmdWxTZWxlY3Rpb24odGhpcy5hY3RpdmUpO1xyXG4gICAgICAgICAgICB0aGlzLm1vdXNlVXAoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNhbnZhcy5vbm1vdXNlZG93biA9IHRoaXMuaGlnaGxpZ2h0VGFuaztcclxuICAgICAgICAgICAgLy8gTk9URTogbW91c2V1cCBpcyBvbiB0aGUgd2hvbGUgd2luZG93LCBzbyB0aGF0IGV2ZW4gaWYgdGhlIGN1cnNvciBleGl0cyB0aGUgY2FudmFzLCB0aGUgZXZlbnQgd2lsbCB0cmlnZ2VyXHJcbiAgICAgICAgICAgIHdpbmRvdy5vbm1vdXNldXAgPSB0aGlzLm1vdXNlVXA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc3VjY2Vzc2Z1bFNlbGVjdGlvbih0YW5rKSB7XHJcbiAgICAgICAgdGFuay5oaWdobGlnaHQodGhpcy5jb250ZXh0LCB0aGlzLmRyYXcpO1xyXG4gICAgICAgIC8vIHN0b3JlIHRoZSBkZXRhaWxzIG9mIHRoZSBhY3RpdmUgdGFua1xyXG4gICAgICAgIHRoaXMucGxheWVyLmFjdGl2ZVRhbmsuc2V0KHRhbmspO1xyXG4gICAgICAgIHRoaXMuYWN0aXZlID0gdGFuaztcclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zZWxlY3Rpb24uanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYnVpbGQvZ2FtZVN0YXRlcy9zZWxlY3Rpb24uanNcbi8vIG1vZHVsZSBpZCA9IDIwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IERyYXcgfSBmcm9tIFwiLi4vZHJhd2luZy9kcmF3XCI7XHJcbmltcG9ydCB7IFMgfSBmcm9tIFwiLi4vdXRpbGl0eS9zdHJpbmdGb3JtYXRcIjtcclxuY2xhc3MgTWVudSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0aXRsZSwgb3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMuZmluYWxfaGVpZ2h0ID0gLTE7XHJcbiAgICAgICAgdGhpcy5zdGFydF9oZWlnaHQgPSAxNTA7XHJcbiAgICAgICAgdGhpcy5oZWlnaHRfaW5jcmVtZW50ID0gNzA7XHJcbiAgICAgICAgdGhpcy50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XHJcbiAgICB9XHJcbiAgICBkcmF3KGNvbnRleHQsIGRyYXcpIHtcclxuICAgICAgICBjb25zdCB3aWR0aCA9IGNvbnRleHQuY2FudmFzLndpZHRoO1xyXG4gICAgICAgIGNvbnN0IGhlaWdodCA9IGNvbnRleHQuY2FudmFzLmhlaWdodDtcclxuICAgICAgICBjb250ZXh0LnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBcInJnYigxMzUsMjA2LDI1MClcIjtcclxuICAgICAgICBjb250ZXh0LmZvbnQgPSBcIjYwcHggR2VvcmdpYVwiO1xyXG4gICAgICAgIGxldCB0ZXh0X2hlaWdodCA9IHRoaXMuc3RhcnRfaGVpZ2h0O1xyXG4gICAgICAgIGNvbnN0IGNlbnRyZSA9IHdpZHRoIC8gMjtcclxuICAgICAgICBjb250ZXh0LmZpbGxUZXh0KHRoaXMudGl0bGUsIGNlbnRyZSwgdGV4dF9oZWlnaHQpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gXCJXaGl0ZVwiO1xyXG4gICAgICAgIGNvbnRleHQuZm9udCA9IFwiMzBweCBHZW9yZ2lhXCI7XHJcbiAgICAgICAgZm9yIChjb25zdCBbaWQsIG9wdGlvbl0gb2YgdGhpcy5vcHRpb25zLmVudHJpZXMoKSkge1xyXG4gICAgICAgICAgICB0ZXh0X2hlaWdodCArPSB0aGlzLmhlaWdodF9pbmNyZW1lbnQ7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkKGlkKSkge1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBcIlllbGxvd1wiO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5mb250ID0gXCI0MHB4XCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IFwiQmxhY2tcIjtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuZm9udCA9IFwiMzBweFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFRleHQob3B0aW9uLCBjZW50cmUsIHRleHRfaGVpZ2h0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5maW5hbF9oZWlnaHQgPSB0ZXh0X2hlaWdodDtcclxuICAgIH1cclxuICAgIHNlbGVjdGVkKGlkKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRfaXRlbSA9PT0gaWQ7XHJcbiAgICB9XHJcbiAgICBzZWxlY3QobW91c2UpIHtcclxuICAgICAgICBpZiAodGhpcy5maW5hbF9oZWlnaHQgPT09IC0xKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBtZW51IGhhc24ndCBiZWVuIGRyYXduLlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gYWRkcyBzb21lIGJ1ZmZlciBzcGFjZSBhcm91bmQgZWFjaCBvcHRpb24sIHRoaXMgbWFrZXMgaXQgZWFzaWVyIHRvIHNlbGVjdCBlYWNoIG9wdGlvblxyXG4gICAgICAgIGNvbnN0IGJ1ZmZlcl9zcGFjZSA9IHRoaXMuaGVpZ2h0X2luY3JlbWVudCAvIDI7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRfaGVpZ2h0ID0gdGhpcy5maW5hbF9oZWlnaHQ7XHJcbiAgICAgICAgbGV0IGlkID0gdGhpcy5vcHRpb25zLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgLy8gY2hlY2sgdXAgdG8gdGhlIGhlaWdodCBvZiB0aGUgdGl0bGUsIHRoZXJlJ3Mgbm90IGdvaW5nIHRvIGJlIGFueXRoaW5nIGFib3ZlIGl0XHJcbiAgICAgICAgd2hpbGUgKGN1cnJlbnRfaGVpZ2h0ID4gdGhpcy5zdGFydF9oZWlnaHQpIHtcclxuICAgICAgICAgICAgaWYgKG1vdXNlLnkgPiBjdXJyZW50X2hlaWdodCAtIGJ1ZmZlcl9zcGFjZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZF9pdGVtID0gaWQ7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gbG93ZXIgdGhlIGhlaWdodCB0aGF0IHdlIGFyZSBjaGVja2luZyBvbiwgdGhpcyBoYXMgdGhlIGVmZmVjdCBvZiBtb3ZpbmcgdGhlXHJcbiAgICAgICAgICAgIC8vIG1lbnUgaXRlbSdzIGhpdGJveCBoaWdoZXIgb24gdGhlIHNjcmVlblxyXG4gICAgICAgICAgICBjdXJyZW50X2hlaWdodCAtPSB0aGlzLmhlaWdodF9pbmNyZW1lbnQ7XHJcbiAgICAgICAgICAgIGlkIC09IDE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBHYW1lRW5kU3RhdGUge1xyXG4gICAgY29uc3RydWN0b3IoY29udHJvbGxlciwgY29udGV4dCwgcGxheWVyLCB2aWV3cG9ydCkge1xyXG4gICAgICAgIHRoaXMuY29udHJvbGxlciA9IGNvbnRyb2xsZXI7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcclxuICAgICAgICB0aGlzLmRyYXcgPSBuZXcgRHJhdygpO1xyXG4gICAgICAgIGNvbnN0IG51bVRhbmtzID0gcGxheWVyLmFjdGl2ZVRhbmtzKCkubGVuZ3RoICsgMTtcclxuICAgICAgICBjb25zdCB0YW5rc1N0ciA9IG51bVRhbmtzID09PSAxID8gXCIgdGFua1wiIDogXCIgdGFua3NcIjtcclxuICAgICAgICB2aWV3cG9ydC5taWRkbGUoKTtcclxuICAgICAgICB0aGlzLm1lbnUgPSBuZXcgTWVudShcIkVuZCBvZiBHYW1lXCIsIFtTLmZvcm1hdChcIlBsYXllciAlcyBXaW5zIVwiLCBwbGF5ZXIuaWQpLCBTLmZvcm1hdChcIldpdGggJXMgJXNcIiwgbnVtVGFua3MsIHRhbmtzU3RyKV0pO1xyXG4gICAgICAgIHRoaXMubWVudS5kcmF3KHRoaXMuY29udGV4dCwgdGhpcy5kcmF3KTtcclxuICAgIH1cclxuICAgIGFkZEV2ZW50TGlzdGVuZXJzKGNhbnZhcykge1xyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWdhbWVFbmQuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYnVpbGQvZ2FtZVN0YXRlcy9nYW1lRW5kLmpzXG4vLyBtb2R1bGUgaWQgPSAyMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBHYW1lU3RhdGUgfSBmcm9tIFwiLi4vZ2FtZUNvbnRyb2xsZXJcIjtcclxuaW1wb3J0IHsgRHJhdyB9IGZyb20gXCIuLi9kcmF3aW5nL2RyYXdcIjtcclxuY2xhc3MgTWVudSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0aXRsZSwgb3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMuZmluYWxfaGVpZ2h0ID0gLTE7XHJcbiAgICAgICAgdGhpcy5zdGFydF9oZWlnaHQgPSAxNTA7XHJcbiAgICAgICAgdGhpcy5oZWlnaHRfaW5jcmVtZW50ID0gNzA7XHJcbiAgICAgICAgdGhpcy50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XHJcbiAgICB9XHJcbiAgICBkcmF3KGNvbnRleHQsIGRyYXcpIHtcclxuICAgICAgICBjb25zdCB3aWR0aCA9IGNvbnRleHQuY2FudmFzLndpZHRoO1xyXG4gICAgICAgIGNvbnN0IGhlaWdodCA9IGNvbnRleHQuY2FudmFzLmhlaWdodDtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IFwiQmxhY2tcIjtcclxuICAgICAgICBjb250ZXh0LmZpbGxSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIGNvbnRleHQudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IFwicmdiKDEzNSwyMDYsMjUwKVwiO1xyXG4gICAgICAgIGNvbnRleHQuZm9udCA9IFwiNjBweCBHZW9yZ2lhXCI7XHJcbiAgICAgICAgbGV0IHRleHRfaGVpZ2h0ID0gdGhpcy5zdGFydF9oZWlnaHQ7XHJcbiAgICAgICAgY29uc3QgY2VudHJlID0gd2lkdGggLyAyO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFRleHQodGhpcy50aXRsZSwgY2VudHJlLCB0ZXh0X2hlaWdodCk7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBcIldoaXRlXCI7XHJcbiAgICAgICAgY29udGV4dC5mb250ID0gXCIzMHB4IEdlb3JnaWFcIjtcclxuICAgICAgICBmb3IgKGNvbnN0IFtpZCwgb3B0aW9uXSBvZiB0aGlzLm9wdGlvbnMuZW50cmllcygpKSB7XHJcbiAgICAgICAgICAgIHRleHRfaGVpZ2h0ICs9IHRoaXMuaGVpZ2h0X2luY3JlbWVudDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWQoaWQpKSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IFwiWWVsbG93XCI7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmZvbnQgPSBcIjQwcHggR2VvcmdpYVwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBcIldoaXRlXCI7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmZvbnQgPSBcIjMwcHggR2VvcmdpYVwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFRleHQob3B0aW9uLCBjZW50cmUsIHRleHRfaGVpZ2h0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5maW5hbF9oZWlnaHQgPSB0ZXh0X2hlaWdodDtcclxuICAgIH1cclxuICAgIHNlbGVjdGVkKGlkKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRfaXRlbSA9PT0gaWQ7XHJcbiAgICB9XHJcbiAgICBzZWxlY3QobW91c2UpIHtcclxuICAgICAgICBpZiAodGhpcy5maW5hbF9oZWlnaHQgPT09IC0xKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBtZW51IGhhc24ndCBiZWVuIGRyYXduLlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gYWRkcyBzb21lIGJ1ZmZlciBzcGFjZSBhcm91bmQgZWFjaCBvcHRpb24sIHRoaXMgbWFrZXMgaXQgZWFzaWVyIHRvIHNlbGVjdCBlYWNoIG9wdGlvblxyXG4gICAgICAgIGNvbnN0IGJ1ZmZlcl9zcGFjZSA9IHRoaXMuaGVpZ2h0X2luY3JlbWVudCAvIDI7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRfaGVpZ2h0ID0gdGhpcy5maW5hbF9oZWlnaHQ7XHJcbiAgICAgICAgbGV0IGlkID0gdGhpcy5vcHRpb25zLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgLy8gY2hlY2sgdXAgdG8gdGhlIGhlaWdodCBvZiB0aGUgdGl0bGUsIHRoZXJlJ3Mgbm90IGdvaW5nIHRvIGJlIGFueXRoaW5nIGFib3ZlIGl0XHJcbiAgICAgICAgd2hpbGUgKGN1cnJlbnRfaGVpZ2h0ID4gdGhpcy5zdGFydF9oZWlnaHQpIHtcclxuICAgICAgICAgICAgaWYgKG1vdXNlLnkgPiBjdXJyZW50X2hlaWdodCAtIGJ1ZmZlcl9zcGFjZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZF9pdGVtID0gaWQ7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gbG93ZXIgdGhlIGhlaWdodCB0aGF0IHdlIGFyZSBjaGVja2luZyBvbiwgdGhpcyBoYXMgdGhlIGVmZmVjdCBvZiBtb3ZpbmcgdGhlXHJcbiAgICAgICAgICAgIC8vIG1lbnUgaXRlbSdzIGhpdGJveCBoaWdoZXIgb24gdGhlIHNjcmVlblxyXG4gICAgICAgICAgICBjdXJyZW50X2hlaWdodCAtPSB0aGlzLmhlaWdodF9pbmNyZW1lbnQ7XHJcbiAgICAgICAgICAgIGlkIC09IDE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBNZW51U3RhdGUge1xyXG4gICAgY29uc3RydWN0b3IoY29udHJvbGxlciwgY29udGV4dCwgdmlld3BvcnQpIHtcclxuICAgICAgICB0aGlzLnNlbGVjdE1lbnVpdGVtID0gKGUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5kcmF3LnVwZGF0ZU1vdXNlUG9zaXRpb24oZSk7XHJcbiAgICAgICAgICAgIHRoaXMubWVudS5zZWxlY3QodGhpcy5kcmF3Lm1vdXNlKTtcclxuICAgICAgICAgICAgdGhpcy5tZW51LmRyYXcodGhpcy5jb250ZXh0LCB0aGlzLmRyYXcpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQWN0aXZhdGVzIHRoZSBzZWxlY3RlZCBtZW51IG9wdGlvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuYWN0aXZhdGVNZW51T3B0aW9uID0gKGUpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubWVudS5zZWxlY3RlZF9pdGVtID49IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbGxlci5jbGVhckNhbnZhcygpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyLmNoYW5nZUdhbWVTdGF0ZShHYW1lU3RhdGUuVEFOS19QTEFDRU1FTlQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGhhbmRsZSBvdGhlciBldmVudHMsIHByb2JhYmx5IGJldHRlciB3aXRoIGEgc3dpdGNoIHN0YXRlbWVudFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyID0gY29udHJvbGxlcjtcclxuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xyXG4gICAgICAgIHRoaXMuZHJhdyA9IG5ldyBEcmF3KCk7XHJcbiAgICAgICAgdGhpcy5tZW51ID0gbmV3IE1lbnUoXCJUYW5rc1wiLCBbXCJTdGFydCBnYW1lXCIsIFwiUG90YXRvZXNcIiwgXCJBcHBsZXNcIiwgXCJJXCIsIFwiQ2hvb3NlXCIsIFwiWW91XCIsIFwiUGlrYWNodVwiXSk7XHJcbiAgICAgICAgdGhpcy5tZW51LmRyYXcodGhpcy5jb250ZXh0LCB0aGlzLmRyYXcpO1xyXG4gICAgICAgIHZpZXdwb3J0Lm1pZGRsZSgpO1xyXG4gICAgfVxyXG4gICAgYWRkRXZlbnRMaXN0ZW5lcnMoY2FudmFzKSB7XHJcbiAgICAgICAgY2FudmFzLm9ubW91c2Vkb3duID0gdGhpcy5hY3RpdmF0ZU1lbnVPcHRpb247XHJcbiAgICAgICAgY2FudmFzLm9ubW91c2Vtb3ZlID0gdGhpcy5zZWxlY3RNZW51aXRlbTtcclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1tZW51LmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2J1aWxkL2dhbWVTdGF0ZXMvbWVudS5qc1xuLy8gbW9kdWxlIGlkID0gMjJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgVGFua0hlYWx0aFN0YXRlLCBUYW5rVHVyblN0YXRlIH0gZnJvbSBcIi4vdGFua1wiO1xyXG5pbXBvcnQgeyBTaW5nbGVBY2Nlc3MgfSBmcm9tIFwiLi4vdXRpbGl0eS9zaW5nbGVBY2Nlc3NcIjtcclxuZXhwb3J0IGNsYXNzIFBsYXllciB7XHJcbiAgICBjb25zdHJ1Y3RvcihpZCwgbmFtZSwgY29sb3IsIHZpZXdwb3J0UG9zaXRpb24pIHtcclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLnRhbmtzID0gbmV3IEFycmF5KCk7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xyXG4gICAgICAgIHRoaXMudGFua3NTaG90ID0gbmV3IFNpbmdsZUFjY2VzcygpO1xyXG4gICAgICAgIHRoaXMuYWN0aXZlVGFuayA9IG5ldyBTaW5nbGVBY2Nlc3MoKTtcclxuICAgICAgICB0aGlzLnZpZXdwb3J0UG9zaXRpb24gPSB2aWV3cG9ydFBvc2l0aW9uO1xyXG4gICAgfVxyXG4gICAgYWN0aXZlVGFua3MoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGFua3MuZmlsdGVyKCh0YW5rKSA9PiB0YW5rLmhlYWx0aFN0YXRlICE9PSBUYW5rSGVhbHRoU3RhdGUuREVBRCk7XHJcbiAgICB9XHJcbiAgICByZXNldFRhbmtzQWN0U3RhdGVzKCkge1xyXG4gICAgICAgIGZvciAoY29uc3QgdGFuayBvZiB0aGlzLnRhbmtzKSB7XHJcbiAgICAgICAgICAgIHRhbmsuYWN0aW9uU3RhdGUgPSBUYW5rVHVyblN0YXRlLk5PVF9BQ1RFRDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGxheWVyLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2J1aWxkL2dhbWVPYmplY3RzL3BsYXllci5qc1xuLy8gbW9kdWxlIGlkID0gMjNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGNsYXNzIFNpbmdsZUFjY2VzcyB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnJlc291cmNlID0gbnVsbDtcclxuICAgICAgICB0aGlzLmFjY2Vzc2VkID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBzZXQocmVzb3VyY2UpIHtcclxuICAgICAgICB0aGlzLnJlc291cmNlID0gcmVzb3VyY2U7XHJcbiAgICAgICAgdGhpcy5hY2Nlc3NlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgYXZhaWxhYmxlKCkge1xyXG4gICAgICAgIHJldHVybiAhdGhpcy5hY2Nlc3NlZCAmJiB0aGlzLnJlc291cmNlICE9PSBudWxsO1xyXG4gICAgfVxyXG4gICAgZ2V0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmF2YWlsYWJsZSgpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLnJlc291cmNlO1xyXG4gICAgICAgICAgICB0aGlzLnJlc291cmNlID0gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIHg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMuYWNjZXNzZWQpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhpcyBvYmplY3QgaGFzIGFscmVhZHkgYmVlbiBhY2Nlc3NlZC5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMucmVzb3VyY2UgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHJlc291cmNlIG9iamVjdCBoYXMgbm90IGJlZW4gc2V0LlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd24gZXJyb3Igd2l0aCBzaW5nbGUgYWNjZXNzIG9iamVjdFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2luZ2xlQWNjZXNzLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2J1aWxkL3V0aWxpdHkvc2luZ2xlQWNjZXNzLmpzXG4vLyBtb2R1bGUgaWQgPSAyNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBDb2xvciB9IGZyb20gXCIuLi9kcmF3aW5nL2NvbG9yXCI7XHJcbmV4cG9ydCBjbGFzcyBMaW5lQ2FjaGUge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IENvbG9yLmdyYXkoKS50b1JHQkEoKTtcclxuICAgICAgICAvKiogSG93IG1hbnkgbGluZXMgc2hvdWxkIGJlIHJlZHJhd24gKi9cclxuICAgICAgICB0aGlzLnNpemUgPSAxMDtcclxuICAgICAgICB0aGlzLnBvaW50cyA9IFtdO1xyXG4gICAgfVxyXG4gICAgLyoqIFJlbW92ZSBsaW5lcyB0aGF0IGFyZSBvdXRzaWRlIG9mIHRoZSBjYWNoZSBzaXplICovXHJcbiAgICBsaW5lcygpIHtcclxuICAgICAgICBjb25zdCBzaXplID0gdGhpcy5wb2ludHMubGVuZ3RoO1xyXG4gICAgICAgIGlmIChzaXplID4gdGhpcy5zaXplKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBvaW50cy5zbGljZShzaXplIC0gdGhpcy5zaXplLCBzaXplKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9pbnRzO1xyXG4gICAgfVxyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxpbmVDYWNoZS5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9idWlsZC91dGlsaXR5L2xpbmVDYWNoZS5qc1xuLy8gbW9kdWxlIGlkID0gMjVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgVGFua0hlYWx0aFN0YXRlLCBUYW5rIH0gZnJvbSBcIi4vZ2FtZU9iamVjdHMvdGFua1wiO1xyXG5pbXBvcnQgeyBUYW5rc01hdGggfSBmcm9tIFwiLi91dGlsaXR5L3RhbmtzTWF0aFwiO1xyXG5pbXBvcnQgeyBTIH0gZnJvbSBcIi4vdXRpbGl0eS9zdHJpbmdGb3JtYXRcIjtcclxuZXhwb3J0IGNsYXNzIENvbGxpc2lvbiB7XHJcbiAgICBzdGF0aWMgZGVidWdTaG90KGxpbmUsIHN0YXJ0LCBlbmQsIHRhbmssIGRpc3RhbmNlKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBzZWdtZW50IG9mIGxpbmUucG9pbnRzKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFMuZm9ybWF0KFwiJXMsJXNcIiwgc2VnbWVudC54LCAtc2VnbWVudC55KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKFMuZm9ybWF0KFwiQ29sbGlzaW9uIHZlcnN1cyBsaW5lOlxcbiVzLCVzXFxuJXMsJXNcIiwgc3RhcnQueCwgLXN0YXJ0LnksIGVuZC54LCAtZW5kLnkpKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhTLmZvcm1hdChcIlRhbmsgSUQ6ICVzXFxuUG9zaXRpb246ICglcywlcylcIiwgdGFuay5pZCwgdGFuay5wb3NpdGlvbi54LCAtdGFuay5wb3NpdGlvbi55KSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJEaXN0YW5jZTogXCIsIGRpc3RhbmNlKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBjb2xsaWRlKGxpbmUsIG51bVBvaW50cywgdGFua3MpIHtcclxuICAgICAgICAvLyBsb29wIG92ZXIgYWxsIHRoZWlyIHRhbmtzXHJcbiAgICAgICAgZm9yIChjb25zdCB0YW5rIG9mIHRhbmtzKSB7XHJcbiAgICAgICAgICAgIC8vIG9ubHkgZG8gY29sbGlzaW9uIGRldGVjdGlvbiB2ZXJzdXMgdGFua3MgdGhhdCBoYXZlIG5vdCBiZWVuIGFscmVhZHkga2lsbGVkXHJcbiAgICAgICAgICAgIGlmICh0YW5rLmhlYWx0aFN0YXRlICE9PSBUYW5rSGVhbHRoU3RhdGUuREVBRCkge1xyXG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgZWFjaCBzZWdtZW50IG9mIHRoZSBsaW5lIGZvciBjb2xsaXNpb24gd2l0aCB0aGUgdGFua1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBudW1Qb2ludHM7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gbGluZS5wb2ludHNbaSAtIDFdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZCA9IGxpbmUucG9pbnRzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpc3QgPSBUYW5rc01hdGgubGluZS5kaXN0Q2lyY2xlQ2VudGVyKHN0YXJ0LCBlbmQsIHRhbmsucG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVidWdTaG90KGxpbmUsIHN0YXJ0LCBlbmQsIHRhbmssIGRpc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXN0ID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTaG90IGhpdCB0aGUgdGFuay5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIGxpbmUgZ2xhbmNlcyB0aGUgdGFuaywgbWFyayBhcyBkaXNhYmxlZFxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChUYW5rLldJRFRIIC0gVGFuay5ESVNBQkxFRF9aT05FIDw9IGRpc3QgJiYgZGlzdCA8PSBUYW5rLldJRFRIICsgVGFuay5ESVNBQkxFRF9aT05FKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhbmsuaGVhbHRoU3RhdGUgPSBUYW5rSGVhbHRoU3RhdGUuRElTQUJMRUQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGFua1wiLCB0YW5rLmlkLCBcImRpc2FibGVkIVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3RvcCBjaGVja2luZyBjb2xsaXNpb24gZm9yIHRoaXMgdGFuaywgYW5kIGdvIG9uIHRoZSBuZXh0IG9uZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9IC8vIGlmIHRoZSBsaW5lIHBhc3NlcyB0aHJvdWdoIHRoZSB0YW5rLCBtYXJrIGRlYWRcclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChkaXN0IDwgVGFuay5XSURUSCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YW5rLmhlYWx0aFN0YXRlID0gVGFua0hlYWx0aFN0YXRlLkRFQUQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGFua1wiLCB0YW5rLmlkLCBcImRlYWQhXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzdG9wIGNoZWNraW5nIGNvbGxpc2lvbiBmb3IgdGhpcyB0YW5rLCBhbmQgZ28gb24gdGhlIG5leHQgb25lXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1nYW1lQ29sbGlzaW9uLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2J1aWxkL2dhbWVDb2xsaXNpb24uanNcbi8vIG1vZHVsZSBpZCA9IDI2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydCBjbGFzcyBWaWV3cG9ydCB7XHJcbiAgICBjb25zdHJ1Y3RvcihjYW52YXNXaWR0aCwgY2FudmFzSGVpZ2h0KSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXNXaWR0aCA9IGNhbnZhc1dpZHRoO1xyXG4gICAgICAgIHRoaXMuY2FudmFzSGVpZ2h0ID0gY2FudmFzSGVpZ2h0O1xyXG4gICAgfVxyXG4gICAgbWlkZGxlKHkgPSAwKSB7XHJcbiAgICAgICAgdGhpcy5nbyh0aGlzLmNhbnZhc1dpZHRoIC8gNCwgeSk7XHJcbiAgICB9XHJcbiAgICBnbyh4LCB5KSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJUcnlpbmcgdG8gc2Nyb2xsIHRvXCIsIHgsIHkpO1xyXG4gICAgICAgIHdpbmRvdy5zY3JvbGwoeCwgeSk7XHJcbiAgICB9XHJcbiAgICBnb1RvKHBvaW50KSB7XHJcbiAgICAgICAgdGhpcy5nbyhwb2ludC54LCBwb2ludC55KTtcclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD12aWV3cG9ydC5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9idWlsZC9nYW1lTWFwL3ZpZXdwb3J0LmpzXG4vLyBtb2R1bGUgaWQgPSAyN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9