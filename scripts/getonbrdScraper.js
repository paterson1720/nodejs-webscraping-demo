const cheerio = require("cheerio")
const rp = require("request-promise")

const parseHtmlToJson = async url => {
  const html = await rp(url)
  const $ = cheerio.load(html)
  let title = $("h1 span[itemprop=title]").text().trim()
  let logo = $(".gb-company-logo__link img").attr("src")
  let date = $("time[itemprop=datePosted]").attr("datetime")
  let company = $("strong[itemprop=name]").html()
  let qualification = $("h2 span[itemprop=qualifications]").html()
  let location = $("span[itemprop=addressCountry]").text().trim()
  let salary = $("h3 span[itemprop=baseSalary]").text().trim()
  let description = $("div #job-body[itemprop=description]").html().trim()
  let tags = $("div[itemprop=skills]").text().trim().replace(/(?:\r\n|\r|\n)/g, ",").split(",")

  return {
    title,
    url,
    logo: logo,
    date: new Date(date),
    company,
    qualification,
    description,
    tags,
    location,
    salary,
  }
}

const getRemoteJobsUrls = async (cheerio, html, selectors) => {
    const remoteJobsUrls = []
    const $ = await cheerio.load(html)
    const jobAnchorTags = $(selectors)
    for (let i = 0; i < jobAnchorTags.length; i++) {
      remoteJobsUrls.push(jobAnchorTags[i].attribs.href)
    }
    return remoteJobsUrls
}

const scrapeGetOnBrdJobs = async url => {
  let html = await rp(url)
  const remoteJobsUrls = await getRemoteJobsUrls(cheerio, html, "div .remote a")
  return Promise.all(
    remoteJobsUrls.map(url => {
      return parseHtmlToJson(url)
    }),
  )
}

/* const logFoundJobs = async () => {
  const jobs = await scrapeGetOnBrdJobs(
    "https://www.getonbrd.world/jobs/programming",
  )
  console.log(jobs)
  console.log("Done")
} */

module.exports = scrapeGetOnBrdJobs;
