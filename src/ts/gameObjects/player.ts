import { Tank } from "./tank";
import { IGameObject } from "./iGameObject";
import { Color } from "../drawing/color";

export class Player {
    tanks: IGameObject[];
    name: string;
    color: string;
    id: number;

    constructor(id: number, name: string, color: string) {
        this.id = id;
        this.name = name;
        this.tanks = new Array<IGameObject>();
        this.color = color;
    };
}