import { expect } from 'chai';
import 'mocha';

import { Length } from '../../ts/limiters/length'
import { CartesianCoords } from '../../ts/utility/cartesianCoords';

describe('Action limiter', () => {
    const length = 150;
    it('should signal when the line is long enough', () => {
        const line = new Length(length);
        const start = new CartesianCoords(0, 0);
        const end = new CartesianCoords(50, 50);

        // it adds about 44.72 for each all
        expect(line.add(start, end)).to.be.true;
        expect(line.add(start, end)).to.be.true;
        expect(line.add(start, end)).to.be.false;
    });
    it('should check if a point is far enough', () => {
        const line = new Length(length);
        const start = new CartesianCoords(0, 0);
        const end = new CartesianCoords(100, 100);

        // it adds about 44.72 for each  all
        expect(line.in(start, end)).to.be.true;

        const too_far = new CartesianCoords(200, 200);
        expect(line.add(start, too_far)).to.be.false;
    })
});