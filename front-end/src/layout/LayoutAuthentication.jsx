/* eslint-disable react-refresh/only-export-components */
// import { useEffect } from "react";
import PropTypes from "prop-types";
// import { useNavigate } from "react-router-dom";
import { withErrorBoundary } from "react-error-boundary";
import ErrorComponent from "../components/common/ErrorComponent";
import Overlay from "../components/common/Overlay";

const LayoutAuthentication = ({ children, heading = "" }) => {
    return (
        <>
            <Overlay></Overlay>
            <div className="relative w-full min-h-screen p-10 bg-lite dark:bg-darkBG isolate">
                <img
                    src="/background.png"
                    alt="background"
                    className="hidden lg:block w-full pointer-events-none absolute bottom-0 left-0 right-0 z-[-1]"
                />
                <h1 className="mb-5 text-5xl font-extrabold text-center text-thirdly">
                    Wave Chat
                </h1>
                <div className="w-full max-w-[556px] bg-white dark:bg-darkSecondary rounded-xl px-5 py-8 lg:px-12 lg:py-16 mx-auto">
                    <h2 className="mb-1 text-lg font-semibold text-center lg:text-xl lg:mb-3 dark:text-white">
                        {heading}
                    </h2>
                    {children}
                </div>
            </div>
        </>
    );
};

LayoutAuthentication.propTypes = {
    children: PropTypes.node,
    heading: PropTypes.string,
};

export default withErrorBoundary(LayoutAuthentication, {
    FallbackComponent: ErrorComponent,
});
