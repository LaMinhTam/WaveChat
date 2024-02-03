import MessageReceive from "./MessageReceive";
import MessageSend from "./MessageSend";

const ConversationContent = () => {
    return (
        <div className="flex-1 w-full h-full bg-strock">
            <MessageSend />
            <MessageReceive />
            <MessageSend />
        </div>
    );
};

export default ConversationContent;
