import { expect } from 'chai';
import 'mocha';

import { Actions } from '../../ts/limiters/action'
import { CartesianCoords } from '../../ts/cartesianCoords';

describe('Action limiter', () => {
    const number_of_turns = 3;
    it('should signal when enough actions have been taken', () => {
        const turn = new Actions(number_of_turns);
        expect(turn.end()).to.be.false;
        expect(turn.end()).to.be.false;
        expect(turn.end()).to.be.true;
    });
});