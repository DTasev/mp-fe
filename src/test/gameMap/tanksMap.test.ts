import { expect } from 'chai';
import 'mocha';
import { TanksMap } from '../../ts/tanks/gameMap/tanksMap';
import { TanksCache } from '../../ts/tanks/utility/tanksCache';
import { LocalStorageMock } from '../mocking/localStorageMock';
import { Mock } from '../mocking/mock';
import { Remote } from '../../ts/tanks/utility/remote';
import { CanvasContextMock } from '../mocking/canvasContextMock';
import { CanvasMock } from '../mocking/canvasMock';
import { SepiaTheme } from '../../ts/tanks/themes/sepia';
import { Obstacle } from '../../ts/tanks/gameMap/obstacle';


describe('Tanks Map', () => {
    (<any>window.localStorage) = new LocalStorageMock();

    it('should stop construction for id == -1', () => {
        const map = new TanksMap("-1");
        expect(map.terrain).to.be.undefined;
        expect(map.id).to.be.undefined;
        expect(map.name).to.be.undefined;
        expect(map.url).to.be.undefined;
        expect(map.thumbnail_url).to.be.undefined;
        expect(map.creator).to.be.undefined;
        expect(map.created).to.be.undefined;
        expect(map.cached).to.be.undefined;
    });
    it('should load map data from cache', () => {
        const mapToStore = TanksMap.premadeMap();
        TanksCache.setMap("1", mapToStore)
        const map = new TanksMap("1");

        // return async method to mocha - this will test it correctly
        return map.ready.then(() => {
            expect(map.terrain.length).to.eq(mapToStore.terrain.length);
            expect(map.id).to.eq(mapToStore.id);
            expect(map.name).to.eq(mapToStore.name);
            expect(map.url).to.eq(mapToStore.url);
            expect(map.thumbnail_url).to.eq(mapToStore.thumbnail_url);
            expect(map.creator).to.eq(mapToStore.creator);
            expect(map.created).to.eq(mapToStore.created);
            // the cached value is not loaded back
            expect(map.cached).to.be.undefined;
        });
    });
    it('should load map data from remote', () => {
        const mock_Remote_mapDetail = new Mock(Remote, Remote.mapDetail, "apples");
        const map = new TanksMap("not-found");

        expect(map.ready).to.eq("apples");
        mock_Remote_mapDetail.expect_called.once();
        mock_Remote_mapDetail.restore();
    });
    it('should draw itself', () => {
        const mock_canvas: CanvasMock = new CanvasMock();
        const mock_context: CanvasContextMock = mock_canvas.getContext();

        const map = TanksMap.premadeMap();
        map.terrain.push(Obstacle.premadeObstacle());
        map.draw(mock_context as any, new SepiaTheme());
        mock_context.mock_beginPath.expect_called.once();
        mock_context.mock_closePath.expect_called.once();
        mock_context.mock_stroke.expect_called.once();
    });
    it('should be able to create an empty premade map', () => {
        const map = TanksMap.premadeMap();
        expect(map.terrain).to.not.be.undefined;
        expect(map.id).to.not.be.undefined;
        expect(map.name).to.not.be.undefined;
        expect(map.url).to.not.be.undefined;
        expect(map.thumbnail_url).to.not.be.undefined;
        expect(map.creator).to.not.be.undefined;
        expect(map.created).to.not.be.undefined;
        expect(map.cached).to.not.be.undefined;
    })
});


// Run integration tests with API only if the local server is running
Remote.available().catch((reason) => {
    console.warn(reason + " Not running Tanks Map integration tests.");
}).then(() => {
    (<any>window.localStorage) = new LocalStorageMock();
    describe('Tanks Map Integration Tests', () => {
        it('retrieve map', () => {
            const mapId = "1";

            window.localStorage.clear();
            const map = new TanksMap(mapId);
            map.ready.then(() => {
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
    });
});