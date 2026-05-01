import secureLocalStorage from '../utils/secureStorage';
import type { JWToken } from "../@types/session";

const authHeader = ()=> {
    const session = secureLocalStorage.getItem("session") as JWToken | null;
    if (session && session.access_token) {
        return { Authorization: `Bearer ${session.access_token}` };
    }

    return {};
};

export default authHeader;