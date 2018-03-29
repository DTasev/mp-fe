import { GameController } from "../controller";
import { Draw } from "../drawing/draw";
import { Viewport } from "../gameMap/viewport";
import { Player } from "../objects/player";
import { Tank, TankHealthState, TankTurnState } from "../objects/tank";
import * as Settings from '../settings';
import { ITheme } from "../themes/iTheme";
import { Ui } from "../ui/ui";
import { TanksMath } from "../utility/tanksMath";
import { IPlayState } from "./iActionState";
import { KeyboardKeys } from "../utility/keyboardKeys";


export class SelectionState implements IPlayState {
    context: CanvasRenderingContext2D;
    controller: GameController;
    player: Player;
    draw: Draw;
    ui: Ui;

    currentActiveTank: Tank;

    constructor(controller: GameController, context: CanvasRenderingContext2D, ui: Ui, player: Player) {
        this.controller = controller;
        this.context = context;
        this.player = player;
        this.draw = new Draw();
        this.ui = ui;
    }

    addEventListeners(canvas: HTMLCanvasElement) {
        // keep the current active tank, then switch to the next state
        if (this.player.activeTank.available()) {
            this.currentActiveTank = this.player.activeTank.get();
            this.successfulSelection(this.currentActiveTank);
            // switch to the next state
            this.mouseUp();
        } else {
            if (Settings.IS_MOBILE) {
                // NOTE: mouseup is on the whole window, so that even if the cursor exits the canvas, the event will trigger
                canvas.ontouchstart = this.mouseDown;
                // Scrolling for Mobile: this is added here so that the touchmove event triggers the ui adjusting event
                // normal computers trigger window.onscroll, and that is handled in the controller
                window.ontouchmove = (e: Event) => {
                    console.log('Adjusting UI');
                    this.ui.mobileMoveToFitView(e);
                }
                window.ontouchend = this.mouseUp;
            } else {
                canvas.onmousedown = this.mouseDown;
                window.onmouseup = this.mouseUp;
            }
        }
    }
    addKeyboardShortcuts(canvas: HTMLCanvasElement) {
        if (!Settings.IS_MOBILE) {
            console.log("In selection shortcuts");
            window.onkeyup = (e: KeyboardEvent) => {
                switch (e.keyCode) {
                    case KeyboardKeys.KEY_1:
                        this.selectTankKeyboard(this.player.tanks[0])
                        break;
                    case KeyboardKeys.KEY_2:
                        if (2 <= this.player.tanks.length) {
                            this.selectTankKeyboard(this.player.tanks[1]);
                        }
                        break;
                    case KeyboardKeys.KEY_3:
                        if (3 <= this.player.tanks.length) {
                            this.selectTankKeyboard(this.player.tanks[2]);
                        }
                        break;
                    case KeyboardKeys.KEY_4:
                        if (4 <= this.player.tanks.length) {
                            this.selectTankKeyboard(this.player.tanks[3]);
                        }
                        break;
                    case KeyboardKeys.KEY_5:
                        if (4 <= this.player.tanks.length) {
                            this.selectTankKeyboard(this.player.tanks[4]);
                        }
                        break;
                    default:
                        break;
                }
            };
        }
    }

    view(viewport: Viewport) {
        viewport.goTo(this.player.viewportPosition);
    }

    setUpUi(ui: Ui, viewport: Viewport, theme: ITheme) {
        ui.heading.addHome(viewport, this.player, theme);
    }

    mouseDown = (e: MouseEvent | TouchEvent): void => {
        // if the button clicked is not the left button, do nothing
        if (e instanceof MouseEvent && e.button != 0) {
            return;
        }

        this.draw.updatePosition(e);
        console.log('In selection mousedown');

        // Check if the user has clicked any tank.
        for (const tank of this.player.tanks) {
            // tanks that must not be selected:
            // - dead tanks
            // - tanks that have acted
            // - tanks that the mouse click does not collide with
            if (tank.healthState !== TankHealthState.DEAD &&
                tank.active() &&
                TanksMath.point.collideCircle(this.draw.mouse, tank.position, Tank.WIDTH)) {
                // highlight the selected tank
                this.successfulSelection(tank);
                // prevent scrolling action on mobile, only when a tank is successfully selected
                if (e instanceof TouchEvent) {
                    e.preventDefault();
                }

                // only highlight the first tank, if there are multiple on top of each other
                break;
            }
        }
    }

    /**
     * Checks if the tank is alive and active. DOES NOT CHECK FOR MOUSE COLLISION. 
     * This is intended to be used for keyboard shortcuts.
     * 
     * @param tank The tank object to be checked
     */
    private selectTankKeyboard(tank: Tank): void {
        if (tank.healthState !== TankHealthState.DEAD && tank.active()) {
            this.successfulSelection(tank);
            this.mouseUp();
        }
    }

    mouseUp = () => {
        // if the use has clicked a valid tank on mouseDown then go to the appropriate next state
        // based on the tanks' own state, i.e. tank that has moved will go into shooting
        if (this.player.activeTank.available()) {
            this.controller.changeGameState(this.currentActiveTank.nextState());
        }
    }

    private successfulSelection(tank: Tank) {
        // show the range is the tank is going to move, otherwise don't draw it
        tank.highlight(this.context, tank.actionState === TankTurnState.NOT_ACTED && tank.healthState !== TankHealthState.DISABLED ? true : false);
        tank.beforeTurnEffects();
        // store the details of the active tank
        this.player.activeTank.set(tank);
        this.currentActiveTank = tank;
    }
}
