import { expect } from 'chai';
import 'mocha';
import { Color } from '../../ts/tanks/drawing/color';


describe('Color', () => {
    it('to rgba', () => {
        const c = new Color(1, 1, 1);
        expect(c.rgba()).to.eq("rgba(1,1,1,1)");

        const c1 = new Color(1, 2, 3);
        expect(c1.rgba()).to.eq("rgba(1,2,3,1)");

        const c2 = new Color(42, 42, 42);
        expect(c2.rgba(0.33)).to.eq("rgba(42,42,42,0.33)");
    });
    it('to hex', () => {
        const c = new Color(0, 0, 0);
        expect(c.hex()).to.eq("#000000");

        const c1 = new Color(255, 255, 255);
        expect(c1.hex()).to.eq("#ffffff");

        const c2 = new Color(128, 128, 128);
        expect(c2.hex()).to.eq("#808080");
    });
    it('from hex', () => {
        const c = Color.fromHex("#000000");
        expect(c.hex()).to.eq("#000000");

        const c1 = Color.fromHex("#ffffff");
        expect(c1.hex()).to.eq("#ffffff");

        const c2 = Color.fromHex("#808080");
        expect(c2.hex()).to.eq("#808080");
    })
});