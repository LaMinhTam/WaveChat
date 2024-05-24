import { axiosPrivate } from "./axios";

export default async function fetchConversations() {
    const res = await axiosPrivate.get("/conversation/list");
    return res.data.data;
}
