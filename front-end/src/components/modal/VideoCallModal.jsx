import Crop75Icon from "@mui/icons-material/Crop75";
import CallEndIcon from "@mui/icons-material/CallEnd";
import { IconClose } from "../icons";
import { useEffect, useState } from "react";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardVoiceRoundedIcon from "@mui/icons-material/KeyboardVoiceRounded";
import MicOffRoundedIcon from "@mui/icons-material/MicOffRounded";
import VideocamOffRoundedIcon from "@mui/icons-material/VideocamOffRounded";
import { useDispatch } from "react-redux";
import { setShowRequestVideoCallModal } from "../../store/callSlice";
import { useSocket } from "../../contexts/socket-context";
import Peer from "simple-peer";
import PropTypes from "prop-types";
const VideoCallModal = () => {
    const [receivedStream, setReceivedStream] = useState(null);
    const {
        videoRef,
        userRef,
        connectionRef,
        socket,
        stream,
        setStream,
        callAccepted,
        callDenied,
        callEnded,
        receiveVideoCallRequest,
        setReceiveVideoCallRequest,
        setCallAccepted,
        requestVideoCallData,
        setCallDenied,
        callSignal,
    } = useSocket();
    console.log("VideoCallModal ~ callSignal:", callSignal);
    console.log("VideoCallModal ~ connectionRef:", connectionRef);
    const dispatch = useDispatch();
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const handleVideoClick = () => {
        if (stream) {
            const videoTracks = stream.getVideoTracks();
            if (videoTracks.length > 0) {
                if (videoTracks[0].enabled) {
                    videoTracks[0].stop();
                    stream.removeTrack(videoTracks[0]);
                    setIsVideoOff(true);
                }
            } else {
                navigator.mediaDevices
                    .getUserMedia({ video: true })
                    .then((newStream) => {
                        const newVideoTrack = newStream.getVideoTracks()[0];
                        const audioTracks = stream.getAudioTracks();
                        const newStreamWithAudio = new MediaStream([
                            newVideoTrack,
                            ...audioTracks,
                        ]);
                        setStream(newStreamWithAudio);
                        if (videoRef.current) {
                            videoRef.current.srcObject = newStreamWithAudio;
                        }
                        setIsVideoOff(false);
                    })
                    .catch((err) => console.log(err));
            }
        }
    };

    const handleAudioClick = () => {
        if (stream) {
            const audioTracks = stream.getAudioTracks();
            if (audioTracks.length > 0) {
                audioTracks[0].enabled = !audioTracks[0].enabled;
                setIsMuted(!audioTracks[0].enabled);
            }
        }
    };

    const handleEndCall = () => {
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach((track) => track.stop());
            setStream(null);
        }
        dispatch(setShowRequestVideoCallModal(false));
    };

    const handleAnswerCall = () => {
        setCallAccepted(true);
        setReceiveVideoCallRequest(false);
        const peer = new Peer({ initiator: false, trickle: false, stream });
        peer.on("signal", (data) => {
            console.log("peer.on ~ data:", data);
            socket.emit("answer-call-request", {
                target_user_id: requestVideoCallData.user_from._id,
                signal_data: data,
                message: `Chấp nhận cuộc gọi video từ ${
                    requestVideoCallData?.user_from?.full_name ?? ""
                }`,
            });
        });
        peer.on("stream", (stream) => {
            setReceivedStream(stream);
            console.log(
                "receivedStream:",
                stream.getVideoTracks()?.stats ?? "null"
            );
            userRef.current.srcObject = stream;
        });
        peer.signal(callSignal);
        connectionRef.current = peer;
    };

    const handleRejectCall = () => {
        setReceiveVideoCallRequest(false);
        dispatch(setShowRequestVideoCallModal(false));
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach((track) => track.stop());
            setStream(null);
        }
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

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
                setStream(stream);
                setCallAccepted(false);
                setCallDenied(false);
            })
            .catch((err) => console.log(err));
    }, [setCallAccepted, setCallDenied, setStream]);

    useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [stream, videoRef]);

    return (
        <div className="w-[700px] h-full flex flex-col rounded-lg">
            {!receiveVideoCallRequest && !callAccepted && !callDenied && (
                <CallAccepted
                    stream={stream}
                    receivedStream={receivedStream}
                    videoRef={videoRef}
                    callAccepted={callAccepted}
                    callEnded={callEnded}
                    userRef={userRef}
                    handleVideoClick={handleVideoClick}
                    isVideoOff={isVideoOff}
                    handleEndCall={handleEndCall}
                    handleAudioClick={handleAudioClick}
                    isMuted={isMuted}
                />
            )}
            {callAccepted && !callEnded && (
                <CallAccepted
                    stream={stream}
                    receivedStream={receivedStream}
                    videoRef={videoRef}
                    callAccepted={callAccepted}
                    callEnded={callEnded}
                    userRef={userRef}
                    handleVideoClick={handleVideoClick}
                    isVideoOff={isVideoOff}
                    handleEndCall={handleEndCall}
                    handleAudioClick={handleAudioClick}
                    isMuted={isMuted}
                />
            )}
            {receiveVideoCallRequest && !callAccepted && (
                <>
                    <div className="flex items-center w-full h-[48px] p-2 bg-strock">
                        <span className="text-[16px] font-semibold mr-auto">
                            Cuộc gọi video từ{" "}
                            {requestVideoCallData?.user_from?.full_name ?? ""}
                        </span>
                    </div>
                    <div className="w-full h-[350px]">
                        <img
                            src={
                                requestVideoCallData?.user_from?.avatar ??
                                "https://source.unsplash.com/random"
                            }
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
            )}
        </div>
    );
};

