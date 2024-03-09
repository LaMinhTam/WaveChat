import { useState } from "react";
import AWS from "aws-sdk";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const useS3ImageConversation = (getValues = () => {}, cb = null) => {
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState("");
    const userProfile = useSelector((state) => state.user.userProfile);

    AWS.config.update({
        accessKeyId: import.meta.env.VITE_S3_AccessKeyId,
        secretAccessKey: import.meta.env.VITE_S3_SecretAccessKey,
        region: import.meta.env.VITE_S3_Region,
    });

    const s3 = new AWS.S3();

    const handleUploadImage = (image, timestamp) => {
        const params = {
            Bucket: import.meta.env.VITE_S3_Bucket,
            Key: `conversations/${userProfile._id}/images/${timestamp}-${image.name}`,
            Body: image,
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

    const handleDeleteImage = (timestamp) => {
        const imageName = getValues("image_name");
        const params = {
            Bucket: import.meta.env.VITE_S3_Bucket,
            Key: `conversations/${userProfile._id}/images/${timestamp}-${imageName}`,
        };

        s3.deleteObject(params, (err) => {
            if (err) {
                console.log("handleDeleteImage ~ error:", err);
                console.log("Can not delete image");
                setImage("");
            } else {
                toast.success("Image deleted successfully");
                setImage("");
                setProgress(0);
                cb && cb();
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
        handleUploadImage,
        handleDeleteImage,
        handleResetUpload,
    };
};

export default useS3ImageConversation;
