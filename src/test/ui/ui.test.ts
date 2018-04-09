import { expect } from 'chai';
import 'mocha';
import { Ui } from '../../ts/tanks/ui/ui';
import { SepiaTheme } from '../../ts/tanks/themes/sepia';
import { Color } from '../../ts/tanks/drawing/color';
import { mockDOM } from '../testutility';


describe('UI', () => {
    mockDOM();
    const uiDom = document.getElementById(Ui.ID_GAME_UI);
    afterEach(() => {
        uiDom.innerHTML = "";
    });
    it('fail finding container element', () => {
        try {
            const ui = new Ui("potatoes", 1024, 1024);
            // fail test on next step
            expect(false).to.be.true;
        } catch (e) {
            // don't have to do anything - if the test reached this point it should pass
        }
    });

    it('construct heading and body', () => {
        const ui = new Ui(Ui.ID_GAME_UI, 1024, 2024);
        expect(uiDom.children.length).to.eq(2);
        expect(uiDom.style.width).to.eq("1024px");
    });

    it('clear', () => {
        const ui = new Ui(Ui.ID_GAME_UI, 1024, 2024);
        expect(uiDom.children.length).to.eq(2);
        ui.clear();
        // expect not to delete the children elements of the UI
        expect(uiDom.children.length).to.eq(2);
    });
    it('show canvas', () => {
        const ui = new Ui(Ui.ID_GAME_UI, 1024, 2024);
        ui.showCanvas();
        expect(uiDom.style.height).to.eq("0px")
    });
    it('hide canvas', () => {
        const ui = new Ui(Ui.ID_GAME_UI, 1024, 2024);
        ui.showCanvas();
        ui.hideCanvas();
        expect(uiDom.style.height).to.eq("2024px")
    });
    it('set player name', () => {
        const ui = new Ui(Ui.ID_GAME_UI, 1024, 2024);
        ui.setPlayer("apples", new SepiaTheme());
        expect(ui.heading.playerTurn.innerHTML).to.not.be.empty;
    });
    it('show message', () => {
        const ui = new Ui(Ui.ID_GAME_UI, 1024, 2024);
        ui.message("apples", new SepiaTheme());
        expect(ui.heading.message.innerHTML).to.not.be.empty;
    });
    it('change background', () => {
        const ui = new Ui(Ui.ID_GAME_UI, 1024, 2024);
        ui.background(Color.black());
        expect(uiDom.style.backgroundColor).to.eq("rgb(0, 0, 0)");
    });
    it('change text color', () => {
        const ui = new Ui(Ui.ID_GAME_UI, 1024, 2024);
        ui.textColor(Color.black());
        expect(uiDom.style.color).to.eq("rgb(0, 0, 0)");
    });
});