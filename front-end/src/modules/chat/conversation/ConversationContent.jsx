import { useChat } from "../../../contexts/chat-context";
import { getUserId } from "../../../utils/auth";
import groupMessages from "../../../utils/groupMessage";
import s3ImageUrl from "../../../utils/s3ImageUrl";
import MessageReceive from "./MessageReceive";
import MessageSend from "./MessageSend";
import { v4 as uuidv4 } from "uuid";

const ConversationContent = () => {
    const { message } = useChat();
    const currentUserId = getUserId();

    const groupedMessages = groupMessages(message);
    console.log("ConversationContent ~ groupedMessages:", groupedMessages);
    return (
        <div className="flex-1 w-full h-full max-h-[570px] overflow-y-auto custom-scrollbar bg-strock p-2">
            {groupedMessages.map((group) => (
                <div key={uuidv4()} className="flex flex-col items-center">
                    <span className="mb-2 text-sm text-text3">
                        {group.formattedTime}
                    </span>
                    {group.data.map((msg) =>
                        msg?.user_id === currentUserId ? (
                            <MessageSend key={uuidv4()} msg={msg} />
                        ) : (
                            <MessageReceive
                                key={uuidv4()}
                                msg={msg}
                                imageUrl={s3ImageUrl(
                                    msg.user?.avatar,
                                    msg.user?._id
                                )}
                            />
                        )
                    )}
                </div>
            ))}
        </div>
    );
};

export default ConversationContent;
