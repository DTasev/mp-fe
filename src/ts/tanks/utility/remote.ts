import { Settings } from '../settings';
import { IMapListData } from '../gameMap/dataInterfaces';

export class Remote {
    static mapList(successCallback: Function, failureCallback: Function) {
        const request = new XMLHttpRequest();
        request.open("GET", Settings.REMOTE_URL, true);
        request.onreadystatechange = () => {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) { // 200 OK
                    successCallback(JSON.parse(request.responseText));
                }
            }
        };
        request.onerror = () => {
            failureCallback();
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
    static sendMap(username: string, password: string, data: string, successCallback: Function, failureCallback: Function) {
        const request = new XMLHttpRequest();

        let auth_basic = window.btoa(username + ":" + password);
        request.open("POST", Settings.REMOTE_URL, true);
        request.setRequestHeader("Authorization", "Basic " + auth_basic);
        request.setRequestHeader("Content-Type", "application/json");

        request.onreadystatechange = () => {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 201) { // 201 CREATED
                    successCallback(JSON.parse(request.responseText));
                } else {
                    failureCallback(request.responseText);
                }
            }
        };
        request.send(data);
    }
}