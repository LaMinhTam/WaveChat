import { useState } from "react";
import AWS from "aws-sdk";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setCurrentFileName, setProgress } from "../store/commonSlice";

const useS3File = (getValues = () => {}, cb = null) => {
    const [file, setFile] = useState("");
    const dispatch = useDispatch();
    const userProfile = useSelector((state) => state.user.userProfile);

    AWS.config.update({
        accessKeyId: import.meta.env.VITE_S3_AccessKeyId,
        secretAccessKey: import.meta.env.VITE_S3_SecretAccessKey,
        region: import.meta.env.VITE_S3_Region,
    });

    const s3 = new AWS.S3();

    const handleUploadFile = (file, timestamp) => {
        const params = {
            Bucket: import.meta.env.VITE_S3_Bucket,
            Key: `conversations/${userProfile._id}/files/${timestamp}-${file.name}`,
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
        const fileName = getValues("file_name");
        const params = {
            Bucket: import.meta.env.VITE_S3_Bucket,
            Key: `conversations/${userProfile._id}/files/${timestamp}-${fileName}`,
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
                cb && cb();
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
