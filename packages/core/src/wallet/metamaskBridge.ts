import detectEthereumProvider from '@metamask/detect-provider';

async function hasSnapSupport(provider: any) {
  try {
    await provider.request({
      method: "wallet_getSnaps",
    })
    return true
  } catch {
    return false
  }
}

async function bootstrapMetamaskBridge() {
  if (window.hasOwnProperty("starknet_metamask")) {
    return;
  }

  const provider = await detectEthereumProvider()
  if (!provider) {
    return;
  }

  const snapSupport = await hasSnapSupport(provider)
  if (!snapSupport) {
    return;
  }

  const MetaMaskSnapWallet = await import('starknet-metamask')
  window["starknet_metamask"] = new MetaMaskSnapWallet(provider)
}

export {bootstrapMetamaskBridge}