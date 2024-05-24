import { useState } from "react";
import { useChat } from "../../contexts/chat-context";
import { IconClose } from "../icons";
import { toast } from "react-toastify";
import { axiosPrivate } from "../../api/axios";
import { setShowConversationInfo } from "../../store/commonSlice";
import { WAVE_CHAT_API } from "../../api/constants";

const ModalChangeGroupName = () => {
    const [newName, setNewName] = useState("");
    const {
        setShowModalChangeGroupName,
        modalChangeGroupNameRef,
        conversationId,
    } = useChat();

    const onEnter = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleChangeConversationName();
        }
    };

    const handleChangeConversationName = async () => {
        try {
            const res = await axiosPrivate.post(
                WAVE_CHAT_API.changeGroupName(conversationId),
                {
                    name: newName,
                }
            );
            if (res.data.status === 200) {
                toast.success("Đổi tên thành công");
                setShowModalChangeGroupName(false);
                setShowConversationInfo(false);
            }
        } catch (error) {
            console.log("error", error);
            toast.error("Đã xảy ra lỗi, vui lòng thử lại sau");
        }
    };
    return (
        <div ref={modalChangeGroupNameRef}>
            <div className="flex items-center justify-between py-2 pl-4 pr-2">
                <span className="text-lg font-semibold">
                    Chuyển quyền trưởng nhóm
                </span>
                <button
                    className="flex items-center justify-center w-8 h-8 mb-1 rounded-full hover:bg-text2 hover:bg-opacity-10"
                    onClick={() => {
                        setShowModalChangeGroupName(false);
                    }}
                >
                    <IconClose />
                </button>
            </div>
            <div className="flex flex-col p-4 gap-y-3">
                <label htmlFor="newGroupName">Tên nhóm mới</label>
                <input
                    type="text"
                    placeholder="Nhập vào tên nhóm mới"
                    name="newGroupName"
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full h-[36px] border-b border-primary focus:border-secondary"
                    onKeyDown={onEnter}
                />
                <button
                    className="w-[200px] h-[48px] mx-auto text-center bg-primary rounded text-lite mt-5"
                    onClick={handleChangeConversationName}
                >
                    Đổi tên
                </button>
            </div>
        </div>
    );
};

export default ModalChangeGroupName;
