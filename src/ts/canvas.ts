import { GameStateController, GameState } from "./gameStateController";

export class Canvas {
    canvas: HTMLCanvasElement;
    controller: GameStateController;

    constructor(id: string, width: number, height: number, controller: GameStateController) {
        this.canvas = <HTMLCanvasElement>document.getElementById(id);
        this.setDOMResolution(width, height);
        this.controller = controller;
        this.controller.initialise(this.canvas, this.canvas.getContext("2d"));

        // start the game in Menu state
        this.controller.changeGameState(GameState.MENU);

        // initialise as empty removal function 
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

    /**
     * Debug function to display which event is triggered, and how many times.
     * @param e The actual event class
     * @param message Message to be displayed, this should identify the event
     * @param times How many times it has been repeated, the counting must be done externally
     */
    showEvent(e, message: string, times: number) {
        document.getElementById("debug-status").innerHTML = message + "times: " + times;
        event.preventDefault();
    }

    private setDOMResolution(width: number, height: number): void {
        this.canvas.width = width;
        this.canvas.height = height;
    }
}