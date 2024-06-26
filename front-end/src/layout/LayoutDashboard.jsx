import Overlay from "../components/common/Overlay";
import DashboardSideBar from "../modules/dashboard/DashboardSideBar";
import { Outlet } from "react-router-dom";
import DashboardListOptions from "../modules/dashboard/DashboardListOptions";
import Modal from "../components/modal/Modal";
import { useEffect } from "react";
import fetchUserProfile from "../api/fetchUserProfile";
import { getUserId } from "../utils/auth";
import { useDispatch, useSelector } from "react-redux";
import { setListBlockUser, setUserProfile } from "../store/userSlice";
import { axiosPrivate } from "../api/axios";
import {
    setListFriendRequest,
    setListFriendSendRequest,
} from "../store/friendSlice";
import { WAVE_CHAT_API } from "../api/constants";
const LayoutDashboard = () => {
    const currentUserId = getUserId();
    const dispatch = useDispatch();
    const render = useSelector((state) => state.friend.render);
    const renderListBlockUser = useSelector(
        (state) => state.common.renderListBlockUser
    );
    useEffect(() => {
        async function fetchProfileData() {
            try {
                const user = await fetchUserProfile(currentUserId);
                dispatch(setUserProfile(user));
            } catch (error) {
                console.log("error", error);
            }
        }
        fetchProfileData();
    }, [currentUserId, dispatch]);
    useEffect(() => {
        async function fetchFriendRequest() {
            try {
                const res = await axiosPrivate.get(
                    WAVE_CHAT_API.listFriendRequest()
                );
                if (res.data.status === 200) {
                    dispatch(setListFriendRequest(res.data.data));
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchFriendRequest();
    }, [dispatch, render]);
    useEffect(() => {
        async function fetchFriendSendRequest() {
            try {
                const res = await axiosPrivate.get(
                    WAVE_CHAT_API.listSentRequest()
                );
                if (res.data.status === 200) {
                    dispatch(setListFriendSendRequest(res.data.data));
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchFriendSendRequest();
    }, [dispatch, render]);
    useEffect(() => {
        async function fetchListBlockUser() {
            try {
                const res = await axiosPrivate.get(
                    WAVE_CHAT_API.listBlockUser()
                );
                if (res.data.status === 200) {
                    dispatch(setListBlockUser(res.data.data));
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchListBlockUser();
    }, [dispatch, renderListBlockUser]);
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
