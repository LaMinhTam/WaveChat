import PropTypes from "prop-types";
import s3ImageUrl from "../../utils/s3ImageUrl";
import { axiosPrivate } from "../../api/axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setRender } from "../../store/friendSlice";
import { setId } from "../../store/conversationSlice";

const FriendCard = ({ data, type }) => {
    const dispatch = useDispatch();
    const handleAccept = async () => {
        try {
            const res = await axiosPrivate.post(
                `/friend/accept?_id=${data?.user_id}`
            );
            if (res.data.status === 200) {
                const response = await axiosPrivate.post(
                    "/conversation/create",
                    {
                        member_id: data?.user_id,
                    }
                );
                if (response.data.message === "OK") {
                    dispatch(setRender(Math.random() * 1000));
                    dispatch(setId(response.data.data.conversation_id));
                    toast.success("Hai bạn đã trở thành bạn bè");
                }
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi");
        }
    };
    const handleReCall = async () => {
        try {
            const res = await axiosPrivate.post(
                `/friend/remove-request?_id=${data?.user_id}`
            );
            if (res.data.status === 200) {
                dispatch(setRender(Math.random() * 1000));
                toast.success(
                    `Đã thu hồi lời mời kết bạn từ ${data?.full_name}`
                );
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi");
        }
    };

    const handleReject = async () => {
        try {
            const res = await axiosPrivate.post(
                `/friend/remove-friend?_id=${data?.user_id}`
            );
            if (res.data.status === 200) {
                dispatch(setRender(Math.random() * 1000));
                toast.success(
                    `Đã từ chối lời mời kết bạn từ ${data?.full_name}`
                );
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi");
        }
    };

    return (
        <div className="w-full min-w-[350px] h-[120px] flex flex-col gap-y-3 p-4 bg-lite">
            <div className="flex items-center gap-x-5">
                <div className="w-[40px] h-[40px] rounded-full">
                    <img
                        className="object-cover w-full h-full rounded-full"
                        src={s3ImageUrl(data?.avatar)}
                        alt={data?.full_name}
                    />
                </div>
                <div className="flex flex-col">
                    <span>{data?.full_name}</span>
                </div>
            </div>
            <div className="flex items-center justify-center gap-x-2">
                {type === "receive" && (
                    <button
                        onClick={handleReject}
                        className="hover:bg-opacity-60 w-full h-[40px] px-4 flex items-center justify-center bg-text6 font-semibold"
                    >
                        <span>Từ chối</span>
                    </button>
                )}
                {type === "receive" && (
                    <button
                        onClick={handleAccept}
                        className="hover:bg-opacity-60 w-full h-[40px] px-4 flex items-center justify-center bg-tertiary text-secondary font-semibold"
                    >
                        <span>Đồng ý</span>
                    </button>
                )}
                {type === "request" && (
                    <button
                        onClick={handleReCall}
                        className="hover:bg-opacity-60 w-full h-[40px] px-4 flex items-center justify-center bg-text6 font-semibold"
                    >
                        <span>Thu hồi</span>
                    </button>
                )}
            </div>
        </div>
    );
};

FriendCard.propTypes = {
    data: PropTypes.object,
    setData: PropTypes.func,
    type: PropTypes.string,
};

export default FriendCard;
