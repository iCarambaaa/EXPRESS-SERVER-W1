import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints"; // table of endpoints
import authorRouter  from "./endpoints/authors.js"; // import author router
import postsRouter  from "./endpoints/blogs.js"; // import posts router
//import filesRouter from "./endpoints/files.js"; // import files router
import { genericErrorHandler, badRequestHandler, unauthorizedHandler, notFoundHandler } from "./lib/errorHandlers.js";
import {publicDirectory} from "./lib/fs-tools.js";


const server = express(); // express server declaration


// CORS setup

const whitelist = [process.env.FE_LOCAL_URL, process.env.FE_PROD_URL]

const corsOpts = {
  
  origin: function (origin, next) {
    // Since CORS is a global middleware, it is going to be executed for each and every request --> 
    // we are able to "detect" the origin of each and every req from this function
    console.log("CURRENT ORIGIN: ", origin)

    if (!origin || whitelist.indexOf(origin) !== -1) {
      // If origin is in the whitelist or if the origin is undefined () --> move ahead
      next(null, true)

    } else {
      // If origin is NOT in the whitelist --> trigger a CORS error
      next(new Error("CORS ERROR"))
    }
  }
}


// *********************** GLOBAL MIDDLEWARES ********************

server.use(cors(corsOpts)); // cors for connecting BE&FE

server.use(express.json()); // this! specify before ENDPOINTS, else all will be UNDEFINED

server.use(express.static(publicDirectory)); // declaring as public folder (serving static content from here on now)

// ************************ ENDPOINTS **********************

server.use("/authors", authorRouter)
server.use("/posts", postsRouter)
// server.use("/files", filesRouter)

// *********************** ERROR MIDDLEWARES ***************************


server.use(badRequestHandler)
server.use(unauthorizedHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)



// RUNNING THE MAIN THREAD LOOP

console.table(listEndpoints(server)) // usage of express-list-endpoints

const PORT = process.env.PORT // Port declaration out of .env

server.listen(PORT, () => console.log("Server listening on port :", PORT, "✅")); // Main thread initialization

server.on("error", (error) =>                                                      // error handling
  console.log(`❌ Server is not running due to : ${error}`)        
);