import ReactPlayer from "react-player";
import PropTypes from "prop-types";
import IconVideo from "../../../../components/icons/IconVideo";
import formatSize from "../../../../utils/formatSize";

const MessageVideo = ({ media, progress, currentFileName }) => {
    let fileName = media.split(";")[1];
    let file_name = fileName.split("-")[1];
    let size = media.split(";")[2];
    let url = media.split(";")[3];
    return (
        <div>
            <div className="flex flex-col items-center gap-y-2 w-[376px]">
                <ReactPlayer url={url} controls width="100%" height="200px" />
                <div className="flex items-center w-full">
                    <div className="flex items-center justify-center gap-x-3">
                        <IconVideo />
                        <div className="flex flex-col">
                            <span className="text-sm text-wrap">
                                {file_name}
                            </span>
                            <div className="flex items-center justify-between">
                                {progress > 0 &&
                                    currentFileName === file_name && (
                                        <div className="w-full h-2 bg-gray-200 rounded">
                                            <div
                                                className="h-full text-xs text-center text-white bg-blue-500 rounded"
                                                style={{
                                                    width: `${progress}%`,
                                                }}
                                            ></div>
                                        </div>
                                    )}
                                <span className="flex-shrink-0 text-xs text-text3">
                                    {formatSize(size)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

MessageVideo.propTypes = {
    media: PropTypes.string,
    progress: PropTypes.number,
    currentFileName: PropTypes.string,
};

export default MessageVideo;
