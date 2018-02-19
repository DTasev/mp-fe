import { J2H } from "./json2html";

export class Ui {
    private readonly div: HTMLDivElement;
    private readonly left: HTMLDivElement;
    private readonly right: HTMLDivElement;

    constructor(id: string, width: number) {
        this.div = <HTMLDivElement>document.getElementById(id);
        if (!this.div) {
            throw new Error("The UI DOM element was not found!");
        }

        this.setWidth(width);

        const left = {
            "div": {
                "className": "w3-col s11 m11 l11",
                "children": [{
                    "p": {
                        "textContent": "a"
                    }
                }]
            }
        };
        this.left = <HTMLDivElement>J2H.json2html(left);

        const right = {
            "div": {
                "className": "w3-col s1 m1 l1",
                "children": [{
                    "button": {
                        "style": "width:100%",
                        "textContent": "Apples"
                    }
                }]
            }
        };
        this.right = <HTMLDivElement>J2H.json2html(right);

        this.div.appendChild(this.left);
        this.div.appendChild(this.right);
    }
    setWidth(width: number) {
        // as any ignores the read-only "style" warning, as we need to write the width of the canvas to the width of the UI element
        // the width + 2 removes the small gap left on the right, which is there for an unknown reason
        (this.div as any).style = "width:" + (width + 2) + "px";
    }
}