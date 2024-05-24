import { axiosPrivate } from "./axios";
import { WAVE_CHAT_API } from "./constants";

export default async function fetchUserProfile(id) {
    const res = await axiosPrivate.get(WAVE_CHAT_API.userProfile(id));
    return res.data.data;
}
