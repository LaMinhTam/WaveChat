import PropTypes from "prop-types";
import formatDate from "../../../utils/formatDate";

const GroupMessageReceive = ({ message, sender }) => {
    return (
        <div className="max-w-[75%] w-full h-full m-2 flex items-start gap-x-2">
            <div className="w-10 h-10 rounded-full">
                <img
                    src={sender.imageUrl}
                    alt={sender.name}
                    className="object-cover w-full h-full rounded-full"
                />
            </div>
            <div className="flex flex-col items-start justify-center p-3 rounded gap-y-2 bg-lite custom-message__block">
                <span>{message.message}</span>
                <span>{formatDate(message.created_at)}</span>
            </div>
        </div>
    );
};

GroupMessageReceive.propTypes = {
    message: PropTypes.shape({
        message: PropTypes.string.isRequired,
        created_at: PropTypes.string.isRequired,
    }).isRequired,
    sender: PropTypes.shape({
        imageUrl: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
};

export default GroupMessageReceive;
