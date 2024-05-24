import { toast } from "react-toastify";
import { axiosPrivate } from "./axios";
import { WAVE_CHAT_API } from "./constants";

export default async function fetchUserByPhone(phone) {
    const response = await axiosPrivate.get(
        WAVE_CHAT_API.findUserByPhone(phone)
    );
    if (response.data.status === 200) {
        const data = response.data?.data?.user;
        return data;
    } else {
        toast.error("Không tìm thấy người dùng!");
        return null;
    }
}
