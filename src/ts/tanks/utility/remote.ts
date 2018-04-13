import { Settings } from '../settings';
import { IMapListData, IMapDetailData } from '../gameMap/dataInterfaces';
import { getCookie } from "../utility/cookies";

interface MapListSuccessCallback {
    (remoteMapData: IMapListData[]): any;
}
interface MapDetailSuccessCallback {
    (remoteMapData: IMapDetailData): any;
}
export class Remote {
    static async available(): Promise<boolean> {
        const request = new XMLHttpRequest();
        request.timeout = 400;
        request.open("GET", Settings.REMOTE_URL, true);
        return new Promise<boolean>((resolve, reject) => {
            request.onreadystatechange = () => {
                if (request.readyState === XMLHttpRequest.DONE) {
                    if (request.status === 200) { // 200 OK
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            };
            request.onerror = () => {
                reject(false);
            }
            request.send(null);
        });
    }
    static mapList(successCallback: MapListSuccessCallback): Promise<boolean> {
        const request = new XMLHttpRequest();
        request.open("GET", Settings.REMOTE_URL, true);
        return new Promise((resolve, reject) => {
            request.onreadystatechange = () => {
                if (request.readyState === XMLHttpRequest.DONE) {
                    if (request.status === 200) { // 200 OK
                        successCallback(JSON.parse(request.responseText));
                        resolve(true);
                    }
                }
            };
            request.send(null);
        });
    }

    static mapDetail(id: string, successCallback: MapDetailSuccessCallback): Promise<boolean> {
        const request = new XMLHttpRequest();
        request.open("GET", Settings.REMOTE_URL + id, true);
        return new Promise((resolve, reject) => {
            request.onreadystatechange = () => {
                if (request.readyState === XMLHttpRequest.DONE) {
                    if (request.status === 200) { // 200 OK
                        successCallback(JSON.parse(request.responseText));
                        resolve(true);
                    }
                }
            };
            request.send(null);
        });
    }

    static sendMap(username: string, password: string, data: string, successCallback: Function, failureCallback: Function) {
        const request = new XMLHttpRequest();

        let auth_basic = window.btoa(username + ":" + password);
        request.open("POST", Settings.REMOTE_URL, true);
        request.setRequestHeader("Authorization", "Basic " + auth_basic);
        request.setRequestHeader("Content-Type", "application/json");
        request.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));

        request.onreadystatechange = () => {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 201) { // 201 CREATED
                    successCallback();
                } else {
                    failureCallback(request.responseText);
                }
            }
        };
        request.send(data);
    }
}