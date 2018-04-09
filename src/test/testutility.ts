/**
 * Not a TEST file! Just contains utility functions shared among the tests.
 */
import { Ui } from "../ts/tanks/ui/ui";

/**
 * Adds all the elements necessary to be inside the DOM
 */
export function mockDOM() {
    const uiDom = document.createElement("div");
    uiDom.id = Ui.ID_GAME_UI;
    document.body.appendChild(uiDom);
}