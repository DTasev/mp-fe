import { Ui } from '../../tanks/ui/ui';
import { J2H } from '../../tanks/json2html';
import { Obstacle, ObstacleType } from '../../tanks/gameMap/obstacle';
import { mouseForward, setCenter, redrawCanvas } from '../main';
import { Settings } from '../../tanks/settings';

export class PublicMapCreatorControls {
    static selectObstacleType(e: HTMLButtonElement) {
        for (const child of e.parentElement.children) {
            child.classList.remove(MapCreatorControls.CLASS_SELECTED_OBSTACLE_TYPE);
            child.id = "";
        }
        e.classList.add(MapCreatorControls.CLASS_SELECTED_OBSTACLE_TYPE);
        e.id = MapCreatorControls.ID_SELECTED_OBSTACLE_TYPE;
    }
    static selectTool(e: HTMLButtonElement) {
        for (const child of e.parentElement.children) {
            child.classList.remove(MapCreatorControls.CLASS_SELECTED_OBSTACLE_TYPE);
            child.id = "";
        }
        e.classList.add(MapCreatorControls.CLASS_SELECTED_OBSTACLE_TYPE);
        e.id = MapCreatorControls.ID_SELECTED_TOOL;
    }
}

export class MapCreatorControls {
    static ID_SELECTED_OBSTACLE_TYPE = "mc-selected-obstacle";
    static CLASS_SELECTED_OBSTACLE_TYPE = "w3-green";

    static ID_SELECTED_TOOL = "mc-selected-tool";

    static ID_MODAL = "mc-modal";
    static ID_MODAL_CLOSE = "mc-modal-close";
    static ID_MODAL_TEXT = "mc-modal-text";

    private obstacles: Obstacle[];

    constructor(main: Obstacle[], ui: Ui) {
        this.obstacles = main;
        const obstacleType_description = {
            div: {
                textContent: "Obstacle type:",
                style: "display:inline-block;",
                children: [{
                    button: {
                        innerHTML: '<i class="fas fa-square"></i> Solid',
                        className: "w3-button w3-border mc-button " + MapCreatorControls.CLASS_SELECTED_OBSTACLE_TYPE,
                        "data-type": "solid",
                        onclick: "PublicMapCreatorControls.selectObstacleType(this)",
                        id: MapCreatorControls.ID_SELECTED_OBSTACLE_TYPE
                    }
                }, {
                    button: {
                        innerHTML: '<i class="fas fa-tint"></i> Water',
                        className: "w3-button w3-border mc-button",
                        "data-type": "water",
                        onclick: "PublicMapCreatorControls.selectObstacleType(this)"
                    }
                }, {
                    button: {
                        innerHTML: '<i class="fas fa-tree"></i> Wood',
                        className: "w3-button w3-border mc-button",
                        "data-type": "wood",
                        onclick: "PublicMapCreatorControls.selectObstacleType(this)"
                    }
                }]
            }
        };
        ui.heading.playerTurn.style.paddingTop = "16px";
        ui.heading.playerTurn.add(J2H.parse(obstacleType_description));

        const tool_description = {
            div: {
                textContent: "Tool:",
                style: "display:inline-block;",
                children: [{
                    button: {
                        innerHTML: '| Line',
                        className: "w3-button w3-border mc-button " + MapCreatorControls.CLASS_SELECTED_OBSTACLE_TYPE,
                        "data-tool": "line",
                        onclick: "PublicMapCreatorControls.selectTool(this)",
                        id: MapCreatorControls.ID_SELECTED_TOOL
                    }
                }, {
                    button: {
                        innerHTML: '<i class="far fa-square"></i> Rectangle',
                        className: "w3-button w3-border mc-button",
                        "data-tool": "rectangle",
                        onclick: "PublicMapCreatorControls.selectTool(this)"
                    }
                }]
            }
        };
        ui.heading.message.style.paddingTop = "16px";
        ui.heading.message.add(J2H.parse(tool_description));

        const edit = document.createElement("button");
        edit.classList.add("w3-button", "w3-border");
        edit.textContent = "Edit obstacle";
        edit.onclick = this.showModal;

        ui.heading.right.style.paddingTop = "16px";
        ui.heading.right.add(edit);
    }

