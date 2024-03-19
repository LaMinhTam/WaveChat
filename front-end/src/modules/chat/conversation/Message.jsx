import PropTypes from "prop-types";
import formatDate from "../../../utils/formatDate";
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
import Viewer from "react-viewer";
import { useState } from "react";
import s3ConversationUrl from "../../../utils/s3ConversationUrl";
import { useSelector } from "react-redux";
const Message = ({ msg, type }) => {
    const [isOpenImage, setIsOpenImage] = useState(false);
    const handleDownloadFile = (fileName) => {
        const link = document.createElement("a");
        link.href = s3ConversationUrl(fileName, msg.user._id, "file");
        link.setAttribute("download", fileName);
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        link.remove();
    };
    const progress = useSelector((state) => state.common.progress);
    const currentFileName = useSelector(
        (state) => state.common.currentFileName
    );
    return (
        <div
            className={`max-w-[75%] w-full h-full m-2 ${
                type === "send" ? "ml-auto" : "flex items-start gap-x-2 mr-auto"
            }`}
        >
            <div className="flex items-center justify-center gap-x-3">
                {type === "receive" && (
                    <div className="w-10 h-10 rounded-full">
                        <img
                            src={s3ImageUrl(msg.user?.avatar, msg.user?._id)}
                            alt=""
                            className="object-cover w-full h-full rounded-full"
                        />
                    </div>
                )}
                <div
                    className={`flex flex-col items-start justify-center p-3 rounded gap-y-2 bg-tertiary custom-message__block ml-auto`}
                >
                    <span>{msg.media.length <= 0 && msg?.message}</span>
                    {msg?.media?.length > 0 &&
                        msg.media.map((media) => {
                            let fileType = media.split(";")[0];
                            let fileName = media.split(";")[1];
                            let file_name = fileName.split("-")[1];
                            const imageUri = s3ConversationUrl(
                                fileName,
                                msg.user._id
                            );
                            let type = fileType.split("/")[0];
                            let fileExtension = fileName.split(".")[1];
                            let size = media.split(";")[2];
                            return (
                                <div key={uuidv4()}>
                                    {type === "image" ? (
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
                                    ) : (
                                        <div className="flex items-center gap-x-2 w-[376px]">
                                            <div className="flex items-center w-full">
                                                <div className="flex items-center justify-center gap-x-3">
                                                    {fileExtension ===
                                                        "pdf" && <IconPdf />}
                                                    {fileExtension ===
                                                        "csv" && <IconCSV />}
                                                    {fileExtension ===
                                                        "xlsx" && <IconXLSX />}
                                                    {fileExtension ===
                                                        "docx" && <IconDocs />}
                                                    {fileExtension ===
                                                        "txt" && <IconTxt />}
                                                    <div className="flex flex-col">
                                                        <span className="text-sm text-wrap">
                                                            {file_name}
                                                        </span>

                                                        <div className="flex items-center justify-between">
                                                            {progress > 0 &&
                                                                currentFileName ===
                                                                    file_name && (
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
                                                                {formatSize(
                                                                    size
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    className="flex items-center justify-center ml-auto rounded w-7 h-7 bg-lite"
                                                    disabled={progress > 0}
                                                    onClick={() =>
                                                        handleDownloadFile(
                                                            fileName
                                                        )
                                                    }
                                                >
                                                    <IconDownload />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    <Viewer
                                        visible={isOpenImage}
                                        onClose={() => {
                                            setIsOpenImage(false);
                                        }}
                                        images={[{ src: imageUri, alt: "" }]}
                                    />
                                </div>
                            );
                        })}
                    <span className="text-sm text-text3">
                        {formatDate(msg.created_at)}
                    </span>
                </div>
            </div>
        </div>
    );
};
Message.propTypes = {
    msg: PropTypes.object,
    type: PropTypes.string.isRequired,
};

export default Message;
