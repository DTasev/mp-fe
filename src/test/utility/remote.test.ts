import { expect } from "chai";
import 'mocha';
import { TanksMap } from "../../ts/tanks/gameMap/tanksMap";
import { Remote } from "../../ts/tanks/utility/remote";
import { TanksCache } from "../../ts/tanks/utility/tanksCache";
import { LocalStorageMock } from "../mocking/localStorageMock";
import { IMapListData } from "../../ts/tanks/gameMap/dataInterfaces";


describe('Tanks API integration', () => {
    (<any>window.localStorage) = new LocalStorageMock();
    before(async function () {
        const response = await Remote.available();
        if (!response) {
            this.skip();
        }
    })
    it('retrieve map', function () {
        const mapId = "1";

        window.localStorage.clear();
        const map = new TanksMap(mapId);
        return map.ready.then(() => {
            expect(map.terrain).to.not.be.undefined;
            expect(map.id).to.eq(1);
            expect(map.name).to.not.be.undefined;
            expect(map.url).to.eq("http://localhost:8000/tanks/api/maps/1/");
            expect(map.thumbnail_url).to.not.be.undefined;
            expect(map.creator).to.not.be.undefined;
            expect(map.created).to.not.be.undefined;
            expect(map.cached).to.not.be.undefined;

            expect(TanksCache.getMap(mapId)).to.not.be.undefined;
        });
    });
    it('retrieve all maps', function () {
        Remote.mapList((remoteMapData: IMapListData[]) => {
            expect(remoteMapData.length).to.be.greaterThan(0);
        })
    });
});