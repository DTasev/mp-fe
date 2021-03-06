import { Color } from "../drawing/color";
import { ITheme, IThemeEndGame, IThemeGameColors, IThemeGameUi, IThemeMapColors, IThemeMenu } from "./iTheme";

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
        return Color.fromHex("#00fa00");
    }
    tankActiveOutline(): Color {
        return Color.fromHex("#6c3513");
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
class SepiaMapColors implements IThemeMapColors {
    solidFill(): [boolean, string] {
        return [true, this.solid().rgba()];
    }
    waterFill(): [boolean, string] {
        return [true, this.water().rgba()];
    }
    woodFill(): [boolean, string] {
        return [true, this.wood().rgba()];
    }
    solid(): Color {
        return Color.fromHex("#24292e");
    }
    water(): Color {
        return new Color(77, 158, 179);
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