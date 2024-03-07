export interface ExtensionDetail {
  icon: string | null;
  title: string | null;
  userCount: string | null;
  rating: number | null;
  rateCount: string | null;
  updated: Date | null;
  description: string | null;
  version: string | null;
  screenshots: string[] | [];
  filesize: { size: number; unit: string } | null;
  socials: {
    homepage: string | null;
    support: string | null;
    email: string | null;
  };
}
export interface WebStoreDetailAPI {
  getDetail(extensionId: string): Promise<ExtensionDetail>;
}