    showModal = () => {
        const modal = document.getElementById(MapCreatorControls.ID_MODAL);
        modal.style.display = "block";
        var span = document.getElementById(MapCreatorControls.ID_MODAL_CLOSE);
        span.onclick = () => { modal.style.display = "none"; redrawCanvas(); };
        window.onkeyup = (e) => { if (e.keyCode == 27) { modal.style.display = "none"; window.onkeyup = null; redrawCanvas(); } };

        const modalText = document.getElementById(MapCreatorControls.ID_MODAL_TEXT);
        modalText.innerHTML = "";
        for (const obstacle of this.obstacles) {
            const d = {
                button: {
                    style: "display: inline-block; padding: 6px; margin:6px; cursor:pointer;",
                    className: "w3-border w3-white w3-hover-gray",
                    textContent: "ID: " + obstacle.id + " - " + obstacle.type,
                    onclick: () => this.editObstacleModal(obstacle.id)
                }
            };
            modalText.appendChild(J2H.parse(d));
        }
    }
    editObstacleModal = (id: number) => {
        const modal = document.getElementById(MapCreatorControls.ID_MODAL);
        const modalText = document.getElementById(MapCreatorControls.ID_MODAL_TEXT);
        modalText.innerHTML = "";
        const obstacle = this.obstacles[id];

        // list of all available options
        let options = [
            {
                option: {
                    textContent: "solid"
                }
            }, {
                option: {
                    textContent: "water"
                }
            }, {
                option: {
                    textContent: "wood"
                }
            }];

        // remove the type that the obstacle is currently
        options = options.filter((op) => op.option.textContent !== obstacle.type);

        const d = {
            div: {
                children: [{
                    p: {
                        textContent: "Editing obstacle"
                    }
                }, {
                    p: {
                        textContent: "ID:" + obstacle.id,
                    }
                }, {
                    select: {
                        children: [{
                            option: {
                                textContent: <string>obstacle.type
                            }
                            // append the rest of the available types
                        }].concat(options)
                    }
                }, {
                    button: {
                        textContent: "Set new center",
                        className: "w3-button w3-border w3-white w3-hover-gray",
                        onclick: () => this.setNewCenter(id)
                    }
                }, {
                    button: {
                        textContent: "Delete",
                        className: "w3-button w3-border w3-red w3-hover-gray",
                        onclick: () => {
                            if (confirm("Are you sure you want to DELETE the obstacle?")) {
                                this.deleteObstacle(id);
                                modal.style.display = "none";
                                redrawCanvas();
                            }
                        }
                    }
                }]
            }
        };

        const e = J2H.parse(d);
        // Add onchange value to the select element. Setting it this way was the only way the event actually triggered
        (<HTMLSelectElement>e.children[2]).onchange = (e: Event) => this.changeObstacleType(e, id);
        modalText.appendChild(e);
    }
    setNewCenter(id: number) {
        const canvas = <HTMLCanvasElement>document.getElementById(Settings.ID_GAME_CANVAS);
        const modal = document.getElementById(MapCreatorControls.ID_MODAL);
        modal.style.display = "none";
        // on mouse down callback into the main function to set the new center and redraw the canvas
        canvas.onmousedown = (e: MouseEvent) => { setCenter(e, id); redrawCanvas(); }
    }
    changeObstacleType(e: Event, id: number) {
        this.obstacles[id].type = Obstacle.typeFromString((<HTMLSelectElement>e.srcElement).value);
    }
    deleteObstacle(id: number) {
        this.obstacles.splice(id, 1);
    }
}