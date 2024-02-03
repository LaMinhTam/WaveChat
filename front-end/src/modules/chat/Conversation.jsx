import { useSelector } from "react-redux";
import ConversationChatInput from "./conversation/ConversationChatInput";
import ConversationContent from "./conversation/ConversationContent";
import ConversationHeader from "./conversation/ConversationHeader";
import ConversationToolbar from "./conversation/ConversationToolbar";
import s3ImageUrl from "../../utils/s3ImageUrl";

const Conversation = () => {
    const friendInfo = useSelector((state) => state.user.friendInfo);
    return (
        <div className="flex flex-col w-full h-full min-h-screen">
            <ConversationHeader
                name={friendInfo.nick_name}
                status={"Vừa truy cập"}
                avatar={s3ImageUrl(friendInfo.avatar, friendInfo.id)}
            />
            <ConversationContent />
            <div className="mt-auto shadow-md">
                <ConversationToolbar />
                <ConversationChatInput />
            </div>
        </div>
    );
};

export default Conversation;
