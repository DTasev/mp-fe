import { expect } from 'chai';
import 'mocha';
import { LineCache } from '../../ts/tanks/utility/lineCache';
import { Line } from '../../ts/tanks/utility/line';
import { Point } from '../../ts/tanks/utility/point';


describe('Line Cache', () => {
    it('give only active lines', () => {
        const lc = new LineCache();
        for (let i = 0; i < lc.size + 5; i++) {
            lc.lines.push(new Line([new Point(0, 0)]));
        }
        expect(lc.active().length).to.eq(lc.size);
    });
});