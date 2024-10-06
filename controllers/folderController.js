const {
  getFiles,
  addFileUrl,
  getFile,
  deleteFile,
} = require("../prisma/queries");
const cloudinary = require("../utils/cloudinaryConfig");

// multer
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 4 * 1024 * 1024, // Limit file size to 4MB (in bytes)
    files: 1, // Limit to 1 file at a time
  },
});

const getFolderPage = async (req, res) => {
  const id = req.params.folderId;
  const files = await getFiles(id);
  res.render("userFolderPage", { files: files, user: req.user });
};

const postFile = [
  async (req, res, next) => {
    upload.single("avatar")(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          let message = "Max file size allowed is 4MB";
          const id = req.params.folderId;
          const files = await getFiles(id);
          res.render("userFolderPage", {
            files: files,
            user: req.user,
            message: message,
          });
          return;
        }
      } else if (!req.file) {
        let message = "Please select a file";
        const id = req.params.folderId;
        const files = await getFiles(id);
        res.render("userFolderPage", {
          files: files,
          user: req.user,
          message: message,
        });
        return;
      } else if (err) {
        return next(err);
        // An unknown error occurred when uploading.
      } else {
        const id = req.params.folderId;
        console.log("uploaded file", req.file);
        const filename = Date.now() + "--" + req.file.originalname;
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "raw" },
          async (error, result) => {
            if (error) {
              return next(error);
            } else {
              console.log("result", result);
              // save url to database
              const file = await addFileUrl(
                result.secure_url,
                id,
                filename,
                result.created_at,
                result.bytes,
                result.public_id
              );
              res.redirect("/home/" + id);
            }
          }
        );
        stream.end(req.file.buffer);
      }
    });
  },
];

const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw",
    });
    console.log("Cloudinary file deleted successfully:", result);
    return result;
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
  }
};

const deleteTheFile = async (req, res) => {
  const fileId = req.params.fileId;
  const deletedFile = await getFile(fileId);
  // delete file from cloudinary
  console.log("publicId", deletedFile.publicId);
  deleteFromCloudinary(deletedFile.publicId);
  const file = await deleteFile(fileId);
  const folderId = req.params.folderId;
  res.redirect("/home/" + folderId);
};

const getFileDownload = async (req, res) => {
  const fileId = req.params.fileId;
  const file = await getFile(fileId);
  res.redirect(file.url);
};

const getFileDetails = async (req, res) => {
  const fileId = req.params.fileId;
  const file = await getFile(fileId);
  res.render("fileDetails", { user: req.user, file: file });
};


module.exports = {
    getFolderPage,
    postFile,
    deleteTheFile,
    getFileDownload,
    getFileDetails
}