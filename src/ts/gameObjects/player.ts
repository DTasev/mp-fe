import { Tank } from "./tank";
import { IGameObject } from "./iGameObject";
import { Color } from "../drawing/color";

export class Player {
    readonly id: number;
    readonly name: string;

    readonly tanks: IGameObject[];
    readonly color: Color;

    constructor(id: number, name: string, color: Color) {
        this.id = id;
        this.name = name;
        this.tanks = new Array<IGameObject>();
        this.color = color;
    };
}