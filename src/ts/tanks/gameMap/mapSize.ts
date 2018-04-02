import { Settings } from '../settings';

export enum MapSize {
    SMALL,
    MEDIUM,
    LARGE
}
export function determineCanvasSize(numPlayers: number): [number, number] {
    // const height = window.innerHeight * 0.995;
    // take 90% of the window, leave a bit of gap on the right
    // const width = window.innerWidth;

    const mapSize = MapSize.MEDIUM;
    const width = Math.min(1024 * numPlayers, 2048);
    const height = width / 2;
    console.log("Players:", numPlayers, "Canvas size width:", width, "height:", height);
    return [width, height];
}