import { axiosPrivate } from "./axios";

export default async function sendFriendRequest(id) {
    const res = await axiosPrivate.post(`/friend/send?_id=${id}`);
    return res.data;
}
