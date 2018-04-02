import * as Settings from '../settings';
import { IMapListData } from '../gameMap/dataInterfaces';

export class Remote {
    static mapList(successCallback: Function) {
        const request = new XMLHttpRequest();
        request.open("GET", Settings.REMOTE_URL, true);
        request.onreadystatechange = () => {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) { // 200 OK
                    successCallback(JSON.parse(request.responseText));
                } else {
                    // provide default map
                    console.warn("Remote not reached. Using cached maps.");
                }
            }
        };
        request.send(null);
    }
    static mapDetail(id: string, successCallback: Function) {
        const request = new XMLHttpRequest();
        request.open("GET", Settings.REMOTE_URL + "/" + id, true);
        request.onreadystatechange = () => {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) { // 200 OK
                    successCallback(JSON.parse(request.responseText));
                } else {
                    // provide default map
                    console.warn("Remote not reached. Using cached maps.");
                }
            }
        };
        request.send(null);
    }
}