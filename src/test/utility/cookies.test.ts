import { expect } from 'chai';
import 'mocha';
import { getCookie } from '../../ts/tanks/utility/cookies';


describe('Cookies', () => {
    before(() => {
        document.cookie = "chocolate=eoqwhdjwalkdjlaw;";
    })
    it('get existing cookie', () => {
        expect(getCookie("chocolate")).to.eq("eoqwhdjwalkdjlaw");
    });
    it('return null for not-existing cookie', () => {
        expect(getCookie("appels")).to.be.null;
    });
});