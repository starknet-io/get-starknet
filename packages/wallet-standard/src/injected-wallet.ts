import type { RequestFn, StarknetWindowObject } from "@starknet-io/types-js";
import type { Wallet } from "@wallet-standard/base";

import { STARKNET_CHAINS } from "./chains";
import {
  StarknetWalletRequest,
  type WalletWithStarknetFeatures,
} from "./features";

export class StarknetInjectedWallet implements WalletWithStarknetFeatures {
  constructor(private readonly injected: StarknetWindowObject) {}

  get version() {
    return "1.0.0" as const;
  }

  get name() {
    return this.injected.name;
  }

  get icon() {
    if (typeof this.injected.icon === "string") {
      return this.injected.icon as Wallet["icon"];
    }

    return this.injected.icon.light as Wallet["icon"];
  }

  get chains() {
    return STARKNET_CHAINS.slice();
  }

  get accounts() {
    return [];
  }

  get features() {
    return {
      [StarknetWalletRequest]: {
        version: "1.0.0" as const,
        request: this.request.bind(this),
      },
    };
  }

  request(...args: Parameters<RequestFn>): ReturnType<RequestFn> {
    return this.injected.request(...args);
  }
}
