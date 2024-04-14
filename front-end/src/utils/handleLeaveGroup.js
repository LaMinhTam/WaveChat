import { toast } from "react-toastify";
import { axiosPrivate } from "../api/axios";
import Swal from "sweetalert2";

const handleLeaveGroup = async (
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
