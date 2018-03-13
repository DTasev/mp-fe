import { J2H } from "../json2html";

export class CommonUi {
    /** Creates the home button */
    static button_home(): HTMLButtonElement {
        return J2H.parse({
            "button": {
                "style": "width:100%",
                "className": "w3-button w3-border w3-dark-gray",
                "children": {
                    "i": {
                        "className": "fas fa-home"
                    }
                }
            }
        });
    }
}