
import express from "express"
import { pipeline } from "stream"
//import { createGzip } from "zlib"
import { getAuthorsReadableStream, getPosts } from "../lib/fs-tools.js"
import { getPDFReadableStream } from "../lib/pdf-tools.js"
import json2csv from "json2csv"


const filesRouter = express.Router()


filesRouter.get("/authorsCSV", (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", `attachment; filename=authors.csv`) // set as download
    const source = getAuthorsReadableStream() // gettin readable stram from fs-tools
    const transform = new json2csv.Transform({ fields: ["name", "surname", "email", "date of birth"] }) // using json2csv Constructor class
    const destination = res

    pipeline(source, transform, destination, err => {
      if (err) next(err)
    })
  } catch (error) {
    next(error)
  }
})






// filesRouter.get("/downloadPDF", (req, res, next) => {
//     try {
//       res.setHeader("Content-Disposition", "attachment; filename=whatever.pdf") // This header tells the browser to do not open the file, but to download it
  
//       const source = getPDFReadableStream({ firstName: "Zee" }) // PDF READABLE STREAM
//       const destination = res
  
//       pipeline(source, destination, err => {
//         if (err) next(err)
//       })
//     } catch (error) {
//       next(error)
//     }
//   })

  export default filesRouter