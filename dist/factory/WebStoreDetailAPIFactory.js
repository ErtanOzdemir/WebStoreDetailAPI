"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebStoreDetailAPIFactory = void 0;
const ChromeDetailAPI_1 = require("../api/ChromeDetailAPI");
const FirefoxDetailAPI_1 = require("../api/FirefoxDetailAPI");
const OperaDetailAPI_1 = require("../api/OperaDetailAPI");
class WebStoreDetailAPIFactory {
    static createDetailAPI(options) {
        switch (options.platform) {
            case "chrome":
                return new ChromeDetailAPI_1.ChromeDetailAPI(options);
            case "firefox":
                return new FirefoxDetailAPI_1.FirefoxDetailAPI(options);
            case "opera":
                return new OperaDetailAPI_1.OperaDetailAPI(options);
            default:
                throw new Error("Unsupported platform");
        }
    }
}
exports.WebStoreDetailAPIFactory = WebStoreDetailAPIFactory;
