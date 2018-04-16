import { Color } from "../drawing/color";

export interface IThemeMenu {
    background(): Color;
    title(): Color;
    text(): Color;
}
export interface IThemeEndGame {
    background(): Color;
    scoreScreen(): Color;
    titleClass(): string;
    text(): Color;
}
export interface IThemeGameUi {
    // Game UI color classes
    homeButtonClass(): string;
    skipShootingButtonClass(): string;
    skipTurnButtonClass(): string;
    playerTurnTextClass(): string;
    playerMessageClass(): string;
}
export interface IThemeGameColors {
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
    tankSmoke(): Color;
    tankExplosion(): Color;
    oldLinesColor(): Color;
}

export interface IThemeMapColors {
    solid(): Color;
    water(): Color;
    wood(): Color;
}
export interface ITheme {
    name: string;
    menu: IThemeMenu;
    end: IThemeEndGame;
    ui: IThemeGameUi;
    game: IThemeGameColors;
    map: IThemeMapColors;
}