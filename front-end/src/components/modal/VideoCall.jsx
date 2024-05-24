import { useSocket } from "../../contexts/socket-context";
import DailyIframe from "@daily-co/daily-js";
import PropTypes from "prop-types";
import { getUserName } from "../../utils/auth";
const VideoCall = () => {
    const currentUserName = getUserName();
    const {
        socket,
        requestVideoCallData,
        receiveCalledVideo,
        setReceiveCalledVideo,
        callAccepted,
        setCalledUser,
        setRequestVideoCallData,
        setShowVideoCallModal,
        setCallDenied,
        deleteRoom,
    } = useSocket();
    const handleAnswerCall = async () => {
        try {
            setShowVideoCallModal(false);
            const callFrame = DailyIframe.createFrame({
                showFullscreenButton: true,
                iframeStyle: {
                    position: "absolute",
                    width: "700px",
                    height: "400px",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                },
            });

            await callFrame.join({
                url: requestVideoCallData.signal_data.room_url,
                showFullscreenButton: true,
                showLeaveButton: true,
                showParticipantsBar: true,
                userName: currentUserName,
            });

            callFrame.on("left-meeting", () => {
                callFrame.destroy();
            });

            callFrame.on("participant-left", async () => {
                callFrame.destroy();
                // Delete the room on daily.co
                try {
                    await deleteRoom(requestVideoCallData.signal_data.room_id);
                } catch (error) {
                    console.error(`Failed to delete room: ${error.message}`);
                }
            });

            socket.emit("answer-call-request", {
                target_user_id: requestVideoCallData.user_from._id,
                signal_data: {
                    type: "video",
                    room_id: requestVideoCallData.signal_data.room_id,
                },
                message: `Chấp nhận cuộc gọi video từ ${
                    requestVideoCallData?.user_from?.full_name ?? ""
                }`,
            });
        } catch (error) {
            console.error("Error answering video call:", error);
            // Xử lý lỗi tham gia cuộc gọi
        }
    };

    const handleRejectCall = () => {
        setCallDenied(true);
        setReceiveCalledVideo(false);
        setCalledUser({});
        setRequestVideoCallData({});
        setShowVideoCallModal(false);
        socket.emit("deny-call-request", {
            target_user_id: requestVideoCallData.user_from._id,
            signal_data: {
                type: "video",
            },
            message: `Từ chối cuộc gọi video từ ${
                requestVideoCallData?.user_from?.full_name ?? ""
            }`,
        });
    };
    return (
        <div className="w-[700px] h-full flex flex-col rounded-lg">
            {receiveCalledVideo && !callAccepted && (
                <CallingComp
                    full_name={requestVideoCallData?.user_from?.full_name}
                    avatar={requestVideoCallData?.user_from?.avatar}
                    handleAnswerCall={handleAnswerCall}
                    handleRejectCall={handleRejectCall}
                />
            )}
        </div>
    );
};

const CallingComp = ({
    full_name,
    avatar,
    handleAnswerCall,
    handleRejectCall,
}) => {
    return (
        <>
            <div className="flex items-center w-full h-[48px] p-2 bg-strock">
                <span className="text-[16px] font-semibold mr-auto">
                    Cuộc gọi video từ {full_name ?? ""}
                </span>
            </div>
            <div className="w-full h-[350px]">
                <img
                    src={avatar ?? "https://source.unsplash.com/random"}
                    alt=""
                    className="object-contain w-full h-full"
                />
            </div>
            <div className="w-full h-[60px] flex items-center justify-center gap-x-3">
                <button
                    onClick={handleAnswerCall}
                    className="w-[120px] h-[48px] bg-primary hover:bg-opacity-70 text-lite"
                >
                    <span>Chấp nhận</span>
                </button>
                <button
                    onClick={handleRejectCall}
                    className="w-[120px] h-[48px] bg-error hover:bg-opacity-70 text-lite"
                >
                    <span>Từ chối</span>
                </button>
            </div>
        </>
    );
};

CallingComp.propTypes = {
    full_name: PropTypes.string,
    avatar: PropTypes.string,
    handleAnswerCall: PropTypes.func,
    handleRejectCall: PropTypes.func,
    type: PropTypes.string,
};

export default VideoCall;
