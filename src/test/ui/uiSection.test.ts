import { expect } from 'chai';
import 'mocha';
import { UiSection } from '../../ts/tanks/ui/uiSection';


describe('UI Section', () => {
    it('add element', () => {
        const div = document.createElement("div");
        const section = new UiSection(div);
        const button = document.createElement("button");
        section.add(button);
        expect(section.htmlElement().children.length).to.eq(1);
    });
    it('clear all HTML', () => {
        const div = document.createElement("div");
        const section = new UiSection(div);
        const button = document.createElement("button");
        section.add(button);
        section.clear();
        expect(section.innerHTML).to.eq("&nbsp;");
    });
    it('return it\'s HTML element', () => {
        const div = document.createElement("div");
        const section = new UiSection(div);
        const button = document.createElement("button");
        section.add(button);
        const htmlElement = section.htmlElement()
        expect(htmlElement.children.length).to.eq(1);
    });
});