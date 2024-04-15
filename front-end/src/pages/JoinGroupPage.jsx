import { useParams, useSearchParams } from "react-router-dom";
import QRCode from "react-qr-code";
import { axiosPrivate } from "../api/axios";
import { useDispatch } from "react-redux";

import { toast } from "react-toastify";
import { setId } from "../store/conversationSlice";
import { useEffect } from "react";
import { useState } from "react";
import s3ImageUrl from "../utils/s3ImageUrl";
import { getUserId } from "../utils/auth";

const JoinGroupPage = () => {
    const { conversationId } = useParams();
    const [searchParams] = useSearchParams();
    const linkJoin = searchParams.get("link_join");
    const dispatch = useDispatch();
    const [details, setDetails] = useState({});
    console.log("JoinGroupPage ~ details:", details);
    const [isJoin, setIsJoin] = useState(false);
    const [isConfirm, setIsConfirm] = useState(false);
    const currentUserId = getUserId();
    useEffect(() => {
        async function fetchConversation() {
            const res = await axiosPrivate.get(
                `/conversation/detail?conversation_id=${conversationId}`
            );
            console.log("fetchConversation ~ res:", res);
            if (res.data.status === 200) {
                setDetails(res.data.data);
            }
        }
        if (conversationId) {
            fetchConversation();
        }
    }, [conversationId]);

    useEffect(() => {
        let isInGroup = false;
        details?.members?.forEach((member) => {
            if (member === currentUserId) {
                isInGroup = true;
            }
        });
        setIsJoin(isInGroup);
    }, [currentUserId, details?.members]);
    const handleJoinGroupWithLink = async () => {
        try {
            const res = await axiosPrivate.post(
                `/conversation-group/join-with-link?link_join=${linkJoin}`
            );
            console.log("handleJoinGroupWithLink ~ res:", res);
            if (res.data.status === 200) {
                if (details?.is_confirm_new_member === 0) {
                    dispatch(setId(conversationId));
                    toast.success("Tham gia nhóm thành công");
                    setIsJoin(true);
                    setIsConfirm(false);
                } else if (details?.is_confirm_new_member === 1) {
                    toast.success("Yêu cầu tham gia nhóm thành công");
                    setIsJoin(false);
                    setIsConfirm(true);
                }
            } else toast.error(res.data.message);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="w-full h-screen overflow-hidden bg-text6">
            <div className="w-full h-[64px] px-12 flex items-center bg-lite shadow-md">
                <h1 className="text-3xl font-extrabold text-secondary">
                    Wave chat
                </h1>
            </div>
            <div className="mt-6 min-h-[320px] p-10 w-[832px] rounded flex items-center justify-center bg-lite mx-auto">
                <div className="flex flex-col items-start justify-center flex-shrink-0 min-w-[592px]">
                    <div className="flex items-start justify-center mb-10">
                        <div className="rounded-full w-[80px] h-[80px] mr-6">
                            <img
                                src={s3ImageUrl(details?.avatar)}
                                alt={details?.name}
                                className="object-cover w-full h-full rounded-full"
                            />
                        </div>
                        <div className="flex flex-col items-start justify-center">
                            <h1 className="mb-2 text-2xl font-medium">
                                {details?.name}
                            </h1>
                            <span className="mb-4 text-text7">Nhóm</span>
                            <button
                                disabled={isJoin || isConfirm}
                                onClick={handleJoinGroupWithLink}
                                className="w-[216px] px-3 bg-secondary text-lite rounded-md h-[48px]"
                            >
                                {isJoin && "Đã tham gia"}
                                {isConfirm && "Đã gửi yêu cầu"}
                                {!isJoin && !isConfirm && "Tham gia nhóm"}
                            </button>
                        </div>
                    </div>
                    <div>
                        <h3 className="mb-4 font-medium text-[20px]">
                            Mô tả nhóm
                        </h3>
                        <p className="font-normal text-[15px] text-text7">
                            Nhóm chưa có mô tả.
                        </p>
                    </div>
                </div>
                <div className="">
                    <div className="w-[200px] h-[200px]">
                        {linkJoin && <QRCode value={linkJoin} size={200} />}
                    </div>
                    <p className="mt-2 text-xs text-text7">
                        Mở wavechat, bấm quét QR để quét và xem trên điện thoại
                    </p>
                </div>
            </div>
        </div>
    );
};

export default JoinGroupPage;
