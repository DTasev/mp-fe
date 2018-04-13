import { expect } from 'chai';
import 'mocha';
import { GameController } from '../../ts/tanks/controller';
import { Color } from '../../ts/tanks/drawing/color';
import { TanksMap } from '../../ts/tanks/gameMap/tanksMap';
import { Player } from '../../ts/tanks/objects/player';
import { SelectionState } from '../../ts/tanks/states/selection';
import { SepiaTheme } from '../../ts/tanks/themes/sepia';
import { Ui } from '../../ts/tanks/ui/ui';
import { CanvasContextMock } from '../mocking/canvasContextMock';
import { CanvasMock } from '../mocking/canvasMock';
import { SingleCallMock, Mock } from '../mocking/mock';
import { mockDOM } from '../testutility';
import { Settings } from '../../ts/tanks/settings';
import { Viewport } from '../../ts/tanks/gameMap/viewport';
import { Point } from '../../ts/tanks/utility/point';


describe('Selection - Game State', () => {
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
        controller = new GameController(mock_canvas as any, mock_context as any, ui, new SepiaTheme(), TanksMap.premadeMap(), [player, new Player(0, "P1", Color.black())], 2, false);
    });
    it('add event listeners - skip selection when tank is available', () => {
        player.activeTank.set(player.tanks[0]);
        const s = new SelectionState(controller, mock_context as any, ui, player);
        const mock_changeGameState = new SingleCallMock(controller, controller.changeGameState);

        mock_canvas.nullify();

        s.addEventListeners(mock_canvas as any);
        expect(mock_canvas.onmousedown).to.be.null;
        expect(mock_canvas.onmouseup).to.be.null;
        expect(mock_canvas.ontouchstart).to.be.null;
        expect(mock_canvas.ontouchend).to.be.null;
        expect(mock_canvas.ontouchmove).to.be.null;
    });
    it('add event listeners - PC', () => {
        // make sure the active tank is not set
        player.activeTank.clear();
        const s = new SelectionState(controller, mock_context as any, ui, player);
        const mock_changeGameState = new SingleCallMock(controller, controller.changeGameState);

        mock_canvas.nullify();
        window.onmouseup = null;
        window.ontouchmove = null;
        window.ontouchend = null;

        (<any>Settings)["IS_MOBILE"] = false;

        s.addEventListeners(mock_canvas as any);

        expect(mock_canvas.onmousedown).to.not.be.null;
        expect(window.onmouseup).to.not.be.null;

        expect(mock_canvas.ontouchstart).to.be.null;
        expect(window.ontouchend).to.be.null;
        expect(window.ontouchmove).to.be.null;
    });
    it('add event listeners - mobile', () => {
        player.activeTank.clear();
        const s = new SelectionState(controller, mock_context as any, ui, player);
        const mock_changeGameState = new SingleCallMock(controller, controller.changeGameState);

        mock_canvas.nullify();

        window.onmouseup = null;
        window.ontouchmove = null;
        window.ontouchend = null;

        (<any>Settings)["IS_MOBILE"] = true;

        s.addEventListeners(mock_canvas as any);

        expect(mock_canvas.ontouchstart).to.not.be.null;
        expect(window.ontouchend).to.not.be.null;
        expect(window.ontouchmove).to.not.be.null;

        expect(mock_canvas.onmousedown).to.be.null;
        expect(window.onmouseup).to.be.null;

        (<any>Settings)["IS_MOBILE"] = false;
    });
    it('add keyboard shortcuts - PC', () => {
        player.activeTank.clear();

        const s = new SelectionState(controller, mock_context as any, ui, player);

        window.onkeyup = null;

        (<any>Settings)["IS_MOBILE"] = false;
        s.addKeyboardShortcuts(mock_canvas as any);
        expect(window.onkeyup).to.not.be.null;
    });
    it('add keyboard shortcuts - mobile', () => {
        player.activeTank.clear();

        const s = new SelectionState(controller, mock_context as any, ui, player);
        const mock_changeGameState = new SingleCallMock(controller, controller.changeGameState);

        window.onkeyup = null;

        (<any>Settings)["IS_MOBILE"] = true;
        s.addKeyboardShortcuts(mock_canvas as any);
        expect(window.onkeyup).to.not.be.null;

        (<any>Settings)["IS_MOBILE"] = false;
    });
    it('view', () => {
        const viewport = new Viewport(100, 100);
        const mock_viewport_goTo = new SingleCallMock(viewport, viewport.goTo);
        const s = new SelectionState(controller, mock_context as any, ui, player);

        s.view(viewport);
        mock_viewport_goTo.expect_called.once();
    });
    it('set up UI', () => {
        const s = new SelectionState(controller, mock_context as any, ui, player);

        s.setUpUi(ui, new Viewport(100, 100), new SepiaTheme());
        expect(ui.heading.left.innerHTML).to.not.be.empty;
    });
    it('select tank - mouse', () => {
        player.tanks[0].position = new Point(100, 100);
        player.activeTank.clear();

        const s = new SelectionState(controller, mock_context as any, ui, player);
        const mouseEvent = new MouseEvent("woah", {
            button: 0 // LMB
        });
        // custom mouse position so that it will be overriden if mouse coordinates are updated
        (<any>mouseEvent).offsetX = 100;
        (<any>mouseEvent).offsetY = 100;

        s.draw.mouse = new Point();
        s.selectTank(mouseEvent);
        expect(s.draw.mouse.equals(new Point())).to.be.false;
        expect(player.activeTank.get()).to.not.be.null;
        expect(s.currentActiveTank).to.not.be.null;

    });
    it('select tank - touch', () => {
        player.tanks[0].position = new Point(100, 100);
        player.activeTank.clear();

        const s = new SelectionState(controller, mock_context as any, ui, player);

        const eventTarget = document.createElement("canvas");
        const mouseEvent = new TouchEvent("woah", {
            touches: [{
                pageX: 100, pageY: 100, clientX: 100, clientY: 100, identifier: 1, screenX: 100, screenY: 100,
                target: eventTarget
            }]
        });

        s.draw.mouse = new Point();
        s.selectTank(mouseEvent);
        expect(s.draw.mouse.equals(new Point())).to.be.false;
        expect(player.activeTank.get()).to.not.be.null;
        expect(s.currentActiveTank).to.not.be.null;
    });
    it('select tank - not left mouse button', () => {
        player.tanks[0].position = new Point(100, 100);

        const s = new SelectionState(controller, mock_context as any, ui, player);
        const mouseEvent = new MouseEvent("woah", {
            button: 1 // MMB
        });
        // custom mouse position so that it will be overriden if mouse coordinates are updated
        (<any>mouseEvent).offsetX = 1000;
        (<any>mouseEvent).offsetY = 1000;

        s.draw.mouse = new Point();
        s.selectTank(mouseEvent);
        expect(s.draw.mouse.equals(new Point())).to.be.true;
        expect(s.currentActiveTank).to.be.null;
    });
    it('change game state - mouse up', () => {
        const s = new SelectionState(controller, mock_context as any, ui, player);

        const mock_changeGameState = new SingleCallMock(controller, controller.changeGameState);

        s.currentActiveTank = player.tanks[0];
        player.activeTank.set(player.tanks[0]);

        s.mouseUp();

        mock_changeGameState.expect_called.once();
    });
});