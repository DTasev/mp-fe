export class Settings {
    static readonly ID_GAME_CANVAS = "tanks-canvas";

    static readonly DEFAULT_NUMBER_PLAYERS = 2;
    static readonly DEFAULT_NUMBER_TANKS = 2;
    static readonly IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? true : false;
    static readonly MAX_TANKS = 8;

    // window.location.origin is "null" in the testing environment
    static readonly REMOTE_URL = window.location.origin !== "null" ? window.location.origin + "/tanks/api/maps/" : "http://localhost:8000/tanks/api/maps/";
    // cache duration is 1 day in milliseconds
    static readonly CACHE_DURATION = 8.64e7;
    static readonly MAP_SETUP_WAIT_TIME = 200;

    static readonly DEBUG = !window.location.origin || window.location.origin.includes("localhost") || window.location.origin.includes("127.0.0.1") ? true : false;
    static readonly SCROLLBAR_WIDTH = 17;
    static readonly DEFAULT_THEME = "sepia";
}   