// Imports module-only classes
/// <reference path="dataInterfaces.ts" />

import { Point } from "../utility/point";
import { Draw } from "../drawing/draw";
import { Color } from "../drawing/color";
import { ITheme } from "../gameThemes/iTheme";
import { Obstacle } from "./obstacle";

const exampleMap = {
    "name": "Map",
    "creator": "DT",
    "createdDate": "2018-03-13T02:00:00Z",
    "updatedDate": "2018-03-13T03:00:00Z",
    "downloadedDate": "2018-03-14T05:00:00Z",
    "terrain": [
        {
            "type": "solid", // or liquid, etc
            // will be processed two at a time forming a new point
            "data": [
                500, 500,
                550, 550,
                500, 700,
                450, 650,
                500, 500 // TODO remove this point, it should be made implicit by connecting data[-1] to data[0]
            ], // etc, must be even number of points or data is corrupted!
            "centerX": 500,
            "centerY": 600
        }
    ]
};
export class Map {
    obstacles: Obstacle[];
    id: number;
    name: string;
    creator: string;
    createdDate: string;
    updatedDate: string;
    downloadedDate: string;


    /**
     * Loads the map, from cache, if present and up-to-date, else from remote
     */
    constructor(id: string) {
        // TODO download the data remotely, or load from cache
        // currently just load the example map
        const desc = <IMapData>JSON.parse(JSON.stringify(exampleMap));

        this.name = desc.name;
        this.creator = desc.creator;
        this.createdDate = desc.createdDate;
        this.updatedDate = desc.updatedDate;
        this.downloadedDate = desc.downloadedDate;
        this.obstacles = [];
        for (const obstacleDescription of desc.terrain) {
            this.obstacles.push(new Obstacle(obstacleDescription));
        }
    }
    draw(context: CanvasRenderingContext2D, theme: ITheme) {
        const length = this.obstacles.length;
        for (const obstacle of this.obstacles) {
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