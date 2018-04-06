import { Mock } from "./mock";

export class CanvasContextMock {
    // context parameters
    fillStyle: string;
    lineWidth: number;
    strokeStyle: string;
    lineCap: string;
    lineJoin: string;

    // mocks for context functions
    mock_beginPath: Mock;
    mock_closePath: Mock;
    mock_arc: Mock;
    mock_fill: Mock;
    mock_stroke: Mock;
    mock_moveTo: Mock;
    mock_lineTo: Mock;
    mock_clearRect: Mock;
    mock_fillRect: Mock;
    mock_fillText: Mock;

    constructor() {
        this.mock_beginPath = new Mock(this, this.beginPath);
        this.mock_closePath = new Mock(this, this.closePath);
        this.mock_arc = new Mock(this, this.arc);
        this.mock_fill = new Mock(this, this.fill);
        this.mock_stroke = new Mock(this, this.stroke);
        this.mock_moveTo = new Mock(this, this.moveTo);
        this.mock_lineTo = new Mock(this, this.lineTo);
        this.mock_clearRect = new Mock(this, this.clearRect);
        this.mock_fillRect = new Mock(this, this.fillRect);
        this.mock_fillText = new Mock(this, this.fillText);
    }
    restore() {
        this.mock_beginPath.restore();
        this.mock_closePath.restore();
        this.mock_arc.restore();
        this.mock_fill.restore();
        this.mock_stroke.restore();
        this.mock_moveTo.restore();
        this.mock_lineTo.restore();
        this.mock_clearRect.restore();
        this.mock_fillRect.restore();
        this.mock_fillText.restore();
    }

    beginPath() { }
    closePath() { }
    arc() { }
    fill() { }
    stroke() { }
    moveTo() { }
    lineTo() { }
    clearRect() { }
    fillText() { }
    fillRect() { }
}