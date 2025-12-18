require("dotenv").config();
const { BlobServiceClient } = require("@azure/storage-blob");

async function deleteFromAzure(blobname) {
  try {
    // Create blob service
    const blobService = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING
    );

    const containerClient = blobService.getContainerClient(
      process.env.AZURE_CONTAINER_NAME
    );

    // Extract blob name from URL
    
    // ⚠️ works if blob is directly inside container

    const blobClient = containerClient.getBlobClient(blobname);

    // Delete blob
    await blobClient.deleteIfExists();

    return "success"
  } catch (error) {
    return "failed"
  }
}

module.exports = deleteFromAzure;
