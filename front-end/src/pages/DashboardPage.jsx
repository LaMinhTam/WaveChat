// import DashboardWelcome from "../modules/dashboard/DashboardWelcome";
import { useDispatch } from "react-redux";
import Conversation from "../modules/chat/Conversation";
import { getToken, getUserId } from "../utils/auth";
import RequiredAuthPage from "./RequiredAuthPage";
import { useEffect } from "react";
import { axiosPrivate } from "../api/axios";
import { setUserProfile } from "../store/userSlice";

const DashboardPage = () => {
    const id = getUserId();
    const access_token = getToken();
    const dispatch = useDispatch();
    useEffect(() => {
        async function fetchProfileData() {
            const res = await axiosPrivate.get(`/user/profile?_id=${id}`);
            dispatch(setUserProfile(res.data.data));
        }
        fetchProfileData();
    }, [access_token, dispatch, id]);
    return (
        <RequiredAuthPage>
            {/* <DashboardWelcome /> */}
            <Conversation />
        </RequiredAuthPage>
    );
};
export default DashboardPage;
