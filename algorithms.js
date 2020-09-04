const MathAlgorithm = require("./math");
const flatMap = require('array.prototype.flatmap');
const Fs = require('fs');
const Jimp = require('jimp');
const { Image } = require('image-js');
const Sharp = require('sharp');

const testPath1 = "test1.jpeg";
const testPath2 = "test2.jpeg";


var oneSquare = function (name, image1, image2) {
    try {
        const defaultSquare = MathAlgorithm.getDefaultSquare(image1, image2);

        var sumSimilarity = 0;

        for (var i = 0; i < defaultSquare.width; i++)
            for (var j = 0; j < defaultSquare.height; j++) {
                sumSimilarity = sumSimilarity + MathAlgorithm.comparePixelInImages(image1, image2, defaultSquare.width + i, defaultSquare.height + j);
            }

        const similarity = (sumSimilarity / (defaultSquare.width * defaultSquare.height) * 100).toFixed(2);

        // console.log(`One Square Compare : Similarity ${similarity} %`);

        return { name, similarity };

    } catch (error) {
        console.log(error)
    }
}

var fiveSquare = function (name, image1, image2) {
    try {
        const defaultSquare = MathAlgorithm.getDefaultSquare(image1, image2);

        var sumSimilarity = 0;

        for (var i = 0; i < defaultSquare.width; i++)
            for (var j = 0; j < defaultSquare.height; j++) {
                sumSimilarity = sumSimilarity + MathAlgorithm.comparePixelInImages(image1, image2, i, j) +
                    MathAlgorithm.comparePixelInImages(image1, image2, defaultSquare.width + i, defaultSquare.height + j) +
                    MathAlgorithm.comparePixelInImages(image1, image2, defaultSquare.width * 2 + i, j) +
                    MathAlgorithm.comparePixelInImages(image1, image2, i, defaultSquare.height * 2 + j) +
                    MathAlgorithm.comparePixelInImages(image1, image2, defaultSquare.width * 2 + i, defaultSquare.height * 2 + j);

            }

        const similarity = (sumSimilarity / (defaultSquare.width * defaultSquare.height * 5) * 100).toFixed(2);

        //  console.log(`Five Square Compare : Similarity ${similarity} %`);

        return { name, similarity };

    } catch (error) {
        console.log(error);
    }
}

var bigSquare = function (name, image1, image2) {
    try {
        const defaultSquare = MathAlgorithm.getBigDefaultSquare(image1, image2);

        var sumSimilarity = 0;

        for (var i = 0; i < defaultSquare.width; i++)
            for (var j = 0; j < defaultSquare.height; j++) {
                sumSimilarity = sumSimilarity + MathAlgorithm.comparePixelInImages(image1, image2, defaultSquare.width + i, defaultSquare.height + j);
            }

        const similarity = (sumSimilarity / (defaultSquare.width * defaultSquare.height) * 100).toFixed(2);

        //  console.log(`Big Square Compare : Similarity ${similarity} %`);

        return { name, similarity };

    } catch (error) {
        console.log(error);
    }
}

var random = function (name, image1, image2) {
    try {
        const square = MathAlgorithm.getBigDefaultSquare(image1, image2);

        const countPixels = square.width * square.height;

        const defaultSquare = MathAlgorithm.compareSquare(MathAlgorithm.getSize(image1.bitmap), MathAlgorithm.getSize(image2.bitmap));

        let pixelsToCompare = [];
        // var h = ['|', '/', '-', '\\'];
        //var i = 0;
        while (pixelsToCompare.length < countPixels) {
            const x = Number((Math.random() * defaultSquare.width).toFixed(0));
            const y = Number((Math.random() * defaultSquare.height).toFixed(0));
            if (pixelsToCompare.filter(f => f.x == x && f.y == y).length < 1) {
                pixelsToCompare.push({
                    x,
                    y
                });
            }

            //   process.stdout.write(`\rLoading randomize algorithm ${h[i++]} ${(pixelsToCompare.length / countPixels * 100).toFixed(2)}%    `);
            //   i &= h.length - 1;

        }

        // process.stdout.write("\r");

        var sumSimilarity = 0;

        for (var i = 0; i < pixelsToCompare.length; i++) {
            sumSimilarity = sumSimilarity + MathAlgorithm.comparePixelInImages(image1, image2, pixelsToCompare[i].x, pixelsToCompare[i].y);
        }

        const similarity = (sumSimilarity / pixelsToCompare.length * 100).toFixed(2);

        //console.log(`Random Compare : Similarity ${similarity} %`);

        return { name, similarity };

    } catch (error) {
        console.log(error);
    }
}

var histogram = async function (name, imagePath, secondImagePath) {
    try {
        const image1 = await Image.load(imagePath);
        const image2 = await Image.load(secondImagePath);
        const image1Histogram = image1.getHistograms();
        const image2Histogram = image2.getHistograms();
        const countHistogram = flatMap(image1Histogram, (x) => x).length;

        var sumSimilarity = 0;

        for (var i = 0; i < image1Histogram.length; i++)
            for (var j = 0; j < image1Histogram[i].length; j++) {
                if (Math.abs(image1Histogram[i][j] - image2Histogram[i][j]) <= countHistogram * 0.1) {
                    sumSimilarity = sumSimilarity + 1;
                }
            }

        const similarity = (sumSimilarity / countHistogram * 100).toFixed(2);

        // console.log(`Histogram Compare : Similarity ${similarity} %`);

        return { name, similarity };

    } catch (error) {
        console.log(error);
    }
}

