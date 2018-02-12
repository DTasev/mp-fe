import { Tank } from "./tank";
import { IGameObject } from "./iGameObject";

export class Player {
    tanks: IGameObject[];
    name: string;

    constructor(name: string) {
        this.name = name;
        this.tanks = new Array<IGameObject>();
    };
}