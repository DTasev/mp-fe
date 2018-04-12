import { expect } from 'chai';
import 'mocha';
import { UiHeading } from '../../ts/tanks/ui/uiHeading';
import { Color } from '../../ts/tanks/drawing/color';
import { Viewport } from '../../ts/tanks/gameMap/viewport';
import { Player } from '../../ts/tanks/objects/player';
import { DarkTheme } from '../../ts/tanks/themes/dark';
import { Settings } from '../../ts/tanks/settings';


describe('UI Heading', () => {
    it('construct sections', () => {
        const div = document.createElement("div");
        const heading = new UiHeading(div);
        expect(div.children.length).to.eq(4);
    });
    it('change background', () => {
        const div = document.createElement("div");
        const heading = new UiHeading(div);
        heading.background(Color.black());
        expect(div.style.backgroundColor).to.eq('rgb(0, 0, 0)');
    });
    it('change text color', () => {
        const div = document.createElement("div");
        const heading = new UiHeading(div);
        heading.textColor(Color.black());
        expect(div.style.color).to.eq('rgb(0, 0, 0)');
    });
    it('add home', () => {
        const div = document.createElement("div");
        const heading = new UiHeading(div);
        // on mobile no home button is added
        (<any>Settings)["IS_MOBILE"] = true;
        heading.addHome(new Viewport(1, 1), Player.premadePlayer(), new DarkTheme());
        expect(div.children[0].children.length).to.eq(0);

        (<any>Settings)["IS_MOBILE"] = false;
        heading.addHome(new Viewport(1, 1), Player.premadePlayer(), new DarkTheme());
        expect(div.children[0].children.length).to.eq(1);
    });
    it('clear', () => {
        const div = document.createElement("div");
        const heading = new UiHeading(div);
        heading.addHome(new Viewport(1, 1), Player.premadePlayer(), new DarkTheme());
        expect(div.children[0].children.length).to.eq(1);
        heading.clear();
        expect(div.children[0].children.length).to.eq(0);
    });
});