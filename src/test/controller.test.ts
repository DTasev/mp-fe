import { expect } from 'chai';
import 'mocha';

import { GameController, GameState } from "../ts/tanks/controller";
import { Mock, SingleCallMock } from './mocking/mock';
import { CanvasContextMock } from './mocking/canvasContextMock';
import { CanvasMock } from './mocking/canvasMock';
import { LocalStorageMock } from './mocking/localStorageMock';
import { Ui } from '../ts/tanks/ui/ui';
import { Viewport } from '../ts/tanks/gameMap/viewport';
import { Color } from '../ts/tanks/drawing/color';
import { Collision } from '../ts/tanks/utility/collision';
import * as Settings from '../ts/tanks/settings';
import { Line } from '../ts/tanks/utility/line';
import { Point } from '../ts/tanks/utility/point';
import { Tank } from '../ts/tanks/objects/tank';
import { DarkTheme } from '../ts/tanks/themes/dark';
import { Player } from '../ts/tanks/objects/player';
import { TanksMap } from '../ts/tanks/gameMap/tanksMap';

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
    let mock_canvas: CanvasMock;
    let mock_context: CanvasContextMock;
    let mock_viewport_go: Mock;
    let ui: Ui;
    let theme = new DarkTheme();
    (<any>window.localStorage) = new LocalStorageMock();
    beforeEach(() => {
        mock_canvas = new CanvasMock();
        mock_context = mock_canvas.getContext();
        ui = new Ui(Ui.ID_GAME_UI, mock_canvas.width, mock_canvas.height);
    });
    it('should construct', () => {
        const controller = new GameController(mock_canvas as any, mock_context as any, ui, theme, TanksMap.premadeMap(), [new Player(0, "P1", Color.black()), new Player(0, "P1", Color.black())], 1, false);
        expect(controller["currentPlayer"]).to.eq(0);
        mock_canvas.mock_onmousedown.called.never();
        mock_canvas.mock_onmouseup.called.never();
        mock_canvas.mock_onmousemove.called.never();
    });
    it('should clear canvas', () => {
        const controller = new GameController(mock_canvas as any, mock_context as any, ui, theme, TanksMap.premadeMap(), [new Player(0, "P1", Color.black()), new Player(0, "P1", Color.black())], 1, false);
        mock_context.mock_fillRect.expect_called.once();
        controller.clearCanvas();
        mock_context.mock_fillRect.expect_called.twice();
        mock_context.mock_clearRect.expect_called.never();

        expect(controller["currentPlayer"]).to.eq(0);
        mock_canvas.mock_onmousedown.expect_called.never();
        mock_canvas.mock_onmouseup.expect_called.never();
        mock_canvas.mock_onmousemove.expect_called.never();
    });
    it('should perform collision', () => {
        // enforce having two player with two tanks each, for a total of 2 collision calls
        const mock_collision = new Mock(Collision, Collision.shooting, [0, 1]);
        const controller = new GameController(mock_canvas as any, mock_context as any, ui, theme, TanksMap.premadeMap(), [new Player(0, "P1", Color.black()), new Player(0, "P1", Color.black())], 1, false);

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
            controller.collide(start, end);
        }

        mock_collision.expect_called.quadrice();
        mock_collision.restore();
    });
    it('should get the next active player', () => {
        const controller = new GameController(mock_canvas as any, mock_context as any, ui, theme, TanksMap.premadeMap(), [new Player(0, "P1", Color.black()), new Player(0, "P1", Color.black())], 1, false);

        // set up a tank for .push player
        controller["players"][0].tanks.push(new Tank(0, controller["players"][0], 10, 10, theme));
        controller["players"][1].tanks.push(new Tank(0, controller["players"][1], 10, 10, theme));

        expect(controller["currentPlayer"]).to.eq(0);
        controller.nextActivePlayer();
        expect(controller["currentPlayer"]).to.eq(1);
        controller.nextActivePlayer();
        expect(controller["currentPlayer"]).to.eq(0);
    });
    it('should redraw the tanks on the canvas', () => {
        const controller = new GameController(mock_canvas as any, mock_context as any, ui, theme, TanksMap.premadeMap(), [new Player(0, "P1", Color.black()), new Player(0, "P1", Color.black())], 1, false);

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
    });
    it('should change the game state', () => {
        const controller = new GameController(mock_canvas as any, mock_context as any, ui, theme, TanksMap.premadeMap(), [new Player(0, "P1", Color.black()), new Player(0, "P1", Color.black())], 1, false);

        controller["players"].push(new Player(0, "P1", Color.black()));
        controller["players"].push(new Player(0, "P1", Color.black()));
        controller.changeGameState(GameState.TANK_PLACEMENT);

        expect(controller.gameState()).to.eq(GameState.TANK_PLACEMENT);
    });
});