import { Point } from "../../ts/tanks/utility/point";
import { expect } from 'chai';
import 'mocha';

describe('Cartesian Coordinates', () => {
    it('should construct properly', () => {
        const expectedX = 42
        const expectedY = 42 ** 2;
        const cartesian = new Point(expectedX, expectedY);
        expect(cartesian.x).to.equal(expectedX);
        expect(cartesian.y).to.equal(expectedY);
    });
    it('should have initial values', () => {
        const cartesian = new Point();
        expect(cartesian.x).to.equal(-1);
        expect(cartesian.y).to.equal(-1);
    })
    it('should perform a deep copy', () => {
        const point = new Point(300, 42);
        const pointCopy = point.copy();
        const newX = 52, newY = 99;
        pointCopy.x = newX;
        pointCopy.y = newY;

        expect(point.x).to.not.equal(pointCopy.x);
        expect(point.y).to.not.equal(pointCopy.y);

    })
});