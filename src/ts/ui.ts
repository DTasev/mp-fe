import { J2H } from "./json2html";
interface IUiSection {
    add(elem: HTMLElement);
    clear();
}

class UiSection implements IUiSection {
    private readonly parent: HTMLElement;

    constructor(elem: HTMLElement) {
        this.parent = elem;
    }

    add(elem: HTMLElement) {
        if (this.parent.innerHTML === "&nbsp;") {
            this.parent.innerHTML = "";
        }
        this.parent.appendChild(elem);
    }
    clear() {
        this.parent.innerHTML = "&nbsp;";
    }
    html(): HTMLElement {
        return this.parent;
    }
}

export class Ui {

    static readonly ID_BUTTON_SKIP_TURN = "tanks-ui-button-skipturn";
    private readonly container: HTMLDivElement;

    readonly left: UiSection;
    readonly middle: UiSection;
    readonly right: UiSection;

    constructor(id: string, width: number) {
        this.container = <HTMLDivElement>document.getElementById(id);
        if (!this.container) {
            throw new Error("The UI DOM element was not found!");
        }

        this.setWidth(width);
        const left = {
            "div": {
                "className": "w3-col s1 m1 l1"
            }
        };
        this.left = new UiSection(J2H.parse(left));

        const middle = {
            "div": {
                "className": "w3-col s10 m10 l10",
                "style": "text-align:center;"
            }
        }
        this.middle = new UiSection(J2H.parse(middle));
        const right = {
            "div": {
                "className": "w3-col s1 m1 l1"
            }
        };
        this.right = new UiSection(J2H.parse(right));

        this.container.appendChild(this.left.html());
        this.container.appendChild(this.middle.html());
        this.container.appendChild(this.right.html());
    }
    setWidth(width: number) {
        // as any ignores the read-only "style" warning, as we need to write the width of the canvas to the width of the UI element
        // the width + 2 removes the small gap left on the right, which is there for an unknown reason
        (this.container as any).style = "width:" + (width + 2) + "px";
    }

    clear() {
        this.left.clear();
        this.middle.clear();
        this.right.clear();
    }

    setPlayer(name) {
        this.middle.add(J2H.parse({
            "b": {
                "textContent": name + "'s turn.",
                "className": "fa-2x"
            }
        }));
    }
    update(e: Event): void {
        this.container.left = window.visualViewport.pageLeft;
        this.container.top = window.visualViewport.pageTop;
    }
}