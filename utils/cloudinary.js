const cloudinary = require("cloudinary").v2;

// const fs = require("fs");

// Configuration
/* cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
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
    if (!fileBuffer) return null; // Handle the case where there's no buffer
    // Upload the buffer to Cloudinary
    const response = await cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          throw error;
        }
        return result;
      }
    );

    // Use a stream to upload the buffer
    const stream = cloudinary.uploader.upload_stream({ resource_type: "auto" });
    stream.end(fileBuffer); // End the stream with the buffer

    return await new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });
  } catch (error) {
    return null; // Handle errors accordingly
  }
};

module.exports = { uploadOnCloudinary };
