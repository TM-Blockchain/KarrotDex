// karrot-logic.js

document.addEventListener('DOMContentLoaded', async () => {
  const tokenFrom = document.getElementById("tokenFrom");
  const tokenTo = document.getElementById("tokenTo");

  window.addEventListener("load", async () => {
  const tokenLogos = {
    "0x6910076Eee8F4b6ea251B7cCa1052dd744Fc04DA": "img/karrot-hex.jpg", // KARROT
    "0x6B175474E89094C44Da98b954EedeAC495271d0F": "https://assets.coingecko.com/coins/images/9956/thumb/4943.png", // DAI
    "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png", // USDC
    // Add more tokens here as needed
  };

  function updateTokenIcon(selectId, imgId) {
    const selectEl = document.getElementById(selectId);
    const imgEl = document.getElementById(imgId);
    const selectedToken = selectEl.value.toLowerCase();

    if (tokenLogos[selectedToken]) {
      imgEl.src = tokenLogos[selectedToken];
    } else {
      imgEl.src = "img/default-token.png";
    }
  }

  // Initial load for both selects
  updateTokenIcon("tokenFrom", "fromIcon");
  updateTokenIcon("tokenTo", "toIcon");

  // Watch for changes in token selects
  document.getElementById("tokenFrom").addEventListener("change", () => {
    updateTokenIcon("tokenFrom", "fromIcon");
  });

  document.getElementById("tokenTo").addEventListener("change", () => {
    updateTokenIcon("tokenTo", "toIcon");
  });
});

  // Fetch token list from CoinGecko
  const response = await fetch("https://api.coingecko.com/api/v3/coins/list?include_platform=true");
  const tokens = await response.json();

  // Example list of ERC-20 tokens you want to include (by symbol or ID)
  const wantedTokens = ["dai", "usd-coin", "tether", "weth", "wrapped-bitcoin"];

  // Fetch logos and platforms
  const getTokenDetails = async (id) => {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
    return res.json();
  };

  for (let id of wantedTokens) {
    try {
      const data = await getTokenDetails(id);
      const name = data.symbol.toUpperCase();
      const address = data.platforms.ethereum;
      const logo = data.image.thumb;

      if (address) {
        const optionFrom = document.createElement("option");
        const optionTo = document.createElement("option");

        optionFrom.value = address;
        optionTo.value = address;

        optionFrom.text = name;
        optionTo.text = name;

        optionFrom.setAttribute("data-logo", logo);
        optionTo.setAttribute("data-logo", logo);

        tokenFrom.appendChild(optionFrom);
        tokenTo.appendChild(optionTo);
      }
    } catch (err) {
      console.error("Token fetch failed:", id, err);
    }
  }

  // Update icons when selection changes
  function updateTokenIcons() {
    const fromIcon = document.getElementById("fromIcon");
    const toIcon = document.getElementById("toIcon");

    const fromSelected = tokenFrom.options[tokenFrom.selectedIndex];
    const toSelected = tokenTo.options[tokenTo.selectedIndex];

    if (fromSelected && fromSelected.dataset.logo) {
      fromIcon.src = fromSelected.dataset.logo;
    }
    if (toSelected && toSelected.dataset.logo) {
      toIcon.src = toSelected.dataset.logo;
    }
  }

  tokenFrom.addEventListener("change", updateTokenIcons);
  tokenTo.addEventListener("change", updateTokenIcons);

  // Trigger initial icon update
  updateTokenIcons();
});
