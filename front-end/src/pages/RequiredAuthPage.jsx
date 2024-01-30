import { useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";
import { getToken } from "../utils/auth";
import { isTokenExpire } from "../utils/isTokenExpire";
const RequiredAuthPage = ({ children }) => {
    const navigate = useNavigate();
    const { loading, userInfo } = useAuth();
    const token = getToken();
    const checkExp = isTokenExpire(token);
    console.log(checkExp);

    useEffect(() => {
        if (!token) {
            navigate("/login");
        } else {
            if (!loading && (checkExp || !userInfo.phoneNumber)) {
                navigate("/login");
            }
        }
    }, [loading, checkExp, navigate, token, userInfo]);

    if (loading) {
        return (
            <div className="flex items-center justify-center">Loading...</div>
        );
    }

    return <>{children}</>;
};
RequiredAuthPage.propTypes = {
    children: PropTypes.node,
};

export default RequiredAuthPage;
