---
"@starknet-io/get-starknet-ui": patch
---

Only render wallet download links that use `https:`, so a `recommendedWallets` entry can't turn a download button into a `javascript:` link.
