import express from "express"
import uniqid from 'uniqid'; // randomid generator
import createHttpError from "http-errors"
import { validationResult } from "express-validator"
import { postsValidationMiddlewares } from '../lib/validations.js'; // declared validations
import {getPosts, writePosts} from "../lib/fs-tools.js"
import { pipeline } from "stream" //for the PDF
import { getPDFReadableStream } from "../lib/pdf-tools.js"

const postsRouter = express.Router()


// GET /blogPosts => returns the list of blogposts
// USE TRY & CATCH

postsRouter.get("/", async (req, res, next) => {
    try {   
      const posts = await getPosts()
      if (req.query && req.query.title) {
        const filteredPosts = posts.filter(post => post.title === req.query.title)
        res.send(filteredPosts)
      } else {
        res.send(posts)
    }
    } catch (error) {   // Errors that happen here need to be 500 errors (Generic Server Error)
      next(error)
    }
  })

// GET /blogPosts /123 => returns a single blogpost

postsRouter.get("/:id", async (req, res, next) => {

  try {
    const posts = await getPosts()
    
    const post = posts.find(b => b.id == req.params.id)
    if (post) {

      res.send(post) // send if found
    
    } else {
  
      next(createHttpError(404, `Post with id ${req.params.id} not found!`)) // return error build with "http-errors" f(404, [msg])
    
    }} catch (error) {
    // Errors that happen here need to be 500 errors (Generic Server Error)
    next(error) 
    
  }
})

// POST /blogPosts => create a new blogpost

postsRouter.post("/", postsValidationMiddlewares, async (req, res, next) => {     //Validati0n MIDDLEWARE goes here
  try {
    const errorsList = validationResult(req)

    if (!errorsList.isEmpty()) {
      // If we had validation errors --> we need to trigger Bad Request Error Handler
      next(createHttpError(400, { errorsList }))
    } else {
      const newPost = { id: uniqid(), ...req.body, createdAt: new Date() }
      const posts = await getPosts()

      posts.push(newPost)

      await writePosts(posts)

      res.status(201).send(newPost)
    }
  } catch (error) {

    next(error)
  }
})

// PUT /blogPosts /123 => edit the blogpost with the given id

postsRouter.put("/:id", async (req, res, next) => {
  try {
    const posts = await getPosts()

    const index = posts.findIndex(post => post.id === req.params.id)

    const postToModify = posts[index]
    const updatedFields = req.body

    const updatedPost = { ...postToModify, ...updatedFields }

    posts[index] = updatedPost

    await writePosts(posts)

    res.send(updatedPost)
  } catch (error) {

    next(error)
  }
})


// DELETE /blogPosts /123 => delete the blogpost with the given id

postsRouter.delete("/:id", async (req, res, next) => {
  try {
    const posts = await getPosts()

    const remainingPosts = posts.filter(post => post.id !== req.params.id)

    await writePosts(remainingPosts)

    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

// *******************************COMMENTS*******************************

// GET /blogPosts/:id/comments, get all the comments for a specific post

postsRouter.get("/:id/comments", async (req, res, next) => {

  try {
    const posts = await getPosts()
  
    const post = posts.find(b => b.id == req.params.id)
    
    if (post) {
     
      res.send(post.comments) // send if found
      
    
    } else {
  
      next(createHttpError(404, `Post with id ${req.params.id} not found!`)) // return error build with "http-errors" f(404, [msg])
    
    }} catch (error) {
    // Errors that happen here need to be 500 errors (Generic Server Error)
    next(error) 
    
  }
})

// POST /blogPosts/:id/comments, add a new comment to the specific post

postsRouter.post("/:id/comments", async (req, res, next) => {
  try {
    const posts = await getPosts()

    const index = posts.findIndex(post => post.id === req.params.id)
if(index !== -1) {

  posts[index].comments.push({
    ...req.body, id: uniqid(), createdAt: new Date()
  })
//     const postToAddTheComment = posts[index]
//     const newComment= {  ...req.body, commentId : uniqid() }
//     const comments = [...postToAddTheComment.comments]
//     console.log(comments)

//     const updatedPost = { ...comments, ...newComment }

//     posts[index] = updatedPost

   await writePosts(posts)

 res.send(posts[index])
// }else{
  res.status(404).send("not found")
}
  } catch (error) {

    next(error)
  }
})


// PUT 
// DELETE

//PDF

postsRouter.get("/:id/downloadPDF", async (req, res, next) => {
  try {
    const posts = await getPosts()
    const post = posts.find(p => p.id == req.params.id)
    if(post) {
    res.setHeader("Content-Disposition", `attachment; filename=${post.title}.pdf`) // This header tells the browser to do not open the file, but to download it
    const source = getPDFReadableStream( post ) // PDF READABLE STREAM
    const destination = res

    pipeline(source, destination, err => {
      if (err) next(err)
   
    })}else{
      res.send((`Blog post with ID ${req.params.id} not found`))
    } 
  } catch (error) {
    next(error)
  }
})







export default postsRouter