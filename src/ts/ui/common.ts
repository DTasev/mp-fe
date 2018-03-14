import { J2H } from "../json2html";
import { ITheme } from "../gameThemes/iTheme";

export class CommonUi {
    /** Creates the home button */
    static button_home(theme: ITheme): HTMLButtonElement {
        return J2H.parse({
            "button": {
                "style": "width:100%",
                "className": "w3-button w3-border " + theme.homeButtonClass(),
                "children": {
                    "i": {
                        "className": "fas fa-home"
                    }
                }
            }
        });
    }
}