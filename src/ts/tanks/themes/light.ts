import { Color } from "../drawing/color";
import { ITheme, IThemeEndGame, IThemeGameColors, IThemeGameUi, IThemeMapColors, IThemeMenu } from "./iTheme";

class LightMenu implements IThemeMenu {
    background(): Color {
        return Color.white();
    }
    title(): Color {
        return Color.black();
    }
    text(): Color {
        return Color.black();
    }
}
class LightEndGame implements IThemeEndGame {
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
class LightGameUi implements IThemeGameUi {
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
class LightGameColors implements IThemeGameColors {
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
        return Color.white();
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
class LightMapColors implements IThemeMapColors {
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
export class LightTheme implements ITheme {
    name = "light";
    menu: IThemeMenu;
    end: IThemeEndGame;
    ui: IThemeGameUi;
    game: IThemeGameColors;
    map: IThemeMapColors;

    private currentColor = 0;

    constructor() {
        this.menu = new LightMenu();
        this.end = new LightEndGame();
        this.ui = new LightGameUi();
        this.game = new LightGameColors();
        this.map = new LightMapColors();
    }
}