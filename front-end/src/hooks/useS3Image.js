import { useState } from "react";
import AWS from "aws-sdk";
import { useDispatch, useSelector } from "react-redux";
import { setUserProfile } from "../store/userSlice";

const useS3Image = () => {
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

    const handleUploadImage = (file, timestamp) => {
        const params = {
            Bucket: import.meta.env.VITE_S3_Bucket,
            Key: `profile/${userProfile._id}/${timestamp}-${file.name}`,
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
        const timestamp = new Date().getTime();
        handleUploadImage(file, timestamp);
    };

    const handleResetUpload = () => {
        setImage("");
        setProgress(0);
        dispatch(setUserProfile({ ...userProfile, avatar: "" }));
    };

    return {
        progress,
        image,
        setProgress,
        setImage,
        handleSelectImage,
        handleResetUpload,
    };
};

export default useS3Image;
