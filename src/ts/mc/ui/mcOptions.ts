import { Ui } from "../../tanks/ui/ui";
import { Obstacle } from "../../tanks/gameMap/obstacle";
import { setCenter, redrawCanvas } from '../main';
import { Settings } from '../../tanks/settings';
import { J2H } from "../../tanks/json2html";
import { Remote } from "../../tanks/utility/remote";

export class MCOptions {
    readonly ID_MODAL = "mc-modal";
    readonly ID_MODAL_CLOSE = "mc-modal-close";
    readonly ID_MODAL_TEXT = "mc-modal-text";

    readonly ID_MODAL_OBSTACLETYPE = "mc-modal-obstacletype";

    readonly ID_MODAL_OBSTACLEDATA = "mc-modal-obstacledata";
    readonly ID_MODAL_OBSTACLEDATA_COPIED = "mc-modal-obstacledata-copied";

    readonly ID_MODAL_INPUT_MAP_NAME = "mc-input-map-name";
    readonly ID_MODAL_INPUT_MAP_USERNAME = "mc-input-map-username";
    readonly ID_MODAL_INPUT_MAP_PASSWORD = "mc-input-map-password";
    readonly ID_MODAL_INPUT_MAP_THUMBNAIL = "mc-input-map-thumbnail";

    readonly COPIED_TEXT_TIMEOUT = 1500;

    private obstacles: Obstacle[];

    constructor(obstacles: Obstacle[], ui: Ui) {
        this.obstacles = obstacles;

        const edit_btn = document.createElement("button");
        edit_btn.classList.add("w3-button", "w3-border");
        edit_btn.textContent = "Edit obstacle";
        edit_btn.onclick = this.showModal;

        const export_btn = <HTMLButtonElement>edit_btn.cloneNode();
        export_btn.textContent = "Export all";
        export_btn.onclick = this.exportObstacles;

        const home_btn = <HTMLButtonElement>edit_btn.cloneNode();
        home_btn.textContent = "Back to Game";
        // on click redirect to main page
        home_btn.onclick = () => { window.location.href = window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1) };

        ui.heading.right.style.paddingTop = "16px";
        ui.heading.right.add(edit_btn);
        ui.heading.right.add(export_btn);

