const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const cors = require('cors');

const PORT = 3001;
const app = express();
app.use(cors());

const csspath = path.join(__dirname,'../public/css');
const jspath = path.join(__dirname,'../public/js');

app.use("/css", express.static(csspath));

app.use("/js", express.static(jspath));

app.set("view engine", "hbs");

const name= "heloo";




app.get("/download/:id", async (req, res) => {
    try {
        const downname = encodeURIComponent(req.params.id);
        const downloadlink1 = `https://ww3.gogoanimes.fi/category/${downname}`;
        const downloadreq = await axios.get(downloadlink1);
        const downloadres = downloadreq.data;

        const $ = cheerio.load(downloadres);

        //console.log(downloadres);
        //console.log("=====x=====");

        const eptv = [];

        const nameid = $('#episode_page li').find('a').attr('ep_end') || null;

        const image = $('.anime_info_body_bg').find('img').attr('src') || null;

        const imageani = "https://ww3.gogoanimes.fi/" + image;

        console.log(imageani);

        const type = $('.anime_info_body_bg').find('p:eq(1) a').attr('title') || null;

        console.log(type);

        const animeview = $('.anime_info_body_bg').find('p:eq(2)').text() || null;

        console.log(animeview);

        const genre = $('.anime_info_body_bg').find('p:eq(3)').text().trim().split('Genre:')[1] || null;

        console.log(genre);

        const statusani = $('.anime_info_body_bg').find('p:eq(4)').text().split('Released:')[1] || null;

        const airedani = $('.anime_info_body_bg').find('p:eq(5)').text().split('Status')[1] || null;

        const namenick = $('.anime_info_body_bg').find('h1').text() || null;

        for (var i = 1; i <= nameid; i++) {
            //console.log(i);

            try {
                const eplink = `https://api.anime-dex.workers.dev/download/${downname}-episode-${i}`;
                const epreq = await axios.get(eplink);
                const epres = epreq.data;

                //console.log(epres);

                const quality360 = epres.results["640x360"] || null;
                const quality480 = epres.results["854x480"] || null;
                const quality720 = epres.results["1280x720"] || null;
                const quality1080 = epres.results["1920x1080"] || null;

                //console.log(quality1080);

                eptv.push({ ep_num:i, quality360, quality480, quality720, quality1080, imageani});
               

            } catch (error) {
                console.log(error);
            }
        }

        // Send the response after the loop is complete
        //res.json({ animeid: downname, nameid, eptv });
        res.status(200).render("index", {downname, nameid, eptv, imageani, type, animeview, genre, statusani, airedani, namenick})

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log('the service is on on ', PORT);
});
