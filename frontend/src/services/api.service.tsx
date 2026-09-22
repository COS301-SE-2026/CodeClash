import axios from "axios";

const API = axios.create(
    {
        baseURL: import.meta.env.VITE_API_URL || ''
    }
)

export async function authGet<T>(url: string, token: string): Promise<T> {
    const res = await API.get(url, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (res.status !== 200) {
        /// Error notification once notification system is implemented
        throw new Error(res.data.message);
    }

    return res.data;
}