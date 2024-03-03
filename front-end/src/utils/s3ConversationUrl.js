export default function s3ConversationUrl(fileName, userId, type = "image") {
    if (!fileName)
        return "https://wavechatdemo.s3.ap-southeast-1.amazonaws.com/defaut_avatar.jpg";
    return type === "image"
        ? `https://wavechatdemo.s3-ap-southeast-1.amazonaws.com/conversations/${userId}/images/${fileName}`
        : `https://wavechatdemo.s3-ap-southeast-1.amazonaws.com/conversations/${userId}/files/${fileName}`;
}
