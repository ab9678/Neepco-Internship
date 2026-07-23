import multer from "multer";

const handleUploadError = (err, req, res, next) => {
    if (!err) {
        return next();
    }

    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                success: false,
                message: "Image size cannot exceed 5 MB.",
            });
        }

        if (err.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({
                success: false,
                message:
                    err.field || "Only JPEG, JPG, PNG and WEBP images are allowed.",
            });
        }
    }

    return res.status(400).json({
        success: false,
        message: err.message || "File upload failed.",
    });
};

export default handleUploadError;