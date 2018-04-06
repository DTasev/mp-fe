import { S } from "../utility/stringFormat";

export class Color {

    private red: number;
    private green: number;
    private blue: number;
    private alpha: number;

    constructor(red: number, green: number, blue: number, alpha = 1.0) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }

    rgba(alpha = this.alpha): string {
        return S.format("rgba(%s,%s,%s,%s)", this.red, this.green, this.blue, alpha);
    }

    private componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    hex(): string {
        return "#" + this.componentToHex(this.red) + this.componentToHex(this.green) + this.componentToHex(this.blue);
    }

    static red(alpha = 1.0): Color {
        return new Color(255, 0, 0, alpha);
    }
    static green(alpha = 1.0): Color {

        return new Color(0, 255, 0, alpha);
    }
    static blue(alpha = 1.0): Color {
        return new Color(0, 0, 255, alpha);
    }
    static black(alpha = 1.0): Color {
        return new Color(0, 0, 0, alpha);
    }
    static white(alpha = 1.0): Color {
        return new Color(255, 255, 255, alpha);
    }
    static yellow(alpha = 1.0): Color {
        return new Color(255, 255, 0, alpha);
    }
    static gray(alpha = 1.0): Color {
        return new Color(128, 128, 128, alpha);
    }
    static pink(alpha = 1.0): Color {
        return new Color(255, 102, 203, alpha);
    }
    static sand(alpha = 1.0): Color {
        return new Color(253, 245, 230, alpha);
    }
    static lilac(alpha = 1.0): Color {
        return new Color(153, 102, 255, alpha);
    }
    static lightblue(alpha = 1.0) {
        return new Color(0, 204, 255, alpha);
    }
    static orange(alpha = 1.0) {
        return new Color(245, 130, 48, alpha);
    }
    static purple(alpha = 1.0) {
        return new Color(145, 30, 180, alpha);
    }
    static maroon(alpha = 1.0) {
        return new Color(128, 0, 0, alpha);
    }
    static woodbrown(alpha = 1.0) {
        return new Color(110, 71, 11, alpha);
    }
    static darkbrown(alpha = 1.0) {
        return new Color(102, 51, 0, alpha);
    }
    static c(red: number, green: number, blue: number, alpha = 1.0) {
        return new Color(red, green, blue, alpha);
    }
    static transparent(): Color {
        return new Color(0, 0, 0, 0);
    }
    static fromHex(hex: string, alpha = 1.0): Color {
        return new Color(parseInt(hex.substr(1, 2), 16), parseInt(hex.substr(3, 2), 16), parseInt(hex.substr(5), 16), alpha);
    }

}