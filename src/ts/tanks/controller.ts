import { Draw } from './drawing/draw';
import { determineCanvasSize } from "./gameMap/mapSize";
import { Obstacle } from "./gameMap/obstacle";
import { TanksMap } from "./gameMap/tanksMap";
import { Viewport } from "./gameMap/viewport";
import { Player } from './objects/player';
import { GameEndState } from "./states/gameEnd";
import { IActionState } from "./states/iActionState";
import { MovingState } from "./states/movement";
import { PlacingState } from "./states/placement";
import { SelectionState } from "./states/selection";
import { ShootingState } from "./states/shooting";
import { ITheme } from "./themes/iTheme";
import { Ui } from "./ui/ui";
import { Collision } from "./utility/collision";
import { Line } from './utility/line';
import { LineCache } from './utility/lineCache';
import { Point } from './utility/point';
import { SingleAccess } from "./utility/singleAccess";
import { generatePlayerPositions } from "./gameMap/positions";
import { Settings } from './settings';
export enum GameState {
    TANK_PLACEMENT,
    TANK_MOVEMENT,
    TANK_SELECTION,
    TANK_SHOOTING,
    GAME_END
}

/**
 * Implementation for the actions that will be executed according to player actions.
 * 
 * Mouse event functions are wrapped to keep `this` context. This is the (e:MouseEvent) => {...} syntax.
 * 
 * In short, because the methods are added as event listeners (and are not called directly), the `this` reference starts pointing
 * towards the `window` object. The closure keeps the `this` to point towards the proper instance of the object.
 * 
 * For more details: https://github.com/Microsoft/TypeScript/wiki/'this'-in-TypeScript#red-flags-for-this
 */
export class GameController {
    private readonly canvas: HTMLCanvasElement;
    private readonly context: CanvasRenderingContext2D;
    private readonly ui: Ui;

    /** The player's current view of the canvas. */
    private viewport: Viewport;
    /** The current state of the game */
    private state: GameState;
    /** The current event that carries out the actions for the state */
    private action: IActionState;
    /** The position of the current player in the players array */
    private currentPlayer: number;
    /** All the players in the game */
    private readonly players: Player[] = [];

    /** Stores the all of the shot lines */
    private readonly lineCache: LineCache;
    private readonly map: TanksMap;

    /** The number of players in the game */
    readonly numPlayers: number;
    readonly numTanks: number;
    /** The current color theme of the game */
    readonly theme: ITheme;

