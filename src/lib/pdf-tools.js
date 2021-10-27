import PdfPrinter from "pdfmake"
import striptags from "striptags"
import { getBlogsReadableStream, getPosts } from "../lib/fs-tools.js"

export const getPDFReadableStream = post => {
  const fonts = {
    Helvetica: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      // italics: "fonts/Roboto-Italic.ttf",
      // bolditalics: "fonts/Roboto-MediumItalic.ttf",
    },
  }
  const cleanContent = striptags(post.content)
  const printer = new PdfPrinter(fonts)
  console.log("hello world", post)
  const docDefinition = {
    pageSize: 'A4',
    pageOrientation: 'portrait', pageBreak: 'after',
    content: [  {text: `${post.title}\n\n`, style: "header"},
                {text: `${post.category}\n\n`, style: "subheader"},
                {text: `${cleanContent}\n\n`},
                {text: `${post.author.name}\n\n`},
             ],
             styles: {
                header: {
                    fontSize: 22,
                    bold: true
                },
                subheader: {
                    fontSize: 20,
                    bold: true
                },
              
                small: {
                    fontSize: 8
                }
            },

    defaultStyle: {
      font: "Helvetica",
      fontSize: 17
    },
    // ...
  }

  const options = {
    // ...
  }

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, options)
  // pdfReadableStream.pipe(fs.createWriteStream('document.pdf')); // old syntax for piping
  // pipeline(pdfReadableStream, fs.createWriteStream('document.pdf')) // new syntax for piping (we don't want to pipe pdf into file on disk right now)
  pdfReadableStream.end()

  return pdfReadableStream
}