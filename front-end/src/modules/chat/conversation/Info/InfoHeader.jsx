import { useDispatch } from "react-redux";
import { IconBack } from "../../../../components/icons";
import PropTypes from "prop-types";
import { setShowStorage } from "../../../../store/commonSlice";
const InfoHeader = ({ type = "" }) => {
    const dispatch = useDispatch();
    return (
        <div className="flex-shrink-0 px-[15px] h-[68px] text-center border-b border-b-gray-300 flex items-center justify-center">
            <button
                className={type === "storage" ? "" : "hidden"}
                onClick={() => dispatch(setShowStorage(false))}
            >
                <IconBack />
            </button>
            <h1 className="mx-auto text-lg font-medium">
                {type === "storage" ? "Kho lưu trữ" : "Thông tin hội thoại"}
            </h1>
            <button className={`text-sm ${type === "storage" ? "" : "hidden"}`}>
                Chọn
            </button>
        </div>
    );
};

InfoHeader.propTypes = {
    type: PropTypes.string,
};

export default InfoHeader;
