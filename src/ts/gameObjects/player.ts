import { Tank } from "./tank";
import { IGameObject } from "./iGameObject";
import { Color } from "../drawing/color";

export class Player {
    tanks: IGameObject[];
    name: string;
    color: Color;

    constructor(name: string, color: Color) {
        this.name = name;
        this.tanks = new Array<IGameObject>();
        this.color = color;
    };
}