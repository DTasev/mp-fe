/**
 * These classes help TypeScript to know the fields present in the JSON data for obstacles. 
 * This allows accessing the data as properties (e.g. `obstacleData.type` and `obstacleData.data`)
 * This does NOT do runtime type checking - the remote JSON data could be corrupt. 
 * Any additional fields will still be accessible with array access (e.g. `obstacleData["newKeyNameHere"]`)
 */

export interface ITerrainData {
    x: number;
    y: number;
}
export interface IObstacleData {
    id: number;
    type: string;
    centerX: number;
    centerY: number;
    points: ITerrainData[];
}

/**
 * Data interface exported when quering for the details of a specific map.
 * It contains all of the terrain.
 */
export interface IMapDetailData {
    id: number;
    name: string;
    creator: string;
    created: string;
    url: URL;
    thumbnail: URL;
    terrain: IObstacleData[];
}

/**
 * Data interface exported when quering for all available maps.
 */
export interface IMapListData {
    id: number;
    name: string;
    creator: string;
    created: string;
    url: URL;
    thumbnail: URL;
}
