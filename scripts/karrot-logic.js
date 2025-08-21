// karrot-logic.js

document.addEventListener('DOMContentLoaded', async () => {
  const tf = document.getElementById("tokenFrom");
  const tt = document.getElementById("tokenTo");
  const fromIcon = document.getElementById("fromIcon");
  const toIcon = document.getElementById("toIcon");
  const checkbox = document.getElementById("useCustomAddress");
  const customAddressInput = document.getElementById("customAddress");
  const swapBtn = document.getElementById("btnSwap");

  const tokenLogos = {
    "0x6910076eee8f4b6ea251b7cca1052dd744fc04da": "img/karrot-hex.jpg", // KARROT
    "0x6b175474e89094c44da98b954eedeac495271d0f": "https://assets.coingecko.com/coins/images/9956/thumb/4943.png", // DAI
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png", // USDC
  };

  function updateIcon(sel, img) {
    const val = sel.value.toLowerCase();
    img.src = tokenLogos[val] || sel.selectedOptions[0]?.dataset.logo || "img/default-token.png";
  }

  function updateAllIcons() {
    updateIcon(tf, fromIcon);
    updateIcon(tt, toIcon);
  }

  // Helper to add options
  const addOption = (address, symbol, logo) => {
    const o1 = document.createElement("option");
    o1.value = address.toLowerCase();
    o1.textContent = symbol;
    o1.dataset.logo = logo;
    tf.appendChild(o1);

    const o2 = o1.cloneNode(true);
    tt.appendChild(o2);
  };

  // Add KARROT first
  const DAI = "0x6b175474e89094c44da98b954eedeac495271d0f";
  const KARROT = "0x6910076eee8f4b6ea251b7cca1052dd744fc04da";
  addOption(KARROT, "KARROT", tokenLogos[KARROT]);

  // Load other tokens
  const wanted = ["dai", "usd-coin", "tether", "weth", "wrapped-bitcoin"];
  for (const id of wanted) {
    try {
      const data = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`).then(r => r.json());
      const addr = data.platforms.ethereum?.toLowerCase();
      if (!addr) continue;
      addOption(addr, data.symbol.toUpperCase(), data.image.thumb);
    } catch (err) {
      console.warn("Token fetch failed:", id, err);
    }
  }

  // Now that all options exist, set defaults
  tf.value = DAI;
  tt.value = KARROT;
  tf.dispatchEvent(new Event('change'));
  tt.dispatchEvent(new Event('change'));
  updateAllIcons();

  // Prevent selecting the same token in both
  tf.addEventListener("change", () => {
    updateIcon(tf, fromIcon);
    if (tf.value === tt.value) {
      tt.selectedIndex = (tt.selectedIndex + 1) % tt.options.length;
      updateIcon(tt, toIcon);
    }
  });

  tt.addEventListener("change", () => {
    updateIcon(tt, toIcon);
    if (tt.value === tf.value) {
      tf.selectedIndex = (tf.selectedIndex + 1) % tf.options.length;
      updateIcon(tf, fromIcon);
    }
  });

  if (checkbox && customAddressInput) {
    checkbox.addEventListener("change", () => {
      customAddressInput.classList.toggle("hidden", !checkbox.checked);
    });
  }

  // Wallet + swap logic remains unchanged...

  updateAllIcons();
});
