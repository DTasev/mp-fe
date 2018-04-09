import { Mock } from './mock';
import { CanvasContextMock } from './canvasContextMock';

export class CanvasMock {
    onmousedown() { }
    onmouseup() { }
    onmousemove() { }
    onkeyup() { }

    mock_onmouseup: Mock;
    mock_onmousedown: Mock;
    mock_onmousemove: Mock;
    mock_onkeyup: Mock;

    width = 640;
    height = 480;

    constructor() {
        this.mock_onmousedown = new Mock(this, this.onmousedown);
        this.mock_onmouseup = new Mock(this, this.onmouseup);
        this.mock_onmousemove = new Mock(this, this.onmousemove);
        this.mock_onkeyup = new Mock(this, this.onkeyup);
    }
    getContext() {
        return new CanvasContextMock();
    }
}
