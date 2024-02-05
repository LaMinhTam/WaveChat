import { useSelector } from "react-redux";
import ConversationChatInput from "./conversation/ConversationChatInput";
import ConversationContent from "./conversation/ConversationContent";
import ConversationHeader from "./conversation/ConversationHeader";
import ConversationToolbar from "./conversation/ConversationToolbar";

const Conversation = () => {
    const friendInfo = useSelector((state) => state.user.friendInfo);

    return (
        <div className="flex flex-col w-full h-full min-h-screen">
            <ConversationHeader
                name={friendInfo.full_name}
                status={"Vừa truy cập"}
                avatar={friendInfo.avatar}
                userId={friendInfo._id}
            />
            <ConversationContent />
            <div className="mt-auto shadow-md">
                <ConversationToolbar />
                <ConversationChatInput user_id={friendInfo._id} />
            </div>
        </div>
    );
};

export default Conversation;
