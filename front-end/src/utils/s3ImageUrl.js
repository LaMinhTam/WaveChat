export default function s3ImageUrl(image_name) {
    if (!image_name)
        return "https://wavechat.s3.ap-southeast-1.amazonaws.com/defaut_avatar.jpg";
    return image_name;
}
