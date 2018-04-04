export function getCookie(cookieName): string {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split("=");
            if (cookieName === name) {
                return value;
            }
        }
    }
}