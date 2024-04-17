import axios, { AxiosError } from 'axios';
import { WebStoreDetailAPIOptions } from '../types';
import * as cheerio from 'cheerio';
import { ExtensionDetail, WebStoreDetailAPI } from '../types/WebStoreDetailAPI';
import ExtensionError from '../error/ExtensionError';

export class ChromeDetailAPI implements WebStoreDetailAPI {
  private headers: any;

  constructor(options: WebStoreDetailAPIOptions) {
    this.headers = options.headers;
  }

  async getDetail(extensionId: string): Promise<ExtensionDetail> {
    try {
      if (!extensionId) {
        throw new ExtensionError('Extension id is required');
      }

      const url = `https://chrome.google.com/webstore/detail/${extensionId}`;
      const response = await axios.get(url, { headers: this.headers });

      const $ = cheerio.load(response.data);

      const icon: string | null = this.parseIcon($, extensionId);
      const title: string | null = this.parseTitle($, extensionId);
      const userCount: string | null = this.parseUserCount($, extensionId);
      const rating: number | null = this.parseRating($, extensionId);
      const rateCount: string | null = this.parseRateCount($, extensionId);
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
        socials
      };

      return details;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new Error('Extension not found.');
        }
      }
      if (error instanceof ExtensionError) {
        throw Error(error.message);
      }
      throw new Error('An error occurred while fetching extension details.');
    }
  }

  private parseIcon($: cheerio.Root, extensionId: string): string | null {
    const icon = $(`[href*=./detail/${extensionId}] img`).attr('src');

    return icon || null;
  }

  private parseTitle($: cheerio.Root, extensionId: string): string | null {
    const title = $(`[href*=./detail/${extensionId}]`).text();

    return title || null;
  }

  private parseRateCount($: cheerio.Root, extensionId: string): string | null {
    const rateCountStr = $(`[href*=./detail/${extensionId}]`)
      .next()
      .children()
      .last()
      .text();

    const rateCountMatch = rateCountStr.match(
      /([\d.]+)\(([\d.]+(?:[KMB]?)) ratings\)/
    );
    const raterCount = rateCountMatch ? rateCountMatch[2] : null;
    return raterCount || null;
  }

  private parseUserCount($: cheerio.Root, extensionId: string): string | null {
    const userCountStr = $(`[href*=./detail/${extensionId}]`)
      .parent()
      .eq(0)
      .children()
      .last()
      .text();

    const userCountMatch = userCountStr.match(/([\d,]+)/);
    const userCount = userCountMatch ? userCountMatch[1] : '';
    return userCount || null;
  }

  private parseRating($: cheerio.Root, extensionId: string): number | null {
    const rateCountStr = $(`[href*=./detail/${extensionId}]`)
      .next()
      .children()
      .last()
      .text();

    const rateCountMatch = rateCountStr.match(
      /([\d.]+)\(([\d.]+(?:[KMB]?)) ratings\)/
    );
    const raterCount = rateCountMatch ? parseFloat(rateCountMatch[1]) : null;
    return raterCount || null;
  }

  private parseUpdated($: cheerio.Root): Date | null {
    const date = $(`div:contains("Update")`).next().text();

    return new Date(date);
  }

  private parseDescription($: cheerio.Root): string | null {
    const description = $(`main div`).children().eq(2).find('p').eq(1).html();
    return description;
  }

  private parseVersion($: cheerio.Root): string | null {
    const version = $(`div:contains("Version")`).next().text();
    return version || null;
  }

  private parseScreenshot($: cheerio.Root): string[] | [] {
    const screenshots = $(`div[aria-label*="Preview slide"]`)
      .map((i, el) => {
        return $(el).children().eq(0).attr('data-media-url');
      })
      .get();

    return screenshots || [];
  }

  private parseFilesize(
    $: cheerio.Root
  ): { size: number; unit: string } | null {
    const version = $(`div:contains("Size")`).next().text();

    const size = version.match(/(\d+\.?\d*)(\w+)/);
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
    const homepage = $(`a:contains("Website")`).attr('href');
    const support = $(`a:contains("Support")`).attr('href');
    const email = $(`summary:contains("Email")`)
      .parent()
      .children()
      .last()
      .text();

    return {
      homepage: homepage || null,
      support: support || null,
      email: email || null
    };
  }
}
