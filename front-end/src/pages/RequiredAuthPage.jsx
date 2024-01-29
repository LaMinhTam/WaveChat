import { useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";
const RequiredAuthPage = ({ children }) => {
    const navigate = useNavigate();
    const { userInfo } = useAuth();

    useEffect(() => {
        if (!userInfo || !userInfo.accessToken) {
            navigate("/login");
        }
    }, [navigate, userInfo]);
    return <>{children}</>;
};
RequiredAuthPage.propTypes = {
    children: PropTypes.node,
};

export default RequiredAuthPage;
