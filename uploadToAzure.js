require('dotenv').config();
const { BlobServiceClient } = require("@azure/storage-blob");
const path = require("path");
const fs = require("fs");



async function uploadToAzure(filepath, filename) {
    try {
        console.log(process.env.AZURE_STORAGE_CONNECTION_STRING)
        console.log(process.env.AZURE_CONTAINER_NAME)
        const blobService = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
        const container = blobService.getContainerClient(process.env.AZURE_CONTAINER_NAME);

        // READ FILE DATA
        const fileBuffer = fs.readFileSync(filepath);

        // DETERMINE MIME TYPE FROM EXTENSION
        const ext = path.extname(filename).toLowerCase();

        let mimeType = "application/octet-stream";
        if (ext === ".png") mimeType = "image/png";
        if (ext === ".jpg" || ext === ".jpeg") mimeType = "image/jpeg";
        if (ext === ".webp") mimeType = "image/webp";

        const blobClient = container.getBlockBlobClient(filename);

        // UPLOAD WITH CONTENT TYPE
        await blobClient.uploadData(fileBuffer, {
            blobHTTPHeaders: {
                blobContentType: mimeType
            }
        });

        // REMOVE LOCAL FILE
        fs.unlinkSync(filepath);

        return blobClient.url;
    } catch (err) {
        console.log("Azure Upload Error:", err);
        throw err;
    }
}

module.exports = uploadToAzure;
