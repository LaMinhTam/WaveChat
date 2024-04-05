export default function s3ImageUrl(image_name, userId) {
    if (!image_name || !userId)
        return "https://wavechat.s3.ap-southeast-1.amazonaws.com/defaut_avatar.jpg";
    return image_name;
}
