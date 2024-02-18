import PropTypes from "prop-types";
import formatDate from "../../../utils/formatDate";
// import formatDate from "../../../utils/formatDate";
const MessageSend = ({ msg }) => {
    const { time } = formatDate(msg?.created_at);

    return (
        <div className="max-w-[75%] w-full h-full m-2 ml-auto">
            <div className="flex flex-col items-start justify-center p-3 ml-auto rounded gap-y-2 bg-tertiary custom-message__block">
                <span>{msg?.message}</span>
                <span className="text-sm text-text3">{time}</span>
            </div>
        </div>
    );
};
MessageSend.propTypes = {
    msg: PropTypes.object,
};

export default MessageSend;
