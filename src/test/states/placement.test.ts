import { expect } from 'chai';
import 'mocha';
import { mockDOM } from '../testutility';
import { CanvasMock } from '../mocking/canvasMock';
import { CanvasContextMock } from '../mocking/canvasContextMock';
import { Ui } from '../../ts/tanks/ui/ui';
import { GameController } from '../../ts/tanks/controller';
import { Player } from '../../ts/tanks/objects/player';
import { Tank } from '../../ts/tanks/objects/tank';
import { Color } from '../../ts/tanks/drawing/color';
import { TanksMap } from '../../ts/tanks/gameMap/tanksMap';
import { SepiaTheme } from '../../ts/tanks/themes/sepia';
import { PlacingState } from '../../ts/tanks/states/placement';
import { Settings } from '../../ts/tanks/settings';
import { Mock } from '../mocking/mock';
import { Viewport } from '../../ts/tanks/gameMap/viewport';
import { Point } from '../../ts/tanks/utility/point';


describe('Placement - Game State', () => {
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
        controller = new GameController(mock_canvas as any, mock_context as any, ui, new SepiaTheme(), TanksMap.premadeMap(), [player, new Player(0, "P1", Color.black())], 2, false);
    });
    it('construct', () => {
        const player = Player.premadePlayer();
        const p = new PlacingState(controller, mock_context as any, player);
        expect(PlacingState.playersTankPlacement).to.not.be.null;
    });
    it('add event listeners', () => {
        const player = Player.premadePlayer();
        const p = new PlacingState(controller, mock_context as any, player);

        // add event listeners replaces the function, so we can't check if the mock is being called
        mock_canvas.onmousedown = null;
        p.addEventListeners(mock_canvas as any);
        expect(mock_canvas.onmousedown).to.not.be.null;

        (<any>Settings)["IS_MOBILE"] = true;

        mock_canvas.ontouchstart = null;
        p.addEventListeners(mock_canvas as any);
        expect(mock_canvas.ontouchstart).to.not.be.null;

        (<any>Settings)["IS_MOBILE"] = false;
    });
    it('view', () => {
        const viewport = new Viewport(100, 100);
        const mock_viewport_goTo = new Mock(viewport, viewport.goTo);

        const player = Player.premadePlayer();
        const p = new PlacingState(controller, mock_context as any, player);
        p.view(viewport);
        mock_viewport_goTo.expect_called.once();
    });
    it('set up UI', () => {
        const player = Player.premadePlayer();
        const p = new PlacingState(controller, mock_context as any, player);

        p.setUpUi(ui, new Viewport(100, 100), new SepiaTheme());
        expect(ui.heading.left.innerHTML).to.not.be.empty;
    });
    it('single tap - add tank - touch', () => {
        const player = Player.premadePlayer();
        const p = new PlacingState(controller, mock_context as any, player);
        const mouseEvent = new TouchEvent("woah", {
            touches: [{ pageX: 100, pageY: 100, clientX: 100, clientY: 100, identifier: 1, screenX: 100, screenY: 100, target: null }] // MMB
        });

        p.draw.mouse = new Point();
        // a single tap doesn't do anything
        p.addTank(mouseEvent);

        expect(p.draw.mouse.equals(new Point())).to.be.true;
    });
    it('double tap - add tank - touch', () => {
        const player = Player.premadePlayer();
        const p = new PlacingState(controller, mock_context as any, player);

        const eventTarget = document.createElement("canvas");
        const mouseEvent = new TouchEvent("woah", {
            touches: [{
                pageX: 100, pageY: 100, clientX: 100, clientY: 100, identifier: 1, screenX: 100, screenY: 100,
                target: eventTarget
            }]
        });

        p.draw.mouse = new Point();
        // a single tap doesn't do anything
        p.addTank(mouseEvent);
        // but the double tap will execute the rest of the function
        p.addTank(mouseEvent);

        expect(p.draw.mouse.equals(new Point(100, 100))).to.be.true;
    });
    it('wrong button - add tank - mouse', () => {
        const player = Player.premadePlayer();
        const p = new PlacingState(controller, mock_context as any, player);
        const mouseEvent = new MouseEvent("woah", {
            button: 1 // MMB
        });
        // custom mouse position so that it will be overrides if mouse coordinates are updated
        (<any>mouseEvent).offsetX = 100;
        (<any>mouseEvent).offsetY = 100;

        p.draw.mouse = new Point();
        // mouse event is with the wrong button - nothing should be done
        p.addTank(mouseEvent);

        expect(p.draw.mouse.equals(new Point())).to.be.true;
    });
    it('add tank - mouse', () => {
        const player = Player.premadePlayer();
        const numTanks = player.tanks.length;
        const p = new PlacingState(controller, mock_context as any, player);
        const mouseEvent = new MouseEvent("woah", {
            button: 0 // MMB
        });
        // custom mouse position so that it will be overrides if mouse coordinates are updated
        (<any>mouseEvent).offsetX = 100;
        (<any>mouseEvent).offsetY = 100;

        p.draw.mouse = new Point();
        p.addTank(mouseEvent);

        expect(player.tanks.length).to.eq(numTanks + 1);
    });
    it('end placement state', () => {
        const player = Player.premadePlayer();
        const numTanks = player.tanks.length;
        const playerTwo = Player.premadePlayer();
        const numTanksPlayerTwo = playerTwo.tanks.length;
        const numTanksPlaced = 2;
        controller = new GameController(mock_canvas as any, mock_context as any, ui, new SepiaTheme(), TanksMap.premadeMap(), [player, playerTwo], numTanksPlaced, false);

        let p = new PlacingState(controller, mock_context as any, player);
        const mouseEvent = new MouseEvent("woah", {
            button: 0 // MMB
        });
        // custom mouse position so that it will be overrides if mouse coordinates are updated
        (<any>mouseEvent).offsetX = 100;
        (<any>mouseEvent).offsetY = 100;

        p.draw.mouse = new Point();
        // player one's tanks are placed
        p.addTank(mouseEvent);
        p.addTank(mouseEvent);

        expect(player.tanks.length).to.eq(numTanks + 2);
        expect(p.tanksPlaced.over()).to.be.true;

        p = new PlacingState(controller, mock_context as any, playerTwo);

        // placing player two's tanks
        p.addTank(mouseEvent);
        p.addTank(mouseEvent);

        expect(playerTwo.tanks.length).to.eq(numTanks + 2);
        expect(p.tanksPlaced.over()).to.be.true;

        expect(PlacingState.playersTankPlacement).to.be.null;
    });
});