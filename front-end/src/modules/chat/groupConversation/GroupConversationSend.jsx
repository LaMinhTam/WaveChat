import PropTypes from "prop-types";
import formatDate from "../../../utils/formatDate";

const GroupMessageSend = ({ message }) => {
    let time;
    if (message.createdAt) {
        time = formatDate(message.createdAt);
    } else {
        time = formatDate(message.created_at);
    }

    return (
        <div className="max-w-[75%] w-full h-full m-2 ml-auto">
            <div className="flex flex-col items-start justify-center p-3 ml-auto rounded gap-y-2 bg-tertiary custom-message__block">
                <span>{message?.message}</span>
                <span className="text-sm text-text3">{time}</span>
            </div>
        </div>
    );
};

GroupMessageSend.propTypes = {
    message: PropTypes.shape({
        message: PropTypes.string.isRequired,
        created_at: PropTypes.string.isRequired,
        createdAt: PropTypes.string, // Optional, depending on your data structure
    }).isRequired,
};

export default GroupMessageSend;
