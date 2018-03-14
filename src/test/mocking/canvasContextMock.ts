import { SingleCallMock } from "./mock";

export class CanvasContextMock {
    // context parameters
    fillStyle: string;
    lineWidth: number;
    strokeStyle: string;
    lineCap: string;
    lineJoin: string;

    // mocks for context functions
    mock_beginPath: SingleCallMock;
    mock_closePath: SingleCallMock;
    mock_arc: SingleCallMock;
    mock_fill: SingleCallMock;
    mock_stroke: SingleCallMock;
    mock_moveTo: SingleCallMock;
    mock_lineTo: SingleCallMock;
    mock_clearRect: SingleCallMock;
    mock_fillRect: SingleCallMock;
    mock_fillText: SingleCallMock;

    constructor() {
        this.mock_beginPath = new SingleCallMock(this, this.beginPath);
        this.mock_closePath = new SingleCallMock(this, this.closePath);
        this.mock_arc = new SingleCallMock(this, this.arc);
        this.mock_fill = new SingleCallMock(this, this.fill);
        this.mock_stroke = new SingleCallMock(this, this.stroke);
        this.mock_moveTo = new SingleCallMock(this, this.moveTo);
        this.mock_lineTo = new SingleCallMock(this, this.lineTo);
        this.mock_clearRect = new SingleCallMock(this, this.clearRect);
        this.mock_fillRect = new SingleCallMock(this, this.fillRect);
        this.mock_fillText = new SingleCallMock(this, this.fillText);
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