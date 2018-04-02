import { ITheme } from "../themes/iTheme";
import { IMapDetailData, IObstacleData } from "./dataInterfaces";
import { Obstacle } from "./obstacle";
import { Remote } from "../utility/remote";


export class TanksMap {
    ready = false;

    terrain: Obstacle[];
    id: number;
    name: string;
    creator: string;
    created: string;


    /**
     * Loads the map, from cache, if present and up-to-date, else from remote
     */
    constructor(id: string) {
        // TODO download the data remotely, or load from cache
        // currently just load the example map
        Remote.mapDetail(id, (map: IMapDetailData) => {
            debugger
            this.name = map.name;
            this.creator = map.creator;
            this.created = map.created;

            this.terrain = [];
            for (const obstacleDescription of <IObstacleData[]>JSON.parse(map.terrain)) {
                this.terrain.push(new Obstacle(obstacleDescription));
            }
            this.ready = true;
        });
    }

    draw(context: CanvasRenderingContext2D, theme: ITheme) {
        const length = this.terrain.length;
        for (const obstacle of this.terrain) {
            obstacle.draw(context, theme);
        }
    }

    /**
     * Cache the obstacle data locally
     */
    cache(): void {
        throw new Error("Not implemented");
    }
}