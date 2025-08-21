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

  // Load token list from CoinGecko
  const response = await fetch("https://api.coingecko.com/api/v3/coins/list?include_platform=true");
  const tokens = await response.json();

  const wantedTokens = ["dai", "usd-coin", "tether", "weth", "wrapped-bitcoin"];

  const getTokenDetails = async (id) => {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
    return res.json();
  };

  for (let id of wantedTokens) {
    try {
      const data = await getTokenDetails(id);
      const name = data.symbol.toUpperCase();
      const address = data.platforms.ethereum?.toLowerCase();
      const logo = data.image.thumb;

      if (address) {
        const optionFrom = document.createElement("option");
        const optionTo = document.createElement("option");

        optionFrom.value = address;
        optionFrom.text = name;
        optionFrom.setAttribute("data-logo", logo);

        optionTo.value = address;
        optionTo.text = name;
        optionTo.setAttribute("data-logo", logo);

        tokenFrom.appendChild(optionFrom);
        tokenTo.appendChild(optionTo);
      }
    } catch (err) {
      console.error("Token fetch failed:", id, err);
    }
  }

  // Set default values
  const daiAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";
  const karrotAddress = "0x6910076eee8f4b6ea251b7cca1052dd744fc04da";

  tokenFrom.value = daiAddress;
  tokenTo.value = karrotAddress;

  // Update token icons
  function updateTokenIcon(selectEl, imgEl) {
    const selected = selectEl.options[selectEl.selectedIndex];
    const tokenAddress = selectEl.value.toLowerCase();

    if (tokenLogos[tokenAddress]) {
      imgEl.src = tokenLogos[tokenAddress];
    } else if (selected.dataset.logo) {
      imgEl.src = selected.dataset.logo;
    } else {
      imgEl.src = "img/default-token.png";
    }
  }

  function updateAllIcons() {
    updateTokenIcon(tokenFrom, fromIcon);
    updateTokenIcon(tokenTo, toIcon);
  }

  tokenFrom.addEventListener("change", () => updateTokenIcon(tokenFrom, fromIcon));
  tokenTo.addEventListener("change", () => updateTokenIcon(tokenTo, toIcon));

  updateAllIcons();

  // Toggle custom address input
  const checkbox = document.getElementById("useCustomAddress");
  const customAddressInput = document.getElementById("customAddress");

  if (checkbox && customAddressInput) {
    checkbox.addEventListener("change", () => {
      customAddressInput.classList.toggle("hidden", !checkbox.checked);
    });
  }
});
