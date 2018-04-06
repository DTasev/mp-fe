import { Settings } from '../settings';

export function determineCanvasSize(numPlayers: number): [number, number] {
    // const width = Math.min(1024 * numPlayers, 2048);
    // const height = width / 2;
    // if (Settings.DEBUG) {
    //     console.log("Players:", numPlayers, "Canvas size width:", width, "height:", height);
    // }
    return [2048, 1024];
}