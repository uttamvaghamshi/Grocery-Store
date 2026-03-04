import cloudinary from "../Config/cloudinary.js";

export default function streamUpload(fileBuffer, folderName) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: folderName },
            (error, result) => {
                if (result) resolve(result);
                else reject(error);
            }
        );

        stream.end(fileBuffer);
    });
}