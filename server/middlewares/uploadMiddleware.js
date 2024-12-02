import upload from "../utils/multerConfig.js";

const uploadSingle = (req, res, next) => {
  upload.single("images")(req, res, (err) => {
    if (err) {
      console.log(err)
      return res
        .status(400)
        .json({ message: "File upload failed", error: err.message });
    }
    next();
  });
};

export default uploadSingle;



