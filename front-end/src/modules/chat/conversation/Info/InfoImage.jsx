import { useState } from "react";
import { IconMore } from "../../../../components/icons";
import PropTypes from "prop-types";
import s3ConversationUrl from "../../../../utils/s3ConversationUrl";
import Viewer from "react-viewer";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";
import { setShowStorage } from "../../../../store/commonSlice";
const InfoImage = ({ images, type = "", conversation_id }) => {
    const [show, setShow] = useState(true);
    const [visible, setVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const dispatch = useDispatch();
    let imageList = [];

    if (images.length > 8 && type !== "storage") {
        imageList = images.slice(0, 8).map((item) => {
            let fileName = item.media.split(";")[1];
            return s3ConversationUrl(fileName, conversation_id);
        });
    } else if (images.length <= 8 && type !== "storage") {
        imageList = images.map((item) => {
            let fileName = item.media.split(";")[1];
            return s3ConversationUrl(fileName, conversation_id);
        });
    } else {
        const list = images.map((group) => {
            return group.data.map((item) => {
                let fileName = item.media.split(";")[1];
                return s3ConversationUrl(fileName, conversation_id);
            });
        });
        imageList = list.flat();
    }

    const handleImageClick = (index) => {
        setActiveIndex(index);
        setVisible(true);
    };
    return (
        <div>
            {type !== "storage" && (
                <div className="w-full border-b-8">
                    <div className="flex items-center justify-between px-4 py-2">
                        <h3>Ảnh/Video</h3>
                        <button onClick={() => setShow(!show)}>
                            <IconMore />
                        </button>
                    </div>
                    {show && (
                        <>
                            <div className="grid grid-cols-4 gap-2 px-4">
                                {imageList.map((imageUri, index) => {
                                    return (
                                        <div key={uuidv4()}>
                                            <div
                                                className="w-[72px] h-[72px] rounded-md bg-text6 cursor-pointer"
                                                onClick={() =>
                                                    handleImageClick(index)
                                                }
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
                                        </div>
                                    );
                                })}
                            </div>
                            <button
                                className="w-[310px] h-8 px-4 m-4 rounded bg-text6 font-medium"
                                onClick={() => dispatch(setShowStorage(true))}
                            >
                                Xem tất cả
                            </button>
                        </>
                    )}
                    <Viewer
                        visible={visible}
                        onClose={() => {
                            setVisible(false);
                        }}
                        images={imageList.map((src) => ({ src }))}
                        activeIndex={activeIndex}
                    />
                </div>
            )}
            {type === "storage" && (
                <div>
                    {images.map((group) => {
                        return (
                            <div
                                key={uuidv4()}
                                className="w-full pb-4 border-b-8"
                            >
                                <div className="flex items-center justify-between px-4 py-2">
                                    <h3>{group.formattedTime}</h3>
                                </div>
                                <div className="grid grid-cols-4 gap-2 px-4">
                                    {group.data.map((item, index) => {
                                        let fileName = item.media.split(";")[1];
                                        return (
                                            <div
                                                key={uuidv4()}
                                                className="w-[72px] h-[72px] rounded-md bg-text6 cursor-pointer"
                                                onClick={() =>
                                                    handleImageClick(index)
                                                }
                                            >
                                                <img
                                                    src={s3ConversationUrl(
                                                        fileName,
                                                        conversation_id
                                                    )}
                                                    alt=""
                                                    className="object-cover w-full h-full rounded"
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                    <Viewer
                        visible={visible}
                        onClose={() => {
                            setVisible(false);
                        }}
                        images={imageList.map((src) => ({ src }))}
                        activeIndex={activeIndex}
                    />
                </div>
            )}
        </div>
    );
};

InfoImage.propTypes = {
    images: PropTypes.array,
    type: PropTypes.string,
    conversation_id: PropTypes.string,
};

export default InfoImage;
