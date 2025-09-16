// /scripts/tokenMap.js

export const aggregatorTokenMap = {
  PulseX: [
    {
      address: "0x6b175474e89094c44da98b954eedeac495271d0f",
      label: "DAI",
      logo: "img/dai.png"
    },
    {
      address: "0x6910076eee8f4b6ea251b7cca1052dd744fc04da",
      label: "KARROT",
      logo: "img/karrot-hex.jpg"
    }
  ],
  Uniswap: [
    {
      address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      label: "USDC",
      logo: "img/usdc.png"
    },
    {
      address: "0x6910076eee8f4b6ea251b7cca1052dd744fc04da",
      label: "KARROT",
      logo: "img/karrot-hex.jpg"
    }
  ]
};

// Optional: default token selections
export const aggregatorDefaults = {
  PulseX: {
    from: "0x6b175474e89094c44da98b954eedeac495271d0f", // DAI
    to: "0x6910076eee8f4b6ea251b7cca1052dd744fc04da"   // KARROT
  },
  Uniswap: {
    from: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
    to: "0x6910076eee8f4b6ea251b7cca1052dd744fc04da"   // KARROT
  }
};
