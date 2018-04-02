import { ITheme } from "../themes/iTheme";
import { IMapDetailData, IObstacleData } from "./dataInterfaces";
import { Obstacle } from "./obstacle";
import { Remote } from "../utility/remote";
import { TanksCache } from "../utility/tanksCache";
import * as Settings from '../settings';


export class TanksMap {
    ready = false;

    terrain: Obstacle[];
    id: number;
    name: string;
    creator: string;
    created: string;
    cached: number;


    /**
     * Loads the map, from cache, if present and up-to-date, else from remote
     */
    constructor(id: string) {
        // try loading the map from cache, if it has been downloaded previously
        const cachedMap = TanksCache.getMap(id);
        // checks that there is a cached version of the map, that has not expired
        if (cachedMap && Date.now() - cachedMap.cached < Settings.CACHE_DURATION) {
            console.log("Loading map from cache.");
            this.name = cachedMap.name;
            this.creator = cachedMap.creator;
            this.created = cachedMap.created;
            this.terrain = [];
            for (const obstacleDescription of <IObstacleData[]>(<any>cachedMap.terrain)) {
                this.terrain.push(new Obstacle(obstacleDescription));
            }
            this.ready = true;
        } else {
            console.log("Downloading map from remote.");
            // cache is not present, download from remote
            Remote.mapDetail(id, (map: IMapDetailData) => {
                this.name = map.name;
                this.creator = map.creator;
                this.created = map.created;

                this.terrain = [];
                for (const obstacleDescription of <IObstacleData[]>JSON.parse(map.terrain)) {
                    this.terrain.push(new Obstacle(obstacleDescription));
                }
                this.ready = true;
                this.cached = Date.now();
                TanksCache.setMap(id, this);
            });
        }
    }

    draw(context: CanvasRenderingContext2D, theme: ITheme) {
        const length = this.terrain.length;
        for (const obstacle of this.terrain) {
            obstacle.draw(context, theme);
        }
    }
}