import PropTypes from "prop-types";

const MessageImage = ({ media, setIsOpenImage }) => {
    let url = media.split(";")[3];
    return (
        <div
            className="w-[250px] h-[250px] rounded cursor-pointer"
            onClick={() => setIsOpenImage(true)}
        >
            <img
                src={url}
                alt=""
                className="object-cover w-full h-full rounded"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = url;
                    return;
                }}
            />
        </div>
    );
};
MessageImage.propTypes = {
    media: PropTypes.string,
    setIsOpenImage: PropTypes.func,
};

export default MessageImage;
