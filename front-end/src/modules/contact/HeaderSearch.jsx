import { IconSearch, IconSort } from "../../components/icons";
import PropTypes from "prop-types";

const HeaderSearch = ({ text }) => {
    return (
        <>
            <div className="relative flex-1">
                <input
                    type="text"
                    className="w-full h-[32px] rounded-md border pl-10"
                    placeholder={text}
                />
                <span className="absolute left-[6px] top-[6px]">
                    <IconSearch />
                </span>
            </div>
            <div className="relative flex-1">
                <select
                    name="selectSort"
                    id="selectSort"
                    className="w-full h-[32px] rounded-md border pl-10"
                >
                    <option value="sortedAZ">Tên (A-Z)</option>
                    <option value="sortedZA">Tên (Z-A)</option>
                </select>
                <span className="absolute left-[6px] top-[6px]">
                    <IconSort />
                </span>
            </div>
        </>
    );
};

HeaderSearch.propTypes = {
    text: PropTypes.string,
};

export default HeaderSearch;
