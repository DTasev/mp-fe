import { ITheme } from "../themes/iTheme";
import { IMapDetailData, IObstacleData } from "./dataInterfaces";
import { Obstacle } from "./obstacle";
import { Remote } from "../utility/remote";
import { TanksCache } from "../utility/tanksCache";
import { Settings } from '../settings';


export class TanksMap {
    ready: Promise<boolean>;

    terrain: Obstacle[];
    id: string;
    name: string;
    url: string;
    thumbnail_url: string;
    creator: string;
    created: string;
    cached: number;


    /**
     * Loads the map, from cache, if present and up-to-date, else from remote
     */
    constructor(id: string) {
        id = id + "";

        // special case to stop the map from looking for data in the cache or from remote
        // used for testing purposes
        if (id === "-1") {
            return;
        }

        // force ID to be a string
        // try loading the map from cache, if it has been downloaded previously
        const cachedMap = TanksCache.getMap(id);
        // checks that there is a cached version of the map, that has not expired
        if (cachedMap && Date.now() - cachedMap.cached < Settings.CACHE_DURATION) {
            console.log("Loading map from cache.");
            this.ready = new Promise((resolve, reject) => { this.loadMapDetails(cachedMap); resolve(true); });
        } else {
            console.log("Downloading map from remote.");
            // cache is not present, download from remote
            this.ready = Remote.mapDetail(id, (map: IMapDetailData) => {
                this.loadMapDetails(map);
                this.cached = Date.now();
                TanksCache.setMap(id, this);
            });
        }
    }

    private loadMapDetails(mapData: TanksMap | IMapDetailData) {
        this.id = mapData.id;
        this.name = mapData.name;
        this.url = mapData.url;
        this.thumbnail_url = mapData.thumbnail_url;
        this.creator = mapData.creator;
        this.created = mapData.created;

        this.terrain = [];
        if (typeof mapData.terrain === "string") {
            mapData.terrain = JSON.parse(mapData.terrain);
        }
        for (const obstacleDescription of <IObstacleData[]>mapData.terrain) {
            this.terrain.push(Obstacle.fromData(obstacleDescription));
        }
    }

    draw(context: CanvasRenderingContext2D, theme: ITheme) {
        const length = this.terrain.length;
        for (const obstacle of this.terrain) {
            obstacle.draw(context, theme);
        }
    }
    static premadeMap(): TanksMap {
        const map = new TanksMap("-1");
        map.id = "1";
        map.name = "Test Map";
        map.url = "https://localhost/test/url";
        map.thumbnail_url = "https://localhost/test/url";
        map.creator = "1";
        map.created = Date.now() + "";
        map.cached = Date.now();
        map.terrain = [];
        return map;
    }
}