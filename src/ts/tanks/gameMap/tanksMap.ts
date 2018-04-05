import { ITheme } from "../themes/iTheme";
import { IMapDetailData, IObstacleData } from "./dataInterfaces";
import { Obstacle } from "./obstacle";
import { Remote } from "../utility/remote";
import { TanksCache } from "../utility/tanksCache";
import { Settings } from '../settings';


export class TanksMap {
    ready: Promise<XMLHttpRequest>;

    terrain: Obstacle[];
    id: string;
    name: string;
    url: URL;
    thumbnail_url: URL;
    creator: string;
    created: string;
    cached: number;


    /**
     * Loads the map, from cache, if present and up-to-date, else from remote
     */
    constructor(id: string) {
        id = id + "";

        // special case to stop the map from looking for data in the cache or from remote
        if (id === "-1") {
            return;
        }

        // force ID to be a string
        // try loading the map from cache, if it has been downloaded previously
        const cachedMap = TanksCache.getMap(id);
        // checks that there is a cached version of the map, that has not expired
        if (cachedMap && Date.now() - cachedMap.cached < Settings.CACHE_DURATION) {
            console.log("Loading map from cache.");
            this.ready = new Promise((resolve, reject) => { this.loadMapDetails(cachedMap); resolve(); });
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

    private loadMapDetails(cachedMap: TanksMap | IMapDetailData) {
        this.id = cachedMap.id;
        this.name = cachedMap.name;
        this.url = cachedMap.url;
        this.thumbnail_url = cachedMap.thumbnail_url;
        this.creator = cachedMap.creator;
        this.created = cachedMap.created;
        this.terrain = [];
        if (typeof cachedMap.terrain === "string") {
            cachedMap.terrain = JSON.parse(cachedMap.terrain);
        }
        for (const obstacleDescription of <IObstacleData[]>cachedMap.terrain) {
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
        map.url = new URL("https://localhost/test/url");
        map.thumbnail_url = new URL("https://localhost/test/url");
        map.creator = "1";
        map.created = Date.now() + "";
        map.terrain = [];
        return map;
    }
}