import * as Settings from '../settings';

export enum MapSize {
    SMALL,
    MEDIUM,
    LARGE
}
export function determineMapSize(): [number, number] {
    // const height = window.innerHeight * 0.995;
    // take 90% of the window, leave a bit of gap on the right
    // const width = window.innerWidth;

    const mapSize = MapSize.MEDIUM;
    const width = 1024 * Settings.NUM_PLAYERS;
    const height = width / 2;
    console.log("Players:", Settings.NUM_PLAYERS, "Canvas size width:", width, "height:", height);
    return [width, height];
}