import React from "react";

const useClickOutSide = (dom = "button") => {
    const [show, setShow] = React.useState(false);
    const nodeRef = React.useRef(null);
    React.useEffect(() => {
        function handleClickOutSide(e) {
            // Check if the click event is happening inside the Viewer
            if (e.target.closest(".react-viewer")) {
                return;
            }
            if (
                nodeRef.current &&
                !nodeRef.current.contains(e.target) &&
                !e.target.matches(dom)
            ) {
                setShow(false);
            }
        }
        document.addEventListener("click", handleClickOutSide);
        return () => {
            document.removeEventListener("click", handleClickOutSide);
        };
    }, [dom]);
    return {
        show,
        setShow,
        nodeRef,
    };
};

export default useClickOutSide;
