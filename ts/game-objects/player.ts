import { Tank } from "./tank";

export class Player {
    tanks: Array<Tank>;
    constructor() {
        this.tanks = new Array<Tank>();
    };
}