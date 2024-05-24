import { useState } from "react";
import AWS from "aws-sdk";
import { toast } from "react-toastify";

const useS3ImageConversation = (getValues = () => {}) => {
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState("");

    AWS.config.update({
        accessKeyId: import.meta.env.VITE_S3_AccessKeyId,
        secretAccessKey: import.meta.env.VITE_S3_SecretAccessKey,
        region: import.meta.env.VITE_S3_Region,
    });

    const s3 = new AWS.S3();

    const handleUploadImage = (image, timestamp) => {
        const conversation_id = getValues("conversation_id");
        const params = {
            Bucket: import.meta.env.VITE_S3_Bucket,
            Key: `conversation/${conversation_id}/images/${timestamp}-${image.name}`,
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
        const conversation_id = getValues("conversation_id");
        const imageName = getValues("image_name");
        const params = {
            Bucket: import.meta.env.VITE_S3_Bucket,
            Key: `conversations/${conversation_id}/images/${timestamp}-${imageName}`,
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
