import { Color } from "../drawing/color";
import { J2H } from "../json2html";

/**
 * The UiBody is on top of the canvas and overlays it. It should not be shown at the same
 * time as any events are happening on the canvas, as it might hide them or stop onmouseclick events 
 * on the canvas
 */
export class UiBody {

    readonly htmlElement: HTMLDivElement;
    constructor(htmlElement: HTMLDivElement) {
        this.htmlElement = htmlElement;
    }

    textColor(color: Color) {
        this.htmlElement.style.color = color.rgba();
    }
    textAlign(position: string = "center") {
        this.htmlElement.style.textAlign = position;
    }
    clear(): void {
        this.htmlElement.innerHTML = "";
    }
    addColumns(): [HTMLDivElement, HTMLDivElement, HTMLDivElement] {
        // these are on the side of the menu buttons, to pad it out so that it can be in the middle
        const sideDescription = {
            "div": {
                "className": "w3-col w3-hide-small w3-hide-medium l2",
                // tells the browser to render a whitespace and respect the CSS styling classes
                "innerHTML": "&nbsp;"
            }
        };
        const middleDescription = {
            "div": {
                "className": "w3-col s12 m12 l8"
            }
        };
        const left = J2H.parse<HTMLDivElement>(sideDescription);
        const right = J2H.parse<HTMLDivElement>(sideDescription);
        const middle = J2H.parse<HTMLDivElement>(middleDescription);
        return [left, middle, right];
    }
}