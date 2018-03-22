import { expect } from 'chai';
import 'mocha';

import { Actions } from '../../ts/tanks/limiters/action'
import { Point } from '../../ts/tanks/utility/point';

describe('Action limiter', () => {
    const number_of_turns = 3;
    it('should signal when enough actions have been taken', () => {
        const turn = new Actions(number_of_turns);
        turn.take();
        expect(turn.over()).to.be.false;
        turn.take();
        expect(turn.over()).to.be.false;
        turn.take();
        expect(turn.over()).to.be.true;
    });
    it('should be able to end the turn early', () => {
        const turn = new Actions(number_of_turns);
        turn.take();
        expect(turn.over()).to.be.false;
        turn.end();
        expect(turn.over()).to.be.true;
    })
});