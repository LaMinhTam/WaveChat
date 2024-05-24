import { axiosPrivate } from "./axios";
import { WAVE_CHAT_API } from "./constants";

export default async function fetchCurrentUserFriends() {
    const res = await axiosPrivate.get(WAVE_CHAT_API.listFriend());
    return res.data.data;
}
