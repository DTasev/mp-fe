import { Color } from "../drawing/color";
import { ITheme, IThemeEndGame, IThemeGameColors, IThemeGameUi, IThemeMapColors, IThemeMenu } from "./iTheme";

class DarkMenu implements IThemeMenu {
    background(): Color {
        return Color.black();
    }
    title(): Color {
        return Color.white();
    }
    text(): Color {
        return Color.white();
    }
}
class DarkEndGame implements IThemeEndGame {
    background(): Color {
        return Color.transparent();
    }
    titleClass(): string {
        return "w3-text-white";
    }
    text(): Color {
        return Color.white();
    }
}
class DarkGameUi implements IThemeGameUi {
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
        return "w3-text-white";
    }
    playerMessageClass(): string {
        return this.playerTurnTextClass();
    }
}
class DarkGameColors implements IThemeGameColors {
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
        return Color.black();
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
        return Color.white();
    }
    tankMovementArea(): Color {
        throw new Error("Method not implemented.");
    }
    tankShootingLine(): Color {
        return Color.white();
    }
    oldLinesColor(): Color {
        return Color.gray();
    }

}
class DarkMapColors implements IThemeMapColors {
    solid(): Color {
        return Color.white();
    }
    water(): Color {
        return Color.lightblue();
    }
    wood(): Color {
        return Color.woodbrown();
    }
}

export class DarkTheme implements ITheme {
    name = "dark";
    menu: IThemeMenu;
    end: IThemeEndGame;
    ui: IThemeGameUi;
    game: IThemeGameColors;
    map: IThemeMapColors;

    private currentColor = 0;
    constructor() {
        this.menu = new DarkMenu();
        this.end = new DarkEndGame();
        this.ui = new DarkGameUi();
        this.game = new DarkGameColors();
        this.map = new DarkMapColors();
    }
}