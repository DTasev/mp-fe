import { Color } from "../drawing/color";

// TODO might have to add classes
interface Theme {
    // Menu colors
    menuBackground(): Color;
    menuTitle(): Color;
    menuEntry(): Color;

    // End game colors
    endGameTitle(): Color;
    endGameText(): Color;

    // Game UI colors
    home(): Color;
    skipShooting(): Color;
    skipTurn(): Color;
    playerTurnText(): Color;
    playerMessage(): Color;

    // Game colors
    canvasBackground(): Color;
    // should provide a different colour on each call
    tank(): Color;
    tankMovementLine(): Color;
    tankMovementArea(): Color;
    tankShootingLine(): Color;
    tankHighlight(): Color;
    oldShotLine(): Color;

    // TODO functions for every type of obstacle?
    mapObstacle(): Color;
}