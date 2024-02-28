import PropTypes from "prop-types";
import formatDate from "../../../utils/formatDate";
import s3ConversationImageUrl from "../../../utils/s3ConversationImageUrl";
import { v4 as uuidv4 } from "uuid";
import {
    IconCSV,
    IconDocs,
    IconDownload,
    IconPdf,
    IconTxt,
    IconXLSX,
} from "../../../components/icons";
import formatSize from "../../../utils/formatSize";
import s3ImageUrl from "../../../utils/s3ImageUrl";
const Message = ({ msg, type }) => {
    let time;
    if (msg.createdAt) {
        time = formatDate(msg.createdAt);
    } else {
        time = formatDate(msg.created_at);
    }
    return (
        <div
            className={`max-w-[75%] w-full h-full m-2 ${
                type === "send" ? "ml-auto" : "flex items-start gap-x-2"
            }`}
        >
            {type === "receive" && (
                <div className="w-10 h-10 rounded-full">
                    <img
                        src={s3ImageUrl(msg.user?.avatar, msg.user?._id)}
                        alt=""
                        className="object-cover w-full h-full rounded-full"
                    />
                </div>
            )}
            <div className="flex flex-col items-start justify-center p-3 ml-auto rounded gap-y-2 bg-tertiary custom-message__block">
                <span>{msg.media.length <= 0 && msg?.message}</span>
                {msg.media.length > 0 &&
                    msg.media.map((media) => {
                        let fileType = media.split(";")[0];
                        let fileName = media.split(";")[1];
                        const imageUri = s3ConversationImageUrl(
                            fileName,
                            msg.user_id
                        );
                        let type = fileType.split("/")[0];
                        let fileExtension = fileName.split(".")[1];
                        let size = media.split(";")[2];
                        return (
                            <div key={uuidv4()}>
                                {type === "image" ? (
                                    <div className="w-[250px] h-[250px] rounded">
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
                                ) : (
                                    <div className="flex items-center gap-x-2 w-[376px]">
                                        <div className="flex items-center w-full">
                                            <div className="flex items-center justify-center gap-x-3">
                                                {fileExtension === "pdf" && (
                                                    <IconPdf />
                                                )}
                                                {fileExtension === "csv" && (
                                                    <IconCSV />
                                                )}
                                                {fileExtension === "xlsx" && (
                                                    <IconXLSX />
                                                )}
                                                {fileExtension === "docx" && (
                                                    <IconDocs />
                                                )}
                                                {fileExtension === "txt" && (
                                                    <IconTxt />
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-wrap">
                                                        {fileName}
                                                    </span>
                                                    <span className="text-xs text-text3">
                                                        {formatSize(size)}
                                                    </span>
                                                </div>
                                            </div>
                                            <button className="flex items-center justify-center ml-auto rounded w-7 h-7 bg-lite">
                                                <IconDownload />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                <span className="text-sm text-text3">{time}</span>
            </div>
        </div>
    );
};
Message.propTypes = {
    msg: PropTypes.object,
    type: PropTypes.string.isRequired,
};

export default Message;
