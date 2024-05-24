import { axiosPrivate } from "../api/axios";
import Swal from "sweetalert2";

export default function alertRemoveBlock({
    user_id,
    setIsBlocked,
    setBlockType,
}) {
    return Swal.fire({
        title: "Bạn đang chặn người dùng này! Hủy chặn?",
        text: "Bạn sẽ không thể hoàn tác hành động này!",
        icon: "Cảnh báo",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Có, hãy hủy!",
        cancelButtonText: "Không!",
    }).then(async (result) => {
        if (result.isConfirmed) {
            const res = await axiosPrivate.post(
                `/user/remove-block-user/${user_id}`
            );
            if (res.data.status === 200) {
                Swal.fire(
                    "Đã hủy chặn!",
                    "Người dùng đã được hủy chặn.",
                    "Thành công"
                );
                setBlockType(0);
                setIsBlocked(false);
            } else {
                Swal.fire("Lỗi!", "Đã có lỗi xảy ra.", "error");
            }
        } else {
            return;
        }
    });
}
