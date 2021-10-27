import fs from "fs-extra"
//import { fileURLToPath } from "url"
import { dirname, join } from "path"

const {readJSON, writeJSON, writeFile, createReadStream } = fs //readJSON and writeJSON are not part of the "normal" fs module -- async functions


// ****************** declare all file paths ******************
export const publicDirectory = join(process.cwd(), "./public") // getting the folder path - process.cwd() gives the root folder

const dataFolder = join(process.cwd(), "/src/data") // process.cwd() gives the root folder

const authorsJSONPath = join(dataFolder, "authors.json") // Joining folder path and file
const blogsJSONPath = join(dataFolder, "blogs.json")


// ****************** USE HELPERFUNCTIONS TO GET AND WRITE THE JSON *******************

export const getAuthors = () => readJSON(authorsJSONPath) //don`t forget to export
export const getPosts = () => readJSON(blogsJSONPath)

export const writeAuthors = (content) => writeJSON(authorsJSONPath, content) // don't forget the content
export const writePosts = (content) => writeJSON(blogsJSONPath, content)


// ****************** HELPERFUNCTION TO CREATE READBLE STREAM FOR PDF *******************

export const getBlogsReadableStream = () => createReadStream(blogsJSONPath)