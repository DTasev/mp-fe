export class Color {
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

    static red(alpha: number = 1.0): string {
        return "rgba(" + 255 + "," + 0 + "," + 0 + "," + alpha + ")";
    }
    static green(alpha: number = 1.0): string {

        return "rgba(" + 0 + "," + 255 + "," + 0 + "," + alpha + ")";
    }
    static blue(alpha: number = 1.0): string {
        return "rgba(" + 0 + "," + 0 + "," + 255 + "," + alpha + ")";
    }
    static black(alpha: number = 1.0): string {
        return "rgba(" + 0 + "," + 0 + "," + 0 + "," + alpha + ")";
    }
    static white(alpha: number = 1.0): string {
        return "rgba(" + 255 + "," + 255 + "," + 255 + "," + alpha + ")";

    }
    static yellow(alpha: number = 1.0): string {
        return "rgba(" + 255 + "," + 255 + "," + 0 + "," + alpha + ")";

    }
    static gray(alpha: number = 1.0): string {
        return "rgba(" + 128 + "," + 128 + "," + 128 + "," + alpha + ")";
    }
    static pink(alpha: number = 1.0): string {
        return "rgba(" + 255 + "," + 102 + "," + 203 + "," + alpha + ")";
    }

    static c(red: number, green: number, blue: Number, alpha: number = 1.0) {
        return "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
    }

}