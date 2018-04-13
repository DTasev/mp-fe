import { expect } from "chai";
import 'mocha';
import { TanksMap } from "../../ts/tanks/gameMap/tanksMap";
import { Remote } from "../../ts/tanks/utility/remote";
import { TanksCache } from "../../ts/tanks/utility/tanksCache";
import { LocalStorageMock } from "../mocking/localStorageMock";
import { IMapListData, IMapDetailData } from "../../ts/tanks/gameMap/dataInterfaces";


describe('Tanks API integration', () => {
    (<any>window.localStorage) = new LocalStorageMock();
    before(async function () {
        const response = await Remote.available();
        if (!response) {
            this.skip();
        }
    })
    it('retrieve map', async function () {
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
    it('retrieve all maps', async function () {
        return Remote.mapList((remoteMapData: IMapListData[]) => {
            expect(remoteMapData.length).to.be.greaterThan(0);
        })
    });
    it('retrieve map detail', async function () {
        return Remote.mapDetail("1", (remoteMapData: IMapDetailData) => {
            expect(remoteMapData.name.length).to.be.greaterThan(0);
            expect(remoteMapData.id).to.eq(1);
        })
    });
});