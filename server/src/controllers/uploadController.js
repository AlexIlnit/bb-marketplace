import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (req, res) => {
    //  console.log("FILE:", req.file);
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "listings"
        },
        (error, result) => {
  if (error) {
    console.error("CLOUDINARY ERROR:", error);
    reject(error);
  } else {
    resolve(result);
  }
}
      ).end(file.buffer);
    });

    res.json({
      url: result.secure_url
    });

  } catch (error) {
  console.error("UPLOAD ERROR:");
  console.error(error);

  res.status(500).json({
    message: error.message,
  });
}
};