    nextPlayer: boolean = false;
    readonly timeStart: SingleAccess<Date>;

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, ui: Ui, theme: ITheme, map: TanksMap, players: Player[], numTanks: number) {
        this.canvas = canvas;
        this.context = context;
        this.ui = ui;
        this.theme = theme;
        this.map = map;
        this.lineCache = new LineCache();

        this.currentPlayer = 0;
        this.numPlayers = players.length;
        this.numTanks = numTanks;

        const [canvasWidth, canvasHeight] = determineCanvasSize(this.numPlayers);
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.viewport = new Viewport(canvasWidth, canvasHeight);
        this.viewport.middle();

        const playerPositions = generatePlayerPositions(this.numPlayers, this.canvas.width, this.canvas.height);
        for (const [id, player] of players.entries()) {
            player.setViewportPosition(playerPositions[id]);
        }
        this.players = players;

        this.redrawCanvas();
        this.timeStart = new SingleAccess<Date>(new Date());
        this.ui.startFollowingViewport();
    }

    /**
     * The game events should be in this order:
     * Menu
     * Placing for each player
     * Repeat until game over
     *  Moving, Shooting for P1
     *  Moving, Shooting for P2
     * @param newState The new state that the game will enter
     */
    changeGameState(newState: GameState) {
        this.ui.clear();

        this.state = newState;

        if (Settings.IS_MOBILE) {
            // clears touch events
            this.canvas.ontouchstart = null;
            this.canvas.ontouchend = null;
            window.ontouchend = null;
            this.canvas.ontouchmove = null;
        } else {
            // clears mouse events
            this.canvas.onmousedown = null;
            this.canvas.onmouseup = null;
            window.onmouseup = null;
            this.canvas.onmousemove = null;
            window.onkeyup = null;
        }

        // if the state has marked the end of the player's turn, then we go to the next player
        const gameWinner = this.gameOver();
        let itWasNextTurn = false;
        if (!gameWinner && this.nextPlayer) {
            this.nextActivePlayer();
            this.nextPlayer = false;
            itWasNextTurn = true;
        }

        if (gameWinner) {
            this.state = GameState.GAME_END;
        }

        // select either the winner or the current player
        const player = <Player>gameWinner || this.players[this.currentPlayer];

        // only display the player's name if there is a player
        if (this.state !== GameState.GAME_END) {
            this.ui.setPlayer(player.name, this.theme);
            if (itWasNextTurn) {
                console.log("This is", player.name, "playing.");
            }
        }

        switch (this.state) {
            case GameState.TANK_PLACEMENT:
                if (itWasNextTurn) {
                    console.log("Initialising TANK PLACING");
                }
                this.action = new PlacingState(this, this.context, player);
                break;
            case GameState.TANK_SELECTION:
                if (itWasNextTurn) {
                    console.log("Initialising TANK SELECTION");
                }
                this.action = new SelectionState(this, this.context, this.ui, player);
                break;
            case GameState.TANK_MOVEMENT:
                if (itWasNextTurn) {
                    console.log("Initialising TANK MOVEMENT");
                }
                this.action = new MovingState(this, this.context, this.ui, player);
                break;
            case GameState.TANK_SHOOTING:
                if (itWasNextTurn) {
                    console.log("Initialising TANK SHOOTING");
                }
                this.action = new ShootingState(this, this.context, this.ui, player);
                break;
            case GameState.GAME_END:
                if (itWasNextTurn) {
                    console.log("Initialising GAME END");
                }
                this.action = new GameEndState(this, this.ui, player);
                break
            default:
                throw new Error("The game should never be in an unknown state, something has gone terribly wrong!");
        }

        // add the mouse events for the new state
        this.action.setUpUi(this.ui, this.viewport, this.theme);
        this.action.view(this.viewport);
        this.action.addEventListeners(this.canvas);
        this.action.addKeyboardShortcuts(this.canvas);
    }
    private gameOver(): Player | boolean {
        if (this.state !== GameState.TANK_PLACEMENT) {
            let onePlayerHasTanks = false;
            let winner: Player;
            for (const player of this.players) {
                if (player.activeTanks().length > 0) {

                    // make note of the first player that has tanks, if no one else has tanks, then he is the winner
                    // if more than one person has tanks then no one has won yet
                    if (!onePlayerHasTanks) {
                        onePlayerHasTanks = true;
                        // store the potential winner, if no one else has tanks
                        winner = player;
                    } else {
                        // more than one player has more than 0 tanks, therefore the game is not over
                        return false;
                    }
                }
            }

            return winner;
        }
    }
    /** Clears everything from the canvas on the screen. To show anything afterwards it needs to be redrawn. */
    clearCanvas(): void {
        this.context.fillStyle = this.theme.game.canvasBackground().rgba();
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    redrawCanvas(): void {
        this.clearCanvas();

        // draw the terrain
        this.map.draw(this.context, this.theme);

        // draw every player for every tank
        for (const player of this.players) {
            for (const tank of player.tanks) {
                tank.draw(this.context);
            }
        }

        const oldLinesColor = this.theme.game.oldLinesColor().rgba();
        // draw the last N lines
        for (const line_path of this.lineCache.active()) {
            for (let i = 1; i < line_path.points.length; i++) {
                // old lines are currently half-transparent
                Draw.line(this.context, line_path.points[i - 1], line_path.points[i], 1, oldLinesColor);
            }
        }
    }

    /**
     * Collide the shot line with all valid target tanks.
     * @param line The line of the shot for collision
     * @param friendlyFire Whether the player's own tanks can be collided with
     */
    collide(start: Point, end: Point, friendlyFire = false) {
        if (friendlyFire) {
            throw new Error("Not implemented");
        }
        const playersForCollision = friendlyFire ? this.players : this.players.filter((p) => p.id !== this.currentPlayer);
        for (const player of playersForCollision) {
            Collision.shooting(start, end, player.tanks);
        }
    }

    cacheLine(path: Line) {
        this.lineCache.lines.push(path);
    }

    /** Change the current player to the next active player. 
     * For States after placement, it takes into account how many tanks the player has.
     * If the player has no tanks alive, then their turn will be skipped.
     */
    nextActivePlayer(): void {
        if (this.state === GameState.TANK_PLACEMENT) {
            this.currentPlayer += 1;
        } else {
            do {
                // if this is the last player, it will revert back to zero, otherwise just increment
                this.currentPlayer = this.currentPlayer === this.numPlayers - 1 ? 0 : this.currentPlayer + 1;
            } while (this.players[this.currentPlayer].activeTanks().length === 0);
        }
    }

    collidingWithTerrain(point: Point, radius: number): Obstacle {
        return Collision.terrain(point, radius, this.map.terrain);
    }

    lineCollidingWithTerrain(start: Point, end: Point): [Point, Obstacle] {
        return Collision.lineWithTerrain(start, end, this.map.terrain);
    }
    gameState(): GameState {
        return this.state;
    }
}