const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const cheerio = require('cheerio');

const PORT = 3002;
const app = express();

// Use middleware to parse the request body
app.use(express.json());
app.use(cors());

const BaseURL = "https://gogoanime3.co";

async function GogoDLScrapper(animeid, cookies) {
    try {
        const cookieString = `DSuzmasXADJj1ZLxRODY%2FnVKXPhBllkGsxwNPluS93Ih0%2BRVO2j47VvaG%2Bhuvix6jFu%2BCq6Rg%2Fx5XKFwR78oUQ%3D%3D`;

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        await page.setExtraHTTPHeaders({ 'Cookie': cookieString });
        await page.goto(`${BaseURL}/${animeid}`);

        const html = await page.content();
        const body = cheerio.load(html);
        let data = {};
        const links = body("div.cf-download").find("a");

        links.each((i, link) => {
            const a = body(link);
            data[a.text().trim()] = a.attr("href").trim();
        });

        await browser.close();

        return data;
    } catch (e) {
        return e;
    }
}

app.get('/:animeid', async (req, res) => {
    const animeid = req.params.animeid;
    const cookies = req.body.cookies; // Assuming you send cookies in the request body

    const result = await GogoDLScrapper(animeid, cookies);
    res.json(result);
});

app.listen(PORT, () => {
    console.log('The service is on on', PORT);
});
