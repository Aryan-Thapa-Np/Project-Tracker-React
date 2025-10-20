const apiUrl = import.meta.env.VITE_BACKEND_URL;
const appToken = import.meta.env.VITE_APP_TOKEN;
export const getCsrfToken = async () => {
    try {
        const res = await fetch(`${apiUrl}/api/user/getCsrf`, {
            method: "GET",
            credentials: "include",
            headers: {
                "x-app-token": `${appToken}`,
            }
        })

        const data = await res.json();
        if (!data.ok && data.success === false) {
            return;
        }
        if (data.success === true) {
            return data.csrfToken;
        }
    } catch (error) {
        console.log(error);
    }
}