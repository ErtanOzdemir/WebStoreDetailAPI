"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperaDetailAPI = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
class OperaDetailAPI {
    constructor(options) {
        this.headers = options.headers;
    }
    getDetail(extensionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `https://addons.opera.com/en/extensions/details/${extensionId}`;
            const response = yield axios_1.default.get(url, { headers: this.headers });
            const $ = cheerio.load(response.data);
            const icon = this.parseIcon($);
            const title = this.parseTitle($);
            const userCount = this.parseUserCount($);
            const rating = this.parseRating($);
            const rateCount = this.parseRateCount($);
            const updated = this.parseUpdated($);
            const description = this.parseDescription($);
            const version = this.parseVersion($);
            const screenshots = this.parseScreenshot($);
            const filesize = this.parseFilesize($);
            const socials = this.parseSocials($);
            const details = {
                icon,
                title,
                userCount,
                rating,
                rateCount,
                updated,
                description,
                version,
                screenshots,
                filesize,
                socials,
            };
            return details;
        });
    }
    parseIcon($) {
        const icon = $(".icon-pkg").attr("src");
        return icon || null;
    }
    parseTitle($) {
        var _a;
        const title = (_a = $("h1").text()) === null || _a === void 0 ? void 0 : _a.trim();
        return title || null;
    }
    parseRateCount($) {
        const raterCount = $("#rating-count").text();
        return Number(raterCount) || null;
    }
    parseUserCount($) {
        const userCountString = $(`dt:contains("Downloads")`).next().text();
        const userCount = parseFloat(userCountString.replace(/,/g, ""));
        return userCount || null;
    }
    parseRating($) {
        const rating = $("#rating-value").text();
        return Number(rating) || null;
    }
    parseUpdated($) {
        const updateStr = $(`dt:contains("Last update")`).next().text();
        const date = new Date(updateStr.replace(".", ""));
        return date;
    }
    parseDescription($) {
        const description = $("section.description").html();
        return description || null;
    }
    parseVersion($) {
        const version = $(`dt:contains("Version")`).next().text();
        return version || null;
    }
    parseScreenshot($) {
        const screenshots = $(".thumbnail a").map((i, el) => {
            return $(el).attr("href");
        });
        return screenshots.get() || [];
    }
    parseFilesize($) {
        const filesize = $(`dt:contains("Size")`).next().text();
        const size = filesize.match(/(\d+\.?\d*)\s?(\w+)/);
        if (size === null) {
            return null;
        }
        return { size: Number(size[1]), unit: size[2] } || null;
    }
    parseSocials($) {
        const homepage = $(`dt:contains("Service website")`).next().text();
        const support = $(`dt:contains("Support page")`).next().text();
        const email = null;
        return {
            homepage: homepage || null,
            support: support || null,
            email: email || null,
        };
    }
}
exports.OperaDetailAPI = OperaDetailAPI;
