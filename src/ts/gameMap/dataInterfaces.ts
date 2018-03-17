/**
 * These classes help TypeScript to know the fields present in the JSON data for obstacles. 
 * This allows accessing the data as properties (e.g. `obstacleData.type` and `obstacleData.data`)
 * This does NOT do runtime type checking - the remote JSON data could be corrupt. 
 * Any additional fields will still be accessible with array access (e.g. `obstacleData["newKeyNameHere"]`)
 */

export interface IObstacleData {
    type: string;
    centerX: number;
    centerY: number;
    data: number[];
}

export interface IMapData {
    name: string;
    creator: string;
    createdDate: string;
    updatedDate: string;
    downloadedDate: string;
    terrain: IObstacleData[]
}
