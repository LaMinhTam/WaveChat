import { toast } from "react-toastify";
import { axiosPrivate } from "../api/axios";
import Swal from "sweetalert2";
import {
    setActiveConversation,
    setShowConversation,
    setShowConversationInfo,
} from "../store/commonSlice";
import { setId } from "../store/conversationSlice";

const handleLeaveGroup = async (
    dispatch,
    conversationId,
    setShowPassPermissionModal,
    isAdmin
) => {
    try {
        if (!isAdmin) {
            const res = await axiosPrivate.post(
                `/conversation-group/leave?conversation_id=${conversationId}`
            );
            if (res.data.status === 200) {
                toast.success(`Bạn đã rời nhóm`);
                dispatch(setShowConversation(false));
                dispatch(setActiveConversation(""));
                dispatch(setShowConversationInfo(false));
                dispatch(setId(Math.random() * 1000));
            }
        } else {
            Swal.fire({
                title: "Bạn cần chuyển quyền cho người khác trước khi rời nhóm",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Chuyển quyền",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setShowPassPermissionModal(true);
                } else {
                    return;
                }
            });
        }
    } catch (error) {
        console.log(error);
    }
};

export default handleLeaveGroup;
