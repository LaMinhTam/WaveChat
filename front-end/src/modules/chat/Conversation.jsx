import ConversationContent from "./conversation/ConversationContent";
import ConversationHeader from "./conversation/ConversationHeader";
import ConversationToolbar from "./conversation/ConversationToolbar";

const Conversation = () => {
    return (
        <div className="w-full h-full min-h-screen">
            <ConversationHeader name={"Nguyễn Văn A"} status={"Vừa truy cập"} />
            <ConversationContent />
            <ConversationToolbar />
            <div></div>
        </div>
    );
};

export default Conversation;
