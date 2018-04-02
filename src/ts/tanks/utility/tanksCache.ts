import { TanksMap } from "../gameMap/tanksMap";
import { IMapDetailData } from "../gameMap/dataInterfaces";

export class TanksCache {
    private static KEY_THEME = "theme";

    static get theme(): string {
        return window.localStorage.getItem(this.KEY_THEME) || "sepia";
    }
    static set theme(theme: string) {
        window.localStorage.setItem(this.KEY_THEME, theme.toLowerCase());
    }

    static getMap(id: string): TanksMap {
        return <TanksMap>JSON.parse(window.localStorage.getItem("map" + id));
    }

    static setMap(id: string, data: TanksMap): void {
        window.localStorage.setItem("map" + id, JSON.stringify(data));
    }


}