import { axiosPrivate } from "../api/axios";
import { CONVERSATION_MEMBER_PERMISSION } from "../api/constants";
import { toast } from "react-toastify";

export default async function handleGrantPermission(
    type = "add",
    permissionType,
    userId,
    userName,
    conversationId
) {
    try {
        const res = await axiosPrivate.post(
            `/conversation-group/update-permission?conversation_id=${conversationId}`,
            {
                user_id: userId,
                permission: permissionType,
            }
        );
        if (res.data.status === 200) {
            if (permissionType === CONVERSATION_MEMBER_PERMISSION.OWNER) {
                toast.success(
                    `Bạn đã chuyển quyền trưởng nhóm cho ${userName}`
                );
            } else {
                if (type === "add") {
                    toast.success(`Bạn đã thêm ${userName} làm phó nhóm`);
                } else if (type === "remove") {
                    toast.success(`Bạn đã xóa ${userName} khỏi phó nhóm`);
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}
