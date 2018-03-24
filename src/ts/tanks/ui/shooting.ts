import { J2H } from "../json2html";
import { ITheme } from "../themes/iTheme";

export class ShootingUi {
    static button_skipTurn(theme: ITheme): HTMLButtonElement {
        return J2H.parse({
            "button": {
                "style": "width:100%",
                "className": "w3-button w3-border " + theme.ui.skipTurnButtonClass(),
                "children": {
                    "i": {
                        "className": "fas fa-fast-forward"
                    }
                }
            }
        });
    }
}
