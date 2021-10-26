import express from "express";
import { join } from "path"
import cors from "cors";
import listEndpoints from "express-list-endpoints"; // table of endpoints
import authorRouter  from "./endpoints/authors.js"; // import author router
import { genericErrorHandler, badRequestHandler, unauthorizedHandler, notFoundHandler } from "./lib/errorHandlers.js";


const server = express(); // express server declaration


server.use(cors()); // cors for connecting BE&FE

server.use(express.json()); // this! specify before ENDPOINTS, else all will be UNDEFINED


// public folder
const publicDirectory = join(process.cwd(), "./public") // getting the folder path - process.cwd() gives the root folder

server.use(express.static(publicDirectory)); // declaring as public folder (serving static content from here now on)

// *********************** GLOBAL MIDDLEWARES ********************

//empty

// ************************ ENDPOINTS **********************

server.use("/authors", authorRouter)


// *********************** ERROR MIDDLEWARES ***************************


server.use(badRequestHandler)
server.use(unauthorizedHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)




// RUNNING THE MAIN THREAD LOOP

console.table(listEndpoints(server)) // usage of express-list-endpoints

const PORT = process.env.PORT // Port declaration out of .env

server.listen(PORT, () => console.log("Server listening on port :", PORT, "✅")); // Main thread initialization

server.on("error", (error) =>
  console.log(`❌ Server is not running due to : ${error}`)         // error handling
);