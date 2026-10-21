import type { MaybeWallet } from "./maybe-wallet";
import { useStarknetProvider } from "./provider";

export type SelectedWalletProps = {
  children: (wallet?: MaybeWallet) => React.ReactNode;
};

/**
 * This component is used to display the selected wallet.
 *
 * @param SelectedWalletProps - The props for the component.
 * @returns The selected wallet.
 *
 * @example
 *
 * ```tsx
 * import { SelectedWallet } from "@starknet-io/get-starknet-modal";
 *
 * function Dapp() {
 *   return (
 *     <SelectedWallet>
 *       {(wallet) => <div>{wallet?.name}</div>}
 *     </SelectedWallet>
 *   );
 * }
 * ```
 */
export function SelectedWallet({
  children,
  ref,
  ...props
}: SelectedWalletProps & Omit<React.ComponentProps<"div">, "children">) {
  const { selected } = useStarknetProvider();

  return (
    <div ref={ref} {...props}>
      {children(selected?.wallet)}
    </div>
  );
}
