import { getUserId } from "../../../utils/auth";
import groupMessages from "../../../utils/groupMessage";
import Message from "./Message";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";

const ConversationContent = ({ message }) => {
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
                        msg?.user?._id === currentUserId ? (
                            <Message key={uuidv4()} msg={msg} type="send" />
                        ) : (
                            <Message key={uuidv4()} msg={msg} type="receive" />
                        )
                    )}
                </div>
            ))}
        </div>
    );
};

ConversationContent.propTypes = {
    message: PropTypes.array,
};

export default ConversationContent;
