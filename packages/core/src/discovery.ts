export type WalletProvider = {
  id: string
  name: string
  icon: string
  downloads:
    | { chrome?: `https://chrome.google.com/webstore/detail/${string}` }
    | { firefox?: `https://addons.mozilla.org/en-US/firefox/addon/${string}` }
    | { edge?: `https://microsoftedge.microsoft.com/addons/detail/${string}` }
    | { safari?: `https://apps.apple.com/us/app/${string}` }
    | { googleplay?: `https://play.google.com/store/apps/details?id=${string}` }
}

const wallets: WalletProvider[] = [
  {
    id: "argentX",
    name: "Argent X",
    icon: "data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjQwIiBoZWlnaHQ9IjM2IiB2aWV3Qm94PSIwIDAgNDAgMzYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0yNC43NTgyIC0zLjk3MzY0ZS0wN0gxNC42MjM4QzE0LjI4NTEgLTMuOTczNjRlLTA3IDE0LjAxMzggMC4yODExNzggMTQuMDA2NCAwLjYzMDY4M0MxMy44MDE3IDEwLjQ1NDkgOC44MjIzNCAxOS43NzkyIDAuMjUxODkzIDI2LjM4MzdDLTAuMDIwMjA0NiAyNi41OTMzIC0wLjA4MjE5NDYgMjYuOTg3MiAwLjExNjczNCAyNy4yNzA5TDYuMDQ2MjMgMzUuNzM0QzYuMjQ3OTYgMzYuMDIyIDYuNjQwOTkgMzYuMDg3IDYuOTE3NjYgMzUuODc1NEMxMi4yNzY1IDMxLjc3MjggMTYuNTg2OSAyNi44MjM2IDE5LjY5MSAyMS4zMzhDMjIuNzk1MSAyNi44MjM2IDI3LjEwNTcgMzEuNzcyOCAzMi40NjQ2IDM1Ljg3NTRDMzIuNzQxIDM2LjA4NyAzMy4xMzQxIDM2LjAyMiAzMy4zMzYxIDM1LjczNEwzOS4yNjU2IDI3LjI3MDlDMzkuNDY0MiAyNi45ODcyIDM5LjQwMjIgMjYuNTkzMyAzOS4xMzA0IDI2LjM4MzdDMzAuNTU5NyAxOS43NzkyIDI1LjU4MDQgMTAuNDU0OSAyNS4zNzU5IDAuNjMwNjgzQzI1LjM2ODUgMC4yODExNzggMjUuMDk2OSAtMy45NzM2NGUtMDcgMjQuNzU4MiAtMy45NzM2NGUtMDdaIiBmaWxsPSIjRkY4NzVCIi8+Cjwvc3ZnPgo=",
    downloads: {
      chrome:
        "https://chrome.google.com/webstore/detail/argent-x-starknet-wallet/dlcobpjiigpikoobohmabehhmhfoodbb",
      firefox: "https://addons.mozilla.org/en-US/firefox/addon/argent-x",
      edge: "https://microsoftedge.microsoft.com/addons/detail/argent-x/ajcicjlkibolbeaaagejfhnofogocgcj",
    },
  },
  {
    id: "braavos",
    name: "Braavos",
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8cGF0aAogICAgICAgIGQ9Ik02Mi43MDUgMTMuOTExNkM2Mi44MzU5IDE0LjEzMzMgNjIuNjYyMSAxNC40MDcgNjIuNDAzOSAxNC40MDdDNTcuMTgwNyAxNC40MDcgNTIuOTM0OCAxOC41NDI3IDUyLjgzNTEgMjMuNjgxN0M1MS4wNDY1IDIzLjM0NzcgNDkuMTkzMyAyMy4zMjI2IDQ3LjM2MjYgMjMuNjMxMUM0Ny4yMzYxIDE4LjUxNTYgNDMuMDAwOSAxNC40MDcgMzcuNzk0OCAxNC40MDdDMzcuNTM2NSAxNC40MDcgMzcuMzYyNSAxNC4xMzMxIDM3LjQ5MzUgMTMuOTExMkM0MC4wMjE3IDkuNjI4MDkgNDQuNzIwNCA2Ljc1IDUwLjA5OTEgNi43NUM1NS40NzgxIDYuNzUgNjAuMTc2OSA5LjYyODI2IDYyLjcwNSAxMy45MTE2WiIKICAgICAgICBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMzcyXzQwMjU5KSIgLz4KICAgIDxwYXRoCiAgICAgICAgZD0iTTc4Ljc2MDYgNDUuODcxOEM4MC4yNzI1IDQ2LjMyOTcgODEuNzAyNSA0NS4wMDU1IDgxLjE3MTQgNDMuNTIyMkM3Ni40MTM3IDMwLjIzMzQgNjEuMzkxMSAyNC44MDM5IDUwLjAyNzcgMjQuODAzOUMzOC42NDQyIDI0LjgwMzkgMjMuMjg2OCAzMC40MDcgMTguODc1NCA0My41OTEyQzE4LjM4MjQgNDUuMDY0NSAxOS44MDgzIDQ2LjM0NDYgMjEuMjk3OCA0NS44ODgxTDQ4Ljg3MiAzNy40MzgxQzQ5LjUzMzEgMzcuMjM1NSA1MC4yMzk5IDM3LjIzNDQgNTAuOTAxNyAzNy40MzQ4TDc4Ljc2MDYgNDUuODcxOFoiCiAgICAgICAgZmlsbD0idXJsKCNwYWludDFfbGluZWFyXzM3Ml80MDI1OSkiIC8+CiAgICA8cGF0aAogICAgICAgIGQ9Ik0xOC44MTMyIDQ4LjE3MDdMNDguODkzNSAzOS4wNDcyQzQ5LjU1MDYgMzguODQ3OCA1MC4yNTI0IDM4Ljg0NzMgNTAuOTA5OCAzOS4wNDU2TDgxLjE3ODEgNDguMTc1MkM4My42OTEyIDQ4LjkzMzIgODUuNDExIDUxLjI0ODMgODUuNDExIDUzLjg3MzVWODEuMjIzM0M4NS4yOTQ0IDg3Ljg5OTEgNzkuMjk3NyA5My4yNSA3Mi42MjQ1IDkzLjI1SDYxLjU0MDZDNjAuNDQ0OSA5My4yNSA1OS41NTc3IDkyLjM2MzcgNTkuNTU3NyA5MS4yNjhWODEuNjc4OUM1OS41NTc3IDc3LjkwMzEgNjEuNzkyMSA3NC40ODU1IDY1LjI0OTggNzIuOTcyOUM2OS44ODQ5IDcwLjk0NTQgNzUuMzY4MSA2OC4yMDI4IDc2LjM5OTQgNjIuNjk5MkM3Ni43MzIzIDYwLjkyMjkgNzUuNTc0MSA1OS4yMDk0IDczLjgwMjQgNTguODU3M0M2OS4zMjI2IDU3Ljk2NjcgNjQuMzU2MiA1OC4zMTA3IDYwLjE1NjQgNjAuMTg5M0M1NS4zODg3IDYyLjMyMTkgNTQuMTQxNSA2NS44Njk0IDUzLjY3OTcgNzAuNjMzN0w1My4xMjAxIDc1Ljc2NjJDNTIuOTQ5MSA3Ny4zMzQ5IDUxLjQ3ODUgNzguNTM2NiA0OS45MDE0IDc4LjUzNjZDNDguMjY5OSA3OC41MzY2IDQ3LjA0NjUgNzcuMjk0IDQ2Ljg2OTYgNzUuNjcxMkw0Ni4zMjA0IDcwLjYzMzdDNDUuOTI0OSA2Ni41NTI5IDQ1LjIwNzkgNjIuNTg4NyA0MC45ODk1IDYwLjcwMThDMzYuMTc3NiA1OC41NDk0IDMxLjM0MTkgNTcuODM0NyAyNi4xOTc2IDU4Ljg1NzNDMjQuNDI2IDU5LjIwOTQgMjMuMjY3OCA2MC45MjI5IDIzLjYwMDcgNjIuNjk5MkMyNC42NDEgNjguMjUwNyAzMC4wODEyIDcwLjkzMDUgMzQuNzUwMyA3Mi45NzI5QzM4LjIwOCA3NC40ODU1IDQwLjQ0MjQgNzcuOTAzMSA0MC40NDI0IDgxLjY3ODlWOTEuMjY2M0M0MC40NDI0IDkyLjM2MiAzOS41NTU1IDkzLjI1IDM4LjQ1OTkgOTMuMjVIMjcuMzc1NkMyMC43MDI0IDkzLjI1IDE0LjcwNTcgODcuODk5MSAxNC41ODkxIDgxLjIyMzNWNTMuODY2M0MxNC41ODkxIDUxLjI0NDYgMTYuMzA0NSA0OC45MzE2IDE4LjgxMzIgNDguMTcwN1oiCiAgICAgICAgZmlsbD0idXJsKCNwYWludDJfbGluZWFyXzM3Ml80MDI1OSkiIC8+CiAgICA8ZGVmcz4KICAgICAgICA8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMzcyXzQwMjU5IiB4MT0iNDkuMzA1NyIgeTE9IjIuMDc5IiB4Mj0iODAuMzYyNyIgeTI9IjkzLjY1OTciCiAgICAgICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI0Y1RDQ1RSIgLz4KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY5NjAwIiAvPgogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICAgICAgPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDFfbGluZWFyXzM3Ml80MDI1OSIgeDE9IjQ5LjMwNTciIHkxPSIyLjA3OSIgeDI9IjgwLjM2MjciIHkyPSI5My42NTk3IgogICAgICAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiNGNUQ0NUUiIC8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0ZGOTYwMCIgLz4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQyX2xpbmVhcl8zNzJfNDAyNTkiIHgxPSI0OS4zMDU3IiB5MT0iMi4wNzkiIHgyPSI4MC4zNjI3IiB5Mj0iOTMuNjU5NyIKICAgICAgICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjRjVENDVFIiAvPgogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGRjk2MDAiIC8+CiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDwvZGVmcz4KPC9zdmc+",
    downloads: {
      chrome:
        "https://chrome.google.com/webstore/detail/braavos-wallet/jnlgamecbpmbajjfhmmmlhejkemejdma",
      firefox: "https://addons.mozilla.org/en-US/firefox/addon/braavos-wallet",
      edge: "https://microsoftedge.microsoft.com/addons/detail/braavos-wallet/hkkpjehhcnhgefhbdcgfkeegglpjchdc",
    },
  },
  {
    id: "okxwallet",
    name: "OKX Wallet",
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJDSURBVHgB7Zq9jtpAEMfHlhEgQLiioXEkoAGECwoKxMcTRHmC5E3IoyRPkPAEkI7unJYmTgEFTYwA8a3NTKScLnCHN6c9r1e3P2llWQy7M/s1Gv1twCP0ej37dDq9x+Zut1t3t9vZjDEHIiSRSPg4ZpDL5fxkMvn1cDh8m0wmfugfO53OoFQq/crn8wxfY9EymQyrVCqMfHvScZx1p9ls3pFxXBy/bKlUipGPrVbLuQqAfsCliq3zl0H84zwtjQrOw4Mt1W63P5LvBm2d+Xz+YzqdgkqUy+WgWCy+Mc/nc282m4FqLBYL+3g8fjDxenq72WxANZbLJeA13zDX67UDioL5ybXwafMYu64Ltn3bdDweQ5R97fd7GyhBQMipx4POeEDHIu2LfDdBIGGz+hJ9CQ1ABjoA2egAZPM6AgiCAEQhsi/C4jHyPA/6/f5NG3Ks2+3CYDC4aTccDrn6ojG54MnEvG00GoVmWLIRNZ7wTCwDHYBsdACy0QHIhiuRETxlICWpMMhGZHmqS8qH6JLyGegAZKMDkI0uKf8X4SWlaZo+Pp1bRrwlJU8ZKLIvUjKh0WiQ3sRUbNVq9c5Ebew7KEo2m/1p4jJ4qAmDaqDQBzj5XyiAT4VCQezJigAU+IDU+z8vJFnGWeC+bKQV/5VZ71FV6L7PA3gg3tXrdQ+DgLhC+75Wq3no69P3MC0NFQpx2lL04Ql9gHK1bRDjsSBIvScBnDTk1WrlGIZBorIDEYJj+rhdgnQ67VmWRe0zlplXl81vcyEt0rSoYDUAAAAASUVORK5CYII=",
    downloads: {
      chrome:
        "https://chrome.google.com/webstore/detail/mcohilncbfahbmgdjkbpemcciiolgcge",
      firefox: "https://addons.mozilla.org/en-US/firefox/addon/okexwallet",
      edge: "https://microsoftedge.microsoft.com/addons/detail/%E6%AC%A7%E6%98%93-web3-%E9%92%B1%E5%8C%85/pbpjkcldjiffchgbbndmhojiacbgflha",
      safari: "https://apps.apple.com/us/app/okx-wallet/id6463797825",
    },
  },
  {
    id: "metamask",
    name: "MetaMask",
    icon: `data:image/svg+xml;utf8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMTIiIGhlaWdodD0iMTg5IiB2aWV3Qm94PSIwIDAgMjEyIDE4OSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cG9seWdvbiBmaWxsPSIjQ0RCREIyIiBwb2ludHM9IjYwLjc1IDE3My4yNSA4OC4zMTMgMTgwLjU2MyA4OC4zMTMgMTcxIDkwLjU2MyAxNjguNzUgMTA2LjMxMyAxNjguNzUgMTA2LjMxMyAxODAgMTA2LjMxMyAxODcuODc1IDg5LjQzOCAxODcuODc1IDY4LjYyNSAxNzguODc1Ii8+PHBvbHlnb24gZmlsbD0iI0NEQkRCMiIgcG9pbnRzPSIxMDUuNzUgMTczLjI1IDEzMi43NSAxODAuNTYzIDEzMi43NSAxNzEgMTM1IDE2OC43NSAxNTAuNzUgMTY4Ljc1IDE1MC43NSAxODAgMTUwLjc1IDE4Ny44NzUgMTMzLjg3NSAxODcuODc1IDExMy4wNjMgMTc4Ljg3NSIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMjU2LjUgMCkiLz48cG9seWdvbiBmaWxsPSIjMzkzOTM5IiBwb2ludHM9IjkwLjU2MyAxNTIuNDM4IDg4LjMxMyAxNzEgOTEuMTI1IDE2OC43NSAxMjAuMzc1IDE2OC43NSAxMjMuNzUgMTcxIDEyMS41IDE1Mi40MzggMTE3IDE0OS42MjUgOTQuNSAxNTAuMTg4Ii8+PHBvbHlnb24gZmlsbD0iI0Y4OUMzNSIgcG9pbnRzPSI3NS4zNzUgMjcgODguODc1IDU4LjUgOTUuMDYzIDE1MC4xODggMTE3IDE1MC4xODggMTIzLjc1IDU4LjUgMTM2LjEyNSAyNyIvPjxwb2x5Z29uIGZpbGw9IiNGODlEMzUiIHBvaW50cz0iMTYuMzEzIDk2LjE4OCAuNTYzIDE0MS43NSAzOS45MzggMTM5LjUgNjUuMjUgMTM5LjUgNjUuMjUgMTE5LjgxMyA2NC4xMjUgNzkuMzEzIDU4LjUgODMuODEzIi8+PHBvbHlnb24gZmlsbD0iI0Q4N0MzMCIgcG9pbnRzPSI0Ni4xMjUgMTAxLjI1IDkyLjI1IDEwMi4zNzUgODcuMTg4IDEyNiA2NS4yNSAxMjAuMzc1Ii8+PHBvbHlnb24gZmlsbD0iI0VBOEQzQSIgcG9pbnRzPSI0Ni4xMjUgMTAxLjgxMyA2NS4yNSAxMTkuODEzIDY1LjI1IDEzNy44MTMiLz48cG9seWdvbiBmaWxsPSIjRjg5RDM1IiBwb2ludHM9IjY1LjI1IDEyMC4zNzUgODcuNzUgMTI2IDk1LjA2MyAxNTAuMTg4IDkwIDE1MyA2NS4yNSAxMzguMzc1Ii8+PHBvbHlnb24gZmlsbD0iI0VCOEYzNSIgcG9pbnRzPSI2NS4yNSAxMzguMzc1IDYwLjc1IDE3My4yNSA5MC41NjMgMTUyLjQzOCIvPjxwb2x5Z29uIGZpbGw9IiNFQThFM0EiIHBvaW50cz0iOTIuMjUgMTAyLjM3NSA5NS4wNjMgMTUwLjE4OCA4Ni42MjUgMTI1LjcxOSIvPjxwb2x5Z29uIGZpbGw9IiNEODdDMzAiIHBvaW50cz0iMzkuMzc1IDEzOC45MzggNjUuMjUgMTM4LjM3NSA2MC43NSAxNzMuMjUiLz48cG9seWdvbiBmaWxsPSIjRUI4RjM1IiBwb2ludHM9IjEyLjkzOCAxODguNDM4IDYwLjc1IDE3My4yNSAzOS4zNzUgMTM4LjkzOCAuNTYzIDE0MS43NSIvPjxwb2x5Z29uIGZpbGw9IiNFODgyMUUiIHBvaW50cz0iODguODc1IDU4LjUgNjQuNjg4IDc4Ljc1IDQ2LjEyNSAxMDEuMjUgOTIuMjUgMTAyLjkzOCIvPjxwb2x5Z29uIGZpbGw9IiNERkNFQzMiIHBvaW50cz0iNjAuNzUgMTczLjI1IDkwLjU2MyAxNTIuNDM4IDg4LjMxMyAxNzAuNDM4IDg4LjMxMyAxODAuNTYzIDY4LjA2MyAxNzYuNjI1Ii8+PHBvbHlnb24gZmlsbD0iI0RGQ0VDMyIgcG9pbnRzPSIxMjEuNSAxNzMuMjUgMTUwLjc1IDE1Mi40MzggMTQ4LjUgMTcwLjQzOCAxNDguNSAxODAuNTYzIDEyOC4yNSAxNzYuNjI1IiB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSAyNzIuMjUgMCkiLz48cG9seWdvbiBmaWxsPSIjMzkzOTM5IiBwb2ludHM9IjcwLjMxMyAxMTIuNSA2NC4xMjUgMTI1LjQzOCA4Ni4wNjMgMTE5LjgxMyIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMTUwLjE4OCAwKSIvPjxwb2x5Z29uIGZpbGw9IiNFODhGMzUiIHBvaW50cz0iMTIuMzc1IC41NjMgODguODc1IDU4LjUgNzUuOTM4IDI3Ii8+PHBhdGggZmlsbD0iIzhFNUEzMCIgZD0iTTEyLjM3NTAwMDIsMC41NjI1MDAwMDggTDIuMjUwMDAwMDMsMzEuNTAwMDAwNSBMNy44NzUwMDAxMiw2NS4yNTAwMDEgTDMuOTM3NTAwMDYsNjcuNTAwMDAxIEw5LjU2MjUwMDE0LDcyLjU2MjUgTDUuMDYyNTAwMDgsNzYuNTAwMDAxMSBMMTEuMjUsODIuMTI1MDAxMiBMNy4zMTI1MDAxMSw4NS41MDAwMDEzIEwxNi4zMTI1MDAyLDk2Ljc1MDAwMTQgTDU4LjUwMDAwMDksODMuODEyNTAxMiBDNzkuMTI1MDAxMiw2Ny4zMTI1MDA0IDg5LjI1MDAwMTMsNTguODc1MDAwMyA4OC44NzUwMDEzLDU4LjUwMDAwMDkgQzg4LjUwMDAwMTMsNTguMTI1MDAwOSA2My4wMDAwMDA5LDM4LjgxMjUwMDYgMTIuMzc1MDAwMiwwLjU2MjUwMDAwOCBaIi8+PGcgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMjExLjUgMCkiPjxwb2x5Z29uIGZpbGw9IiNGODlEMzUiIHBvaW50cz0iMTYuMzEzIDk2LjE4OCAuNTYzIDE0MS43NSAzOS45MzggMTM5LjUgNjUuMjUgMTM5LjUgNjUuMjUgMTE5LjgxMyA2NC4xMjUgNzkuMzEzIDU4LjUgODMuODEzIi8+PHBvbHlnb24gZmlsbD0iI0Q4N0MzMCIgcG9pbnRzPSI0Ni4xMjUgMTAxLjI1IDkyLjI1IDEwMi4zNzUgODcuMTg4IDEyNiA2NS4yNSAxMjAuMzc1Ii8+PHBvbHlnb24gZmlsbD0iI0VBOEQzQSIgcG9pbnRzPSI0Ni4xMjUgMTAxLjgxMyA2NS4yNSAxMTkuODEzIDY1LjI1IDEzNy44MTMiLz48cG9seWdvbiBmaWxsPSIjRjg5RDM1IiBwb2ludHM9IjY1LjI1IDEyMC4zNzUgODcuNzUgMTI2IDk1LjA2MyAxNTAuMTg4IDkwIDE1MyA2NS4yNSAxMzguMzc1Ii8+PHBvbHlnb24gZmlsbD0iI0VCOEYzNSIgcG9pbnRzPSI2NS4yNSAxMzguMzc1IDYwLjc1IDE3My4yNSA5MCAxNTMiLz48cG9seWdvbiBmaWxsPSIjRUE4RTNBIiBwb2ludHM9IjkyLjI1IDEwMi4zNzUgOTUuMDYzIDE1MC4xODggODYuNjI1IDEyNS43MTkiLz48cG9seWdvbiBmaWxsPSIjRDg3QzMwIiBwb2ludHM9IjM5LjM3NSAxMzguOTM4IDY1LjI1IDEzOC4zNzUgNjAuNzUgMTczLjI1Ii8+PHBvbHlnb24gZmlsbD0iI0VCOEYzNSIgcG9pbnRzPSIxMi45MzggMTg4LjQzOCA2MC43NSAxNzMuMjUgMzkuMzc1IDEzOC45MzggLjU2MyAxNDEuNzUiLz48cG9seWdvbiBmaWxsPSIjRTg4MjFFIiBwb2ludHM9Ijg4Ljg3NSA1OC41IDY0LjY4OCA3OC43NSA0Ni4xMjUgMTAxLjI1IDkyLjI1IDEwMi45MzgiLz48cG9seWdvbiBmaWxsPSIjMzkzOTM5IiBwb2ludHM9IjcwLjMxMyAxMTIuNSA2NC4xMjUgMTI1LjQzOCA4Ni4wNjMgMTE5LjgxMyIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMTUwLjE4OCAwKSIvPjxwb2x5Z29uIGZpbGw9IiNFODhGMzUiIHBvaW50cz0iMTIuMzc1IC41NjMgODguODc1IDU4LjUgNzUuOTM4IDI3Ii8+PHBhdGggZmlsbD0iIzhFNUEzMCIgZD0iTTEyLjM3NTAwMDIsMC41NjI1MDAwMDggTDIuMjUwMDAwMDMsMzEuNTAwMDAwNSBMNy44NzUwMDAxMiw2NS4yNTAwMDEgTDMuOTM3NTAwMDYsNjcuNTAwMDAxIEw5LjU2MjUwMDE0LDcyLjU2MjUgTDUuMDYyNTAwMDgsNzYuNTAwMDAxMSBMMTEuMjUsODIuMTI1MDAxMiBMNy4zMTI1MDAxMSw4NS41MDAwMDEzIEwxNi4zMTI1MDAyLDk2Ljc1MDAwMTQgTDU4LjUwMDAwMDksODMuODEyNTAxMiBDNzkuMTI1MDAxMiw2Ny4zMTI1MDA0IDg5LjI1MDAwMTMsNTguODc1MDAwMyA4OC44NzUwMDEzLDU4LjUwMDAwMDkgQzg4LjUwMDAwMTMsNTguMTI1MDAwOSA2My4wMDAwMDA5LDM4LjgxMjUwMDYgMTIuMzc1MDAwMiwwLjU2MjUwMDAwOCBaIi8+PC9nPjwvZz48L3N2Zz4=`,
    downloads: {
      chrome:
        "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
      firefox: "https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/",
      edge: "https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm?hl=en-US",
    },
  },
  {
    id: "safepal",
    name: "SafePal",
    icon: `data:image/png;base64,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`,
    downloads: {
      chrome:
        "https://chrome.google.com/webstore/detail/safepal/lgmpcpglpngdoalbgeoldeajfclnhafa",
      firefox: "https://addons.mozilla.org/en-US/firefox/addon/safepal-extension-wallet/",
      edge: "https://microsoftedge.microsoft.com/addons/detail/safepal/apenkfbbpmhihehmihndmmcdanacolnh?hl=en-US",
      safari: "https://apps.apple.com/us/app/safepal-crypto-wallet-btc-nft/id1548297139",
      googleplay: "https://play.google.com/store/apps/details?id=io.safepal.wallet",
    },
  },
]

export default wallets
