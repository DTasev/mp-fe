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

    static red(): string {
        return "rgba(" + 255 + "," + 0 + "," + 0 + "," + 1.0 + ")";
    }
    static green(): string {

        return "rgba(" + 0 + "," + 255 + "," + 0 + "," + 1.0 + ")";
    }
    static blue(): string {
        return "rgba(" + 0 + "," + 0 + "," + 255 + "," + 1.0 + ")";
    }
    static black(): string {
        return "rgba(" + 0 + "," + 0 + "," + 0 + "," + 1.0 + ")";
    }
    static white(): string {
        return "rgba(" + 255 + "," + 255 + "," + 255 + "," + 1.0 + ")";

    }
    static yellow(): string {
        return "rgba(" + 255 + "," + 255 + "," + 0 + "," + 1.0 + ")";

    }
    static gray(): string {

        return "rgba(" + 128 + "," + 128 + "," + 128 + "," + 1.0 + ")";
    }

}