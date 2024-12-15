import AWS from "aws-sdk";

/**
 * Upload a file to S3
 * @param {File} file - The file to upload
 * @returns {Promise<{file_key: string, file_name: string, file_url: string}>} - Details about the uploaded file
 */
export async function uploadToS3(file) {
  try {
    // Update AWS SDK configuration
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: "eu-north-1",
    });

    const s3 = new AWS.S3();

    // Generate a unique file key
    const fileKey = `uploads/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    console.log(process.env.S3_BUCKET_NAME)

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
      Body: file,
    };

    // Upload the file and log progress
    const upload = s3
      .putObject(params)
      .on("httpUploadProgress", (evt) => {
        console.log(
          `Uploading to S3... ${Math.round((evt.loaded * 100) / evt.total)}%`
        );
      })
      .promise();

    // Wait for the upload to complete
    await upload;

    console.log("Successfully uploaded to S3:", fileKey);

    // Return details about the uploaded file
    return {
      file_key: fileKey,
      file_name: file.name,
      file_url: getS3Url(fileKey),
    };
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

/**
 * Get the S3 URL for a file
 * @param {string} fileKey - The S3 file key
 * @returns {string} - The S3 URL for the file
 */
export function getS3Url(fileKey) {
  return `https://${process.env.S3_BUCKET_NAME}.s3.eu-north-1.amazonaws.com/${fileKey}`;
}
