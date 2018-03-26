import { ITheme, IThemeMenu, IThemeEndGame, IThemeGameUi, IThemeGameColors, IThemeMapColors } from "./iTheme";
import { Color } from "../drawing/color";

class SepiaMenu implements IThemeMenu {
    background(): Color {
        return Color.sand();
    }
    title(): Color {
        return Color.black();
    }
    text(): Color {
        return Color.black();
    }
}
class SepiaEndGame implements IThemeEndGame {
    background(): Color {
        return Color.transparent();
    }
    titleClass(): string {
        return "w3-text-black";
    }
    text(): Color {
        return Color.black();
    }
}
class SepiaGameUi implements IThemeGameUi {
    homeButtonClass(): string {
        return "w3-dark-gray";
    }
    skipShootingButtonClass(): string {
        return this.homeButtonClass();
    }
    skipTurnButtonClass(): string {
        return this.homeButtonClass();
    }
    playerTurnTextClass(): string {
        return "w3-text-black";
    }
    playerMessageClass(): string {
        return this.playerTurnTextClass();
    }
}
class SepiaGameColors implements IThemeGameColors {
    playerColors(): Color[] {
        return [
            Color.red(),
            Color.blue(),
            Color.green(),
            Color.pink(),
            Color.lilac(),
            Color.orange(),
            Color.purple(),
            Color.maroon()
        ];
    }
    canvasBackground(): Color {
        return Color.sand();
    }
    tankActive(): Color {
        return Color.red();
    }
    tankActiveOutline(): Color {
        return Color.green();
    }
    tankLabel(): Color {
        return Color.black();
    }
    tankDead(): Color {
        return Color.gray();
    }
    tankMovementLine(): Color {
        return Color.black();
    }
    tankMovementArea(): Color {
        throw new Error("Method not implemented.");
    }
    tankShootingLine(): Color {
        return Color.black();
    }
    oldLinesColor(): Color {
        return Color.gray();
    }
}
class SepiaMapColors implements IThemeMapColors {
    solid(): Color {
        return Color.black();
    }
    water(): Color {
        return Color.lightblue();
    }
    wood(): Color {
        return Color.woodbrown();
    }
}
export class SepiaTheme implements ITheme {
    name = "sepia";
    menu: IThemeMenu;
    end: IThemeEndGame;
    ui: IThemeGameUi;
    game: IThemeGameColors;
    map: IThemeMapColors;

    private currentColor: number = 0;

    constructor() {
        this.menu = new SepiaMenu();
        this.end = new SepiaEndGame();
        this.ui = new SepiaGameUi();
        this.game = new SepiaGameColors();
        this.map = new SepiaMapColors();
    }
}