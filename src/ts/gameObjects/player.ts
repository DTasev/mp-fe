import { Tank } from "./tank";
import { IGameObject } from "./iGameObject";
import { Color } from "../drawing/color";

export class Player {
    tanks: IGameObject[];
    name: string;
    color: string;

    constructor(name: string, color: string) {
        this.name = name;
        this.tanks = new Array<IGameObject>();
        this.color = color;
    };
}