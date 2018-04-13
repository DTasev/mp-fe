import { Mock } from './mock';
import { CanvasContextMock } from './canvasContextMock';

export class CanvasMock {
    onmousedown() { }
    onmouseup() { }
    onmousemove() { }
    onkeyup() { }
    ontouchstart() { }
    ontouchmove() { }
    ontouchend() { }

    mock_onmouseup: Mock;
    mock_onmousedown: Mock;
    mock_onmousemove: Mock;
    mock_onkeyup: Mock;
    mock_ontouchstart: Mock;
    mock_ontouchmove: Mock;
    mock_ontouchend: Mock;

    width = 640;
    height = 480;

    constructor() {
        this.mock_onmousedown = new Mock(this, this.onmousedown);
        this.mock_onmouseup = new Mock(this, this.onmouseup);
        this.mock_onmousemove = new Mock(this, this.onmousemove);
        this.mock_onkeyup = new Mock(this, this.onkeyup);
        this.mock_ontouchstart = new Mock(this, this.ontouchstart);
        this.mock_ontouchmove = new Mock(this, this.ontouchmove);
        this.mock_ontouchend = new Mock(this, this.ontouchend);
    }
    getContext() {
        return new CanvasContextMock();
    }
    nullify() {
        this.onmousedown = null;
        this.onmouseup = null;
        this.onmousemove = null;
        this.onkeyup = null;
        this.ontouchstart = null;
        this.ontouchmove = null;
        this.ontouchend = null;
    }
}
