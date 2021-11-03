const { convertTemplate } = require('./modules/utils.js');
const sharp = require('sharp');
const { appendFileSync } = require('fs');

const express = require('express');
const app = express();

app.listen(80); // http port lol

app.get('/convert', (req, res) => {
    console.log('A');
    res.json({ a: 1 });
});
