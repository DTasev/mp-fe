import { ITheme } from "./iTheme";
import { Color } from "../drawing/color";

export class DarkTheme implements ITheme {
    private currentColor: number = 0;
    nextPlayerColor(): Color {
        if (this.currentColor == 0) {
            this.currentColor++;
            return Color.red();
        } else if (this.currentColor == 1) {
            this.currentColor++;
            return Color.blue();
        } else if (this.currentColor == 2) {
            this.currentColor++;
            return Color.green();
        } else if (this.currentColor == 3) {
            this.currentColor++;
            return Color.yellow();
        }
        throw new Error("You've used all the available colours!");
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
        throw new Error("Method not implemented.");
    }
}