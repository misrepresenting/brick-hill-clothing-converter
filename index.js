const {convertTemplate} = require('./modules/utils.js');
const sharp = require('sharp');
const {appendFileSync} = require('fs');


sharp('./ta.png')
    .toBuffer()
    .then((buffer) => convertTemplate(buffer))
    .then((template) => appendFileSync('./lol.png', template));

/*
(async () => {
    const buffer = await sharp('./ta.png').toBuffer();
    const template = await convertTemplate(buffer);


    appendFileSync('./lol.png', template)
})()
*/