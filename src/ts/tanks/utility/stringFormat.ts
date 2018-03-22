export class S {
    static format(...a: any[]) {
        return a.reduce((p: string, c: any) => p.replace(/%s/, c));
    }
}