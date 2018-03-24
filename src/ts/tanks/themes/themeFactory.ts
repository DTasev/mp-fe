import { DarkTheme } from "./dark";
import { LightTheme } from "./light";
import { SepiaTheme } from "./sepia";
import { ITheme } from "./iTheme";

export class ThemeFactory {
    static create(theme: string): ITheme {
        switch (theme.toLowerCase()) {
            case "light":
                return new LightTheme();
            case "dark":
                return new DarkTheme();
            case "sepia":
                return new SepiaTheme();
        }
    }
}
