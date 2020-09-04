const Utils = require("./utils");
const axios = require("./axios");

var main = async function () {
    try {
        // await Utils.downloadAllFile();
        // const images = await Utils.sendFilesToDatabase();
        // const similarities = await Utils.sendPatternSimilarity();
        // const algorithms = await Utils.sendAlgorithms();

        const responseImage = await axios.get("images");
        const images = responseImage.data;
        const responseSimilarity = await axios.get('similarities');
        const similarities = responseSimilarity.data;
        const responseAlgorithms = await axios.get('algorithms');
        const algorithms = responseAlgorithms.data;

        await Utils.generatedResultsAndSendResult(images, similarities, algorithms);
        console.log(images, similarities, algorithms);

    } catch (error) {
        console.log(error);
    }
}

main()