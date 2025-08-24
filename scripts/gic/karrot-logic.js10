// karrot-logic.js

let selectedAggregator = "PulseX"; // Default aggregator

// Token logo mapping
const tokenLogos = {
  "0x6910076eee8f4b6ea251b7cca1052dd744fc04da": "img/karrot-hex.jpg", // KARROT
  "0x6b175474e89094c44da98b954eedeac495271d0f": "https://assets.coingecko.com/coins/images/9956/thumb/4943.png", // DAI
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png", // USDC
  "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643": "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png?v=024", // MXDAI
  "0x4fabb145d64652a948d72533023f6e7a623c7c53": "https://cryptologos.cc/logos/binance-usd-busd-logo.png?v=024"  // BUSD
};

// Label mapping
const labelMap = {
  "0x6910076eee8f4b6ea251b7cca1052dd744fc04da": "KARROT",
  "0x6b175474e89094c44da98b954eedeac495271d0f": "DAI",
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": "USDC",
  "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643": "MXDAI",
  "0x4fabb145d64652a948d72533023f6e7a623c7c53": "BUSD"
};

document.addEventListener("DOMContentLoaded", async () => {
  // DOM Elements
  const tf = document.getElementById("tokenFrom");
  const tt = document.getElementById("tokenTo");
  const fromIcon = document.getElementById("fromIcon");
  const toIcon = document.getElementById("toIcon");
  const checkbox = document.getElementById("useCustomAddress");
  const customAddressInput = document.getElementById("customAddress");
  const swapBtn = document.getElementById("btnSwap");
  const switchBtn = document.getElementById("switchTokens");
  const aggregatorSelect = document.getElementById("aggregator"); 

  if (!tf || !tt || !aggregatorSelect) {
    console.error("Missing essential DOM elements.");
    return;
  }

  // Inject token options
  populateTokensForAggregator(selectedAggregator);
  tf.dispatchEvent(new Event("change"));
  tt.dispatchEvent(new Event("change"));

  aggregatorSelect.addEventListener("change", (e) => {
    selectedAggregator = e.target.value;
    populateTokensForAggregator(selectedAggregator);

    if (DEFAULTS[selectedAggregator]) {
      tf.value = DEFAULTS[selectedAggregator].from.toLowerCase();
      tt.value = DEFAULTS[selectedAggregator].to.toLowerCase();
    } else {
      tf.selectedIndex = 0;
      tt.selectedIndex = 1;
    }

    tf.dispatchEvent(new Event("change"));
    tt.dispatchEvent(new Event("change"));
  });

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

  const AGG = "0xYourKarrotAggregator"; // Replace with your aggregator address
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

  if (swapBtn) {
    swapBtn.addEventListener("click", async () => {
      const tokenIn = tf.value;
      const tokenOut = tt.value;
      const amt = document.getElementById("amountFrom").value;
      const userAddr = checkbox.checked ? customAddressInput.value.trim() : account;

      if (!userAddr) {
        return alert("Wallet not connected and no custom address provided.");
      }

      if (!amt || isNaN(amt) || Number(amt) <= 0) {
        return alert("Enter a valid amount");
      }

      const btnText = document.getElementById("swapBtnText");
      const spinner = document.getElementById("swapSpinner");

      swapBtn.disabled = true;
      btnText.textContent = "Swapping...";
      spinner.classList.remove("hidden");

      try {
        console.log(`Executing swap via ${selectedAggregator}`);
        await executeSwap(tokenIn, tokenOut, amt, userAddr);
        alert("Swap successful!");
        document.getElementById("amountFrom").value = "";
      } catch (err) {
        console.error("Swap failed:", err);
        alert("Swap failed. Check the console.");
      } finally {
        swapBtn.disabled = false;
        btnText.textContent = "Swap";
        spinner.classList.add("hidden");
      }
    });
  }

  window.setAggregator = (agg) => {
    selectedAggregator = agg;
    console.log("Aggregator set to:", selectedAggregator);
  };
});

// -----------------------------
// Utilities and Functions
// -----------------------------

function updateIcon(sel, img) {
  const val = sel.value.toLowerCase();
  img.src = tokenLogos[val] || "img/default-token.png";
}

function updateAllIcons() {
  updateIcon(document.getElementById("tokenFrom"), document.getElementById("fromIcon"));
  updateIcon(document.getElementById("tokenTo"), document.getElementById("toIcon"));
}

function populateTokensForAggregator(aggregator) {
  const tf = document.getElementById("tokenFrom");
  const tt = document.getElementById("tokenTo");

  const tokenList = aggregatorTokens[aggregator];
  if (!tokenList) return;

  tf.innerHTML = "";
  tt.innerHTML = "";

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

  tf.selectedIndex = 0;
  tt.selectedIndex = tokenList.length > 1 ? 1 : 0;

  updateAllIcons();
}

const DEFAULTS = {
  PulseX: {
    from: "0x6b175474e89094c44da98b954eedeac495271d0f",
    to: "0x6910076eee8f4b6ea251b7cca1052dd744fc04da"
  },
  Ray: {
    from: "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643",
    to: "0x4fabb145d64652a948d72533023f6e7a623c7c53"
  },
  Liberty: {
    from: "0x1111111111111111111111111111111111111111",
    to: "0x2222222222222222222222222222222222222222"
  }
  // Add more aggregators and defaults as needed
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

  // Apply new default token values if available
  if (DEFAULTS[agg]) {
    tf.value = DEFAULTS[agg].from.toLowerCase();
    tt.value = DEFAULTS[agg].to.toLowerCase();
  } else {
    tf.selectedIndex = 0;
    tt.selectedIndex = 1;
  }

  tf.dispatchEvent(new Event("change"));
  tt.dispatchEvent(new Event("change"));
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
