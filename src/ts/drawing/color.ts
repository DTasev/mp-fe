export class Color {
    private red: number;
    private green: number;
    private blue: number;
    private alpha: number;

    constructor(red: number, green: number, blue: number, alpha: number = 1.0) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }

    toRGBA(alpha?: number): string {
        if (alpha) {
            return "rgba(" + this.red + "," + this.green + "," + this.blue + "," + alpha + ");";
        } else {
            return "rgba(" + this.red + "," + this.green + "," + this.blue + "," + this.alpha + ");";

        }
    }

    static color = 0;
    static next() {
        if (Color.color == 0) {
            Color.color++;
            return Color.red();
        } else if (Color.color == 1) {
            Color.color++;
            return Color.blue();
        } else if (Color.color == 2) {
            Color.color++;
            return Color.green();
        } else if (Color.color == 3) {
            Color.color++;
            return Color.yellow();
        }
        throw new Error("You've used all the available colours!");
    }

    static red(alpha: number = 1.0): Color {
        return new Color(255, 0, 0, alpha);
    }
    static green(alpha: number = 1.0): Color {

        return new Color(0, 255, 0, alpha);
    }
    static blue(alpha: number = 1.0): Color {
        return new Color(0, 0, 255, alpha);
    }
    static black(alpha: number = 1.0): Color {
        return new Color(0, 0, 0, alpha);
    }
    static white(alpha: number = 1.0): Color {
        return new Color(255, 255, 255, alpha);
    }
    static yellow(alpha: number = 1.0): Color {
        return new Color(255, 255, 0, alpha);
    }
    static gray(alpha: number = 1.0): Color {
        return new Color(128, 128, 128, alpha);
    }
    static pink(alpha: number = 1.0): Color {
        return new Color(255, 102, 203, alpha);
    }
    static c(red: number, green: number, blue: number, alpha: number = 1.0) {
        return new Color(red, green, blue, alpha);
    }
}