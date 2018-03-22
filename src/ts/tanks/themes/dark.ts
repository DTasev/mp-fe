import { ITheme } from "./iTheme";
import { Color } from "../drawing/color";

export class DarkTheme implements ITheme {
    private currentColor: number = 0;
    playerColors(): Color[] {
        return [
            Color.red(),
            Color.blue(),
            Color.yellow()
        ];
    }
    menuBackground(): Color {
        return Color.black();
    }
    menuTitle(): Color {
        return Color.white();
    }
    menuText(): Color {
        return Color.white();
    }
    endGameBackground(): Color {
        return Color.transparent();
    }
    endGameTitleClass(): string {
        return "w3-text-white";
    }
    endGameText(): Color {
        return Color.white();
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
        return "w3-text-white";
    }
    playerMessageClass(): string {
        return this.playerTurnTextClass();
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
    mapObstacle(): Color {
        return Color.white();
    }
}