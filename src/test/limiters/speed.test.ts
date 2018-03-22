import { expect } from 'chai';
import 'mocha';

import { Speed } from '../../ts/tanks/limiters/speed'
import { Point } from '../../ts/tanks/utility/point';

describe('Speed limiter', () => {
    const distance = 25;
    it('should signal when the speed is not high enough', () => {
        const fast = new Speed(distance);

        const start = new Point(0, 0);
        const not_enough = new Point(10, 10);
        expect(fast.enough(start, not_enough)).to.be.false;

    });
    it('should signal when the speed is high enough', () => {
        const fast = new Speed(distance);

        const start = new Point(0, 0);

        const enough = new Point(20, 20);
        expect(fast.enough(start, enough)).to.be.true;
    });
});