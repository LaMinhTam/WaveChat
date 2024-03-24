export default function s3ImageUrl(image_name, userId) {
    if (!image_name)
        return "https://wavechat.s3.ap-southeast-1.amazonaws.com/defaut_avatar.jpg";
    return `https://wavechat.s3-ap-southeast-1.amazonaws.com/profile/${userId}/${image_name}`;
}
