import { J2H } from "../json2html";

export class ShootingUi {
    static button_skipTurn(): HTMLButtonElement {
        return J2H.parse({
            "button": {
                "style": "width:100%",
                "className": "w3-button w3-border",
                "children": {
                    "i": {
                        "className": "fas fa-fast-forward"
                    }
                }
            }
        });
    }
}
