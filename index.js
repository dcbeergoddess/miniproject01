const inquirer = require("inquirer")
const axios = require("axios")
const fs = require("fs")


const createTag = (tagName, str) => {
  return `<${tagName}>${str}</${tagName}>`
}

const createH1Tag = (str) => {
  return `<h1>${str}</h1>`
}
const createDiv = (str) => {
  return `<div>${str}</div>`  
}

const createUlTag = (str) => {
  return `<ul>${str}</ul>`  
}

const createLiTag = (str) => {
  return `<li>${str}</li>`  
}

inquirer.prompt([
  {
    type: "input",
    message: "What is your name?",
    name: "name"
  },
  {
    type: "input",
    message: "What is your github username?",
    name: "github"
  },
  {
    type: "input",
    message: "How many repos should go on this page?",
    name: "repoCount"
  }
]).then( ({name, github, repoCount}) => {
  const queryUrl = `https://api.github.com/users/${github}/repos?per_page=${repoCount}`;
  axios
    .get(queryUrl)
    .then( resp => {
      const repoArray = resp.data
      let html = `
        <html>
        <head>
          <title>${name}'s Web Page</title>
        </head>  
        <body>
      `;
      //create h1 tag for page title
      html += createH1Tag("Web Page For " + name)

      //for each repo, create a div, and a ul/li combo for some info
      // loop through repo first, your repoArray
      //forEach = for(var i = 0...)

      repoArray.forEach( repo => {

        //Create each li tag for the current repo
        const liTag1 = createLiTag("Id: " + repo.id) // <li>Id: 45423235<li>
        const liTag2 = createLiTag("Name: " + repo.name)

        //Join two li tags together into a single string
        const allLiTags = liTag1 + liTag2

        //Put the string of li tags inside the <ul> tag
        const ulTag = createUlTag(allLiTags) //<ul><li>....<li></li>...etc.

        //Put the ul tag inside of a div

        const divTag = createDiv(ulTag) //<div>...</div>

        // Add the div tag for this repo to the html
        html += divTag
      })

      //Now at the closing html tags
      html +=`
      </body>
      </html>
      `;

      fs.writeFile("index.html", html, err => {
        if(err){
          return console.log(err)
        }

        console.log("Success!")
      })
      // console.log(html)
    })
});