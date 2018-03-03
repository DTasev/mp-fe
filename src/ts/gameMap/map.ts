import { Point } from "../utility/point";
import { Draw } from "../drawing/draw";
import { Color } from "../drawing/color";
export class Map {
    private map: Point[];

    draw(context: CanvasRenderingContext2D, draw: Draw) {
        const length = this.map.length;
        for (let i = 1; i < length; i++) {
            draw.line(context, this.map[i - 1], this.map[i], 1, Color.green().toRGBA());
        }
    }
}