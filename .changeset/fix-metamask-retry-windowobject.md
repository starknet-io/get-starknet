---
"@starknet-io/get-starknet-core": patch
---

Fix waitForMetaMaskProvider's retry recursion dropping the real windowObject
argument (it was passing the options object as windowObject instead), so every
retry attempt silently listened on a non-functional object instead of the real
window. Also restores the requested retry count, which was resetting to 0 on
each recursive call.
