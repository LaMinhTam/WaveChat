import { IconEmoji, IconSend } from "../../../components/icons";

const ConversationChatInput = () => {
    return (
        <div className="flex items-center w-full h-full shadow-md">
            <input
                type="text"
                placeholder="Nhập tin nhắn..."
                className="flex-1 h-12 p-[12px_10px_18px_16px] rounded-full bg-lite"
            />
            <div className="flex items-center justify-center gap-x-2">
                <button className="flex items-center justify-center w-10 h-10 rounded hover:bg-text3 hover:bg-opacity-10">
                    <IconEmoji />
                </button>
                <button className="flex items-center justify-center w-10 h-10 rounded hover:bg-text3 hover:bg-opacity-10">
                    <IconSend />
                </button>
            </div>
        </div>
    );
};

export default ConversationChatInput;
