import { IActionState } from "./iActionState";
import { GameController, GameState } from "../controller";
import { IGameObject } from "../gameObjects/iGameObject";
import { Point } from "../utility/point";
import { Player } from "../gameObjects/player";
import { Draw } from "../drawing/draw";
import { S } from "../utility/stringFormat";
import { Viewport } from "../gameMap/viewport";
import { Ui } from "../ui/ui";


class Menu {
    private title: string;
    private options: ReadonlyArray<string>;
    private final_height = -1;

    private readonly start_height = 150;
    private readonly height_increment = 70;

    selected_item: number;

    constructor(title: string, options: ReadonlyArray<string>) {
        this.title = title;
        this.options = options;
    }

    draw(context: CanvasRenderingContext2D, draw: Draw) {
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
            } else {
                context.fillStyle = "Black";
                context.font = "30px";
            }
            context.fillText(option, centre, text_height);
        }
        this.final_height = text_height;
    }

    private selected(id): boolean {
        return this.selected_item === id;
    }

    select(mouse: Point): void {
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
export class GameEndState implements IActionState {
    private menu: Menu;

    private context: CanvasRenderingContext2D;
    private controller: GameController;

    private draw: Draw;

    constructor(controller: GameController, context: CanvasRenderingContext2D, player: Player) {
        this.controller = controller;
        this.context = context;
        this.draw = new Draw();
        const numTanks = player.activeTanks().length;
        const tanksStr = numTanks === 1 ? " tank" : " tanks";

        this.menu = new Menu("End of Game", [S.format("%s Won!", player.name), S.format("With %s %s", numTanks, tanksStr)]);
        this.menu.draw(this.context, this.draw);
    }

    addEventListeners(canvas: HTMLCanvasElement) { }

    view(viewport: Viewport) {
        viewport.middle();
    }

    setUpUi(ui: Ui) { }
}