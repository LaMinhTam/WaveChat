import PropTypes from "prop-types";
import {
    IconCSV,
    IconDocs,
    IconDownload,
    IconFileDefault,
    IconPdf,
    IconTxt,
    IconXLSX,
} from "../../../../components/icons";
import formatSize from "../../../../utils/formatSize";
import handleDownloadFile from "../../../../utils/handleDownLoadFile";
const MessageFile = ({ media, progress = 0, currentFileName = "" }) => {
    let fileName = media.split(";")[1];
    let file_name = fileName.split("-")[1];
    let fileExtension = fileName.split(".")[1];
    let size = media.split(";")[2];
    let url = media.split(";")[3];
    return (
        <div>
            <div className="flex flex-col items-center gap-y-2 w-[376px]">
                <div className="flex items-center w-full">
                    <div className="flex items-center justify-center gap-x-3">
                        {fileExtension === "pdf" && <IconPdf />}
                        {fileExtension === "csv" && <IconCSV />}
                        {fileExtension === "xlsx" && <IconXLSX />}
                        {fileExtension === "docx" && <IconDocs />}
                        {fileExtension === "txt" && <IconTxt />}
                        {fileExtension !== "pdf" &&
                            fileExtension !== "csv" &&
                            fileExtension !== "xlsx" &&
                            fileExtension !== "docx" &&
                            fileExtension !== "txt" && <IconFileDefault />}
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
                    <button
                        className="flex items-center justify-center ml-auto rounded w-7 h-7 bg-lite"
                        disabled={progress > 0}
                        onClick={() => handleDownloadFile(fileName, url)}
                    >
                        <IconDownload />
                    </button>
                </div>
            </div>
        </div>
    );
};

MessageFile.propTypes = {
    media: PropTypes.string,
    progress: PropTypes.number,
    currentFileName: PropTypes.string,
};

export default MessageFile;
