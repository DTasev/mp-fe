export class Settings {
    static readonly ID_GAME_CANVAS = "tanks-canvas";

    static readonly DEFAULT_NUMBER_PLAYERS = 2;
    static readonly DEFAULT_NUMBER_TANKS = 1;
    static readonly IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? true : false;
    static readonly MAX_TANKS = 8;
    static readonly REMOTE_URL = "http://127.0.0.1:8000/tanksapi/maps"
    // duration is 1 day in milliseconds
    static readonly CACHE_DURATION = 8.64e7;
    static readonly MAP_SETUP_WAIT_TIME = 200;

    static readonly DEBUG = true;
    static readonly SCROLLBAR_WIDTH = 17;

}