import { axiosPrivate } from "./axios";

export default async function fetchConversations() {
    const res = await axiosPrivate.get("/conversation?limit=20");
    return res.data.data;
}
