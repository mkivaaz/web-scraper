const PORT = 8000
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const cors = require('cors')
const { attr } = require('cheerio/lib/api/attributes')

const app = express()
app.use(cors())

const URL = 'https://lunar.app/'//replace URL here
const terms = [
    "twitter", 
    "facebook", 
    "linkedin", 
    "instagram",
    "tiktok",
    "snapchat",
    "github",
    "play.google", 
    "apps.apple"]

app.get('/', (req, res) => {
    res.send("This is base api")
})

app.get('/results',  (req, res) => {

    if (req.method != 'GET') {
        res.send(405, 'HTTP Method ' + req.method + ' not allowed');
        return;
    }

    const parsedUrl = req.query.url

    axios(parsedUrl)
    .then(response => {
        const html = response.data
        const links = []
        const meta_tags = []
        let website =''
        const $ = cheerio.load(html)
        const a = $('a',html)
        const meta = $('meta', html)
        const description = $('meta[property="og:description"]',html)?.attr('content')
        const title = $('meta[property="og:title"]',html)?.attr('content')
        const image = $('meta[property="og:image"]',html)?.attr('content')
        const type = $('meta[property="og:type"]',html)?.attr('content')

        a.each( (index, element) =>{
            const href = $(element)?.attr('href')
            let pos = 0
            if(terms.some(term => {                
                const res = href?.includes(term)
                if(res)
                    return res
                pos = pos + 1
                return res
            })){
                website = terms[pos]
                links.push({site: website ,url: href})
            }               
                
        })

        meta.each((index, element) =>{
            meta_tags.push($(element).attr())
        })
       
        let uniqueLinks = links.filter((value, index, self) => 
        index === self.findIndex(t => (
            t.place === value.place && t.site === value.site
        )))//filters out duplicates

        const data = {
            social: uniqueLinks,
            // description: description,
            // title:title,image:image, 
            // type:type, 
            meta_tags:meta_tags
        }
        res.send({
            result:'Ok',
            items:data})
        

        
    }).catch(err => console.log(err))
})




app.listen(3000, () => console.log(`Listening Port:${PORT}`))