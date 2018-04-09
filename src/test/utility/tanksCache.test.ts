import { expect } from 'chai';
import 'mocha';
import { TanksCache } from '../../ts/tanks/utility/tanksCache';
import { TanksMap } from '../../ts/tanks/gameMap/tanksMap';
import { LocalStorageMock } from '../mocking/localStorageMock';


describe('Tanks Window Cache', () => {
    (<any>window.localStorage) = new LocalStorageMock();
    it('cache theme', () => {
        TanksCache.theme = "apples";
        expect(TanksCache.theme).to.eq("apples");
    });
    it('get/set maps', () => {
        TanksCache.setMap("1", TanksMap.premadeMap());
        TanksCache.setMap("2", TanksMap.premadeMap());
        TanksCache.setMap("3", TanksMap.premadeMap());

        expect(TanksCache.getMap("1")).to.not.be.null;
        expect(TanksCache.getMap("2")).to.not.be.null;
        expect(TanksCache.getMap("3")).to.not.be.null;
    })
    it('list available maps', () => {
        TanksCache.setMap("1", TanksMap.premadeMap());
        TanksCache.setMap("2", TanksMap.premadeMap());
        TanksCache.setMap("3", TanksMap.premadeMap());
        const availableMaps = TanksCache.availableMaps();
        expect(availableMaps.length).to.eq(3);
        expect(availableMaps[0]).to.eq("map1");
        expect(availableMaps[1]).to.eq("map2");
        expect(availableMaps[2]).to.eq("map3");
    })
});