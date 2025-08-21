// karrot-logic.js

document.addEventListener('DOMContentLoaded', async () => {
  const tf = document.getElementById("tokenFrom");
  const tt = document.getElementById("tokenTo");
  const fromIcon = document.getElementById("fromIcon");
  const toIcon = document.getElementById("toIcon");
  const checkbox = document.getElementById("useCustomAddress");
  const customAddressInput = document.getElementById("customAddress");
  const swapBtn = document.getElementById("btnSwap");
  const switchBtn = document.getElementById("switchTokens");
  const aggregatorSelect = document.getElementById("aggregator");

  const tokenLogos = {
    "0x6910076eee8f4b6ea251b7cca1052dd744fc04da": "img/karrot-hex.jpg", // KARROT
    "0x6b175474e89094c44da98b954eedeac495271d0f": "https://assets.coingecko.com/coins/images/9956/thumb/4943.png", // DAI
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png", // USDC
    "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643": "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png?v=024", // MXDAI
    "0x4fabb145d64652a948d72533023f6e7a623c7c53": "https://cryptologos.cc/logos/binance-usd-busd-logo.png?v=024"  // BUSD
  };

  const labelMap = {
    "0x6910076eee8f4b6ea251b7cca1052dd744fc04da": "KARROT",
    "0x6b175474e89094c44da98b954eedeac495271d0f": "DAI",
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": "USDC",
    "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643": "MXDAI",
    "0x4fabb145d64652a948d72533023f6e7a623c7c53": "BUSD"
  };

  function getTokenMeta(address) {
  const lowerAddr = address.toLowerCase();
  for (const agg in aggregatorTokens) {
    const token = aggregatorTokens[agg].find(t => t.address.toLowerCase() === lowerAddr);
    if (token) return token;
  }
  return {
    label: "UNKNOWN",
    logo: "img/default-token.png"
  };
}
function updateIcon(sel, img) {
  const val = sel.value.toLowerCase();
  const meta = getTokenMeta(val);
  img.src = meta.logo || "img/default-token.png";
}

  function updateAllIcons() {
    updateIcon(tf, fromIcon);
    updateIcon(tt, toIcon);
  }

  const tokens = Object.keys(tokenLogos);

  // Populate FROM and TO dropdowns
  function populateSelect(selectEl, order) {
    order.forEach(addr => {
      const option = document.createElement("option");
      option.value = addr;
      option.textContent = labelMap[addr] || addr;
      option.dataset.logo = tokenLogos[addr];
      selectEl.appendChild(option);
    });
  }

  tf.addEventListener("change", () => {
    updateIcon(tf, fromIcon);
    if (tf.value === tt.value) {
      const idx = (tt.selectedIndex + 1) % tt.options.length;
      tt.selectedIndex = idx;
      updateIcon(tt, toIcon);
    }
  });

  tt.addEventListener("change", () => {
    updateIcon(tt, toIcon);
    if (tt.value === tf.value) {
      const idx = (tf.selectedIndex + 1) % tf.options.length;
      tf.selectedIndex = idx;
      updateIcon(tf, fromIcon);
    }
  });

  if (switchBtn) {
    switchBtn.addEventListener("click", () => {
      const temp = tf.value;
      tf.value = tt.value;
      tt.value = temp;
      tf.dispatchEvent(new Event("change"));
      tt.dispatchEvent(new Event("change"));
    });
  }

  if (checkbox && customAddressInput) {
    checkbox.addEventListener("change", () => {
      customAddressInput.classList.toggle("hidden", !checkbox.checked);
    });
  }

  const AGG = "0xYourKarrotAggregator"; // Update with actual aggregator address
  const karrotABI = [
    {
      constant: true,
      inputs: [],
      name: "totalSupply",
      outputs: [{ name: "", type: "uint256" }],
      type: "function"
    }
  ];

  const { ethers } = window;
  let provider, signer, account;

  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    account = await signer.getAddress();
    document.getElementById("connectWallet").innerText = `🟢 ${account.slice(0, 6)}...${account.slice(-4)}`;
  } else {
    alert("Please install MetaMask!");
    swapBtn.disabled = true;
    return;
  }

  const karrot = new ethers.Contract(AGG, karrotABI, signer);

  // Aggregator control
  let selectedAggregator = "ZK";

  window.setAggregator = (agg) => {
    selectedAggregator = agg;
    console.log("Aggregator set to:", selectedAggregator);
  };

  async function swapRay(tokenIn, tokenOut, amount, userAddr) {
    console.log("[RAY] Swapping", amount, tokenIn, "→", tokenOut, "for", userAddr);
    // Implement actual Ray swap logic here
  }

  async function swapZK(tokenIn, tokenOut, amount, userAddr) {
    console.log("[ZK] Swapping", amount, tokenIn, "→", tokenOut, "for", userAddr);
    // Implement actual ZK swap logic here
  }

  async function swapLiberty(tokenIn, tokenOut, amount, userAddr) {
    console.log("[LIBERTY] Swapping", amount, tokenIn, "→", tokenOut, "for", userAddr);
    // Implement actual Liberty swap logic here
  }

  async function executeSwap(tokenIn, tokenOut, amount, userAddr) {
    switch (selectedAggregator) {
      case "ZK":
        return swapZK(tokenIn, tokenOut, amount, userAddr);
      case "Ray":
        return swapRay(tokenIn, tokenOut, amount, userAddr);
      case "Liberty":
        return swapLiberty(tokenIn, tokenOut, amount, userAddr);
      default:
        alert("Unknown aggregator selected");
        throw new Error("Unknown aggregator");
    }
  }

  swapBtn.addEventListener("click", async () => {
    const tokenIn = tf.value;
    const tokenOut = tt.value;
    const amt = document.getElementById("amountFrom").value;
    const userAddr = checkbox.checked ? document.getElementById("customAddress").value : account;

    if (!amt || isNaN(amt) || Number(amt) <= 0) {
      return alert("Enter a valid amount");
    }

    try {
      console.log(`Executing swap via ${selectedAggregator}`);
      await executeSwap(tokenIn, tokenOut, amt, userAddr);
    } catch (err) {
      console.error("Swap failed:", err);
      alert("Swap failed. See console.");
    }
  });

    // *************** ADDITIONS START HERE ***************

  // Aggregator-specific token lists, including new DEX aggregators and local PulseChain tokens
  const aggregatorTokens = {
    ZK: [
      { address: "0x6910076eee8f4b6ea251b7cca1052dd744fc04da", label: "KARROT", logo: "img/karrot-hex.jpg" },
      { address: "0x6b175474e89094c44da98b954eedeac495271d0f", label: "DAI", logo: "https://assets.coingecko.com/coins/images/9956/thumb/4943.png" },
      { address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", label: "USDC", logo: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png" },
    ],
    Ray: [
      { address: "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643", label: "MXDAI", logo: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png?v=024" },
      { address: "0x4fabb145d64652a948d72533023f6e7a623c7c53", label: "BUSD", logo: "https://cryptologos.cc/logos/binance-usd-busd-logo.png?v=024" },
      // Add more tokens specific to Ray here
    ],
    Liberty: [
      // Liberty tokens (placeholder, update when live)
      { address: "0x1111111111111111111111111111111111111111", label: "LIBTOK1", logo: "img/liberty1.png" },
      { address: "0x2222222222222222222222222222222222222222", label: "LIBTOK2", logo: "img/liberty2.png" }
    ],

    // Newly added aggregators with their tokens
    "9mm": [
      { address: "0xTokenAddress1", label: "9MMToken1", logo: "img/9mm1.png" },
      { address: "0xTokenAddress2", label: "9MMToken2", logo: "img/9mm2.png" }
    ],
    Piteas: [
      { address: "0xPiteasToken1", label: "PiteasToken1", logo: "img/piteas1.png" }
      // Add more Piteas tokens
    ],
    PulseX: [
      { address: "0xPulseXToken1", label: "PulseXToken1", logo: "img/pulsex1.png" }
      // Add more PulseX tokens
    ],
    Uniswap: [
      { address: "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", label: "USDC", logo: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png" },
      { address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", label: "WETH", logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png" }
      // Add more Uniswap tokens
    ],
    PancakeSwap: [
      { address: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82", label: "CAKE", logo: "https://cryptologos.cc/logos/pancakeswap-cake-logo.png" }
      // Add more PancakeSwap tokens
    ],
    CowSwap: [
      { address: "0xTokenCow1", label: "CowToken1", logo: "img/cow1.png" }
      // Add more CowSwap tokens
    ],
    "1inch": [
      { address: "0xToken1inch1", label: "1inchToken1", logo: "img/1inch1.png" }
      // Add more 1inch tokens
    ],
    Matcha: [
      { address: "0xTokenMatcha1", label: "MatchaToken1", logo: "img/matcha1.png" }
      // Add more Matcha tokens
    ],
    ThorSwap: [
      { address: "0xXStockToken1", label: "XStockToken1", logo: "img/thorswap1.png" }
      // Add more ThorSwap tokens
    ]
  };

  // Helper function to populate tokens dropdown based on selected aggregator
  function populateTokensForAggregator(aggregator) {
  console.log("populateTokensForAggregator called for:", aggregator); // ✅ Log

  const tokenList = aggregatorTokens[aggregator];
  if (!tokenList) {
    console.warn("No tokens for:", aggregator); // ✅ Warn if empty
    return;
  }

  // Clear existing options
  tf.innerHTML = "";
  tt.innerHTML = "";

  // Populate both selects with tokens
  tokenList.forEach(({ address, label, logo }) => {
    const optionFrom = document.createElement("option");
    optionFrom.value = address.toLowerCase();
    optionFrom.textContent = label;
    optionFrom.dataset.logo = logo;
    tf.appendChild(optionFrom);

    const optionTo = document.createElement("option");
    optionTo.value = address.toLowerCase();
    optionTo.textContent = label;
    optionTo.dataset.logo = logo;
    tt.appendChild(optionTo);
  });

  // Set default selections
  tf.selectedIndex = 0;
  tt.selectedIndex = tokenList.length > 1 ? 1 : 0;

  updateAllIcons();
}
  // On aggregator change, update tokens list accordingly
  aggregatorSelect.addEventListener("change", (e) => {
    const agg = e.target.value;
    selectedAggregator = agg;
    console.log(`Switched aggregator to: ${agg}`);
    populateTokensForAggregator(agg);
  });
  function populateSelectWithLabels(selectEl, addresses) {
  addresses.forEach(addr => {
    const option = document.createElement("option");
    option.value = addr.toLowerCase();
    option.textContent = labelMap[addr] || addr;
    option.dataset.logo = tokenLogos[addr];
    selectEl.appendChild(option);
  });
}
// Helper to manually trigger icon update
function updateAllIcons() {
  updateIcon(tf, fromIcon);
  updateIcon(tt, toIcon);
}

// Set default aggregator to PulseX
selectedAggregator = "PulseX";
aggregatorSelect.value = "PulseX";

// Populate tokens based on PulseX aggregator
populateTokensForAggregator("PulseX");

// Set default token values: DAI (pDAI) and KARROT
tf.value = "0x6b175474e89094c44da98b954eedeac495271d0f".toLowerCase(); // DAI
tt.value = "0x6910076eee8f4b6ea251b7cca1052dd744fc04da".toLowerCase(); // KARROT

// Trigger icon updates and any UI change reactions
tf.dispatchEvent(new Event("change"));
tt.dispatchEvent(new Event("change"));
updateAllIcons();

  // Extend swap execution for new aggregators (placeholders)
  async function swap9mm(tokenIn, tokenOut, amount, userAddr) {
    console.log("[9mm] Swap", amount, tokenIn, "→", tokenOut, "for", userAddr);
    // Add actual swap logic here
  }

  async function swapPiteas(tokenIn, tokenOut, amount, userAddr) {
    console.log("[Piteas] Swap", amount, tokenIn, "→", tokenOut, "for", userAddr);
    // Add actual swap logic here
  }

  async function swapPulseX(tokenIn, tokenOut, amount, userAddr) {
    console.log("[PulseX] Swap", amount, tokenIn, "→", tokenOut, "for", userAddr);
    // Add actual swap logic here
  }

  async function swapUniswap(tokenIn, tokenOut, amount, userAddr) {
    console.log("[Uniswap] Swap", amount, tokenIn, "→", tokenOut, "for", userAddr);
    // Add actual swap logic here
  }

  async function swapPancakeSwap(tokenIn, tokenOut, amount, userAddr) {
    console.log("[PancakeSwap] Swap", amount, tokenIn, "→", tokenOut, "for", userAddr);
    // Add actual swap logic here
  }

  async function swapCowSwap(tokenIn, tokenOut, amount, userAddr) {
    console.log("[CowSwap] Swap", amount, tokenIn, "→", tokenOut, "for", userAddr);
    // Add actual swap logic here
  }

  async function swapOneInch(tokenIn, tokenOut, amount, userAddr) {
    console.log("[1inch] Swap", amount, tokenIn, "→", tokenOut, "for", userAddr);
    // Add actual swap logic here
  }

  async function swapMatcha(tokenIn, tokenOut, amount, userAddr) {
    console.log("[Matcha] Swap", amount, tokenIn, "→", tokenOut, "for", userAddr);
    // Add actual swap logic here
  }

  async function swapThorSwap(tokenIn, tokenOut, amount, userAddr) {
    console.log("[ThorSwap] Swap", amount, tokenIn, "→", tokenOut, "for", userAddr);
    // Add actual swap logic here
  }

  // Extend executeSwap to support all aggregators
  async function executeSwap(tokenIn, tokenOut, amount, userAddr) {
    switch (selectedAggregator) {
      case "ZK":
        return swapZK(tokenIn, tokenOut, amount, userAddr);
      case "Ray":
        return swapRay(tokenIn, tokenOut, amount, userAddr);
      case "Liberty":
        return swapLiberty(tokenIn, tokenOut, amount, userAddr);
      case "9mm":
        return swap9mm(tokenIn, tokenOut, amount, userAddr);
      case "Piteas":
        return swapPiteas(tokenIn, tokenOut, amount, userAddr);
      case "PulseX":
        return swapPulseX(tokenIn, tokenOut, amount, userAddr);
      case "Uniswap":
        return swapUniswap(tokenIn, tokenOut, amount, userAddr);
      case "PancakeSwap":
        return swapPancakeSwap(tokenIn, tokenOut, amount, userAddr);
      case "CowSwap":
        return swapCowSwap(tokenIn, tokenOut, amount, userAddr);
      case "1inch":
        return swapOneInch(tokenIn, tokenOut, amount, userAddr);
      case "Matcha":
        return swapMatcha(tokenIn, tokenOut, amount, userAddr);
      case "ThorSwap":
        return swapThorSwap(tokenIn, tokenOut, amount, userAddr);
      default:
        alert("Unknown aggregator selected");
        throw new Error("Unknown aggregator");
    }
  }
