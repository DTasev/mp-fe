import { Point } from "../../ts/utility/point";
import { expect } from 'chai';
import 'mocha';

describe('Cartesian Coordinates', () => {
    it('should construct properly', () => {
        const expected_X = 42
        const expected_Y = 42 ** 2;
        const cartesian = new Point(expected_X, expected_Y);
        expect(cartesian.X).to.equal(expected_X);
        expect(cartesian.Y).to.equal(expected_Y);
    });
    it('should have initial values', () => {
        const cartesian = new Point();
        expect(cartesian.X).to.equal(-1);
        expect(cartesian.Y).to.equal(-1);
    })
    it('should perform a deep copy', () => {
        const cartesian = new Point(300, 42);
        const cartesian_copy = cartesian.copy();
        const new_X = 52, new_Y = 99;
        cartesian_copy.X = 52;
        cartesian_copy.Y = 99;

        expect(cartesian.X).to.not.equal(cartesian_copy.X);
        expect(cartesian.Y).to.not.equal(cartesian_copy.Y);

    })
});