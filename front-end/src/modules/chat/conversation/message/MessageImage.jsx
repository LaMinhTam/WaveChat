import s3ConversationUrl from "../../../../utils/s3ConversationUrl";
import PropTypes from "prop-types";

const MessageImage = ({ media, conversation_id, setIsOpenImage }) => {
    let fileName = media.split(";")[1];
    const imageUri = s3ConversationUrl(fileName, conversation_id);
    return (
        <div
            className="w-[250px] h-[250px] rounded cursor-pointer"
            onClick={() => setIsOpenImage(true)}
        >
            <img
                src={imageUri}
                alt=""
                className="object-cover w-full h-full rounded"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = imageUri;
                    return;
                }}
            />
        </div>
    );
};
MessageImage.propTypes = {
    media: PropTypes.string,
    conversation_id: PropTypes.string,
    setIsOpenImage: PropTypes.func,
};

export default MessageImage;
