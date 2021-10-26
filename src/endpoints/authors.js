import express from 'express';
import uniqid from 'uniqid'; // random_id generator
import createHttpError from "http-errors" // easier error creation
import {getAuthors, writeAuthors} from '../lib/fs-tools.js'; // fs helper functions
import multer from "multer"; // image upload handler
import { v2 as cloudinary } from "cloudinary" // CND
import { CloudinaryStorage } from "multer-storage-cloudinary" // multer + CND


const authorRouter = express.Router() // declare Router
// a Router is a set of endpoints that share something like a prefix (authorsRouter is going to share /authors as a prefix)


// defining CND properties
const cloudinaryStorage = new CloudinaryStorage({
    cloudinary, // CREDENTIALS, this line of code is going to search in process.env for CLOUDINARY_URL
    params: {
      folder: "strive-books",
    },
  })


// ******************** routes for API requests ****************

//GET all authors

authorRouter.get("/", async(req, res, next) => { // remember to declare as async
    try {
        const content = await getAuthors()
        console.log("✅ GET Authors fired: ", content)
        
        if (req.query && req.query.title) { // in case we have a query to deal with
            const filteredAuthors = content.filter(element => element.name === req.query.name)
            res.send(filteredAuthors)
            
        } else {
            res.send(content)
        }
        
    } catch (error) {    // Errors that happen here need to be 500 errors (Generic Server Error)
        next(error)     // forward error to error handlers (next is a function and takes the error as parameter)
    }

})

// GET single author

authorRouter.get("/:id", async(req, res, next) => {
    try {
        const content = await getAuthors() // fetch authors array
        const author = content.find(element => element.id === req.params.id) // find author by id provided in the URL
        if (author) {
                res.send(author) // send author if found
                console.log("✅ GET Single Author fired: ", content)
        } else {
                        // instead of this:
                        // const err = new Error("Not found error")
                        // err.status = 404
                        // next(err)
                        // use this:
            next(createHttpError(404, `Author with id ${req.params.id} not found!`)) // create and forward error // this http-errors syntax
            console.log(`❌ GET Single Author fired with id ${req.params.id}:`, 404)
         }

    } catch (error) {
        next(error)
    }
}) 

// POST author

authorRouter.post("/", async(req, res, next) => {
    try {
        const authors = await getAuthors()              // get array of authors
        const newAuthor = {...req.body, id: uniqid()}   // create new author
        authors.push(newAuthor)                         // add author
        await writeAuthors(authors)                           // update JSON
        res.status(201).send(newAuthor)                 // send back updated author
        
    } catch (error) {
        next (error)
    }

})

// PUT author

authorRouter.put("/:id", async(req, res, next) => {
    try {
            const authors = await getAuthors()
            const index = authors.findIndex((author) => author.id === req.params.id) 
            const luckyAuthor = {...authors[index], ...req.body}
            authors[index] = luckyAuthor

            await writeAuthors(authors)
            
            res.status(200).send(luckyAuthor)

    } catch (error) {

        next(error)
    }
})


// DELETE author

authorRouter.delete("/:id", async(req, res,next) => {
    try { 
        const authors = await getAuthors()
        const rest = authors.filter((author) => author.id !== req.params.id)
        await writeAuthors(rest)
        res
        .status(204)
        .send(`product with id ${req.params.id} deleted successfully`);        
    } catch (error) {
        next (error)
    }
})


// upload profile avatar

authorRouter.patch("/:id/avatar", multer({ storage: cloudinaryStorage }).single("profilePic"), async (req, res, next) => {
    try {
       
        console.log(req.file)
        const authors = await getAuthors()
        const index = authors.findIndex((author) => author.id === req.params.id) 
       
        if (index) {

            authors[index].avatar = req.file.path 
            await writeAuthors(authors)
            res.status(201).send(`Image uploaded on Cloudinary: ${req.file.path}` )

        } else {
            res.send(createHttpError(404, `Author with ID ${req.params.id} not found`))
        }
    } catch (error) {
      next(error)
    }
  })


// export the router 

export default authorRouter 