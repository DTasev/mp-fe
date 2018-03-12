import { Color } from "../drawing/color";

export class UiBody {

    readonly htmlElement: HTMLDivElement;
    constructor(htmlElement: HTMLDivElement) {
        this.htmlElement = htmlElement;
    }

    background(color: Color) {
        this.htmlElement.style.backgroundColor = color.toRGBA();
    }
    textColor(color: Color) {
        this.htmlElement.style.color = color.toRGBA();
    }
    textAlign(position: string = "center") {
        this.htmlElement.style.textAlign = position;
    }
    clear(): void {
        this.htmlElement.innerHTML = "";
    }
}