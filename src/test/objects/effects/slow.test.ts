import { expect } from 'chai';
import 'mocha';
import { Tank } from '../../../ts/tanks/objects/tank';
import { SlowEffect } from '../../../ts/tanks/objects/effects/slow';


describe('Effects - Slow', () => {
    it('should reduce movement speed', () => {
        const tank = Tank.premadeTank();
        const slow = new SlowEffect(10);
        const start_movement_range = tank.movementRange;
        slow.before(tank);
        expect(tank.movementRange).to.eq(start_movement_range / 2);
        expect(slow.duration).to.eq(9);
    });

    it('should restore movement speed', () => {
        const tank = Tank.premadeTank();
        const slow = new SlowEffect();
        const start_movement_range = tank.movementRange;
        slow.before(tank);
        slow.after(tank);
        expect(tank.movementRange).to.eq(start_movement_range);
    })
});