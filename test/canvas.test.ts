import { expect, assert } from 'chai';
import 'mocha';
import { Canvas } from "../ts/canvas";
import { Mock } from './mock';

class CanvasMock {

}

describe('Canvas', () => {
    let canvas: Canvas;
    let document_mock: Mock;
    let canvas_add_event_listener_mock: Mock;
    const canvas_dom_id = "some-canvas-id";
    beforeEach(() => {
        const canvas_dom_elem = document.createElement("canvas");
        canvas_dom_elem.id = canvas_dom_id;

        document_mock = new Mock();
        canvas_add_event_listener_mock = new Mock();
        window_add_event_listener_mock = new Mock();

        document_mock.mock(document, document.getElementById, () => {

            // monkey patch the getContext function to return nothing of use
            // `as any` forces typescript to ignore the error of patching a function
            (canvas_dom_elem as any).getContext = function (type: string) {
                // this doesn't matter, until it starts mattering
                return new Object();
            };

            // mock the addEventListener method so that we can check how many are added
            canvas_add_event_listener_mock.mock(canvas_dom_elem, canvas_dom_elem.addEventListener);

            return canvas_dom_elem;
        });

        // canvas will be remade before each test
        canvas = new Canvas(canvas_dom_id);
    });
    afterEach(() => {
        document.body.innerHTML = "";
        document_mock.restore();
        canvas_add_event_listener_mock.restore();
    });
    it('should resize the canvas', () => {
        const expected_width = 1234;
        const expected_height = 1234;
        canvas.setDOMResolution(expected_width, expected_height);

        const canvas_dom_elem: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(canvas_dom_id);
        expect(canvas_dom_elem.width).to.equal(expected_width);
        expect(canvas_dom_elem.height).to.equal(expected_height);
        expect(canvas_add_event_listener_mock.called.exactly(5)).to.be.true;
    });
});