var greyScale = async function (name, imagePath, secondImagePath) {
    try {
        const image1 = await (await Jimp.read(imagePath)).grayscale();
        const image2 = await (await Jimp.read(secondImagePath)).grayscale();

        return await compareWithSecondAlgorithm(name, null, null, image1, image2);

    } catch (error) {
        console.log(error);
    }

}

var normalize = async function (name, imagePath, secondImagePath) {
    try {
        const image1 = await (await Jimp.read(imagePath)).normalize();
        const image2 = await (await Jimp.read(secondImagePath)).normalize();

        return await compareWithSecondAlgorithm(name, null, null, image1, image2);

    } catch (error) {
        console.log(error);
    }
}

var blur = async function (name, parameters, imagePath, secondImagePath) {
    try {
        const param = JSON.parse(parameters);

        const image1 = await (await Jimp.read(imagePath)).blur(param.r);
        const image2 = await (await Jimp.read(secondImagePath)).blur(param.r);

        return await compareWithSecondAlgorithm(name, null, null, image1, image2);

    } catch (error) {
        console.log(error);
    }
}

var gaussianBlur = async function (name, parameters, imagePath, secondImagePath) {
    try {
        const param = JSON.parse(parameters);

        const image1 = await (await Jimp.read(imagePath)).gaussian(param.r);
        const image2 = await (await Jimp.read(secondImagePath)).gaussian(param.r);

        return await compareWithSecondAlgorithm(name, null, null, image1, image2);

    } catch (error) {
        console.log(error);
    }
}

var dither = async function (name, imagePath, secondImagePath) {
    try {
        const image1 = await (await Jimp.read(imagePath)).dither565();
        const image2 = await (await Jimp.read(secondImagePath)).dither565();

        return await compareWithSecondAlgorithm(name, null, null, image1, image2);

    } catch (error) {
        console.log(error);
    }
}

var removeNoise = async function (name, imagePath, secondImagePath) {
    try {
        const image1 = await (await (await Jimp.read(imagePath)).color([{
            apply: 'desaturate',
            params: [90]
        }])).contrast(1);
        const image2 = await (await (await Jimp.read(secondImagePath)).color([{
            apply: 'desaturate',
            params: [90]
        }])).contrast(1);

        return await compareWithSecondAlgorithm(name, null, null, image1, image2);

    } catch (error) {
        console.log(error);
    }
}

var binary = async function (name, imagePath, secondImagePath) {
    try {
        const image1 = await (await Jimp.read(imagePath)).rgba(false).greyscale().contrast(1).posterize(2);

        const image2 = await (await Jimp.read(secondImagePath)).rgba(false).greyscale().contrast(1).posterize(2);

        return await compareWithSecondAlgorithm(name, null, null, image1, image2);

    } catch (error) {
        console.log(error);
    }
}

var sharpen = async function (name, imagePath, secondImagePath) {
    try {
        await Sharp(imagePath).sharpen(1, 1, 1).jpeg({
            quality: 100
        }).toFile(testPath1);
        await Sharp(secondImagePath).sharpen(1, 1, 1).jpeg({
            quality: 100
        }).toFile(testPath2);

        const compare = await compareWithSecondAlgorithm(name, testPath1, testPath2, null, null);

        await Fs.unlinkSync(testPath1);
        await Fs.unlinkSync(testPath2);

        return compare;

    } catch (error) {
        console.log(error);
    }
}

var normal = async function (name, imagePath, secondImagePath) {
    return await compareWithSecondAlgorithm(name, imagePath, secondImagePath);
}

var compareWithAlgorithm = async function (name, parameters, imagePath, secondImagePath) {

    if (name.includes("grey scale"))
        return await greyScale(name, imagePath, secondImagePath);

    if (name.includes("normalize"))
        return await normalize(name, imagePath, secondImagePath);

    if (name.includes("blur"))
        return await blur(name, parameters, imagePath, secondImagePath);

    if (name.includes("gaussian blur"))
        return await gaussianBlur(name, parameters, imagePath, secondImagePath);

    if (name.includes("dither"))
        return await dither(name, imagePath, secondImagePath);

    if (name.includes("remove noise"))
        return await removeNoise(name, imagePath, secondImagePath);

    if (name.includes("binary"))
        return await binary(name, imagePath, secondImagePath);

    if (name.includes("sharpen"))
        return await sharpen(name, imagePath, secondImagePath);

    if (name.includes("normal"))
        return await normal(name, imagePath, secondImagePath);
}

var compareWithSecondAlgorithm = async function (name, imagePath = null, secondImagePath = null, image1 = null, image2 = null) {

    if (!!imagePath)
        image1 = await Jimp.read(imagePath);

    if (!!secondImagePath)
        image2 = await Jimp.read(secondImagePath);

    if (name.includes("one square"))
        return oneSquare(name, image1, image2);

    if (name.includes("five square"))
        return fiveSquare(name, image1, image2);

    if (name.includes("big square"))
        return bigSquare(name, image1, image2);

    if (name.includes("random"))
        return random(name, image1, image2);

    if (name.includes("histogram")) {
        if (!imagePath && !secondImagePath) {
            await image1.writeAsync(testPath1);
            await image2.writeAsync(testPath2);

            const hm = await histogram(name, testPath1, testPath2);

            await Fs.unlinkSync(testPath1);
            await Fs.unlinkSync(testPath2);
            return hm;
        } else {
            return await histogram(name, imagePath, secondImagePath);
        }
    }
}


module.exports = {
    oneSquare, fiveSquare, bigSquare, random, histogram, compareWithAlgorithm, greyScale, normalize, blur, gaussianBlur, dither, removeNoise, binary, sharpen, normal,
};