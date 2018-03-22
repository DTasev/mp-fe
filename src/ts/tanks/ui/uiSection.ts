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
    html(): HTMLElement {
        return this.element;
    }
    innerHTML(content: string) {
        this.element.innerHTML = content;
    }
}