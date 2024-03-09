import { useState } from "react";
import { IconMore } from "../../../../components/icons";
import PropTypes from "prop-types";
import s3ConversationUrl from "../../../../utils/s3ConversationUrl";
import Viewer from "react-viewer";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";
import { setShowStorage } from "../../../../store/commonSlice";
const InfoImage = ({ images, type = "" }) => {
    const [show, setShow] = useState(true);
    const [visible, setVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const dispatch = useDispatch();
    let imageList = [];

    if (images.length > 8 && type !== "storage") {
        imageList = images.slice(0, 8).map((item) => {
            let fileName = item.media.split(";")[1];
            return s3ConversationUrl(fileName, item.id);
        });
    } else {
        imageList = images.map((item) => {
            let fileName = item.media.split(";")[1];
            return s3ConversationUrl(fileName, item.id);
        });
    }

    const handleImageClick = (index) => {
        setActiveIndex(index);
        setVisible(true);
    };
    return (
        <div className="w-full border-b-8">
            {type !== "storage" && (
                <div className="flex items-center justify-between px-4 py-2">
                    <h3>Ảnh/Video</h3>
                    <button onClick={() => setShow(!show)}>
                        <IconMore />
                    </button>
                </div>
            )}
            {show && (
                <>
                    <div className="grid grid-cols-4 gap-2 px-4">
                        {imageList.map((imageUri, index) => {
                            return (
                                <div key={uuidv4()}>
                                    <div
                                        className="w-[72px] h-[72px] rounded-md bg-text6 cursor-pointer"
                                        onClick={() => handleImageClick(index)}
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
            <Viewer
                visible={visible}
                onClose={() => {
                    setVisible(false);
                }}
                images={imageList.map((src) => ({ src }))}
                activeIndex={activeIndex}
            />
        </div>
    );
};

InfoImage.propTypes = {
    images: PropTypes.array,
    type: PropTypes.string,
};

export default InfoImage;
