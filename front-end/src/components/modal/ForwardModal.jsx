import { useChat } from "../../contexts/chat-context";
import SearchPerson from "../../modules/chat/group/create/SearchPerson";
import { IconClose } from "../icons";
import { toast } from "react-toastify";
import { axiosPrivate } from "../../api/axios";
import { useEffect, useState } from "react";
import { WAVE_CHAT_API } from "../../api/constants";

const ForwardModal = () => {
    const {
        setShowForwardModal,
        forwardModalRef,
        selectedList,
        setSelectedList,
        forwardMessage,
    } = useChat();
    const [listConversationId, setListConversationId] = useState([]);

    useEffect(() => {
        const fetchConversationId = async () => {
            try {
                let listConversationId = [];
                await selectedList.forEach(async (element) => {
                    if (!element?.group) {
                        const resConversation = await axiosPrivate.post(
                            WAVE_CHAT_API.createConversation(),
                            {
                                member_id: element.user_id,
                            }
                        );

                        listConversationId.push(
                            resConversation.data.data.conversation_id
                        );
                    } else {
                        listConversationId.push(element.user_id);
                    }
                });
                setListConversationId(listConversationId);
            } catch (error) {
                console.log("fetchConversationId ~ error:", error);
            }
        };
        if (selectedList.length > 0) {
            fetchConversationId();
        }
    }, [selectedList]);

    const handleShareMessage = async () => {
        try {
            const res = await axiosPrivate.post(WAVE_CHAT_API.shareMessage(), {
                message_id: forwardMessage._id,
                conversation_ids: listConversationId,
            });
            if (res.data.status === 200) {
                setSelectedList([]);
                setShowForwardModal(false);
                toast.success("Chia sẻ thành công");
            } else {
                toast.error("Chia sẻ thất bại");
            }
        } catch (error) {
            toast.error("Chia sẻ thất bại");
            console.log("handleShareMessage ~ error:", error);
        }
    };
    return (
        <div ref={forwardModalRef}>
            <div className="flex items-center justify-between py-2 pl-4 pr-2">
                <span className="text-lg font-semibold">Chia sẻ</span>
                <button
                    className="flex items-center justify-center w-8 h-8 mb-1 rounded-full hover:bg-text2 hover:bg-opacity-10"
                    onClick={() => {
                        setSelectedList([]);
                        setShowForwardModal(false);
                    }}
                >
                    <IconClose />
                </button>
            </div>
            <SearchPerson type={"forward"} />
            <div className="px-3 py-4 border border-t-2 border-gray-300">
                <h3 className="text-sm font-normal text-text7">
                    Nội dung chia sẻ
                </h3>
                <div className="flex items-center">
                    <input
                        className="w-full h-[48px] p-3 bg-tertiary bg-opacity-40"
                        value={forwardMessage.message}
                        disabled
                    />
                </div>
            </div>
            <div className="border border-t-2 border-gray-300">
                <div className="py-[14px] px-4 flex items-center">
                    <div></div>
                    <div className="flex items-center ml-auto gap-x-3">
                        <button
                            className="px-4 py-2 bg-text6"
                            onClick={() => setShowForwardModal(false)}
                        >
                            Hủy
                        </button>
                        <button
                            className="px-4 py-2 bg-secondary text-lite disabled:bg-opacity-30"
                            onClick={handleShareMessage}
                            disabled={selectedList.length === 0}
                        >
                            Chia sẻ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForwardModal;
