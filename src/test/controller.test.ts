import { expect } from 'chai';
import 'mocha';

import { GameController, GameState } from "../ts/controller";
import { Mock, SingleCallMock } from './mocking/mock';
import { CanvasContextMock } from './mocking/canvasContextMock';
import { Ui } from '../ts/ui/ui';
import { Viewport } from '../ts/gameMap/viewport';
import { Color } from '../ts/drawing/color';
import { Collision } from '../ts/utility/collision';
import * as Settings from '../ts/settings';
import { Line } from '../ts/utility/line';
import { Point } from '../ts/utility/point';
import { Tank } from '../ts/gameObjects/tank';
import { DarkTheme } from '../ts/gameThemes/dark';
import { Player } from '../ts/gameObjects/player';
import { TanksMap } from '../ts/gameMap/tanksMap';

class CanvasMock {
    onmousedown() { }
    onmouseup() { }
    onmousemove() { }

    mock_onmouseup: SingleCallMock;
    mock_onmousedown: SingleCallMock;
    mock_onmousemove: SingleCallMock;

    width = 640;
    height = 480;

    constructor() {
        this.mock_onmousedown = new SingleCallMock(this, this.onmousedown);
        this.mock_onmouseup = new SingleCallMock(this, this.onmouseup);
        this.mock_onmousemove = new SingleCallMock(this, this.onmousemove);
    }
    getContext() {
        return new CanvasContextMock();
    }
}

/**
 * Adds all the elements necessary to be inside the DOM
 */
function mockDOM() {
    let uiDom = document.createElement("div");
    uiDom.id = Ui.ID_GAME_UI;
    document.body.appendChild(uiDom);

}

describe('Game Controller', () => {
    mockDOM();
    let canvasMock: CanvasMock;
    let contextMock: CanvasContextMock;
    let ui: Ui;
    let viewport: Viewport;
    let theme = new DarkTheme();
    // override the color return as it doesn't matter here
    // Color.next = () => { return Color.red(); }
    beforeEach(() => {
        canvasMock = new CanvasMock();
        contextMock = canvasMock.getContext();
        ui = new Ui(Ui.ID_GAME_UI, canvasMock.width, canvasMock.height);
        viewport = new Viewport(canvasMock.width, canvasMock.height);
    });
    it('should construct', () => {
        const controller = new GameController(canvasMock as any, contextMock as any, ui, theme, new TanksMap("a"), [new Player(0, "P1", Color.black()), new Player(0, "P1", Color.black())], 1);
        expect(controller["currentPlayer"]).to.eq(0);
        canvasMock.mock_onmousedown.called.never();
        canvasMock.mock_onmouseup.called.never();
        canvasMock.mock_onmousemove.called.never();
    });
    it('should clear canvas', () => {
        const controller = new GameController(canvasMock as any, contextMock as any, ui, theme, new TanksMap("a"), [new Player(0, "P1", Color.black()), new Player(0, "P1", Color.black())], 1);
        controller.clearCanvas();

        contextMock.mock_fillRect.expect_called.once();
        contextMock.mock_clearRect.expect_called.never();

        expect(controller["currentPlayer"]).to.eq(0);
        canvasMock.mock_onmousedown.expect_called.never();
        canvasMock.mock_onmouseup.expect_called.never();
        canvasMock.mock_onmousemove.expect_called.never();
    });
    it('should perform collision', () => {
        // enforce having two player with two tanks each, for a total of 2 collision calls
        const mock_collision = new Mock(Collision, Collision.shooting);
        const controller = new GameController(canvasMock as any, contextMock as any, ui, theme, new TanksMap("a"), [new Player(0, "P1", Color.black()), new Player(0, "P1", Color.black())], 1);

        // add some players
        controller["players"].push(new Player(0, "P1", Color.black()));
        controller["players"].push(new Player(1, "P2", Color.black()));

        const line = new Line();
        line.points.push(new Point(0, 0));
        line.points.push(new Point(20, 20));
        line.points.push(new Point(40, 40));
        line.points.push(new Point(60, 60));

        for (let i = 0; i < line.points.length; i++) {
            const start = line.points[i];
            const end = line.points[i + 1];
            controller.collide(start, end, false);
        }

        mock_collision.expect_called.quadrice();
        mock_collision.restore();
    })
    it('should get the next active player', () => {
        const controller = new GameController(canvasMock as any, contextMock as any, ui, theme, new TanksMap("a"), [new Player(0, "P1", Color.black()), new Player(0, "P1", Color.black())], 1);

        // set up a tank for .push player
        controller["players"][0].tanks.push(new Tank(0, controller["players"][0], 10, 10, theme));
        controller["players"][1].tanks.push(new Tank(0, controller["players"][1], 10, 10, theme));

        expect(controller["currentPlayer"]).to.eq(0);
        controller.nextActivePlayer();
        expect(controller["currentPlayer"]).to.eq(1);
        controller.nextActivePlayer();
        expect(controller["currentPlayer"]).to.eq(0);
    })
    it('should redraw the tanks on the canvas', () => {
        const controller = new GameController(canvasMock as any, contextMock as any, ui, theme, new TanksMap("a"), [new Player(0, "P1", Color.black()), new Player(0, "P1", Color.black())], 1);

        // set up a tank for each player
        const tank = new Tank(0, controller["players"][0], 10, 10, theme);
        const mock_tank = new SingleCallMock(tank, tank.draw);

        const tank2 = new Tank(0, controller["players"][1], 10, 10, theme);
        const mock_tank2 = new SingleCallMock(tank2, tank2.draw);

        controller["players"][0].tanks.push(tank);
        controller["players"][1].tanks.push(tank2);
        controller.redrawCanvas();

        mock_tank.expect_called.once();
        mock_tank2.expect_called.once();
    })
    it('should change the game state', () => {
        const controller = new GameController(canvasMock as any, contextMock as any, ui, theme, new TanksMap("a"), [new Player(0, "P1", Color.black()), new Player(0, "P1", Color.black())], 1);

        controller["players"].push(new Player(0, "P1", Color.black()));
        controller["players"].push(new Player(0, "P1", Color.black()));
        const mock_windowScroll = new SingleCallMock(window, window.scroll);
        window.scroll = () => { mock_windowScroll.default_callback() };
        controller.changeGameState(GameState.TANK_PLACEMENT);

        // expect that the viewport was scrolled to the player's view
        mock_windowScroll.expect_called.once();
    })
});