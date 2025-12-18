import multer from "multer";

function randomString(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export const uploadRegister = multer({
    storage: multer.diskStorage({
        destination: "public/uploads/register",
        filename: (req, file, cb) => {
            cb(null, Date.now() + "_register_" + randomString(5) + file.mimetype.replace("application/", "."));
        }
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") cb(null, true);
        else cb(new Error("Seuls les PDF sont autorisés."), false);
    },
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
}).single("register_file");

// TODO: manage 2 files (images)
export const uploadArticleImage = multer({
  storage: multer.diskStorage({
    destination: "public/uploads/article",
    filename: (req, file, cb) => {
      cb(
        null,
        Date.now() +
          "_article_" +
          randomString(5) +
          file.mimetype.replace("image/", ".")
      );
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Seules les images sont autorisées."), false);
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).single("register_file");

// TODO: manage 2 files (images)
export const uploadWorkshopImage = multer({
    storage: multer.diskStorage({
        destination: "public/uploads/workshop",
        filename: (req, file, cb) => {
            cb(null, Date.now() + "_workshop_" + randomString(5) + file.mimetype.replace("image/", "."));
        }
    }),
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (allowedTypes.includes(file.mimetype)) cb(null, true);
        else cb(new Error("Seules les images sont autorisées."), false);
    },
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
}).single("register_file");

