import { useDispatch } from "react-redux";
import { IconBack } from "../../../../components/icons";
import PropTypes from "prop-types";
import {
    setShowConversationPermission,
    setShowListMemberInGroup,
    setShowStorage,
} from "../../../../store/commonSlice";
const InfoHeader = ({ type = "" }) => {
    const dispatch = useDispatch();
    let classNames = "";
    if (type === "storage" || type === "permission" || type === "listMember") {
        classNames = "";
    } else {
        classNames = "hidden";
    }
    return (
        <div className="flex-shrink-0 px-[15px] h-[68px] text-center border-b border-b-gray-300 flex items-center justify-center">
            <button
                className={classNames}
                onClick={() => {
                    dispatch(setShowStorage(false));
                    dispatch(setShowConversationPermission(false));
                    dispatch(setShowListMemberInGroup(false));
                }}
            >
                <IconBack />
            </button>
            <h1 className="mx-auto text-lg font-medium">
                {type === "storage" && "Kho lưu trữ"}
                {type === "permission" && "Quản lý nhóm"}
                {type === "listMember" && "Thành viên"}
                {type !== "storage" &&
                    type !== "permission" &&
                    type !== "listMember" &&
                    "Thông tin hội thoại"}
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
