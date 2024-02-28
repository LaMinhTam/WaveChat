import { useState } from "react";
import AWS from "aws-sdk";
import { useDispatch, useSelector } from "react-redux";
import { setUserProfile } from "../store/userSlice";
import { toast } from "react-toastify";

const useS3Image = (setValue = () => {}, getValues = () => {}, cb = null) => {
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState("");
    const userProfile = useSelector((state) => state.user.userProfile);
    const dispatch = useDispatch();

    AWS.config.update({
        accessKeyId: import.meta.env.VITE_S3_AccessKeyId,
        secretAccessKey: import.meta.env.VITE_S3_SecretAccessKey,
        region: import.meta.env.VITE_S3_Region,
    });

    const s3 = new AWS.S3();

    const handleUploadImage = (file) => {
        const params = {
            Bucket: import.meta.env.VITE_S3_Bucket,
            Key: `images/${userProfile._id}/` + file.name,
            Body: file,
            ACL: "public-read",
            ContentType: "image/jpeg",
            ContentDisposition: "inline; filename=filename.jpg",
        };

        s3.upload(params)
            .on("httpUploadProgress", (evt) => {
                setProgress(Math.round((evt.loaded / evt.total) * 100));
            })
            .send((err, data) => {
                if (err) {
                    console.log("handleUploadImage ~ error:", err);
                } else {
                    setImage(data.Location);
                }
            });
    };

    const handleSelectImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setValue("image_name", file.name);
        handleUploadImage(file);
    };

    const handleDeleteImage = () => {
        const imageName = getValues("image_name") || userProfile.avatar;
        const params = {
            Bucket: import.meta.env.VITE_S3_Bucket,
            Key: `images/${userProfile._id}/` + imageName,
        };

        s3.deleteObject(params, (err) => {
            if (err) {
                console.log("handleDeleteImage ~ error:", err);
                console.log("Can not delete image");
                setImage("");
            } else {
                toast.success("Xóa ảnh thành công");
                setImage("");
                setProgress(0);
                cb && cb();
                dispatch(setUserProfile({ ...userProfile, avatar: "" }));
            }
        });
    };

    const handleResetUpload = () => {
        setImage("");
        setProgress(0);
    };

    return {
        progress,
        image,
        setProgress,
        setImage,
        handleSelectImage,
        handleDeleteImage,
        handleResetUpload,
    };
};

export default useS3Image;
