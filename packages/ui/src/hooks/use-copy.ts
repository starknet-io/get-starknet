import { useCallback, useEffect, useState } from "react";

type CopiedValue = string | null;

type CopyFn = (text: string) => Promise<boolean>;

type isCopied = boolean;

export function useCopyToClipboard(): [CopyFn, isCopied, CopiedValue] {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);
  const [isCopied, setIsCopied] = useState<isCopied>(false);

  const copy: CopyFn = useCallback(async (text) => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return false;
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setIsCopied(true);
      return true;
    } catch (error) {
      console.warn("Copy failed", error);
      setCopiedText(null);
      return false;
    }
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;
    if (isCopied) {
      timeoutId = setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isCopied]);

  return [copy, isCopied, copiedText];
}
