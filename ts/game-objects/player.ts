import { Tank } from "./tank";
import { IGameObject } from "./igame-object";

export class Player {
    tanks: Array<IGameObject>;
    constructor() {
        this.tanks = new Array<IGameObject>();
    };
}