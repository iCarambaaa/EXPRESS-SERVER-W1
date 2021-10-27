
import express from "express"
import { pipeline } from "stream"
//import { createGzip } from "zlib"
import { getBlogsReadableStream, getPosts } from "../lib/fs-tools.js"
import { getPDFReadableStream } from "../lib/pdf-tools.js"



const filesRouter = express.Router()



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