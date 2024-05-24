import PropTypes from "prop-types";
const MessageReply = ({ msg, messageRefs }) => {
    const { message_reply } = msg;
    const handleClickMessage = (id) => {
        const messageElement = messageRefs[id]?.current;
        const containerElement = document.getElementById("chat-content");

        if (messageElement && containerElement) {
            // Scroll the container to the top of the selected message
            const topPos =
                messageElement.offsetTop - containerElement.offsetTop;
            containerElement.scrollTop = topPos;
        }
    };
    if (msg?.type !== 16 || !msg?.message_reply) {
        return null;
    }
    return (
        <div
            className="flex flex-col p-3 rounded cursor-pointer bg-tertiary"
            onClick={() => handleClickMessage(message_reply?._id)}
        >
            <div>
                <span className="text-sm font-bold">{msg.user.full_name}</span>
            </div>
            <span className="text-sm text-text3">
                {[2, 3, 4, 5].includes(message_reply?.type)
                    ? "Tệp tin"
                    : message_reply?.message}
            </span>
        </div>
    );
};
MessageReply.propTypes = {
    msg: PropTypes.object,
    messageRefs: PropTypes.object,
};

export default MessageReply;
