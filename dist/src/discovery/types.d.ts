export declare type WalletProvider = {
    id: string;
    name: string;
    icon: string;
    downloads: {
        chrome?: `https://chrome.google.com/webstore/detail/${string}`;
    } | {
        firefox?: `https://addons.mozilla.org/en-US/firefox/addon/${string}`;
    };
};
