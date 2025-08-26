import "./styles.css";

export * from "./modal";

// Re-export from the low-level packages to simplify usage
export {
  GetStarknetProvider,
  useConnect,
  useStarknetProvider,
} from "@starknet-io/get-starknet-modal";
export { StarknetWalletApi } from "@starknet-io/get-starknet-wallet-standard/features";
