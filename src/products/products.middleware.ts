import { NextFunction, Request, Response } from "express";
import multer from "multer";

const upload = multer();

const uploadSingle = upload.single("product-image");

const errorMessages = {
  LIMIT_FIELD_COUNT: "Too many fields",
  LIMIT_FIELD_KEY: "Field name too long",
  LIMIT_FIELD_VALUE: "Field value too long",
  LIMIT_FILE_COUNT: "Too many files",
  LIMIT_FILE_SIZE: "File too large",
  LIMIT_PART_COUNT: "Too many parts",
  LIMIT_UNEXPECTED_FILE: "Unexpected field",
  MISSING_FIELD_NAME: "Field name missing",
};

export const productsImageMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ message: errorMessages[err.code] });
    } else if (err) {
      console.log(err)
      return res.status(500).json({ message: "An error ocurred when uploading" });
    }

    next();
  });
};
