import { Tank } from "./tank";
import { IGameObject } from "./iGameObject";

export class Player {
    tanks: IGameObject[];
    constructor() {
        this.tanks = new Array<IGameObject>();
    };
}