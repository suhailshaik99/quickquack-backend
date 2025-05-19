// Library Imports
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { Storage } from "@google-cloud/storage";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../config.env") });

// Initializing the GCS Client
const storage = new Storage({
  keyFilename: process.env.GCP_KEYFILE_PATH,
  projectId: process.env.GCP_PRODJECT_ID,
});

const bucket = storage.bucket(process.env.GCP_BUCKET_NAME);
export default bucket;
