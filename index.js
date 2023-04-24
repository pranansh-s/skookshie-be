const spotAPI = require('./spotify');
const axios = require('axios');
const youtubeAudio = require('ytdl-core');
const querystring = require('querystring');
const express = require('express');
const path = require('path');
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const app = express();

app.get('/youtube', async(req, res) => {    
    let youtubeResults = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${querystring.escape(req.query.search)}&type=video&maxResults=1&videoCategoryId=10&key=${process.env.GOOGLE_API}`);
    let uri = `https://www.youtube.com/watch?v=${youtubeResults.data.items[0].id.videoId}`;
    youtubeAudio(uri, { quality: '140' }).pipe(res);
});

app.get('/song', async(req, res) => {
    let spotifyResults = await spotAPI.getTracks(req.query.search);
    res.json({ spotify: spotifyResults });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(PORT, console.log("Online"));

