import handleFormatNotificationMessage from "../../../utils/handleFormatNotificationMessage";
import PropTypes from "prop-types";
const Notification = ({ msg, currentUserId }) => {
    return (
        <span className={`text-sm text-secondary text-center my-2`}>
            {handleFormatNotificationMessage(msg, currentUserId)}
        </span>
    );
};

Notification.propTypes = {
    msg: PropTypes.object,
    currentUserId: PropTypes.string,
};

export default Notification;
