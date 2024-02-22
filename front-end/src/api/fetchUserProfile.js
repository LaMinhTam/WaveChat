import { axiosPrivate } from "./axios";

export default async function fetchUserProfile(id) {
    const res = await axiosPrivate.get(`user/profile?_id=${id}`);
    return res.data.data;
}
