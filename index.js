const express = require("express")
const app = express()

// Nedb is a Embedded persistent or in memory database for Node.js 
// learn more about nedb here: https://github.com/louischatriot/nedb
const Datastore = require('nedb')
const db = new Datastore({ filename: './database.db' });
db.loadDatabase();

// Scraping remote getonboard jobs and save them in our nedb database
const scrapeGetOnBrdJobs = require("./scripts/getonbrdScraper")
const scrapeJobs = async () => {
    const url = "https://www.getonbrd.world/jobs/programming";
    const remoteJobs = await scrapeGetOnBrdJobs(url)
    db.insert(remoteJobs)
  }
scrapeJobs()

// setting ejs as our template engine
app.set("view engine", "ejs")

app.get("/", async (req, res) => {
    db.find({}, (err, docs)=>{
        res.render("pages/index", { jobs: docs })
    }) 
})

app.listen(8080, () => {
  console.log("Visit localhost:8080 in your browser to see this app")
})
