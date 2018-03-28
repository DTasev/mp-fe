import { Tank } from "../tank";

export interface IEffect {
    duration: number;
    before(tank: Tank);
    after(tank: Tank);
}