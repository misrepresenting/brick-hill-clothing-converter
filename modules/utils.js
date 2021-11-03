const sharp = require('sharp');
const sizes = require('./../assets/sizes.json');

async function getComposite(
    rLeftIter,
    rTopIter,
    bhLeftIter,
    bhTopIter,
    size,
    count,
    assetBuffer
) {
    const compositeMap = [];
    const rSize = size[0];
    const bhSize = size[1];

    for (let i = 0; i < count; i++) {
        // the extract method edits the sharp object so we will have to create a new one, or else it will give us bad extract area
        const crop = sharp(assetBuffer)
            .extract({
                left: rLeftIter(i),
                top: rTopIter(i),
                width: rSize[0],
                height: rSize[1],
            })
            .resize(bhSize[0], bhSize[1]);
        const buffer = await crop.toBuffer();

        // push a composite array so we can composite the image
        compositeMap.push({
            input: buffer,
            left: bhLeftIter(i),
            top: bhTopIter(i),
        });
    }

    return compositeMap;
}

// convert the roblox template to brick hill (use the image buffer as param later)
exports.convertTemplate = async function (assetBuffer) {
    const bhTemplate = sharp('./assets/brick-template.png'); // the current directory will be outer since the function is called in a dif enviroment
    const compositeMap = [];
    // get all of the composites of the limbs and then stitch them together onto one big composite

    const rLeg = await getComposite(
        (i) => 66 * i + 19,
        (i) => 355,
        (i) => 58 * i + 16,
        (i) => 321,
        sizes.limb,
        4,
        assetBuffer
    );
    const lLeg = await getComposite(
        (i) => 66 * i + 308,
        (i) => 355,
        (i) => 58 * i + 269,
        (i) => 321,
        sizes.limb,
        4,
        assetBuffer
    );
    const limbTop = await getComposite(
        (i) => 91 * i + 217,
        (i) => 289,
        (i) => 79 * i + 190,
        (i) => 263,
        sizes.square,
        2,
        assetBuffer
    );
    const limbBottom = await getComposite(
        (i) => 91 * i + 217,
        (i) => 485,
        (i) => 79 * i + 190,
        (i) => 438,
        sizes.square,
        2,
        assetBuffer
    );
    const torso = await getComposite(
        (i) => 196 * i + 231,
        (i) => 74,
        (i) => 172 * i + 157,
        (i) => 73,
        sizes.torso,
        2,
        assetBuffer
    );
    const sideTorso = await getComposite(
        (i) => 196 * i + 165,
        (i) => 74,
        (i) => 172 * i + 99,
        (i) => 73,
        sizes.limb,
        2,
        assetBuffer
    );
    const bottomTorso = await getComposite(
        (i) => 231,
        (i) => 196 * i + 8,
        (i) => 157,
        (i) => 177 * i + 13,
        sizes.bottomTorso,
        2,
        assetBuffer
    );

    compositeMap.push(...rLeg);
    compositeMap.push(...lLeg);
    compositeMap.push(...limbTop);
    compositeMap.push(...limbBottom);
    compositeMap.push(...torso);
    compositeMap.push(...sideTorso);
    compositeMap.push(...bottomTorso);

    bhTemplate.composite(compositeMap);

    return await bhTemplate.toBuffer();
};
