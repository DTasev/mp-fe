interface IUiSection {
    add(elem: HTMLElement);
    clear();
}

export class UiSection implements IUiSection {
    private readonly element: HTMLElement;

    constructor(elem: HTMLElement) {
        this.element = elem;
    }

    add(elem: HTMLElement) {
        if (this.element.innerHTML === "&nbsp;") {
            this.element.innerHTML = "";
        }
        this.element.appendChild(elem);
    }
    clear() {
        this.element.innerHTML = "&nbsp;";
    }

    htmlElement(): HTMLElement {
        return this.element;
    }

    public get style(): CSSStyleDeclaration {
        return this.element.style;
    }

    public get innerHTML(): string {
        return this.element.innerHTML;
    }
    public set innerHTML(v: string) {
        this.element.innerHTML = v;
    }



}