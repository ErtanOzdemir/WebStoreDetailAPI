import { AxiosError } from "axios";
import {
  ExtensionDetail,
  WebStoreDetailAPI,
} from "./../types/WebStoreDetailAPI";
import axios from "axios";
import { WebStoreDetailAPIOptions } from "../types";
import * as cheerio from "cheerio";
import ExtensionError from "../error/ExtensionError";

export class FirefoxDetailAPI implements WebStoreDetailAPI {
  private headers: any;

  constructor(options: WebStoreDetailAPIOptions) {
    this.headers = options.headers;
  }

  async getDetail(extensionId: string): Promise<ExtensionDetail> {
    try {
      if (!extensionId) {
        throw new ExtensionError("Extension id is required");
      }

      const url = `https://addons.mozilla.org/en-US/firefox/addon/${extensionId}`;
      const response = await axios.get(url, { headers: this.headers });

      let $ = cheerio.load(response.data);

      const icon: string | null = this.parseIcon($);
      const title: string | null = this.parseTitle($);
      const userCount: string | null = this.parseUserCount($);
      const rating: number | null = this.parseRating($);
      const rateCount: string | null = this.parseRateCount($);
      const updated: Date | null = this.parseUpdated($);
      const description: string | null = this.parseDescription($);
      const version: string | null = this.parseVersion($);
      const screenshots: string[] | [] = this.parseScreenshot($);
      const filesize: { size: number; unit: string } | null =
        this.parseFilesize($);
      const socials: {
        homepage: string | null;
        support: string | null;
        email: string | null;
      } = this.parseSocials($);

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
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new Error("Extension not found.");
        }
      }
      if (error instanceof ExtensionError) {
        throw Error(error.message);
      }
      throw new Error("An error occurred while fetching extension details.");
    }
  }

  private parseIcon($: cheerio.Root): any | null {
    const icon = $(".Addon-icon-image").attr("src");

    return icon || null;
  }

  private parseTitle($: cheerio.Root): string | null {
    const title = $("h1").not("h1 span").text();
    return title || null;
  }

  private parseRateCount($: cheerio.Root): string | null {
    const overallRatingCard = $(".MetadataCard.AddonMeta-overallRating");
    const ratersCountString = overallRatingCard.first().children().eq(1).text();
    const ratersCount = ratersCountString.match(/([\d,]+)/);
    const count = ratersCount ? ratersCount[0] : null;

    return count || null;
  }

  private parseUserCount($: cheerio.Root): string | null {
    const overallRatingCard = $(".MetadataCard.AddonMeta-overallRating");
    const userCountString = overallRatingCard.first().children().eq(0).text();

    const userCountMatch = userCountString.match(/([\d,]+)/);
    const userCount = userCountMatch ? userCountMatch[0] : null;

    return userCount || null;
  }

  private parseRating($: cheerio.Root): number | null {
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

  private parseUpdated($: cheerio.Root): Date | null {
    const dateStr = $(".Definition-dd.AddonMoreInfo-last-updated").text();
    const dateString = dateStr.match(/\((.*?)\)/)?.[1];
    const date = new Date(dateString as string);
    return date;
  }

  private parseDescription($: cheerio.Root): string | null {
    const description = $(".AddonDescription-contents").html();
    return description;
  }

  private parseVersion($: cheerio.Root): string | null {
    const version = $(".Definition-dd.AddonMoreInfo-version").text();
    return version || null;
  }

  private parseScreenshot($: cheerio.Root): string[] | [] {
    const screenshots = $(".ScreenShots-list img")
      .map((_i, el) => {
        return $(el).attr("src");
      })
      .get();

    return screenshots || [];
  }

  private parseFilesize(
    $: cheerio.Root
  ): { size: number; unit: string } | null {
    const size = $(".Definition-dd.AddonMoreInfo-filesize").text().split(" ");
    return { size: Number(size[0]), unit: size[1] } || null;
  }

  private parseSocials($: cheerio.Root): {
    homepage: string | null;
    support: string | null;
    email: string | null;
  } {
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

    const email = $(".AddonMoreInfo-links-contents-list")
      .children()
      .eq(2)
      .children()
      .eq(0)
      .attr("href")
      ?.split("mailto:")[1];

    return {
      homepage: homepage || null,
      support: support || null,
      email: email || null,
    };
  }
}
