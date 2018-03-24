export class TanksCache {
    private static KEY_THEME = "theme";

    static get theme(): string {
        return window.localStorage.getItem(this.KEY_THEME) || "sepia";
    }
    static set theme(theme: string) {
        window.localStorage.setItem(this.KEY_THEME, theme.toLowerCase());
    }
}