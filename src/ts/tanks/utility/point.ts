export class Point {
    public x: number;
    public y: number;
    constructor(x: number = -1, y: number = -1) {
        this.x = x;
        this.y = y;
    }

    copy() {
        return new Point(this.x, this.y);
    }

    toString() {
        return this.x + "," + this.y;
    }
    equals(rhs: Point) {
        return this.x === rhs.x && this.y === rhs.y;
    }
}