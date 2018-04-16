import { Color, HSLColor } from "../drawing/color";
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
        return Color.fromHex("#ab6e50");
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
    tankMovementArea(): Color {
        throw new Error("Method not implemented.");
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
    solid(): string[] {
        const all = Array<string>();
        for (let i = 0; i < 17; i++) {
            all.push(`hsl(0, 0%, ${5 + i}%)`)
        }
        return all;
    }
    water(): string[] {
        const all = Array<string>();
        for (let i = 0; i < 17; i++) {
            all.push(`hsl(192, 40%, ${40 - i}%)`)
        }
        return all;
    }
    wood(): string[] {
        const all = Array<string>();
        for (let i = 0; i < 17; i++) {
            all.push(`hsl(30, 55%, ${20 + i}%)`)
        }
        return all;
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