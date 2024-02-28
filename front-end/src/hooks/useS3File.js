import { useState } from "react";
import AWS from "aws-sdk";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const useS3File = (getValues = () => {}, cb = null) => {
    const [progress, setProgress] = useState(0);
    const [file, setFile] = useState("");
    const userProfile = useSelector((state) => state.user.userProfile);

    AWS.config.update({
        accessKeyId: import.meta.env.VITE_S3_AccessKeyId,
        secretAccessKey: import.meta.env.VITE_S3_SecretAccessKey,
        region: import.meta.env.VITE_S3_Region,
    });

    const s3 = new AWS.S3();

    const handleUploadFile = (file) => {
        const params = {
            Bucket: import.meta.env.VITE_S3_Bucket,
            Key: `conversations/${userProfile._id}/files/` + file.name,
            Body: file,
            ACL: "public-read",
        };

        s3.upload(params)
            .on("httpUploadProgress", (evt) => {
                setProgress(Math.round((evt.loaded / evt.total) * 100));
            })
            .send((err, data) => {
                if (err) {
                    console.log("handleUploadFile ~ error:", err);
                } else {
                    setFile(data.Location);
                }
            });
    };

    const handleDeleteFile = () => {
        const fileName = getValues("file_name");
        const params = {
            Bucket: import.meta.env.VITE_S3_Bucket,
            Key: `conversations/${userProfile._id}/files/` + fileName,
        };

        s3.deleteObject(params, (err) => {
            if (err) {
                console.log("handleDeleteFile ~ error:", err);
                console.log("Can not delete file");
                setFile("");
            } else {
                toast.success("File deleted successfully");
                setFile("");
                setProgress(0);
                cb && cb();
            }
        });
    };

    const handleResetUpload = () => {
        setFile("");
        setProgress(0);
    };

    return {
        progress,
        file,
        setProgress,
        setFile,
        // handleSelectFile,
        handleUploadFile,
        handleDeleteFile,
        handleResetUpload,
    };
};

export default useS3File;
