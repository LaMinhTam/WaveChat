export default function s3ConversationImageUrl(image_name, userId) {
    if (!image_name)
        return "https://wavechatdemo.s3.ap-southeast-1.amazonaws.com/defaut_avatar.jpg";
    return `https://wavechatdemo.s3-ap-southeast-1.amazonaws.com/conversations/${userId}/images/${image_name}`;
}
