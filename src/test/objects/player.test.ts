import { expect } from 'chai';
import 'mocha';
import { Player } from '../../ts/tanks/objects/player';
import { Tank, TankHealthState, TankActState } from '../../ts/tanks/objects/tank';
import { Point } from '../../ts/tanks/utility/point';


describe('Player', () => {
    it('alive tanks', () => {
        const p = Player.premadePlayer();
        p.tanks.push(Tank.premadeTank());

        expect(p.aliveTanks().length).to.eq(2);
        p.tanks[0].healthState = TankHealthState.DEAD;
        expect(p.aliveTanks().length).to.eq(1);
        p.tanks[1].healthState = TankHealthState.DEAD;
        expect(p.aliveTanks().length).to.eq(0);
    });
    it('active tanks', () => {
        const p = Player.premadePlayer();
        p.tanks.push(Tank.premadeTank());

        expect(p.activeTanks().length).to.eq(2);
        p.tanks[0].actionState = TankActState.SHOT;
        expect(p.activeTanks().length).to.eq(1);
        p.tanks[0].healthState = TankHealthState.DEAD;
        expect(p.activeTanks().length).to.eq(1);
        p.tanks[1].healthState = TankHealthState.DEAD;
        expect(p.activeTanks().length).to.eq(0);
    });
    it('reset tank act states', () => {
        const p = Player.premadePlayer();
        p.tanks.push(Tank.premadeTank());

        p.tanks[0].actionState = TankActState.SHOT;
        p.tanks[1].healthState = TankHealthState.DEAD;
        p.resetTanksActStates();
        expect(p.tanks[0].actionState).to.eq(TankActState.NOT_ACTED);
        expect(p.tanks[1].healthState).to.eq(TankHealthState.DEAD);
    });
    it('set viewport postiion', () => {
        const p = Player.premadePlayer();
        const viewportPoint = new Point(23213, 3232);
        p.setViewportPosition(viewportPoint.copy());
        expect(p.viewportPosition.x).to.eq(viewportPoint.x);
        expect(p.viewportPosition.y).to.eq(viewportPoint.y);
    });
});