import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
    const navigate = useNavigate();
    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        if (!accessToken) {
            navigate("/login");
        }
    }, [accessToken, navigate]);

    return <span>DashboardPage</span>;
};

export default DashboardPage;
