import sharp from "sharp";
import multer from "multer";
import { v4 as uuid } from "uuid";

import bucket from "../utils/gcs.js";
import AppError from "../utils/AppError.js";

// Using memory buffer to read the file input instead of blocking the space at a time.
const storage = multer.memoryStorage();
const upload = multer({
  storage,
});

async function uploadToGCS(req, res, next) {
  try {
    if (!req.file) return next(new AppError("Choose a post to upload", 403));

    const optimizedBuffer = await sharp(req.file.buffer)
      .rotate()
      .resize({ width: 1080 })
      .toFormat("webp")
      .webp({ quality: 100, chromaSubsampling: "4:4:4" })
      .toBuffer();

    const fileName = `Post-Uploads/${uuid()}.webp`;
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    blobStream.on("error", (err) => {
      next(new AppError(err.message || "Error uploading the post..", 500));
    });

    blobStream.on("finish", () => {
      const publicURL = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      req.file.cloudStorageURL = publicURL;
      next();
    });

    blobStream.end(optimizedBuffer);
  } catch (error) {
    return next(
      new AppError(error.message || "Error processing image..!", 500)
    );
  }
}

export { upload, uploadToGCS };
