import { expect } from 'chai';
import 'mocha';
import { GameEndState } from '../../ts/tanks/states/gameEnd';
import { GameController } from '../../ts/tanks/controller';
import { CanvasMock } from '../mocking/canvasMock';
import { CanvasContextMock } from '../mocking/canvasContextMock';
import { Ui } from '../../ts/tanks/ui/ui';
import { Player } from '../../ts/tanks/objects/player';
import { TanksMap } from '../../ts/tanks/gameMap/tanksMap';
import { Color } from '../../ts/tanks/drawing/color';
import { SepiaTheme } from '../../ts/tanks/themes/sepia';
import { mockDOM } from '../testutility';
import { Tank } from '../../ts/tanks/objects/tank';
import { Viewport } from '../../ts/tanks/gameMap/viewport';


describe('Game End - Game State', () => {
    mockDOM();
    let mock_canvas: CanvasMock;
    let mock_context: CanvasContextMock;
    let ui: Ui;
    const player = Player.premadePlayer();
    player.tanks.push(Tank.premadeTank());
    let controller: GameController;
    beforeEach(() => {
        mock_canvas = new CanvasMock();
        mock_context = mock_canvas.getContext();
        ui = new Ui(Ui.ID_GAME_UI, mock_canvas.width, mock_canvas.height);
        controller = new GameController(mock_canvas as any, mock_context as any, ui, new SepiaTheme(), TanksMap.premadeMap(), [player, new Player(0, "P1", Color.black())], 1, false);
    });
    it('add event listeners', () => {
        const ge = new GameEndState(controller, ui, player);
        ge.addEventListeners(mock_canvas as any);
        mock_canvas.mock_onmousedown.expect_called.never();
        mock_canvas.mock_onmousemove.expect_called.never();
        mock_canvas.mock_onmouseup.expect_called.never();

    });
    it('add keyboard shortcuts', () => {
        const ge = new GameEndState(controller, ui, player);
        ge.addKeyboardShortcuts(mock_canvas as any);
        mock_canvas.mock_onkeyup.expect_called.never();
    });
    it('set up UI', () => {
        const ge = new GameEndState(controller, ui, player);
        ge.setUpUi(ui, null, new SepiaTheme());
        expect(ui.body.htmlElement.children.length).to.eq(3);
    });
});