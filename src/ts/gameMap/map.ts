import { Point } from "../utility/point";
import { Draw } from "../drawing/draw";
import { Color } from "../drawing/color";
import { ITheme } from "../gameThemes/iTheme";
export class Map {
    private map: Point[];

    draw(context: CanvasRenderingContext2D, draw: Draw, theme: ITheme) {
        const length = this.map.length;
        for (let i = 1; i < length; i++) {
            Draw.line(context, this.map[i - 1], this.map[i], 1, theme.mapObstacle());
        }
    }
}