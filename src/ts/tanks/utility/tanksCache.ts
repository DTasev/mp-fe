import { TanksMap } from "../gameMap/tanksMap";
import { IMapDetailData } from "../gameMap/dataInterfaces";

export class TanksCache {
    private static KEY_THEME = "theme";
    private static KEY_AVAILABLE_MAPS = "availablemaps";

    static get theme(): string {
        return window.localStorage.getItem(this.KEY_THEME) || "sepia";
    }
    static set theme(theme: string) {
        window.localStorage.setItem(this.KEY_THEME, theme.toLowerCase());
    }

    static availableMaps(): string[] {
        return window.localStorage.getItem(this.KEY_AVAILABLE_MAPS).split(",");
    }
    static getMap(id: string): TanksMap {
        const mapid = id.includes("map") ? id : "map" + id;
        return <TanksMap>JSON.parse(window.localStorage.getItem(mapid));
    }

    static setMap(id: string, data: TanksMap): void {
        const mapid = id.includes("map") ? id : "map" + id;
        window.localStorage.setItem(mapid, JSON.stringify(data));
        const avail = window.localStorage.getItem(this.KEY_AVAILABLE_MAPS);
        if (!avail) {
            window.localStorage.setItem(this.KEY_AVAILABLE_MAPS, mapid);
        } else if (!avail.includes(mapid)) {
            window.localStorage.setItem(this.KEY_AVAILABLE_MAPS, avail + "," + mapid);
        }
    }


}