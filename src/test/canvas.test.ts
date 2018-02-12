import { expect } from 'chai';
import 'mocha';
import { Canvas } from "../ts/canvas";
import { SingleCallMock } from './mocking/mock';
import { GameStateController, GameState } from "../ts/gameStateController";

describe('Canvas', () => {
    let canvas: Canvas;

    let controller: GameStateController;
    let controller_changeGameState_mock: SingleCallMock;

    const canvas_dom_id = "some-canvas-id";

    beforeEach(() => {
        controller = new GameStateController();

        const canvas_dom_elem = document.createElement("canvas");
        canvas_dom_elem.id = canvas_dom_id;

        // actually adds the element on the page
        document.body.appendChild(canvas_dom_elem);

        controller_changeGameState_mock = new SingleCallMock(controller, controller.changeGameState);

    });
    afterEach(() => {
        document.body.innerHTML = "";
    });
    it('should have correct width and height', () => {
        const expected_width = 1234;
        const expected_height = 1234;

        canvas = new Canvas(canvas_dom_id, expected_width, expected_height, controller);

        const canvas_dom_elem: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(canvas_dom_id);
        expect(canvas_dom_elem.width).to.equal(expected_width);
        expect(canvas_dom_elem.height).to.equal(expected_height);
    });
    it('should set the initial state', () => {
        const expected_width = 1234;
        const expected_height = 1234;

        canvas = new Canvas(canvas_dom_id, expected_width, expected_height, controller);
        expect(controller_changeGameState_mock.called.once()).to.be.true;
    });
});