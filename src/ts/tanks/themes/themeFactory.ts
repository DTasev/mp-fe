import { DarkTheme } from "./dark";
import { ITheme } from "./iTheme";
import { SimpleTheme } from "./simple";
import { SepiaTheme } from "./sepia";

export class ThemeFactory {
    static create(theme: string): ITheme {
        switch (theme.toLowerCase()) {
            case "simple":
                return new SimpleTheme();
            case "dark":
                return new DarkTheme();
            case "sepia":
                return new SepiaTheme();
        }
    }
}
