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

  function updateIcon(sel, img) {
    const val = sel.value.toLowerCase();
    const tokenOption = sel.querySelector(`option[value="${val}"]`);
    const dynamicLogo = tokenOption ? tokenOption.dataset.logo : null;
    img.src = tokenLogos[val] || dynamicLogo || "img/default-token.png";
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

  populateSelect(tf, tokens);
  populateSelect(tt, [tokens[0], tokens[3], tokens[4], tokens[1], tokens[2]]); // Custom TO order

  tf.value = tokens[1]; // DAI default
  tt.value = tokens[0]; // KARROT default

  tf.dispatchEvent(new Event("change"));
  tt.dispatchEvent(new Event("change"));
  updateAllIcons();

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
      { address: "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643", label: "MXDAI", logo: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png?v=024
