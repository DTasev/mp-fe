import { expect } from 'chai';
import 'mocha';
import { GameController } from '../../ts/tanks/controller';
import { Color } from '../../ts/tanks/drawing/color';
import { DrawState } from '../../ts/tanks/drawing/draw';
import { TanksMap } from '../../ts/tanks/gameMap/tanksMap';
import { Viewport } from '../../ts/tanks/gameMap/viewport';
import { Player } from '../../ts/tanks/objects/player';
import { Tank, TankActState } from '../../ts/tanks/objects/tank';
import { Settings } from '../../ts/tanks/settings';
import { MovingState } from '../../ts/tanks/states/movement';
import { SepiaTheme } from '../../ts/tanks/themes/sepia';
import { Ui } from '../../ts/tanks/ui/ui';
import { Point } from '../../ts/tanks/utility/point';
import { CanvasContextMock } from '../mocking/canvasContextMock';
import { CanvasMock } from '../mocking/canvasMock';
import { SingleCallMock } from '../mocking/mock';
import { mockDOM } from '../testutility';



describe('Movement - Game State', () => {
    mockDOM();
    let mock_canvas: CanvasMock;
    let mock_context: CanvasContextMock;
    let ui: Ui;
    let controller: GameController;
    beforeEach(() => {
        const player = Player.premadePlayer();
        player.tanks.push(Tank.premadeTank());
        mock_canvas = new CanvasMock();
        mock_context = mock_canvas.getContext();
        ui = new Ui(Ui.ID_GAME_UI, mock_canvas.width, mock_canvas.height);
        controller = new GameController(mock_canvas as any, mock_context as any, ui, new SepiaTheme(), TanksMap.premadeMap(), [player, new Player(0, "P1", Color.black())], 1, false);
    });
    afterEach(() => {
        mock_context.restore();
    })
    it('add event listeners', () => {
        const player = Player.premadePlayer();

        const m = new MovingState(controller, mock_context as any, ui, player);
        mock_canvas.onmousedown = null;
        mock_canvas.onmousemove = null;
        mock_canvas.onmouseup = null;
        m.addEventListeners(mock_canvas as any);
        expect(mock_canvas.onmousedown).to.not.be.null;
        expect(mock_canvas.onmousemove).to.not.be.null;
        expect(mock_canvas.onmouseup).to.not.be.null;

        (<any>Settings)["IS_MOBILE"] = true;
        mock_canvas.ontouchstart = null;
        mock_canvas.ontouchmove = null;
        mock_canvas.ontouchend = null;
        m.addEventListeners(mock_canvas as any);
        expect(mock_canvas.ontouchstart).to.not.be.null;
        expect(mock_canvas.ontouchmove).to.not.be.null;
        expect(mock_canvas.ontouchend).to.not.be.null;
        (<any>Settings)["IS_MOBILE"] = false;
    });
    it('add keyboard shortcuts', () => {
        const player = Player.premadePlayer();
        const m = new MovingState(controller, mock_context as any, ui, player);

        (<any>Settings)["IS_MOBILE"] = true;
        window.onkeyup = null;
        m.addKeyboardShortcuts(mock_canvas as any);
        expect(window.onkeyup).to.be.null;

        (<any>Settings)["IS_MOBILE"] = false;
        m.addKeyboardShortcuts(mock_canvas as any);
        expect(window.onkeyup).to.not.be.null;
    });
    it('set up UI', () => {
        const player = Player.premadePlayer();
        const m = new MovingState(controller, mock_context as any, ui, player);
        m.setUpUi(ui, new Viewport(100, 100), new SepiaTheme());

        // skip button has been added
        expect(ui.heading.right.innerHTML).to.not.be.empty;
    });
    it('start movement - ignore MMB and RMB', () => {
        const player = Player.premadePlayer();
        const m = new MovingState(controller, mock_context as any, ui, player);
        m.draw.mouse = new Point(23423423, 423424);
        const startingMousePos = m.draw.mouse.copy();
        const mouseEvent = new MouseEvent("woah", {
            button: 1 // MMB
        });
        // custom mouse position so that it will be overriden if mouse coordinates are updated
        (<any>mouseEvent).offsetX = 100;
        (<any>mouseEvent).offsetY = 100;
        // button 1 is pressed so nothing should happen
        m.startMovement(mouseEvent);

        expect(m.draw.mouse.equals(startingMousePos)).to.be.true;
    });
    it('start movement', () => {
        const player = Player.premadePlayer();
        player.tanks[0].position = new Point(50, 50);
        const lineStart = player.tanks[0].position.copy();

        const startMovementContext = mock_canvas.getContext();

        const m = new MovingState(controller, startMovementContext as any, ui, player);
        const startingMousePos = m.draw.mouse.copy();
        const mouseEvent = new MouseEvent("woah", {
            button: 0 // LMB
        });
        // custom mouse position so that it will be overriden if mouse coordinates are updated
        (<any>mouseEvent).offsetX = 100;
        (<any>mouseEvent).offsetY = 100;

        m.startMovement(mouseEvent);

        // check that the drawing state is changed correctly for successful movement
        expect(m.draw.state).to.eq(DrawState.DRAWING);
        expect(m.tankMovementInRange).to.be.true;
        expect(m.draw.mouse.equals(startingMousePos)).to.be.false;

        // these context functions should have been called when successfully drawing the first movement line
        startMovementContext.mock_beginPath.expect_called.once();
        startMovementContext.mock_moveTo.expect_called.once();
        startMovementContext.mock_lineTo.expect_called.once();
        startMovementContext.mock_stroke.expect_called.once();
        startMovementContext.mock_closePath.expect_called.once();
    });
    it('start movement - outside of range', () => {
        const player = Player.premadePlayer();
        player.tanks[0].position = new Point(4242, 4242);
        const mock_redraw = new SingleCallMock(controller, controller.redrawCanvas);
        const mock_changeGameState = new SingleCallMock(controller, controller.changeGameState);

        const startMovementContext = mock_canvas.getContext();

        const m = new MovingState(controller, startMovementContext as any, ui, player);
        m.draw.state = DrawState.DRAWING;
        const mouseEvent = new MouseEvent("woah", {
            button: 0 // LMB
        });
        // custom mouse position so that it will be overriden if mouse coordinates are updated
        (<any>mouseEvent).offsetX = 100;
        (<any>mouseEvent).offsetY = 100;

        m.startMovement(mouseEvent);
        // check that the drawing state is NOT changed for failed movement
        expect(m.tankMovementInRange).to.be.false;
        expect(m.draw.state).to.eq(DrawState.DRAWING);

        // check that nothing is drawn on the canvas
        startMovementContext.mock_beginPath.expect_called.never();
        startMovementContext.mock_moveTo.expect_called.never();
        startMovementContext.mock_lineTo.expect_called.never();
        startMovementContext.mock_stroke.expect_called.never();
        startMovementContext.mock_closePath.expect_called.never();
    });
    it('end movement - outside of range', () => {
        const player = Player.premadePlayer();
        player.tanks[0].position = new Point(4242, 4242);
        const mock_redraw = new SingleCallMock(controller, controller.redrawCanvas);
        const mock_changeGameState = new SingleCallMock(controller, controller.changeGameState);

        const m = new MovingState(controller, mock_context as any, ui, player);
        m.draw.state = DrawState.DRAWING;
        const mouseEvent = new MouseEvent("woah", {
            button: 0 // LMB
        });
        // custom mouse position so that it will be overriden if mouse coordinates are updated
        (<any>mouseEvent).offsetX = 100;
        (<any>mouseEvent).offsetY = 100;

        // movement will fail because the mouse 'click' is further away than the allowed
        // tank movement range
        m.startMovement(mouseEvent);

        expect(m.tankMovementInRange).to.be.false;

        m.endMovement(mouseEvent);

        // tank was not moved
        expect(player.tanks[0].position.equals(new Point(4242, 4242))).to.be.true;
        // end turn is still called
        expect(m.draw.state).to.eq(DrawState.STOPPED);

        mock_redraw.expect_called.once();
        mock_changeGameState.expect_called.once();

        mock_redraw.restore();
        mock_changeGameState.restore();
    });
    it('end movement - success', () => {
        const player = Player.premadePlayer();
        player.tanks[0].position = new Point(50, 50);
        const mock_redraw = new SingleCallMock(controller, controller.redrawCanvas);
        const mock_changeGameState = new SingleCallMock(controller, controller.changeGameState);

        const m = new MovingState(controller, mock_context as any, ui, player);
        m.draw.state = DrawState.DRAWING;
        const mouseEvent = new MouseEvent("woah", {
            button: 0 // LMB
        });
        // custom mouse position so that it will be overriden if mouse coordinates are updated
        (<any>mouseEvent).offsetX = 100;
        (<any>mouseEvent).offsetY = 100;

        // movement will fail because the mouse 'click' is further away than the allowed
        // tank movement range
        m.startMovement(mouseEvent);

        expect(m.tankMovementInRange).to.be.true;

        m.endMovement(mouseEvent);

        // tank was moved
        expect(player.tanks[0].position.equals(new Point(100, 100))).to.be.true;
        // end turn is still called
        expect(m.draw.state).to.eq(DrawState.STOPPED);

        mock_redraw.expect_called.once();
        mock_changeGameState.expect_called.once();

        mock_redraw.restore();
        mock_changeGameState.restore();
    });
    it('end turn', () => {
        const player = Player.premadePlayer();
        const mock_redraw = new SingleCallMock(controller, controller.redrawCanvas);
        const mock_changeGameState = new SingleCallMock(controller, controller.changeGameState);

        const m = new MovingState(controller, mock_context as any, ui, player);
        m.draw.state = DrawState.DRAWING;

        m.endTurn();

        expect(m.draw.state).to.eq(DrawState.STOPPED);
        mock_redraw.expect_called.once();
        mock_changeGameState.expect_called.once();
    });
    it('go to shooting - skip movement', () => {
        const player = Player.premadePlayer();
        const m = new MovingState(controller, mock_context as any, ui, player);
        const mock_redraw = new SingleCallMock(controller, controller.redrawCanvas);
        const mock_changeGameState = new SingleCallMock(controller, controller.changeGameState);

        m.goToShooting();
        expect(player.tanks[0].actionState).to.eq(TankActState.MOVED);
        expect(m.draw.state).to.eq(DrawState.STOPPED);
        mock_redraw.expect_called.once();
        mock_changeGameState.expect_called.once();
    });
});