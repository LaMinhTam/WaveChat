import Overlay from "../components/common/Overlay";
import DashboardSideBar from "../modules/dashboard/DashboardSideBar";
import { Outlet } from "react-router-dom";
import ReactModal from "react-modal";
import ProfileModal from "../components/modal/ProfileModal";
import { useChat } from "../contexts/chat-context";
import ProfileDetailsModal from "../components/modal/ProfileDetailsModal";
import DashboardListOptions from "../modules/dashboard/DashboardListOptions";
import { getToken, getUserId } from "../utils/auth";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { axiosPrivate } from "../api/axios";
import { setUserProfile } from "../store/userSlice";
import { setCurrentUserName } from "../store/commonSlice";
const LayoutDashboard = () => {
    const { show, showProfileDetails } = useChat();
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
            <div className="h-screen min-h-screen overflow-hidden bg-lite">
                <ReactModal
                    isOpen={show}
                    overlayClassName="modal-overlay fixed inset-0 z-50 ml-16 mt-10 bg-lite shadow-lg p-2
                        flex justify-center items-center w-full max-w-[280px] h-full max-h-[157px]"
                    className="modal-content w-full max-w-[280px] bg-white rounded outline-none p-2 relative max-h-[157px]"
                >
                    <ProfileModal />
                </ReactModal>
                <ReactModal
                    isOpen={showProfileDetails}
                    overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-40 z-50
                        flex justify-center items-center"
                    className="modal-content w-full max-w-[400px] bg-white rounded outline-none relative"
                >
                    <ProfileDetailsModal />
                </ReactModal>

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
