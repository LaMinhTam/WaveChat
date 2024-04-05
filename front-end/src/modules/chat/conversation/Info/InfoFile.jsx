import { useState } from "react";
import {
    IconCSV,
    IconDocs,
    IconFileDefault,
    IconMore,
    IconPdf,
    IconTxt,
    IconXLSX,
} from "../../../../components/icons";
import PropTypes from "prop-types";
import formatSize from "../../../../utils/formatSize";
import { useDispatch } from "react-redux";
import {
    setShowStorage,
    setStorageOption,
} from "../../../../store/commonSlice";
import { v4 as uuidv4 } from "uuid";
import handleDownloadFile from "../../../../utils/handleDownLoadFile";
import IconVideo from "../../../../components/icons/IconVideo";

const InfoFile = ({ files, type = "", conversation_id }) => {
    const [show, setShow] = useState(true);
    const dispatch = useDispatch();
    let fileList = [];
    if (files.length > 3 && type !== "storage") {
        fileList = files.slice(0, 3);
    } else {
        fileList = files;
    }
    return (
        <>
            {type !== "storage" && (
                <div className="w-full border-b-8">
                    <div className="flex items-center justify-between px-4 py-2">
                        <h3>File</h3>
                        <button onClick={() => setShow(!show)}>
                            <IconMore />
                        </button>
                    </div>
                    {show && (
                        <>
                            <div className="grid grid-cols-1 gap-2">
                                {fileList?.map((file) => {
                                    let fileName = file.media.split(";")[1];
                                    let file_name = fileName.split("-")[1];
                                    let fileExtension = fileName.split(".")[1];
                                    let size = file.media.split(";")[2];
                                    return (
                                        <div
                                            key={uuidv4()}
                                            className="w-full h-[64px] rounded-md hover:bg-text6 px-4"
                                        >
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
                                                    {type !== "video" &&
                                                        fileExtension !==
                                                            "pdf" &&
                                                        fileExtension !==
                                                            "csv" &&
                                                        fileExtension !==
                                                            "xlsx" &&
                                                        fileExtension !==
                                                            "docx" &&
                                                        fileExtension !==
                                                            "txt" && (
                                                            <IconFileDefault />
                                                        )}
                                                    {type === "video" && (
                                                        <IconVideo />
                                                    )}
                                                    <div
                                                        className="flex flex-col cursor-pointer"
                                                        onClick={() =>
                                                            handleDownloadFile(
                                                                fileName,
                                                                conversation_id
                                                            )
                                                        }
                                                    >
                                                        <span className="text-sm text-wrap line-clamp-1">
                                                            {file_name}
                                                        </span>
                                                        <span className="text-xs text-text3">
                                                            {formatSize(size)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <button
                                className="w-[310px] h-8 px-4 m-4 rounded bg-text6 font-medium"
                                onClick={() => {
                                    dispatch(setShowStorage(true));
                                    dispatch(setStorageOption("file"));
                                }}
                            >
                                Xem tất cả
                            </button>
                        </>
                    )}
                </div>
            )}
            {type === "storage" &&
                files.map((group) => (
                    <div key={uuidv4()} className="w-full pb-4 border-b-8">
                        <div className="flex items-center justify-between px-4 py-2">
                            <h3>{group.formattedTime}</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-2 px-4">
                            {group.data.map((file) => {
                                let fileName = file.media.split(";")[1];
                                let file_name = fileName.split("-")[1];
                                let fileExtension = fileName.split(".")[1];
                                let size = file.media.split(";")[2];
                                return (
                                    <div
                                        key={uuidv4()}
                                        className="w-full h-[64px] rounded-md hover:bg-text6 px-4"
                                    >
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
                                                {type !== "video" &&
                                                    fileExtension !== "pdf" &&
                                                    fileExtension !== "csv" &&
                                                    fileExtension !== "xlsx" &&
                                                    fileExtension !== "docx" &&
                                                    fileExtension !== "txt" && (
                                                        <IconFileDefault />
                                                    )}
                                                {type === "video" && (
                                                    <IconVideo />
                                                )}
                                                <div
                                                    className="flex flex-col cursor-pointer"
                                                    onClick={() =>
                                                        handleDownloadFile(
                                                            fileName,
                                                            conversation_id
                                                        )
                                                    }
                                                >
                                                    <span className="text-sm text-wrap line-clamp-1">
                                                        {file_name}
                                                    </span>
                                                    <span className="text-xs text-text3">
                                                        {formatSize(size)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
        </>
    );
};

InfoFile.propTypes = {
    files: PropTypes.array,
    type: PropTypes.string,
    conversation_id: PropTypes.string,
};

export default InfoFile;
