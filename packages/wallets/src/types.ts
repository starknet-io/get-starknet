export type OperatingSystemStoreVersion = "ios" | "android";
export type BrowserStoreVersion = "chrome" | "firefox" | "edge" | "safari";

type DownloadsRecord<
  SV extends OperatingSystemStoreVersion | BrowserStoreVersion,
  DL extends string,
> = Record<SV, DL>;

export type WalletProvider = {
  id: string;
  name: string;
  icon: string;
  downloads:
    | DownloadsRecord<
        "chrome",
        `https://chrome.google.com/webstore/detail/${string}`
      >
    | DownloadsRecord<
        "firefox",
        `https://addons.mozilla.org/en-US/firefox/addon/${string}`
      >
    | DownloadsRecord<
        "edge",
        `https://microsoftedge.microsoft.com/addons/detail/${string}`
      >
    | DownloadsRecord<"safari", `https://apps.apple.com/us/app/${string}`>
    | Record<string, string>;
};
