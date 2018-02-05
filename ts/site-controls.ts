export default class Controls {

    private static toggle_w3_show(html_elem) {
        if (html_elem.className.indexOf("w3-show") == -1) {
            html_elem.className += " w3-show";
        } else {
            html_elem.className = html_elem.className.replace(" w3-show", "");
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
