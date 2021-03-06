export class Settings {
    static readonly ID_GAME_CANVAS = "tanks-canvas";

    // default number of players, used for the default value of the slider and quick start
    static readonly DEFAULT_NUMBER_PLAYERS = 2;
    // default number of players, used for the default value of the slider and quick start
    static readonly DEFAULT_NUMBER_TANKS = 2;
    static readonly IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? true : false;
    // the maximum number of tanks allowed by the tank slider
    static readonly MAX_TANKS = 8;

    // window.location.origin is "null" in the testing environment
    static readonly REMOTE_URL = window.location.origin !== "null" ? window.location.origin + "/tanks/api/maps/" : "http://localhost:8000/tanks/api/maps/";
    // cache duration is 1 day in milliseconds
    static readonly CACHE_DURATION = 8.64e7;

    static readonly DEBUG = !window.location.origin || window.location.origin.includes("localhost") || window.location.origin.includes("127.0.0.1") ? true : false;
    static readonly SCROLLBAR_WIDTH = 17;
    static readonly DEFAULT_THEME = "sepia";

    static readonly DEFAULT_NUMBER_PARTICLES = Settings.IS_MOBILE ? 12 : 24;
    static readonly SHOT_CACHE_SIZE = 10;
}   