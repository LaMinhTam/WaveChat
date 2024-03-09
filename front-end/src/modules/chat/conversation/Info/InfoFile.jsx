import { useState } from "react";
import {
    IconCSV,
    IconDocs,
    IconMore,
    IconPdf,
    IconTxt,
    IconXLSX,
} from "../../../../components/icons";
import PropTypes from "prop-types";
import formatSize from "../../../../utils/formatSize";
import { useDispatch } from "react-redux";
import { setShowStorage } from "../../../../store/commonSlice";

const InfoFile = ({ files, type = "" }) => {
    const [show, setShow] = useState(true);
    const dispatch = useDispatch();
    let fileList = [];
    if (files.length > 3 && type !== "storage") {
        fileList = files.slice(0, 3);
    } else {
        fileList = files;
    }
    return (
        <div className="w-full border-b-8">
            {type !== "storage" && (
                <div className="flex items-center justify-between px-4 py-2">
                    <h3>File</h3>
                    <button onClick={() => setShow(!show)}>
                        <IconMore />
                    </button>
                </div>
            )}
            {show && (
                <>
                    <div className="grid grid-cols-1 gap-2">
                        {fileList?.map((file, index) => {
                            let fileName = file.media.split(";")[1];
                            fileName = fileName.split("-")[1];
                            let fileExtension = fileName.split(".")[1];
                            let size = file.media.split(";")[2];
                            return (
                                <div
                                    key={index}
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
                                            <div className="flex flex-col">
                                                <span className="text-sm text-wrap line-clamp-1">
                                                    {fileName}
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

                    {type !== "storage" && (
                        <button
                            className="w-[310px] h-8 px-4 m-4 rounded bg-text6 font-medium"
                            onClick={() => dispatch(setShowStorage(true))}
                        >
                            Xem tất cả
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

InfoFile.propTypes = {
    files: PropTypes.array,
    type: PropTypes.string,
};

export default InfoFile;
