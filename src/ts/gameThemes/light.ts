import { ITheme } from "./iTheme";
import { Color } from "../drawing/color";

export class LightTheme implements ITheme {
    private currentColor: number = 0;
    playerColors(): Color[] {
        return [
            Color.red(),
            Color.green(),
            Color.blue(),
        ];
    }
    menuBackground(): Color {
        return Color.white();
    }
    menuTitle(): Color {
        return Color.black();
    }
    menuText(): Color {
        return Color.black();
    }
    endGameBackground(): Color {
        return Color.transparent();
    }
    endGameTitleClass(): string {
        return "w3-text-black";
    }
    endGameText(): Color {
        return Color.black();
    }
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
    mapObstacle(): Color {
        return Color.black();
    }
}