import s3ConversationUrl from "./s3ConversationUrl";

const handleDownloadFile = (fileName, conversation_id) => {
    const link = document.createElement("a");
    link.href = s3ConversationUrl(fileName, conversation_id, "file");
    link.setAttribute("download", fileName);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    link.remove();
};

export default handleDownloadFile;
