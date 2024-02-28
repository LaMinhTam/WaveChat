import { axiosPrivate } from "./axios";

export default async function fetchCurrentUserFriends() {
    const res = await axiosPrivate.get("/friend?type=4");
    return res.data.data;
}
