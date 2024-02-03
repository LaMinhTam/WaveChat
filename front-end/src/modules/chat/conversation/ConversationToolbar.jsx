import { IconCard, IconFile, IconImage } from "../../../components/icons";

const ConversationToolbar = () => {
    return (
        <div className="w-full flex items-center pl-2 h-[46px] bg-lite border-b border-text3">
            <div className="flex items-center justify-center gap-x-2">
                <button className="flex items-center justify-center w-10 h-10 rounded hover:bg-text3 hover:bg-opacity-10">
                    <IconImage />
                </button>
                <button className="flex items-center justify-center w-10 h-10 rounded hover:bg-text3 hover:bg-opacity-10">
                    <IconFile />
                </button>
                <button className="flex items-center justify-center w-10 h-10 rounded hover:bg-text3 hover:bg-opacity-10">
                    <IconCard />
                </button>
            </div>
        </div>
    );
};

export default ConversationToolbar;
