import { axiosPrivate } from "./axios";
import { WAVE_CHAT_API } from "./constants";

export default async function fetchConversations() {
    const res = await axiosPrivate.get(WAVE_CHAT_API.listConversations());
    return res.data.data;
}
