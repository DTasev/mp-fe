export default class Controls {

    private static toggle_w3_show(elem) {
        if (elem.className.indexOf("w3-show") == -1) {
            elem.className += " w3-show";
        } else {
            elem.className = elem.className.replace(" w3-show", "");
        }
    }
    static w3_open() {
        document.getElementById("mySidebar").style.display = "block";
        document.getElementById("myOverlay").style.display = "block";
    }

    static w3_close() {
        document.getElementById("mySidebar").style.display = "none";
        document.getElementById("myOverlay").style.display = "none";
    }
}
