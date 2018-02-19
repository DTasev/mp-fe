import { expect } from 'chai';
import 'mocha';

import { Speed } from '../../ts/limiters/speed'
import { CartesianCoords } from '../../ts/utility/cartesianCoords';

describe('Speed limiter', () => {
    const distance = 25;
    it('should signal when the speed is not high enough', () => {
        const fast = new Speed(distance);

        const start = new CartesianCoords(0, 0);
        const not_enough = new CartesianCoords(10, 10);
        expect(fast.enough(start, not_enough)).to.be.false;

    });
    it('should signal when the speed is high enough', () => {
        const fast = new Speed(distance);

        const start = new CartesianCoords(0, 0);

        const enough = new CartesianCoords(20, 20);
        expect(fast.enough(start, enough)).to.be.true;
    });
});