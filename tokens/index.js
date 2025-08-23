// tokens/index.js

export const aggregatorTokens = {
  PulseX: [
    {
      address: '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
      label: 'DAI',
      logo: 'img/dai.png'
    },
    {
      address: '0x6910e486b5649Ff8C0C2Dd501173EBe5f6D7E98e', // KARROT
      label: 'KARROT',
      logo: 'img/karrot-hex.jpg'
    }
  ],
  Ray: [
    {
      address: '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', // MXDAI
      label: 'MXDAI',
      logo: 'img/mxdai.png'
    },
    {
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
      label: 'USDT',
      logo: 'img/usdt.png'
    }
  ],
  ZK: [
    {
      address: '0xabc1230000000000000000000000000000000000',
      label: 'ZKToken',
      logo: 'img/zk-token.png'
    },
    {
      address: '0xabc2000000000000000000000000000000000000',
      label: 'ZKUSD',
      logo: 'img/zkusd.png'
    }
  ]
};

export const DEFAULTS = {
  PulseX: {
    from: aggregatorTokens.PulseX[0].address,
    to: aggregatorTokens.PulseX[1].address
  },
  Ray: {
    from: aggregatorTokens.Ray[0].address,
    to: aggregatorTokens.Ray[1].address
  },
  ZK: {
    from: aggregatorTokens.ZK[0].address,
    to: aggregatorTokens.ZK[1].address
  }
};
