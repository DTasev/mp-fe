import { expect } from 'chai';
import 'mocha';
import { GameState } from '../../ts/tanks/controller';
import { SlowEffect } from '../../ts/tanks/objects/effects/slow';
import { Tank, TankActState, TankHealthState } from "../../ts/tanks/objects/tank";
import { CanvasContextMock } from '../mocking/canvasContextMock';
import { CanvasMock } from '../mocking/canvasMock';


describe('Tank Game Object', () => {
    let mock_canvas: CanvasMock;
    let mock_context: CanvasContextMock;
    beforeEach(() => {
        mock_canvas = new CanvasMock();
        mock_context = mock_canvas.getContext();
    });
    it('draw itself', () => {
        const t = Tank.premadeTank();

        t.draw(mock_context as any);

        mock_context.mock_beginPath.expect_called.once();
        mock_context.mock_closePath.expect_called.once();
    });
    it('highlight', () => {
        const t = Tank.premadeTank();

        t.highlight(mock_context as any);

        mock_context.mock_beginPath.expect_called.twice();
        mock_context.mock_closePath.expect_called.twice();
    });
    it('active', () => {
        const t = Tank.premadeTank();
        expect(t.active()).to.be.true;
        t.actionState = TankActState.MOVED;
        expect(t.active()).to.be.true;
        t.actionState = TankActState.SHOT;
        expect(t.active()).to.be.false;
        t.actionState = TankActState.MOVED;
        t.healthState = TankHealthState.DISABLED;
        expect(t.active()).to.be.true;
        t.healthState = TankHealthState.DEAD;
        expect(t.active()).to.be.false;
    });
    it('nextState', () => {
        const t = Tank.premadeTank();
        expect(t.nextState()).to.eq(GameState.TANK_MOVEMENT);
        t.healthState = TankHealthState.DISABLED;
        expect(t.nextState()).to.eq(GameState.TANK_SHOOTING);
    });
    it('manage turn effects', () => {
        const t = Tank.premadeTank();
        t.effects.push(new SlowEffect());
        const start_movement_range = t.movementRange;
        t.beforeTurnEffects();
        expect(t.movementRange).to.not.eq(start_movement_range);
        t.afterTurnEffects();
        expect(t.movementRange).to.eq(start_movement_range);
        expect(t.effects.length).to.eq(0);
    });
});