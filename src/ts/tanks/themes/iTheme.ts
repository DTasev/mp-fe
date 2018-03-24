import { Color } from "../drawing/color";
import { ObstacleType } from "../gameMap/obstacle";

export interface ITheme {
    name: string;
    // Menu colors
    menuBackground(): Color;
    menuTitle(): Color;
    menuText(): Color;

    // End game colors
    endGameBackground(): Color;
    endGameTitleClass(): string;
    endGameText(): Color;

    // Game UI color classes
    homeButtonClass(): string;
    skipShootingButtonClass(): string;
    skipTurnButtonClass(): string;
    playerTurnTextClass(): string;
    playerMessageClass(): string;

    playerColors(): Color[];

    // Game colors
    canvasBackground(): Color;
    tankActive(): Color;
    tankActiveOutline(): Color;
    tankLabel(): Color;
    tankDead(): Color;
    tankMovementLine(): Color;
    tankMovementArea(): Color;
    tankShootingLine(): Color;
    oldLinesColor(): Color;

    mapObstacle(obstacleType: ObstacleType): Color;
}