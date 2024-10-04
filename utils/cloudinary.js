const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (fileBuffer) => {
  try {
    if (!fileBuffer) return null;

    // Return a new promise that resolves when the upload is complete
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) {
            reject(error); // Reject if there's an error
          } else {
            resolve(result); // Resolve the result from Cloudinary
          }
        }
      );

      // Pass the file buffer to the stream
      stream.end(fileBuffer);
    });
  } catch (error) {
    console.error("Error during upload to Cloudinary:", error);
    return null;
  }
};

module.exports = { uploadOnCloudinary };
