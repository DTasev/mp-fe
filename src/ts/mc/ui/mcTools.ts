import { MCObstacleTypes } from "./mcObstacleTypes";
import { Ui } from "../../tanks/ui/ui";
import { J2H } from "../../tanks/json2html";

export class MCPublicTools {
    static selectTool(e: HTMLButtonElement) {
        for (const child of e.parentElement.children) {
            child.classList.remove(MCObstacleTypes.CLASS_SELECTED_OBSTACLE_TYPE);
            child.id = "";
        }
        e.classList.add(MCObstacleTypes.CLASS_SELECTED_OBSTACLE_TYPE);
        e.id = MCTools.ID_SELECTED_TOOL;
    }
}

export enum ToolTypes {
    LINE = "line",
    RECT = "rect"
}
export class MCTools {
    static readonly ID_SELECTED_TOOL = "mc-selected-tool";
    constructor(ui: Ui) {

        const tool_description = {
            div: {
                textContent: "Tool:",
                style: "display:inline-block;",
                children: [{
                    button: {
                        innerHTML: '| Line',
                        className: "w3-button w3-border mc-button " + MCObstacleTypes.CLASS_SELECTED_OBSTACLE_TYPE,
                        "data-tool": ToolTypes.LINE,
                        onclick: "MCPublicTools.selectTool(this)",
                        id: MCTools.ID_SELECTED_TOOL
                    }
                }, {
                    button: {
                        innerHTML: '<i class="far fa-square"></i> Rectangle',
                        className: "w3-button w3-border mc-button",
                        "data-tool": ToolTypes.RECT,
                        onclick: "MCPublicTools.selectTool(this)"
                    }
                }]
            }
        };
        ui.heading.message.style.paddingTop = "16px";
        ui.heading.message.add(J2H.parse(tool_description));
    }
}