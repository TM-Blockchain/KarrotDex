document.addEventListener('DOMContentLoaded', async () => {
  const tokenFrom = document.getElementById("tokenFrom");
  const tokenTo = document.getElementById("tokenTo");

  const tokenLogos = {
    "0x6910076eee8f4b6ea251b7cca1052dd744fc04da": "img/karrot-hex.jpg", // KARROT
    "0x6b175474e89094c44da98b954eedeac495271d0f": "https://assets.coingecko.com/coins/images/9956/thumb/4943.png", // DAI
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png", // USDC
    // Add more static tokens here if needed
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

  // Fetch token list from CoinGecko
  const response = await fetch("https://api.coingecko.com/api/v3/coins/list?include_platform=true");
  const tokens = await response.json();

  // Example list of ERC-20 tokens you want to include (by CoinGecko ID)
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
      const address = data.platforms?.ethereum?.toLowerCase(); // ensure it's on Ethereum

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

  // Set default selections
  tokenFrom.value = "0x6b175474e89094c44da98b954eedeac495271d0f"; // DAI
  tokenTo.value = "0x6910076eee8f4b6ea251b7cca1052dd744fc04da";  // KARROT

  // Update token icons
  function updateTokenIcons() {
    const fromIcon = document.getElementById("fromIcon");
    const toIcon = document.getElementById("toIcon");

    const fromSelected = tokenFrom.options[tokenFrom.selectedIndex];
    const toSelected = tokenTo.options[tokenTo.selectedIndex];

    if (fromSelected && fromSelected.dataset.logo) {
      fromIcon.src = fromSelected.dataset.logo;
    } else {
      fromIcon.src = "img/default-token.png";
    }

    if (toSelected && toSelected.dataset.logo) {
      toIcon.src = toSelected.dataset.logo;
    } else {
      toIcon.src = "img/default-token.png";
    }
  }

  // Update icons on selection change
  tokenFrom.addEventListener("change", updateTokenIcons);
  tokenTo.addEventListener("change", updateTokenIcons);

  // Trigger initial icon load
  updateTokenIcons();

  // Optional: toggle custom address field
  const checkbox = document.getElementById("useCustomAddress");
  const customAddressInput = document.getElementById("customAddress");

  if (checkbox && customAddressInput) {
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        customAddressInput.classList.remove("hidden");
      } else {
        customAddressInput.classList.add("hidden");
      }
    });
  }
});
