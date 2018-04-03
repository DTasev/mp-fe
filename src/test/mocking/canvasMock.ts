import { SingleCallMock } from './mock';
import { CanvasContextMock } from './canvasContextMock';

export class CanvasMock {
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
