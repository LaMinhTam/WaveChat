import Overlay from "../components/common/Overlay";
import DashboardSideBar from "../modules/dashboard/DashboardSideBar";
import { Outlet } from "react-router-dom";
import DashboardListOptions from "../modules/dashboard/DashboardListOptions";
import Modal from "../components/modal/Modal";
import { useEffect } from "react";
import fetchUserProfile from "../api/fetchUserProfile";
import { getUserId } from "../utils/auth";
import { useDispatch } from "react-redux";
import { setUserProfile } from "../store/userSlice";
const LayoutDashboard = () => {
    const currentUserId = getUserId();
    const dispatch = useDispatch();
    useEffect(() => {
        async function fetchProfileData() {
            try {
                const user = await fetchUserProfile(currentUserId);
                console.log("fetchProfileData ~ user:", user);
                dispatch(setUserProfile(user));
            } catch (error) {
                console.log("error", error);
            }
        }
        fetchProfileData();
    }, [currentUserId, dispatch]);
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
