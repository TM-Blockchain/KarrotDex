// karrot-logic.js

document.addEventListener('DOMContentLoaded', async () => {
  const tokenFrom = document.getElementById("tokenFrom");
  const tokenTo = document.getElementById("tokenTo");
  const fromIcon = document.getElementById("fromIcon");
  const toIcon = document.getElementById("toIcon");

  const tokenLogos = {
    "0x6910076eee8f4b6ea251b7cca1052dd744fc04da": "img/karrot-hex.jpg", // KARROT
    "0x6b175474e89094c44da98b954eedeac495271d0f": "https://assets.coingecko.com/coins/images/9956/thumb/4943.png", // DAI
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png", // USDC
  };

  const wantedTokens = ["dai", "usd-coin", "tether", "weth", "wrapped-bitcoin"];

  const getTokenDetails = async (id) => {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
    return res.json();
  };

  // Function to add option to both dropdowns
  const addTokenOption = (address, symbol, logo) => {
    const optionFrom = document.createElement("option");
    const optionTo = document.createElement("option");

    optionFrom.value = address;
    optionTo.value = address;

    optionFrom.text = symbol;
    optionTo.text = symbol;

    optionFrom.setAttribute("data-logo", logo);
    optionTo.setAttribute("data-logo", logo);

    tokenFrom.appendChild(optionFrom);
    tokenTo.appendChild(optionTo);
  };

  // Add predefined tokens
  addTokenOption("0x6910076eee8f4b6ea251b7cca1052dd744fc04da", "KARROT", tokenLogos["0x6910076eee8f4b6ea251b7cca1052dd744fc04da"]);
  addTokenOption("0x6b175474e89094c44da98b954eedeac495271d0f", "DAI", tokenLogos["0x6b175474e89094c44da98b954eedeac495271d0f"]);
  addTokenOption("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", "USDC", tokenLogos["0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"]);

  // Add dynamic tokens from CoinGecko
  for (let id of wantedTokens) {
    try {
      const data = await getTokenDetails(id);
      const symbol = data.symbol.toUpperCase();
      const address = data.platforms?.ethereum?.toLowerCase();
      const logo = data.image.thumb;

      if (address && !tokenLogos[address]) {
        addTokenOption(address, symbol, logo);
      }
    } catch (err) {
      console.error(`Failed to fetch ${id}:`, err);
    }
  }

  // Update token icon
  function updateTokenIcon(selectEl, iconEl) {
    const selectedOption = selectEl.options[selectEl.selectedIndex];
    const tokenAddress = selectedOption.value.toLowerCase();
    const logo = tokenLogos[tokenAddress] || selectedOption.dataset.logo || "img/default-token.png";
    iconEl.src = logo;
  }

  // Prevent selecting the same token
  function preventSameToken(selectElChanged, otherSelectEl) {
    if (selectElChanged.value === otherSelectEl.value) {
      const newIndex = (otherSelectEl.selectedIndex + 1) % otherSelectEl.options.length;
      otherSelectEl.selectedIndex = newIndex;
      updateTokenIcon(otherSelectEl, otherSelectEl === tokenFrom ? fromIcon : toIcon);
    }
  }

  // Add change listeners
  tokenFrom.addEventListener("change", () => {
    updateTokenIcon(tokenFrom, fromIcon);
    preventSameToken(tokenFrom, tokenTo);
  });

  tokenTo.addEventListener("change", () => {
    updateTokenIcon(tokenTo, toIcon);
    preventSameToken(tokenTo, tokenFrom);
  });

  // Initial icons
  updateTokenIcon(tokenFrom, fromIcon);
  updateTokenIcon(tokenTo, toIcon);
});
