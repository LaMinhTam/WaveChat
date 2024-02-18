import { useChat } from "../../../contexts/chat-context";
import { getUserId } from "../../../utils/auth";
import s3ImageUrl from "../../../utils/s3ImageUrl";
import MessageReceive from "./MessageReceive";
import MessageSend from "./MessageSend";
import { v4 as uuidv4 } from "uuid";

const ConversationContent = () => {
    const { message } = useChat();
    const currentUserId = getUserId();
    return (
        <div className="flex-1 w-full h-full max-h-[570px] overflow-y-auto custom-scrollbar bg-strock">
            {message.map((msg) =>
                msg.user?._id === currentUserId ? (
                    <MessageSend key={uuidv4()} msg={msg.message} />
                ) : (
                    <MessageReceive
                        key={uuidv4()}
                        msg={msg.message}
                        imageUrl={s3ImageUrl(msg.user?.avatar, msg.user?._id)}
                    />
                )
            )}
        </div>
    );
};

export default ConversationContent;
