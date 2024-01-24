import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";

const DashboardPage = () => {
    const navigate = useNavigate();
    const { userInfo } = useAuth();

    useEffect(() => {
        if (!userInfo || !userInfo.accessToken) {
            navigate("/login");
        }
    }, [navigate, userInfo]);

    return <span>DashboardPage</span>;
};

export default DashboardPage;
