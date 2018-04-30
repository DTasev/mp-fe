import { Color } from "../drawing/color";
import { ITheme, IThemeEndGame, IThemeGameColors, IThemeGameUi, IThemeMapColors, IThemeMenu } from "./iTheme";

class SimpleMenu implements IThemeMenu {
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
class SimpleEndGame implements IThemeEndGame {
    scoreScreen(): Color {
        return Color.sand(0.9);
    }
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
class SimpleGameUi implements IThemeGameUi {
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
class SimpleGameColors implements IThemeGameColors {
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
    tankShootingLine(): Color {
        return Color.black();
    }
    tankSmoke(): Color {
        return Color.black();
    }
    tankExplosion(): Color {
        return new Color(255, 69, 0);
    }
    oldLinesColor(): Color {
        return Color.gray();
    }
}
class SimpleMapColors implements IThemeMapColors {
    solidFill(): [boolean, string] {
        return [false, null];
    }
    waterFill(): [boolean, string] {
        return [true, Color.lightblue().rgba()]
    }
    woodFill(): [boolean, string] {
        return [true, Color.woodbrown().rgba()]
    }
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

export class SimpleTheme implements ITheme {
    name = "simple";
    menu: IThemeMenu;
    end: IThemeEndGame;
    ui: IThemeGameUi;
    game: IThemeGameColors;
    map: IThemeMapColors;

    private currentColor = 0;

    constructor() {
        this.menu = new SimpleMenu();
        this.end = new SimpleEndGame();
        this.ui = new SimpleGameUi();
        this.game = new SimpleGameColors();
        this.map = new SimpleMapColors();
    }
}