import type { MaybeWallet } from "./maybe-wallet";
import { useStarknetProvider } from "./provider";

export type SelectedWalletProps = {
  children: (wallet?: MaybeWallet) => React.ReactNode;
};

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
