const handleDownloadFile = (fileName, url) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    link.remove();
};

export default handleDownloadFile;