        ui.heading.left.style.padding = "16px 0 0 16px";
        ui.heading.left.add(home_btn);
    }

    exportObstacles = () => {
        const [modalText, obstaclesPresent] = this.defaultModalView();
        if (!obstaclesPresent) {
            return;
        }
        const d = {
            form: {
                children: [{
                    div: {
                        style: "display:block;",
                        children: [{
                            label: {
                                for: this.ID_MODAL_INPUT_MAP_NAME,
                                style: "display:block;",
                                textContent: "Map name: "
                            }
                        }, {
                            input: {
                                id: this.ID_MODAL_INPUT_MAP_NAME,
                                maxlength: 80
                            }
                        }]
                    }
                }, {
                    div: {
                        style: "display:block;",
                        children: [{
                            label: {
                                for: this.ID_MODAL_INPUT_MAP_USERNAME,
                                style: "display:block;",
                                textContent: "Username: "
                            }
                        }, {
                            input: {
                                id: this.ID_MODAL_INPUT_MAP_USERNAME,
                                type: "text",
                                name: "username"
                            }
                        }]
                    }
                }, {
                    div: {
                        style: "display:block;",
                        children: [{
                            label: {
                                for: this.ID_MODAL_INPUT_MAP_PASSWORD,
                                style: "display:block;",
                                textContent: "Password: "
                            }
                        }, {
                            input: {
                                id: this.ID_MODAL_INPUT_MAP_PASSWORD,
                                type: "password",
                                name: "password"
                            }
                        }]
                    }
                }, {
                    div: {
                        style: "display:block;",
                        children: [{
                            label: {
                                for: this.ID_MODAL_INPUT_MAP_THUMBNAIL,
                                style: "display:block;",
                                textContent: "Thumbnail URL: "
                            }
                        }, {
                            input: {
                                id: this.ID_MODAL_INPUT_MAP_THUMBNAIL,
                                type: "text",
                                name: "thumbnail"
                            }
                        }]
                    }
                }, {
                    p: {
                        textContent: "Export to:"
                    }
                }, {
                    button: {
                        textContent: "Local",
                        className: "w3-button w3-border mc-button",
                        onclick: this.exportObstaclesLocal,
                        type: "button" // stops the form from submitting
                    }
                }, {
                    button: {
                        textContent: "Remote",
                        className: "w3-button w3-border mc-button",
                        onclick: this.exportObstaclesRemote,
                        type: "button" // stops the form from submitting
                    }
                }]
            }
        };
        modalText.appendChild(J2H.parse(d));
    }

    exportObstaclesLocal = () => {
        const mapName = <HTMLInputElement>document.getElementById(this.ID_MODAL_INPUT_MAP_NAME);
        if (mapName.value === "") {
            mapName.setCustomValidity("Map name cannot be empty!");
            return;
        } else {
            mapName.setCustomValidity("");
        }

        const [modalText, obstaclesPresent] = this.defaultModalView();
        if (!obstaclesPresent) {
            return;
        }

        const mapData = JSON.stringify({
            name: mapName.value,
            terrain: this.obstacles
        });

        const d = {
            div: {
                textContent: "Obstacle data (character length: " + mapData.length + ")",
                children: [{
                    textarea: {
                        id: this.ID_MODAL_OBSTACLEDATA,
                        textContent: mapData,
                        style: "display:block;"
                    }
                }, {
                    button: {
                        textContent: "Copy to clipboard",
                        onclick: this.copyObstaclesToClipboard,
                        className: "w3-button w3-border mc-button"
                    }
                }, {
                    p: {
                        id: this.ID_MODAL_OBSTACLEDATA_COPIED,
                        textContent: "Copied to clipboard!",
                        style: "display:none;"
                    }
                }]
            }
        };
        modalText.appendChild(J2H.parse(d));
    }

    exportObstaclesRemote = () => {
        const mapName = <HTMLInputElement>document.getElementById(this.ID_MODAL_INPUT_MAP_NAME);
        if (mapName.value === "") {
            mapName.setCustomValidity("Map name cannot be empty!");
            // on the next key press remove the field's error message, then remove the function
            mapName.onkeydown = () => { mapName.setCustomValidity(""); mapName.onkeydown = null; };
            return;
        } else {
            mapName.setCustomValidity("");
        }

        const username = <HTMLInputElement>document.getElementById(this.ID_MODAL_INPUT_MAP_USERNAME);
        if (username.value === "") {
            username.setCustomValidity("Username cannot be empty!");
            // on the next key press remove the field's error message, then remove the function
            username.onkeydown = () => { username.setCustomValidity(""); username.onkeydown = null; };
            return;
        } else {
            username.setCustomValidity("");
        }
        const password = <HTMLInputElement>document.getElementById(this.ID_MODAL_INPUT_MAP_PASSWORD);
        if (password.value === "") {
            password.setCustomValidity("Password cannot be empty!");
            // on the next key press remove the field's error message, then remove the function
            password.onkeydown = () => { password.setCustomValidity(""); password.onkeydown = null; };
            return;
        } else {
            password.setCustomValidity("");
        }
        const thumbnail = <HTMLInputElement>document.getElementById(this.ID_MODAL_INPUT_MAP_THUMBNAIL);
        if (thumbnail.value === "") {
            thumbnail.setCustomValidity("Password cannot be empty!");
            // on the next key press remove the field's error message, then remove the function
            thumbnail.onkeydown = () => { thumbnail.setCustomValidity(""); thumbnail.onkeydown = null; };
            return;
        } else {
            thumbnail.setCustomValidity("");
        }

        const [modalText, obstaclesPresent] = this.defaultModalView(false);
        if (!obstaclesPresent) {
            return;
        }
        const mapData = JSON.stringify({
            name: mapName.value,
            thumbnail_url: thumbnail.value,
            // the terrain is expected to be a single JSON string
            terrain: JSON.stringify(this.obstacles)
        });

        Remote.sendMap(username.value, password.value, mapData,
            () => {
                modalText.innerHTML = "Successful upload!";
            }, (responseText) => {
                modalText.innerHTML = "Failed upload, server response: " + responseText;
            }
        );
    }

    private copyObstaclesToClipboard = () => {
        const textarea = <HTMLTextAreaElement>document.getElementById(this.ID_MODAL_OBSTACLEDATA);
        textarea.select();
        document.execCommand("copy");
        const textCopied = document.getElementById(this.ID_MODAL_OBSTACLEDATA_COPIED);
        textCopied.style.display = "block";
        setTimeout(() => {
            textCopied.style.display = "none";
        }, this.COPIED_TEXT_TIMEOUT);
    }

    showModal = () => {
        const [modalText, obstaclesPresent] = this.defaultModalView();
        if (!obstaclesPresent) {
            return;
        }
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
        const modal = document.getElementById(this.ID_MODAL);
        const modalText = document.getElementById(this.ID_MODAL_TEXT);
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
                    h4: {
                        textContent: "ID:  " + obstacle.id,
                    }
                }, {
                    h4: {
                        textContent: "Type:",
                        style: "display:inline-block; padding-right:16px;"
                    }
                }, {
                    select: {
                        className: "w3-select",
                        style: "margin-bottom:16px",
                        children: [{
                            option: {
                                textContent: <string>obstacle.type
                            }
                            // append the rest of the available types
                        }].concat(options),
                        id: this.ID_MODAL_OBSTACLETYPE
                    }
                }, {
                    button: {
                        textContent: "Set new center",
                        className: "w3-button w3-border w3-white w3-hover-gray",
                        style: "display:block;",
                        onclick: () => this.setNewCenter(id)
                    }
                }, {
                    br: {}
                }, {
                    button: {
                        textContent: "Delete",
                        style: "display:block;",
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
        modalText.appendChild(e);
        document.getElementById(this.ID_MODAL_OBSTACLETYPE).onchange = (e: Event) => this.changeObstacleType(e, id);
    }

    private defaultModalView(clear = true): [HTMLDivElement, boolean] {
        const modal = document.getElementById(this.ID_MODAL);
        modal.style.display = "block";
        var span = document.getElementById(this.ID_MODAL_CLOSE);
        span.onclick = () => { modal.style.display = "none"; redrawCanvas(); };
        window.onkeyup = (e) => {
            if (e.keyCode == 27) {
                modal.style.display = "none";
                window.onkeyup = null;
                redrawCanvas();
            }
        };
        const modalText = <HTMLDivElement>document.getElementById(this.ID_MODAL_TEXT);
        if (this.obstacles.length === 0) {
            modalText.innerHTML = '<br>Nothing to see here... <i class="fas fa-wrench fa-spin"></i><br>';
            return [modalText, false];
        }
        else {
            if (clear) {
                modalText.innerHTML = "";
            }
            return [modalText, true];
        }
    }

    setNewCenter(id: number) {
        const canvas = <HTMLCanvasElement>document.getElementById(Settings.ID_GAME_CANVAS);
        const modal = document.getElementById(this.ID_MODAL);
        modal.style.display = "none";

        canvas.onmouseup = null;
        // on mouse down callback into the main function to set the new center and redraw the canvas
        canvas.onmousedown = (e: MouseEvent) => { setCenter(e, id); redrawCanvas(); }
    }

    changeObstacleType(e: Event, id: number) {
        this.obstacles[id].type = Obstacle.typeFromString((<HTMLSelectElement>e.srcElement).value);
    }

    deleteObstacle(id: number) {
        this.obstacles.splice(id, 1);
        // fix the obstacle ids the brute way
        for (let i = 0; i < this.obstacles.length; i++) {
            this.obstacles[i].id = i;
        }
    }
}