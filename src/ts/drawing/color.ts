export class Color {
    red: number = 0;
    green: number = 0;
    blue: number = 0;
    alpha: number = 1.0;

    toRGB() {
        return "rgb(" + this.red + "," + this.green + "," + this.blue + ")";
    }

    toRGBA() {
        return "rgba(" + this.red + "," + this.green + "," + this.blue + "," + this.alpha + ")";
    }

    set(red: number, green: number, blue: number): void {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    goYellow(): any {
        this.set(255, 255, 0);
    }

    goRed() {
        this.set(255, 0, 0);
    }

    goGreen() {
        this.set(0, 255, 0);
    }

    goBlue() {
        this.set(0, 0, 255);
    }

    goWhite() {
        this.set(255, 255, 255);
    }

    goBlack() {
        this.set(0, 0, 0);
    }

    static color = 0;
    static next() {
        if (Color.color == 0) {
            Color.color++;
            return Color.Red();
        } else if (Color.color == 1) {
            Color.color++;
            return Color.Blue();
        } else if (Color.color == 2) {
            Color.color++;
            return Color.Green();
        } else if (Color.color == 3) {
            Color.color++;
            return Color.Yellow();
        }
        throw new Error("You've used all the available colours!");
    }

    static Red(): Color {
        const c = new Color();
        c.goRed();
        return c;
    }
    static Green(): Color {
        const c = new Color();
        c.goGreen();
        return c;
    }
    static Blue(): Color {
        const c = new Color();
        c.goBlue();
        return c;
    }
    static Black(): Color {
        const c = new Color();
        c.goBlack();
        return c;
    }
    static White(): Color {
        const c = new Color();
        c.goWhite();
        return c;
    }
    static Yellow(): Color {
        const c = new Color();
        c.goYellow();
        return c;
    }

}