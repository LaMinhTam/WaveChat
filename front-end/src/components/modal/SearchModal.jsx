import { useEffect, useCallback } from "react";
import { useChat } from "../../contexts/chat-context";
import { useDispatch, useSelector } from "react-redux";
import s3ImageUrl from "../../utils/s3ImageUrl";
import { setProfileType } from "../../store/commonSlice";
import { setGuestProfile } from "../../store/userSlice";
import debounce from "lodash/debounce";
import fetchUserByPhone from "../../api/fetchUserByPhone";
import { getUserId } from "../../utils/auth";

const SearchModal = () => {
    const { searchModalRef, setShowProfileDetails, setShowSearchModal } =
        useChat();
    const searchUserValue = useSelector(
        (state) => state.common.searchUserValue
    );
    const guestProfile = useSelector((state) => state.user.guestProfile);
    const dispatch = useDispatch();
    const currentUserId = getUserId();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedFetchUserByPhone = useCallback(
        debounce(async (phone) => {
            const data = await fetchUserByPhone(phone);
            dispatch(setGuestProfile(data));
        }, 500),
        [dispatch]
    );

    useEffect(() => {
        debouncedFetchUserByPhone(searchUserValue);
    }, [debouncedFetchUserByPhone, searchUserValue]);

    return (
        <div ref={searchModalRef}>
            {guestProfile && (
                <div
                    className="cursor-pointer w-full h-[60px] flex items-center gap-x-2 hover:bg-text6"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (guestProfile._id !== currentUserId) {
                            dispatch(setProfileType("guest"));
                        }
                        setShowProfileDetails(true);
                        setShowSearchModal(false);
                    }}
                >
                    <div className="w-[40px] h-[40px] rounded-full">
                        <img
                            className="object-cover w-full h-full rounded-full"
                            src={s3ImageUrl(guestProfile?.avatar)}
                            alt={guestProfile?.full_name}
                        />
                    </div>
                    <div className="flex flex-col">
                        <span>{guestProfile?.full_name}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchModal;
