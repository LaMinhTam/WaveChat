import { useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";
const RequiredAuthPage = ({ children }) => {
    const navigate = useNavigate();
    const { userInfo } = useAuth();
    const token = localStorage.getItem("app_chat_token");

    useEffect(() => {
        if (!userInfo || !token) {
            navigate("/login");
        }
    }, [navigate, token, userInfo]);
    return <>{children}</>;
};
RequiredAuthPage.propTypes = {
    children: PropTypes.node,
};

export default RequiredAuthPage;
