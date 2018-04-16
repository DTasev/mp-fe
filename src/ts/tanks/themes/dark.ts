import { Color } from "../drawing/color";
import { ITheme, IThemeEndGame, IThemeGameColors, IThemeGameUi, IThemeMapColors, IThemeMenu } from "./iTheme";

class DarkMenu implements IThemeMenu {
    background(): Color {
        return Color.fromHex("#1c0f0b");
    }
    title(): Color {
        return new Color(182, 182, 150);
    }
    text(): Color {
        return new Color(182, 182, 150);
    }
}
class DarkEndGame implements IThemeEndGame {
    scoreScreen(): Color {
        return Color.fromHex("#2b2c3e", 0.8);
    }
    background(): Color {
        return Color.transparent();
    }
    titleClass(): string {
        return "w3-text-white";
    }
    text(): Color {
        return new Color(182, 182, 150);
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
        return "w3-text-light-green";
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
        return Color.fromHex("#1c0f0b");
    }
    tankActive(): Color {
        return Color.fromHex("#5d3707");
    }
    tankActiveOutline(): Color {
        return Color.fromHex("#a2d0d8");
    }
    tankLabel(): Color {
        return Color.black();
    }
    tankDead(): Color {
        return Color.gray();
    }
    tankMovementLine(): Color {
        return new Color(182, 182, 150);
    }
    tankMovementArea(): Color {
        throw new Error("Method not implemented.");
    }
    tankShootingLine(): Color {
        return new Color(182, 182, 150);
    }
    tankSmoke(): Color {
        return Color.white();
    }
    tankExplosion(): Color {
        return new Color(255, 69, 0);
    }
    oldLinesColor(): Color {
        return Color.gray();
    }

}
class DarkMapColors implements IThemeMapColors {
    solid(): Color {
        return new Color(75, 75, 52);
    }
    water(): Color {
        return new Color(56, 57, 82);
    }
    wood(): Color {
        return Color.maroon();
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