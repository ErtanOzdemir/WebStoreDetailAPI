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
exports.FirefoxDetailAPI = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
class FirefoxDetailAPI {
    constructor(options) {
        this.headers = options.headers;
    }
    getDetail(extensionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `https://addons.mozilla.org/en-US/firefox/addon/${extensionId}`;
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
        const icon = $(".Addon-icon-image").attr("src");
        return icon || null;
    }
    parseTitle($) {
        const title = $("h1").not("h1 span").text();
        return title || null;
    }
    parseRateCount($) {
        const overallRatingCard = $(".MetadataCard.AddonMeta-overallRating");
        const ratersCountString = overallRatingCard.first().children().eq(1).text();
        const numberWithoutCommas = ratersCountString.replace(/,/g, "");
        const raterCount = parseFloat(numberWithoutCommas);
        return raterCount || null;
    }
    parseUserCount($) {
        const overallRatingCard = $(".MetadataCard.AddonMeta-overallRating");
        const userCountString = overallRatingCard
            .first()
            .children()
            .eq(0)
            .text()
            .split("Users")[0];
        const numberWithoutCommas = userCountString.replace(/,/g, "");
        const userCount = parseFloat(numberWithoutCommas);
        return userCount || null;
    }
    parseRating($) {
        const overallRatingCard = $(".MetadataCard.AddonMeta-overallRating");
        const ratingString = overallRatingCard
            .first()
            .children()
            .eq(2)
            .children()
            .eq(1)
            .text();
        const numberWithoutCommas = ratingString.replace(/,/g, "");
        const rating = parseFloat(numberWithoutCommas);
        return rating || null;
    }
    parseUpdated($) {
        var _a;
        const dateStr = $(".Definition-dd.AddonMoreInfo-last-updated").text();
        const dateString = (_a = dateStr.match(/\((.*?)\)/)) === null || _a === void 0 ? void 0 : _a[1];
        const date = new Date(dateString);
        return date;
    }
    parseDescription($) {
        const description = $(".AddonDescription-contents").html();
        return description;
    }
    parseVersion($) {
        const version = $(".Definition-dd.AddonMoreInfo-version").text();
        return version || null;
    }
    parseScreenshot($) {
        const screenshots = $(".ScreenShots-list img")
            .map((_i, el) => {
            return $(el).attr("src");
        })
            .get();
        return screenshots || [];
    }
    parseFilesize($) {
        const size = $(".Definition-dd.AddonMoreInfo-filesize").text().split(" ");
        return { size: Number(size[0]), unit: size[1] } || null;
    }
    parseSocials($) {
        var _a;
        const homepage = $(".AddonMoreInfo-links-contents-list")
            .children()
            .eq(0)
            .children()
            .eq(0)
            .attr("href");
        const support = $(".AddonMoreInfo-links-contents-list")
            .children()
            .eq(1)
            .children()
            .eq(0)
            .attr("href");
        const email = (_a = $(".AddonMoreInfo-links-contents-list")
            .children()
            .eq(2)
            .children()
            .eq(0)
            .attr("href")) === null || _a === void 0 ? void 0 : _a.split("mailto:")[1];
        return {
            homepage: homepage || null,
            support: support || null,
            email: email || null,
        };
    }
}
exports.FirefoxDetailAPI = FirefoxDetailAPI;
