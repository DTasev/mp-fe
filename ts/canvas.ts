import GameEvents from "./game-events";

export class Canvas {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    events: GameEvents;

    constructor(id: string) {
        this.canvas = <HTMLCanvasElement>document.getElementById(id);
        this.context = this.canvas.getContext("2d");
        this.events = new GameEvents(this.context);

        this.canvas.addEventListener('mousedown', this.events.mouseDown, false);
        this.canvas.addEventListener('mousemove', this.events.mouseMove, false);
        // NOTE: mouseup is on the whole window, so that even if the cursor exits the canvas, the event will trigger
        window.addEventListener('mouseup', this.events.mouseUp, false);

        this.canvas.addEventListener('touchstart', this.events.touchMove, false);
        this.canvas.addEventListener('touchend', this.events.mouseUp, false);
        this.canvas.addEventListener('touchmove', this.events.touchMove, false);

        // Browsers really don't like styluses yet. Only pointermove is called when stylus hovers
        // and pointerleave is called when the stylus is pressed down
        //     let down_times: number = 0;
        //     let up_times: number = 0;
        //     let move_times: number = 0;
        //     this.canvas.addEventListener('pointerdown', (e) => { this.showEvent(e, "pointerdown", down_times++); }, false);
        //     this.canvas.addEventListener('pointerup', (e) => { this.showEvent(e, "pointerup", up_times++); }, false);
        //     this.canvas.addEventListener('pointermove', (e) => { this.showEvent(e, "pointermove", move_times++); }, false);
        //     let over_times = 0;
        //     this.canvas.addEventListener('pointerover', (e) => { this.showEvent(e, "pointerover", over_times++); }, false);
        //     let leave_times = 0;
        //     this.canvas.addEventListener('pointerleave', (e) => { this.showEvent(e, "pointerleave", leave_times++); }, false);
        //     let enter_times = 0;
        //     this.canvas.addEventListener('pointerenter', (e) => { this.showEvent(e, "pointerenter", enter_times++); }, false);
        //     let out_times = 0;
        //     this.canvas.addEventListener('pointerout', (e) => { this.showEvent(e, "pointerout", out_times++); }, false);
        //     let cancel_times = 0;
        //     this.canvas.addEventListener('pointercancel', (e) => { this.showEvent(e, "pointercancel", cancel_times++); }, false);
        //     let capture_times = 0;
        //     this.canvas.addEventListener('gotpointercapture', (e) => { this.showEvent(e, "gotpointercapture", capture_times++); }, false);
        //     let lost_capture_times = 0;
        //     this.canvas.addEventListener('lostpointercapture', (e) => { this.showEvent(e, "lostpointercapture", lost_capture_times++); }, false);
    }

    showEvent(e, event: string, times: number) {
        document.getElementById("debug-status").innerHTML = event + "times: " + times;
        e.preventDefault();
    }

    setDOMResolution(width: number, height: number): void {
        this.canvas.width = width;
        this.canvas.height = height;
    }
}