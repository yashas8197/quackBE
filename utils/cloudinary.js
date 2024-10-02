const cloudinary = require("cloudinary").v2;

// const fs = require("fs");

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

/* const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return;
    //upload the file on clodinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    //file has been uploaded
    // console.log("File is uploaded in clodinary", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

module.exports = { uploadOnCloudinary };
 */

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
