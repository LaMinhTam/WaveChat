import { useSelector } from "react-redux";
import { IconTrash } from "../../../components/icons";
import InfoFile from "./Info/InfoFile";
import InfoHeader from "./Info/InfoHeader";
import InfoImage from "./Info/InfoImage";
import InfoOption from "./Info/InfoOption";
import InfoUser from "./Info/InfoUser";
import PropTypes from "prop-types";
import { useState } from "react";

const ConversationInfo = ({ name, images, files }) => {
    const showStorage = useSelector((state) => state.common.showStorage);
    const [option, setOption] = useState("image");
    return (
        <div className="min-w-[344px] h-screen flex flex-col justify-start bg-lite shadow-md overflow-x-hidden overflow-y-scroll custom-scrollbar">
            <InfoHeader type={showStorage ? "storage" : ""} />
            {showStorage ? (
                <div>
                    <div className="flex items-center justify-around m-2 mb-5 font-medium">
                        <button
                            className={
                                option === "image"
                                    ? "border-b-2 border-secondary w-[100px]"
                                    : ""
                            }
                            onClick={() => setOption("image")}
                        >
                            Ảnh / Video
                        </button>
                        <button
                            className={
                                option === "file"
                                    ? "border-b-2 border-secondary w-[100px]"
                                    : ""
                            }
                            onClick={() => setOption("file")}
                        >
                            File
                        </button>
                    </div>
                    <div>
                        {option === "image" ? (
                            <InfoImage images={images} type="storage" />
                        ) : (
                            <InfoFile files={files} type="storage" />
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex-1">
                    <InfoUser name={name} />
                    <InfoOption number={4} />
                    <InfoImage images={images} />
                    <InfoFile files={files} />
                    <button className="w-full flex items-center gap-x-2 h-[48px] hover:bg-text6 px-4 font-medium text-error">
                        <IconTrash />
                        <span>Xóa lịch sử trò chuyện</span>
                    </button>
                </div>
            )}
        </div>
    );
};

ConversationInfo.propTypes = {
    name: PropTypes.string,
    images: PropTypes.array,
    files: PropTypes.array,
};

export default ConversationInfo;
