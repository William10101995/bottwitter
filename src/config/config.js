"use strict";
exports.__esModule = true;
exports.configTweet = void 0;
var dotenv_1 = require("dotenv");
dotenv_1["default"].config();
exports.configTweet = {
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000,
    strictSSL: true
};
