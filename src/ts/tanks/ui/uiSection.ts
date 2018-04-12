export class UiSection {
    private readonly element: HTMLElement;

    constructor(elem: HTMLElement) {
        this.element = elem;
    }

    add(elem: HTMLElement) {
        // if the current element is being held empty with a whitespace 
        // character, then remove it and append the new element. The whitespace
        // needs to be removed to ensure the child element is placed correctly
        if (this.element.innerHTML === "&nbsp;") {
            this.element.innerHTML = "";
        }
        this.element.appendChild(elem);
    }

    /**
     * Clear all HTML contained in the element.
     */
    clear() {
        this.element.innerHTML = "";
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