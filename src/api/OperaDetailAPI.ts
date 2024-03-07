import { AxiosError } from "axios";
import {
  ExtensionDetail,
  WebStoreDetailAPI,
} from "./../types/WebStoreDetailAPI";
import axios from "axios";
import { WebStoreDetailAPIOptions } from "../types";
import * as cheerio from "cheerio";
import ExtensionError from "../error/ExtensionError";

export class OperaDetailAPI implements WebStoreDetailAPI {
  private headers: any;

  constructor(options: WebStoreDetailAPIOptions) {
    this.headers = options.headers;
  }

  async getDetail(extensionId: string): Promise<ExtensionDetail> {
    try {
      if (!extensionId) {
        throw new ExtensionError("Extension id is required");
      }

      const url = `https://addons.opera.com/en/extensions/details/${extensionId}`;
      const response = await axios.get(url, { headers: this.headers });

      const $ = cheerio.load(response.data);

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
          throw new ExtensionError("Extension not found.");
        }
      }
      if (error instanceof ExtensionError) {
        throw new Error(error.message);
      }

      throw new Error(
        "An error occurred while fetching the extension details."
      );
    }
  }

  private parseIcon($: cheerio.Root): any | null {
    const icon = $(".icon-pkg").attr("src");

    return icon || null;
  }

  private parseTitle($: cheerio.Root): string | null {
    const title = $("h1").text()?.trim();
    return title || null;
  }

  private parseRateCount($: cheerio.Root): string | null {
    const raterCount = $("#rating-count").text();

    return raterCount || null;
  }

  private parseUserCount($: cheerio.Root): string | null {
    const userCountString = $(`dt:contains("Downloads")`).next().text();
    const userCountMatch = userCountString.match(/([\d,]+)/);
    const userCount = userCountMatch ? userCountMatch[0] : null;

    return userCount || null;
  }

  private parseRating($: cheerio.Root): number | null {
    const rating = $("#rating-value").text();
    return Number(rating) || null;
  }

  private parseUpdated($: cheerio.Root): Date | null {
    const updateStr = $(`dt:contains("Last update")`).next().text();
    const date = new Date(updateStr.replace(".", ""));

    return date;
  }

  private parseDescription($: cheerio.Root): string | null {
    const description = $("section.description").html();

    return description || null;
  }

  private parseVersion($: cheerio.Root): string | null {
    const version = $(`dt:contains("Version")`).next().text();

    return version || null;
  }

  private parseScreenshot($: cheerio.Root): string[] | [] {
    const screenshots = $(".thumbnail a").map((i, el) => {
      return $(el).attr("href");
    });

    return screenshots.get() || [];
  }

  private parseFilesize(
    $: cheerio.Root
  ): { size: number; unit: string } | null {
    const filesize = $(`dt:contains("Size")`).next().text();

    const size = filesize.match(/(\d+\.?\d*)\s?(\w+)/);

    if (size === null) {
      return null;
    }
    return { size: Number(size[1]), unit: size[2] } || null;
  }

  private parseSocials($: cheerio.Root): {
    homepage: string | null;
    support: string | null;
    email: string | null;
  } {
    const homepage = $(`dt:contains("Service website")`).next().text();
    const support = $(`dt:contains("Support page")`).next().text();
    const email = null;

    return {
      homepage: homepage?.trim() || null,
      support: support?.trim() || null,
      email: email || null,
    };
  }
}
