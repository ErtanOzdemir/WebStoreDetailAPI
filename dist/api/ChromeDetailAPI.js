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
exports.ChromeDetailAPI = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
class ChromeDetailAPI {
    constructor(options) {
        this.headers = options.headers;
    }
    getDetail(extensionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `https://chromewebstore.google.com/detail/${extensionId}?hl=en`;
            const response = yield axios_1.default.get(url, { headers: this.headers });
            const $ = cheerio.load(response.data);
            const icon = this.parseIcon($, extensionId);
            const title = this.parseTitle($, extensionId);
            const userCount = this.parseUserCount($, extensionId);
            const rating = this.parseRating($, extensionId);
            const rateCount = this.parseRateCount($, extensionId);
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
    parseIcon($, extensionId) {
        const icon = $(`[href*=./detail/${extensionId}] img`).attr("src");
        return icon || null;
    }
    parseTitle($, extensionId) {
        const title = $(`[href*=./detail/${extensionId}]`).text();
        return title || null;
    }
    parseRateCount($, extensionId) {
        const rateCountStr = $(`[href*=./detail/${extensionId}]`)
            .next()
            .children()
            .eq(2)
            .children()
            .eq(0)
            .children()
            .eq(2)
            .text();
        const rateCountMatch = rateCountStr.match(/\d+/);
        const raterCount = rateCountMatch ? parseInt(rateCountMatch[0]) : null;
        return raterCount || null;
    }
    parseUserCount($, extensionId) {
        const userCountStr = $(`[href*=./detail/${extensionId}]`)
            .parent()
            .eq(0)
            .children()
            .eq(2)
            .text();
        const userCountMatch = userCountStr.match(/\d+/);
        const userCount = userCountMatch ? parseInt(userCountMatch[0]) : 0;
        return userCount || null;
    }
    parseRating($, extensionId) {
        const ratingStr = $(`[href*=./detail/${extensionId}]`)
            .next()
            .children()
            .eq(2)
            .children()
            .eq(0)
            .children()
            .eq(0)
            .text();
        const rating = Number(ratingStr);
        return rating || null;
    }
    parseUpdated($) {
        const date = $(`div:contains("Update")`).next().text();
        return new Date(date);
    }
    parseDescription($) {
        const description = $(`main div`).children().eq(2).find("p").eq(1).html();
        return description;
    }
    parseVersion($) {
        const version = $(`div:contains("Version")`).next().text();
        return version || null;
    }
    parseScreenshot($) {
        const screenshots = $(`div[aria-label*="Preview slide"]`)
            .map((i, el) => {
            return $(el).children().eq(0).attr("data-media-url");
        })
            .get();
        return screenshots || [];
    }
    parseFilesize($) {
        const version = $(`div:contains("Size")`).next().text();
        const size = version.match(/(\d+\.?\d*)(\w+)/);
        if (size === null) {
            return null;
        }
        return { size: Number(size[1]), unit: size[2] } || null;
    }
    parseSocials($) {
        const homepage = $(`a:contains("Website")`).attr("href");
        const support = $(`a:contains("Support")`).attr("href");
        const email = $(`summary:contains("Email")`)
            .parent()
            .children()
            .last()
            .text();
        return {
            homepage: homepage || null,
            support: support || null,
            email: email || null,
        };
    }
}
exports.ChromeDetailAPI = ChromeDetailAPI;
