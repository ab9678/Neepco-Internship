import multer from "multer";
import path from "path";
import fs from "fs";

const ensureDirectoryExists = (directory) => {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
};

const createUploader = (destination) => {
    ensureDirectoryExists(destination);

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, destination);
        },

        filename: (req, file, cb) => {
            const uniqueName =
                Date.now() +
                "-" +
                Math.round(Math.random() * 1e9) +
                path.extname(file.originalname);

            cb(null, uniqueName);
        },
    });

    const fileFilter = (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new multer.MulterError(
                    "LIMIT_UNEXPECTED_FILE",
                    "Only JPEG, JPG, PNG and WEBP images are allowed."
                )
            );
        }
    };

    return multer({
        storage,
        fileFilter,
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    });
};

export const profileUpload = createUploader("uploads/profiles");

export const postUpload = createUploader("uploads/posts");