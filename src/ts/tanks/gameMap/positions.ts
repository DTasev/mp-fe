import { Point } from '../utility/point';

export function generatePlayerPositions(numPlayers: number, canvasWidth: number, canvasHeight: number): Point[] {
    const points: Point[] = [];

    // 2 players get 1 split, 3 & 4 players get 2, 5 & 6 players get 3, etc
    let width = 0;
    for (let i = 0; i < numPlayers; i++) {
        let point: Point;
        if (i % 2 === 0) {
            point = new Point(width, 0);
        } else {
            point = new Point(width, canvasHeight);
            width += canvasWidth / numPlayers;
        }
        points.push(point);
    }
    return points;
}