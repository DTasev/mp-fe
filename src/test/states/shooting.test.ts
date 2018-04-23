import { expect } from 'chai';
import 'mocha';
import { mockDOM } from '../testutility';
import { CanvasMock } from '../mocking/canvasMock';
import { CanvasContextMock } from '../mocking/canvasContextMock';
import { Ui } from '../../ts/tanks/ui/ui';
import { GameController } from '../../ts/tanks/controller';
import { Player } from '../../ts/tanks/objects/player';
import { Tank, TankActState } from '../../ts/tanks/objects/tank';
import { Color } from '../../ts/tanks/drawing/color';
import { TanksMap } from '../../ts/tanks/gameMap/tanksMap';
import { SepiaTheme } from '../../ts/tanks/themes/sepia';
import { ShootingState } from '../../ts/tanks/states/shooting';
import { Settings } from '../../ts/tanks/settings';
import { Viewport } from '../../ts/tanks/gameMap/viewport';
import { Point } from '../../ts/tanks/utility/point';
import { DrawState, Draw } from '../../ts/tanks/drawing/draw';
import { SingleCallMock } from '../mocking/mock';
import { Particles } from '../../ts/tanks/utility/particles';
import { LineCache } from '../../ts/tanks/utility/lineCache';


describe('Shooting - Game State', () => {
    mockDOM();
    let mock_canvas: CanvasMock;
    let mock_context: CanvasContextMock;
    let ui: Ui;
    let controller: GameController;
    let player: Player;
    beforeEach(() => {
        player = Player.premadePlayer();
        mock_canvas = new CanvasMock();
        mock_context = mock_canvas.getContext();
        ui = new Ui(Ui.ID_GAME_UI, mock_canvas.width, mock_canvas.height);
        controller = new GameController(mock_canvas as any, mock_context as any, ui, new SepiaTheme(), TanksMap.premadeMap(), [player, new Player(0, "P1", Color.black())], 1, false);
    });
    afterEach(() => {
        mock_context.restore();
    })
    it('construct', () => {
        player.activeTank.set(player.tanks[0]);

        const s = new ShootingState(controller, mock_context as any, ui, player);

        expect(s.shotPath).to.not.be.null;
        expect(s.active).to.not.be.null;
        expect(s.tankRoamingLength).to.not.be.null;
        expect(s.shotLength).to.not.be.null;
        expect(s.shotSpeed).to.not.be.null;
    });
    it('add event listeners - mobile', () => {
        const s = new ShootingState(controller, mock_context as any, ui, player);

        (<any>Settings)["IS_MOBILE"] = true;
        window.ontouchend = null;

        s.addEventListeners(mock_canvas as any);

        expect(mock_canvas.ontouchstart).to.not.be.null;
        expect(mock_canvas.ontouchmove).to.not.be.null;
        expect(window.ontouchend).to.not.be.null;
        (<any>Settings)["IS_MOBILE"] = false;
    });
    it('add event listeners - PC', () => {
        const s = new ShootingState(controller, mock_context as any, ui, player);

        mock_canvas.nullify();
        window.onmouseup = null;
        (<any>Settings)["IS_MOBILE"] = false;

        s.addEventListeners(mock_canvas as any);

        expect(mock_canvas.onmousedown).to.not.be.null;
        expect(mock_canvas.onmousemove).to.not.be.null;
        expect(window.onmouseup).to.not.be.null;
    });
    it('add keyboard listeners', () => {
        const s = new ShootingState(controller, mock_context as any, ui, player);
        (<any>Settings)["IS_MOBILE"] = true;
        window.onkeyup = null;
        s.addKeyboardShortcuts(mock_canvas as any);
        expect(window.onkeyup).to.not.be.null;

        window.onkeyup = null;
        (<any>Settings)["IS_MOBILE"] = false;
        s.addKeyboardShortcuts(mock_canvas as any);
        expect(window.onkeyup).to.not.be.null;
    });
    it('set up UI', () => {
        const s = new ShootingState(controller, mock_context as any, ui, player);
        s.setUpUi(ui, new Viewport(100, 100), new SepiaTheme());

        // skip button has been added
        expect(ui.heading.right.innerHTML).to.not.be.empty;
    });
    it('start shooting - invalid mouse button', () => {
        const s = new ShootingState(controller, mock_context as any, ui, player);

        s.draw.mouse = new Point();
        const mouseEvent = new MouseEvent("woah", {
            button: 1 // MMB
        });
        // custom mouse position so that it will be overriden if mouse coordinates are updated
        (<any>mouseEvent).offsetX = 100;
        (<any>mouseEvent).offsetY = 100;
        // button 1 is pressed so nothing should happen
        s.startShooting(mouseEvent);

        expect(s.draw.mouse.equals(new Point())).to.be.true;
    });
    it('start shooting - mouse', () => {
        const s = new ShootingState(controller, mock_context as any, ui, player);

        s.draw.mouse = new Point();
        const mouseEvent = new MouseEvent("woah", {
            button: 0 // LMB
        });

        (<any>mouseEvent).offsetX = 100;
        (<any>mouseEvent).offsetY = 100;
        // button 1 is pressed so nothing should happen
        s.startShooting(mouseEvent);

        expect(s.draw.mouse.equals(new Point())).to.be.false;
    });
    it('continue shooting', () => {

    });
    it('stop shooting - failed shot', () => {
        const s = new ShootingState(controller, mock_context as any, ui, player);
        const mock_changeGameState = new SingleCallMock(controller, controller.changeGameState);

        const mouseEvent = new MouseEvent("woah", {
            button: 0 // LMB
        });
        s.draw.state = DrawState.DRAWING;
        (<any>mouseEvent).offsetX = 100;
        (<any>mouseEvent).offsetY = 100;
        s.successfulShot = false;
        s.stopShooting(mouseEvent);

        expect(s.draw.state).to.eq(DrawState.STOPPED);
        mock_changeGameState.expect_called.once();
    });
    it('stop shooting - successful shot - more tanks to shoot', () => {
        player.tanks.push(Tank.premadeTank());

        const s = new ShootingState(controller, mock_context as any, ui, player);
        const mock_changeGameState = new SingleCallMock(controller, controller.changeGameState);
        const mock_Particles_smoke = new SingleCallMock(Particles, Particles.smoke);

        const mouseEvent = new MouseEvent("woah", {
            button: 0 // LMB
        });
        s.draw.state = DrawState.DRAWING;
        (<any>mouseEvent).offsetX = 100;
        (<any>mouseEvent).offsetY = 100;
        s.successfulShot = true;
        s.stopShooting(mouseEvent);

        mock_Particles_smoke.expect_called.once();
        expect(s.active.actionState).to.eq(TankActState.SHOT);
        expect(s.draw.state).to.eq(DrawState.STOPPED);
        mock_changeGameState.expect_called.once();
    });
    it('stop shooting - successful shot - last tank to shoot', () => {
        const s = new ShootingState(controller, mock_context as any, ui, player);
        const mock_changeGameState = new SingleCallMock(controller, controller.changeGameState);
        const mock_Particles_smoke = new SingleCallMock(Particles, Particles.smoke);

        const mouseEvent = new MouseEvent("woah", {
            button: 0 // LMB
        });
        s.draw.state = DrawState.DRAWING;
        (<any>mouseEvent).offsetX = 100;
        (<any>mouseEvent).offsetY = 100;
        s.successfulShot = true;
        s.stopShooting(mouseEvent);
        // because this is the last tank, all of their act states have been reset
        expect(s.active.actionState).to.eq(TankActState.NOT_ACTED);

        // check that the lines has been cached correctly
        expect(controller.lineCache.lines.length).to.eq(1);

        mock_Particles_smoke.expect_called.once();
        expect(s.draw.state).to.eq(DrawState.STOPPED);
        mock_changeGameState.expect_called.once();
    });
    it('skip turn', () => {
        player.tanks[0].actionState = TankActState.SHOT;
        const mock_changeGameState = new SingleCallMock(controller, controller.changeGameState);
        const s = new ShootingState(controller, mock_context as any, ui, player);
        s.skipTurn();
        expect(player.tanks[0].actionState).to.eq(TankActState.NOT_ACTED);
        expect(s.draw.state).to.eq(DrawState.STOPPED);
        mock_changeGameState.expect_called.once();
    });
});