const CallAccepted = ({
    stream,
    receivedStream,
    videoRef,
    callAccepted,
    callEnded,
    userRef,
    handleVideoClick,
    isVideoOff,
    handleEndCall,
    handleAudioClick,
    isMuted,
}) => {
    console.log("receivedStream:", receivedStream);
    console.log("stream:", stream);
    useEffect(() => {
        if (stream && videoRef.current) {
            console.log("stream:", stream.getVideoTracks());
            videoRef.current.srcObject = stream;
        }
    }, [stream, videoRef]);

    useEffect(() => {
        if (receivedStream && userRef.current) {
            console.log("receivedStream:", receivedStream.getVideoTracks());
            userRef.current.srcObject = receivedStream;
        }
    }, [receivedStream, userRef]);

    return (
        <>
            <div className="flex items-center w-full h-[48px] p-2 bg-strock">
                <span className="text-[16px] font-semibold mr-auto">
                    Wave chat call
                </span>
                <button className="flex items-center justify-center w-8 h-8 mb-1 rounded-full hover:bg-text3 hover:bg-opacity-10">
                    <Crop75Icon />
                </button>
                <button
                    onClick={handleEndCall}
                    className="flex items-center justify-center w-8 h-8 mb-1 rounded-full hover:bg-text3 hover:bg-opacity-10"
                >
                    <IconClose />
                </button>
            </div>
            <div className="w-full h-[350px] flex items-center justify-center overflow-hidden">
                {stream && (
                    <video
                        id="video"
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="flex-1 object-cover w-[350px] h-full"
                    />
                )}

                {callAccepted && !callEnded && (
                    <>
                        <video
                            id="user-video"
                            ref={userRef}
                            playsInline
                            autoPlay
                            className={`flex-1 object-cover w-[350px] h-full ${
                                userRef?.current?.srcObject
                                    ? "stream"
                                    : "not-stream"
                            }`}
                        />
                    </>
                )}
            </div>
            <div className="w-full h-[60px] bg-darkBG">
                <div className="flex items-center justify-center w-full h-full gap-x-5">
                    <button
                        onClick={handleVideoClick}
                        className="flex items-center justify-center w-20 h-8 rounded-full bg-darkStrock hover:bg-opacity-70 text-lite gap-x-3"
                    >
                        <span>
                            {isVideoOff ? (
                                <VideocamOffRoundedIcon />
                            ) : (
                                <VideocamRoundedIcon />
                            )}
                        </span>
                        <span>
                            <KeyboardArrowUpRoundedIcon />
                        </span>
                    </button>
                    <button
                        className="w-8 h-8 bg-red-800 rounded-full hover:bg-opacity-70 text-lite"
                        onClick={handleEndCall}
                    >
                        <CallEndIcon />
                    </button>
                    <button
                        onClick={handleAudioClick}
                        className="flex items-center justify-center w-20 h-8 rounded-full bg-darkStrock hover:bg-opacity-70 text-lite gap-x-3"
                    >
                        <span>
                            {isMuted ? (
                                <MicOffRoundedIcon />
                            ) : (
                                <KeyboardVoiceRoundedIcon />
                            )}
                        </span>
                        <span>
                            <KeyboardArrowUpRoundedIcon />
                        </span>
                    </button>
                </div>
            </div>
        </>
    );
};

CallAccepted.propTypes = {
    stream: PropTypes.object,
    receivedStream: PropTypes.object,
    videoRef: PropTypes.object,
    callAccepted: PropTypes.bool,
    callEnded: PropTypes.bool,
    userRef: PropTypes.object,
    handleVideoClick: PropTypes.func,
    isVideoOff: PropTypes.bool,
    handleEndCall: PropTypes.func,
    handleAudioClick: PropTypes.func,
    isMuted: PropTypes.bool,
};

export default VideoCallModal;
