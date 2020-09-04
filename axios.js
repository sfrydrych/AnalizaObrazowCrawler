const axios = require("axios");

const defaultUrl = "http://localhost:3091/";

async function post(url, data) {
    return axios.default.post(defaultUrl + url, data)
};

async function get(url) {
    return axios.default.get(defaultUrl + url)
};

module.exports = { get, post };