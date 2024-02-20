import Overlay from "../components/common/Overlay";
import DashboardSideBar from "../modules/dashboard/DashboardSideBar";
import { Outlet } from "react-router-dom";
import DashboardListOptions from "../modules/dashboard/DashboardListOptions";
import { getToken, getUserId } from "../utils/auth";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { axiosPrivate } from "../api/axios";
import { setUserProfile } from "../store/userSlice";
import { setCurrentUserName } from "../store/commonSlice";
import Modal from "../components/modal/Modal";
const LayoutDashboard = () => {
    const id = getUserId();
    const access_token = getToken();
    const dispatch = useDispatch();
    useEffect(() => {
        async function fetchProfileData() {
            const res = await axiosPrivate.get(`/user/profile?_id=${id}`);
            dispatch(setUserProfile(res.data.data));
            dispatch(setCurrentUserName(res.data.data.nick_name));
        }
        fetchProfileData();
    }, [access_token, dispatch, id]);

    return (
        <>
            <Modal />
            <div className="h-screen min-h-screen overflow-hidden bg-lite">
                <Overlay></Overlay>
                <div className="flex items-start">
                    <DashboardSideBar></DashboardSideBar>
                    <DashboardListOptions />
                    <div className="flex-1 w-full h-full min-h-screen">
                        <Outlet></Outlet>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LayoutDashboard;
