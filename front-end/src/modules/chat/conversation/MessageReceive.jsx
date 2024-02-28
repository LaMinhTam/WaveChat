import PropTypes from "prop-types";
import formatDate from "../../../utils/formatDate";
const MessageReceive = ({ msg, imageUrl }) => {
    return (
        <div className="max-w-[75%] w-full h-full m-2 flex items-start gap-x-2">
            <div className="w-10 h-10 rounded-full">
                <img
                    src={imageUrl}
                    alt=""
                    className="object-cover w-full h-full rounded-full"
                />
            </div>
            <div className="flex flex-col items-start justify-center p-3 rounded gap-y-2 bg-lite custom-message__block">
                <span>{msg.message}</span>
                <span>{formatDate(msg.created_at)}</span>
            </div>
        </div>
    );
};

MessageReceive.propTypes = {
    msg: PropTypes.object,
    imageUrl: PropTypes.string,
};

export default MessageReceive;
