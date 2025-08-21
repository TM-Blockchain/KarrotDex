// karrot-logic.js

document.addEventListener('DOMContentLoaded', async () => {
  const tokenFrom = document.getElementById("tokenFrom");
  const tokenTo = document.getElementById("tokenTo");

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
