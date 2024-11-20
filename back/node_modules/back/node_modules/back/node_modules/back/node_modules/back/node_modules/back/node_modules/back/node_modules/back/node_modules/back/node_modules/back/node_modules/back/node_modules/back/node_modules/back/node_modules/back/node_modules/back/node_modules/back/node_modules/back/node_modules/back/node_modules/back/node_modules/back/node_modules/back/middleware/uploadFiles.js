import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to handle multiple files
const uploadFiles = upload.fields([
  { name: "resume", maxCount: 1 },
  { name: "coverletter", maxCount: 1 },
  { name: "portfolio", maxCount: 1 },
]);

export default uploadFiles;

// const localStorage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "./files");
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.originalname);
//     },
//   });
  
//   const storage = multer.memoryStorage();
//   //const upload = multer({ storage: localStorage });
//   const upload = multer({ storage });