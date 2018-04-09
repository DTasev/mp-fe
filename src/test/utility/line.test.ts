import { expect } from 'chai';
import 'mocha';
import { Line } from '../../ts/tanks/utility/line';
import { Point } from '../../ts/tanks/utility/point';


describe('Line', () => {
    it('perform deep-copy', () => {
        const l = new Line([new Point(0, 0), new Point(1, 1)]);
        const l_copy = l.copy();
        l_copy.points[0] = new Point(15, 15);
        expect(l.points[0].equals(l_copy.points[0])).to.be.false;
    });
});