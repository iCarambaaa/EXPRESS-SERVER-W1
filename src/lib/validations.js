import { body } from "express-validator"

export const authorsValidationMiddlewares = [
  body("name").exists().withMessage("Name is a mandatory field!"),
  body("surname").exists().withMessage("Surname is a mandatory field!"),
  body("email").exists().withMessage("Email is a mandatory field!").isEmail().withMessage("Email is not in the right format!"),
  body("date of birth").exists().withMessage("Surname is a mandatory field!")
]



export const postsValidationMiddlewares = [
  body("category").exists().withMessage("Category is a mandatory field!"),
  body("title").exists().withMessage("Title is a mandatory field!"),
  body("content").exists().withMessage("Content is a mandatory field!")
]