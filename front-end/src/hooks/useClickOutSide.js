import React from "react";
import { useDispatch } from "react-redux";
import {
    setMessageShowOption,
    setShowUpdateAvatar,
    setShowUpdateCover,
    setShowUpdateProfile,
} from "../store/commonSlice";

const useClickOutSide = (dom = "button") => {
    const [show, setShow] = React.useState(false);
    const nodeRef = React.useRef(null);
    const dispatch = useDispatch();
    React.useEffect(() => {
        function handleClickOutSide(e) {
            // Check if the click event is happening inside the Viewer
            if (e.target.closest(".react-viewer")) {
                return;
            }
            if (e.target.closest(".btn-showUpdateProfile")) {
                return;
            }
            if (e.target.closest(".btn_backToProfileDetails")) {
                return;
            }
            if (e.target.closest(".react-datepicker")) {
                return;
            }
            if (e.target.closest(".btn_showUpdateAvatar")) {
                return;
            }
            if (e.target.closest(".btn-remove__checked")) {
                return;
            }
            if (e.target.closest(".input-checkbox")) {
                return;
            }
            if (e.target.closest("#upload-image")) {
                return;
            }
            if (e.target.closest(".btn-deleteImage")) {
                return;
            }
            if (
                nodeRef.current &&
                !nodeRef.current.contains(e.target) &&
                !e.target.matches(dom)
            ) {
                setShow(false);
                dispatch(setShowUpdateProfile(false));
                dispatch(setShowUpdateAvatar(false));
                dispatch(setShowUpdateCover(false));
                dispatch(setMessageShowOption(""));
            }
        }
        document.addEventListener("click", handleClickOutSide);
        return () => {
            document.removeEventListener("click", handleClickOutSide);
        };
    }, [dispatch, dom]);
    return {
        show,
        setShow,
        nodeRef,
    };
};

export default useClickOutSide;
