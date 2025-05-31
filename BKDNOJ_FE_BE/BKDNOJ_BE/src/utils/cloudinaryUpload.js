const cloudinary = require("./cloudinary");

const uploadToCloudinary = (filePath, folder, resourceType = "image") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
  });
};

module.exports = uploadToCloudinary;
