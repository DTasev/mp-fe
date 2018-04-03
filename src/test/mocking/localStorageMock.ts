export class LocalStorageMock implements Storage {
    dict = {
        "map1": '{"ready":true,"name":"Swamp","creator":1,"created":"2018-03-30T13:52:25.302672Z","terrain":[{"id":0,"type":"water","center":{"x":1234.423076923077,"y":525.2307692307693},"points":[{"x":1191,"y":168}]}],"cached":1522687850211}'
    };

    [key: string]: any;
    length: number;
    clear(): void {
        throw new Error("Method not implemented.");
    }
    getItem(key: string): string {
        const d = this.dict[key];
        return d;
    }
    key(index: number): string {
        throw new Error("Method not implemented.");
    }
    removeItem(key: string): void {
        throw new Error("Method not implemented.");
    }
    setItem(key: string, value: string): void {
        throw new Error("Method not implemented.");
    }
}