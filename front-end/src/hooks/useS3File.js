import { useState } from "react";
import AWS from "aws-sdk";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setCurrentFileName, setProgress } from "../store/commonSlice";

const useS3File = (getValues = () => {}) => {
    const [file, setFile] = useState("");
    const dispatch = useDispatch();

    AWS.config.update({
        accessKeyId: import.meta.env.VITE_S3_AccessKeyId,
        secretAccessKey: import.meta.env.VITE_S3_SecretAccessKey,
        region: import.meta.env.VITE_S3_Region,
    });

    const s3 = new AWS.S3();

    const handleUploadFile = (file, timestamp) => {
        const conversation_id = getValues("conversation_id");
        const params = {
            Bucket: import.meta.env.VITE_S3_Bucket,
            Key: `conversation/${conversation_id}/files/${timestamp}-${file.name}`,
            Body: file,
            ACL: "public-read",
        };
        dispatch(setCurrentFileName(file.name));

        s3.upload(params)
            .on("httpUploadProgress", (evt) => {
                dispatch(
                    setProgress(Math.round((evt.loaded / evt.total) * 100))
                );
            })
            .send((err, data) => {
                if (err) {
                    console.log("handleUploadFile ~ error:", err);
                } else {
                    setFile(data.Location);
                    dispatch(setProgress(0));
                }
            });
    };

    const handleDeleteFile = (timestamp) => {
        const conversation_id = getValues("conversation_id");
        const fileName = getValues("file_name");
        const params = {
            Bucket: import.meta.env.VITE_S3_Bucket,
            Key: `conversation/${conversation_id}/files/${timestamp}-${fileName}`,
        };

        s3.deleteObject(params, (err) => {
            if (err) {
                console.log("handleDeleteFile ~ error:", err);
                console.log("Can not delete file");
                setFile("");
            } else {
                toast.success("File deleted successfully");
                setFile("");
                dispatch(setProgress(0));
            }
        });
    };

    const handleResetUpload = () => {
        setFile("");
        dispatch(setProgress(0));
    };

    return {
        file,
        setFile,
        handleUploadFile,
        handleDeleteFile,
        handleResetUpload,
    };
};

export default useS3File;
