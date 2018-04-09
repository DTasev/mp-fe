import { expect } from 'chai';
import 'mocha';
import { UiBody } from '../../ts/tanks/ui/uiBody';


describe('UI Body', () => {
    it('add correct columns', () => {
        const div = document.createElement("div");
        const b = new UiBody(div);
        const [left, middle, right] = b.addColumns();
        expect(left).to.not.be.null;
        expect(middle).to.not.be.null;
        expect(right).to.not.be.null;

        const checkClasses = (elem: HTMLDivElement) => {
            expect(elem.classList.contains("w3-col")).to.be.true;
            expect(elem.classList.contains("w3-hide-small")).to.be.true;
            expect(elem.classList.contains("w3-hide-medium")).to.be.true;
            expect(elem.classList.contains("l2")).to.be.true;
            expect(elem.innerHTML).to.eq("&nbsp;");
        };

        checkClasses(left);
        checkClasses(right);
        expect(middle.classList.contains("s12")).to.be.true;
        expect(middle.classList.contains("m12")).to.be.true;
        expect(middle.classList.contains("l8")).to.be.true;
    });
});