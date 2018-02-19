export class Ui {
    div: HTMLDivElement;
    constructor(id: string, width: number) {
        this.div = <HTMLDivElement>document.getElementById(id);
        if (!this.div) {
            throw new Error("The UI DOM element was not found!");
        }

        this.setWidth(width);
    }
    setWidth(width: number) {
        // as any ignores the read-only "style" warning, as we need to write the width of the canvas to the width of the UI element
        // the width + 2 removes the small gap left on the right, which is there for an unknown reason
        (this.div as any).style = "width:" + (width + 2) + "px";
    }
}