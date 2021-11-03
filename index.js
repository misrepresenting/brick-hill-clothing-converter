const { convertTemplate } = require('./modules/utils.js');
const sharp = require('sharp');
const { appendFileSync } = require('fs');

(async () => {
    const buffer = await sharp('./ta.png').toBuffer();
    const template = await convertTemplate(buffer);

    appendFileSync('./lol.png', template);
})();
