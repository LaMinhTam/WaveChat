export default function s3ConversationUrl(
    fileName,
    conversation_id,
    type = "image"
) {
    if (!fileName)
        return "https://wavechat.s3.ap-southeast-1.amazonaws.com/defaut_avatar.jpg";
    return type === "image"
        ? `https://wavechat.s3-ap-southeast-1.amazonaws.com/conversation/${conversation_id}/images/${fileName}`
        : `https://wavechat.s3-ap-southeast-1.amazonaws.com/conversation/${conversation_id}/files/${fileName}`;
}
