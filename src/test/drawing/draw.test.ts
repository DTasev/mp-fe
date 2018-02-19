import { expect } from 'chai';
import 'mocha';

import { Draw } from "../../ts/drawing/draw";
import { SingleCallMock } from "../mocking/mock";
import { CanvasContextMock } from "../mocking/canvasContextMock";
import { Point } from "../../ts/utility/point";
import { Color } from '../../ts/drawing/color';


describe('Drawing', () => {
    let draw: Draw;
    // In tests marking as any disables the type checking errors from TS
    let mock_context: CanvasContextMock;
    const test_coords: Point = new Point(23, 23);
    const expected_width = 11414;
    const color = Color.red().toRGBA();

    beforeEach(() => {
        mock_context = new CanvasContextMock();
        draw = new Draw();
    })
    it('should update the mouse position', () => {
        const initial_mouse_pos = -1;
        draw.mouse.X = initial_mouse_pos;
        draw.mouse.Y = initial_mouse_pos;
        const mock_event = new MouseEvent("");

        // as any disables typescript "can't be assigned" error
        const new_X = 42, new_Y = 55;
        (mock_event as any).offsetX = new_X;
        (mock_event as any).offsetY = new_Y;

        draw.updateMousePosition(mock_event);

        expect(draw.mouse.X).to.not.equal(initial_mouse_pos);
        expect(draw.mouse.X).to.equal(new_X);
        expect(draw.mouse.Y).to.not.equal(initial_mouse_pos);
        expect(draw.mouse.Y).to.equal(new_Y);
    });
    it('should draw a dot', () => {
        // as any disables type checking
        draw.dot(mock_context as any, test_coords, expected_width, color);

        expect(mock_context.mock_beginPath.called.once()).to.be.true;
        expect(mock_context.mock_closePath.called.once()).to.be.true;
        expect(mock_context.mock_arc.called.once()).to.be.true;
        expect(mock_context.mock_fill.called.once()).to.be.true;
        expect(mock_context.fillStyle).to.not.be.empty;
        expect(mock_context.lineWidth).to.equal(expected_width);
    });
    it('should draw a dot with outline', () => {
        // set true for the outline
        draw.dot(mock_context as any, test_coords, expected_width, color, true);

        expect(mock_context.mock_stroke.called.once()).to.be.true;
        expect(mock_context.lineWidth).to.equal(expected_width);
        expect(mock_context.strokeStyle).to.not.be.empty;
    });
    it('should draw a circle', () => {
        draw.circle(mock_context as any, test_coords, 5, expected_width, color);

        expect(mock_context.mock_beginPath.called.once()).to.be.true;
        expect(mock_context.mock_closePath.called.once()).to.be.true;
        expect(mock_context.mock_arc.called.once()).to.be.true;
        expect(mock_context.mock_stroke.called.once()).to.be.true;
        expect(mock_context.lineWidth).to.equal(expected_width);
        expect(mock_context.strokeStyle).to.not.be.empty;
    });
    it('should draw a line, and update the last position of the mouse', () => {
        draw.mouseLine(mock_context as any, expected_width, color, true);

        expect(mock_context.strokeStyle).to.not.be.empty;
        expect(mock_context.lineCap).to.not.be.empty;
        expect(mock_context.lineJoin).to.not.be.empty;
        expect(mock_context.mock_beginPath.called.once()).to.be.true;
        expect(mock_context.mock_moveTo.called.once()).to.be.true;
        expect(mock_context.mock_lineTo.called.once()).to.be.true;
        expect(mock_context.lineWidth).to.equal(expected_width);
        expect(mock_context.mock_stroke.called.once()).to.be.true;
        expect(mock_context.mock_closePath.called.once()).to.be.true;
    });
    it('should be able to update the last position of the mouse when drawing a line', () => {
        const mock_event = new MouseEvent("");
        const new_X = 42, new_Y = 55;

        // as any disables typescript "can't be assigned" error
        (mock_event as any).offsetX = new_X;
        (mock_event as any).offsetY = new_Y;
        draw.updateMousePosition(mock_event);
        draw.mouseLine(mock_context as any, expected_width, color, true);

        // tests mouse coords
        expect(draw.last.X).to.equal(draw.mouse.X);
        expect(draw.last.X).to.equal(new_X);
        expect(draw.last.Y).to.equal(draw.mouse.Y);
        expect(draw.last.Y).to.equal(new_Y);
    });
    it('should be able to not update the last position of the mouse when drawing a line', () => {
        const mock_event = new MouseEvent("");
        const new_X = 42, new_Y = 55;

        // as any disables typescript "can't be assigned" error
        (mock_event as any).offsetX = new_X;
        (mock_event as any).offsetY = new_Y;
        draw.updateMousePosition(mock_event);
        // this is necessary, otherwise last coords will also be updated, as they have never been set
        draw.last.X = 1;
        // drawing a line with update_last = false
        draw.mouseLine(mock_context as any, expected_width, color, false);

        // tests mouse coords
        expect(draw.last.X).to.not.equal(draw.mouse.X);
        expect(draw.last.X).to.equal(1);
        expect(draw.last.Y).to.not.equal(draw.mouse.Y);
        expect(draw.last.Y).to.equal(-1);
    });
    it('should update the last position of the mouse if there is no previous position, even if we have said to not update', () => {
        const mock_event = new MouseEvent("");
        const new_X = 42, new_Y = 55;

        // as any disables typescript "can't be assigned" error
        (mock_event as any).offsetX = new_X;
        (mock_event as any).offsetY = new_Y;
        draw.updateMousePosition(mock_event);
        // drawing a line with update_last = false, but the last coords have never been set before
        // so they will be updated anyway
        draw.mouseLine(mock_context as any, expected_width, color, false);

        // tests mouse coords
        expect(draw.last.X).to.equal(draw.mouse.X);
        expect(draw.last.X).to.equal(new_X);
        expect(draw.last.Y).to.equal(draw.mouse.Y);
        expect(draw.last.Y).to.equal(new_Y);
    });
    it('should be able to draw a line from coordinates', () => {
        const start = new Point(0, 0);
        const end = new Point(1, 1);

        draw.line(mock_context as any, start, end, expected_width, color);

        expect(mock_context.mock_beginPath.called.once()).to.be.true;
        expect(mock_context.mock_moveTo.called.once()).to.be.true;
        expect(mock_context.mock_lineTo.called.once()).to.be.true;
        expect(mock_context.lineWidth).to.equal(expected_width);
        expect(mock_context.mock_stroke.called.once()).to.be.true;
        expect(mock_context.mock_closePath.called.once()).to.be.true;
    })
});