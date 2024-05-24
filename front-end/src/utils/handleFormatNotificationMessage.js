import { MESSAGE_SYSTEM_TYPE } from "../api/constants";

export default function handleFormatNotificationMessage(msg, currentUserId) {
    let message = "";
    switch (msg.type) {
        case MESSAGE_SYSTEM_TYPE.UPDATE_NAME:
            message = `${msg?.user?.full_name} đã đổi tên nhóm thành ${msg?.message}.`;
            break;
        case MESSAGE_SYSTEM_TYPE.UPDATE_AVATAR:
            message = `${msg?.user?.full_name} đã đổi ảnh đại diện nhóm.`;
            break;
        case MESSAGE_SYSTEM_TYPE.UPDATE_BACKGROUND:
            message = `${msg?.user?.full_name} đã đổi tên nhóm thành ${msg?.message}.`;
            break;
        case MESSAGE_SYSTEM_TYPE.REMOVE_USER:
            if (msg?.user?._id === currentUserId) {
                message = `Bạn đã xóa ${msg?.user_target?.full_name} khỏi nhóm.`;
            } else {
                message = `${msg?.user?.full_name} đã xóa ${msg?.user_target?.full_name} khỏi nhóm.`;
            }
            break;
        case MESSAGE_SYSTEM_TYPE.ADD_NEW_USER:
            if (msg?.user?._id === currentUserId) {
                let users = msg?.user_target
                    ?.map((user) => user?.full_name)
                    .join(", ");
                message = `Bạn đã thêm ${users} vào nhóm.`;
            } else if (
                msg?.user_target?.some(
                    (user) => user?.user_id === currentUserId
                )
            ) {
                message = `${msg?.user?.full_name} đã thêm bạn vào nhóm.`;
            } else {
                let users = msg?.user_target
                    ?.map((user) => user?.full_name)
                    .join(", ");
                message = `${msg?.user?.full_name} đã thêm ${users} vào nhóm.`;
            }
            break;
        case MESSAGE_SYSTEM_TYPE.CHANGE_PERMISSION_USER:
            if (msg?.user?._id === currentUserId) {
                message = `Bạn đã thay đổi quyền cho ${msg?.user_target?.full_name}.`;
            } else {
                message = `${msg?.user?.full_name} đã thay đổi quyền cho ${msg?.user_target?.full_name}.`;
            }
            break;

        case MESSAGE_SYSTEM_TYPE.USER_OUT_GROUP:
            if (msg?.user?._id === currentUserId) {
                message = `Bạn đã rời nhóm.`;
            } else {
                message = `${msg?.user?.full_name} đã rời nhóm.`;
            }
            break;
        case MESSAGE_SYSTEM_TYPE.NEW_GROUP:
            message = msg.message;
            break;
        case MESSAGE_SYSTEM_TYPE.UPDATE_IS_JOIN_WITH_LINK:
            message = msg.message;
            break;
        case MESSAGE_SYSTEM_TYPE.UPDATE_IS_SEND_MESSAGE:
            message = msg.message;
            break;
        case MESSAGE_SYSTEM_TYPE.REVOKE_MESSAGE:
            message = msg.message;
            break;
        case MESSAGE_SYSTEM_TYPE.YOU_IS_CHANGE_PERMISSION:
            message = msg.message;
            break;
        case MESSAGE_SYSTEM_TYPE.UPDATE_IS_CONFIRM_NEW_MEMBER:
            message = msg.message;
            break;
        case MESSAGE_SYSTEM_TYPE.UPDATE_IS_OFF_CONFIRM_NEW_MEMBER:
            message = msg.message;
            break;
        case MESSAGE_SYSTEM_TYPE.ADD_DEPUTY:
            message = msg.message;
            break;
        case MESSAGE_SYSTEM_TYPE.REMOVE_DEPUTY:
            message = msg.message;
            break;
        case MESSAGE_SYSTEM_TYPE.WAITING_CONFIRM:
            message = `${msg?.user?.full_name} đang chờ phê duyệt.`;
            break;
        case MESSAGE_SYSTEM_TYPE.JOIN_WITH_LINK:
            message = `${msg?.user?.full_name} đã tham gia nhóm bằng link mời.`;
            break;
        default:
            message = msg.message;
            break;
    }
    return message;
}
