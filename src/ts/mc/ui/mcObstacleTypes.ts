import { Obstacle } from '../../tanks/gameMap/obstacle';
import { Ui } from '../../tanks/ui/ui';
import { J2H } from '../../tanks/json2html';

export class MCPublicObstacleTypes {
    static selectObstacleType(e: HTMLButtonElement) {
        for (const child of e.parentElement.children) {
            child.classList.remove(MCObstacleTypes.CLASS_SELECTED_OBSTACLE_TYPE);
            child.id = "";
        }
        e.classList.add(MCObstacleTypes.CLASS_SELECTED_OBSTACLE_TYPE);
        e.id = MCObstacleTypes.ID_SELECTED_OBSTACLE_TYPE;
    }
}
export class MCObstacleTypes {
    static readonly ID_SELECTED_OBSTACLE_TYPE = "mc-selected-obstacle";
    static readonly CLASS_SELECTED_OBSTACLE_TYPE = "w3-green";

    private readonly obstacles: Obstacle[];

    constructor(obstacles: Obstacle[], ui: Ui) {
        this.obstacles = obstacles;
        const obstacleType_description = {
            div: {
                textContent: "Obstacle type:",
                style: "display:inline-block;",
                children: [{
                    button: {
                        innerHTML: '<i class="fas fa-square"></i> Solid',
                        className: "w3-button w3-border mc-button " + MCObstacleTypes.CLASS_SELECTED_OBSTACLE_TYPE,
                        "data-type": "solid",
                        onclick: "MCPublicObstacleTypes.selectObstacleType(this)",
                        id: MCObstacleTypes.ID_SELECTED_OBSTACLE_TYPE
                    }
                }, {
                    button: {
                        innerHTML: '<i class="fas fa-tint"></i> Water',
                        className: "w3-button w3-border mc-button",
                        "data-type": "water",
                        onclick: "MCPublicObstacleTypes.selectObstacleType(this)"
                    }
                }, {
                    button: {
                        innerHTML: '<i class="fas fa-tree"></i> Wood',
                        className: "w3-button w3-border mc-button",
                        "data-type": "wood",
                        onclick: "MCPublicObstacleTypes.selectObstacleType(this)"
                    }
                }]
            }
        };
        ui.heading.playerTurn.style.paddingTop = "16px";
        ui.heading.playerTurn.add(J2H.parse(obstacleType_description));
    }
}