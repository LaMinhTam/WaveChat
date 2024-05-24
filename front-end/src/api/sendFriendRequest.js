import { axiosPrivate } from "./axios";
import { WAVE_CHAT_API } from "./constants";

export default async function sendFriendRequest(id) {
    const res = await axiosPrivate.post(WAVE_CHAT_API.sendFriendRequest(id));
    return res.data;
}
