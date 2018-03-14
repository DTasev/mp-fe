import { J2H } from "../json2html";
import { ITheme } from "../gameThemes/iTheme";

export class MovementUi {
    static button_goToShooting(theme: ITheme): HTMLButtonElement {
        return J2H.parse({
            "button": {
                "style": "width:100%",
                "className": "w3-button w3-border " + theme.skipShootingButtonClass(),
                "children": {
                    "i": {
                        "className": "fas fa-rocket"
                    }
                }
            }
        });
    }
}